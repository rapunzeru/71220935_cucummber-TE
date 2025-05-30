import { expect } from "chai";
import { Builder, By, until } from "selenium-webdriver";
import { When, Then, Given, setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(30000);
let driver;

// ========== LOGIN STEPS ==========
Given("the user is on the login page", async function () {
  driver = new Builder().forBrowser("chrome").build();
  await driver.get("https://www.saucedemo.com/");
});

When("the user enters an invalid username and password", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("invalid_user");
  await driver.findElement(By.id("password")).sendKeys("wrong_password");
});

Then("the user should see a failed message", async function () {
  try {
    const error = await driver
      .wait(until.elementLocated(By.css("h3[data-test='error']")), 5000)
      .getText();
    expect(error.toLowerCase()).to.include("epic sadface");
  } finally {
    await driver.quit();
  }
});

When("the user enters a valid username and password", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("standard_user");
  await driver.findElement(By.id("password")).sendKeys("secret_sauce");
});

When("the user clicks the login button", async function () {
  await driver.findElement(By.id("login-button")).click();
});

Then("the user should see a success message", async function () {
  try {
    const message = await driver
      .wait(until.elementLocated(By.className("title")), 5000)
      .getText();
    expect(message).to.equal("Products");
    const item = await driver.findElement(By.id("item_4_img_link"));
    expect(item).to.exist;
  } finally {
    await driver.quit();
  }
});

// ========== ITEM / CART STEPS ==========
Given("the user is on the item page", async function () {
  await driver.findElement(By.id("user-name")).sendKeys("standard_user");
  await driver.findElement(By.id("password")).sendKeys("secret_sauce");
  await driver.findElement(By.id("login-button")).click();
});

When("the user add item to the cart", async function () {
  await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
});

When("the user in the item list", async function () {
  await driver.findElement(By.className("shopping_cart_link")).click();
});

Then("item should be seen in the item page", async function () {
  const cartItem = await driver.findElement(By.className("inventory_item_name"));
  const text = await cartItem.getText();
  expect(text).to.equal("Sauce Labs Backpack");
});

When("the user remove item to the cart", async function () {
  await driver.findElement(By.id("remove-sauce-labs-backpack")).click();
});

Then("item shouldn't be seen in the item page", async function () {
  try {
    await driver.wait(async () => {
      const items = await driver.findElements(By.id("remove-sauce-labs-backpack"));
      return items.length === 0;
    }, 5000, "Item masih ada di cart setelah 5 detik");

    const cartText = await driver.findElement(By.className("cart_list")).getText();
    expect(cartText).to.not.include("Sauce Labs Backpack");
  } finally {
    await driver.quit();
  }
});

// ========== ADDITIONAL SCENARIOS ==========
When("the user proceeds to checkout", async function () {
  await driver.findElement(By.id("checkout"))?.click();
});

Then("the user should see an error message indicating empty cart", async function () {
  try {
    const checkoutHeader = await driver.findElement(By.className("title")).getText();
    expect(checkoutHeader).to.equal("Checkout: Your Information");

    const items = await driver.findElements(By.className("cart_item"));
    expect(items.length).to.equal(0);
  } finally {
    await driver.quit();
  }
});

When("the user sorts items by price low to high", async function () {
  const dropdown = await driver.findElement(By.className("product_sort_container"));
  const option = await dropdown.findElement(By.css("option[value='lohi']"));
  await option.click();
});


Then("the first item should be the cheapest", async function () {
  try {
    await driver.wait(async () => {
      const prices = await driver.findElements(By.className("inventory_item_price"));
      const priceTexts = await Promise.all(prices.map(p => p.getText()));
      const priceValues = priceTexts.map(p => parseFloat(p.replace("$", "")));

      const min = Math.min(...priceValues);
      return priceValues[0] === min;
    }, 8000, "Urutan harga tidak sesuai setelah sorting (low to high)");
  } finally {
    await driver.quit();
  }
});

