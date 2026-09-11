//tests/TC15.spec.js
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

//navigate to automationexercise.com
test('TC15 - open Automation Exercise website', async ({ page }) => {
    await expect(page).toHaveTitle(/Automation Exercise/);
});

//home page is visible successfully
test('TC15 - Home page is visible successfully', async ({ page }) => {
    await expect(page.locator('body'), 'Home page is visible successfully').toBeVisible();
});

//click 'signup/login' button
test('TC15 - Click on "signup/login" button', async ({ page }) => {
    await page.click('a[href="/login"]');
});

//Fill all details in Signup and create account
test('TC15 - Fill in all details in signup form and create account', async ({ page }) => {
    const uniqueEmail = `jane.doe.${Date.now()}@example.com`;
    await page.goto('https://automationexercise.com/login');
    await page.fill('input[data-qa="signup-name"]', 'Jane Doe');
    await page.fill('input[data-qa="signup-email"]', uniqueEmail);
    await page.click('button[data-qa="signup-button"]');

    await expect(page).toHaveURL(/\/signup/);
    await page.fill('input[data-qa="password"]', 'password123');
    await page.fill('input[data-qa="first_name"]', 'Jane');
    await page.fill('input[data-qa="last_name"]', 'Doe');
    await page.fill('input[data-qa="address"]', '456 Main St');
    await page.fill('input[data-qa="city"]', 'Anytown');
    await page.fill('input[data-qa="state"]', 'NZ');
    await page.fill('input[data-qa="zipcode"]', '67890');
    await page.fill('input[data-qa="mobile_number"]', '0987654321');
    await page.click('button[data-qa="create-account"]');

    await expect(page.locator('h2:has-text("Account Created!")'), 'Account created successfully').toBeVisible();
    await page.click('a[data-qa="continue-button"]');
    await expect(page.locator('a:has-text("Logged in as")'), 'User is logged in after signup').toBeVisible();

    //adding a product to cart
    await page.goto('https://automationexercise.com/products');
    const firstProduct = page.locator('.product-image-wrapper').first();
    const productPrice = await firstProduct.locator('.productinfo h2').innerText();

    await firstProduct.locator('a.add-to-cart').first().click();
    await expect(page.locator('#cartModal')).toBeVisible();
    await expect(page.locator('#cartModal')).toContainText('Added!');
    await page.locator('#cartModal a', { hasText: 'View Cart' }).click();
    await expect(page).toHaveURL(/view_cart/);
    await expect(page.locator('#cart_info')).toContainText(productPrice);
});