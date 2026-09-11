const { test, expect } = require('@playwright/test');

async function signUpAndLogIn(page, email) {
    await page.goto('https://automationexercise.com/login');
    await page.fill('input[data-qa="signup-name"]', 'John Doe');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');

    await expect(page).toHaveURL(/\/signup/);
    await page.fill('input[data-qa="password"]', 'password123');
    await page.fill('input[data-qa="first_name"]', 'John');
    await page.fill('input[data-qa="last_name"]', 'Doe');
    await page.fill('input[data-qa="address"]', '123 Main St');
    await page.fill('input[data-qa="city"]', 'Anytown');
    await page.fill('input[data-qa="state"]', 'CA');
    await page.fill('input[data-qa="zipcode"]', '12345');
    await page.fill('input[data-qa="mobile_number"]', '1234567890');
    await page.click('button[data-qa="create-account"]');

    await expect(page.locator('h2:has-text("Account Created!")'), 'Account created successfully').toBeVisible();
    await page.click('a[data-qa="continue-button"]');
    await expect(page.locator('a:has-text("Logged in as")'), 'User is logged in').toBeVisible();
}

//Login page is visible
test('TC14 - Login page is visible', async ({ page }) => {
    await page.goto('https://automationexercise.com/login');
    await expect(page.locator('h2:has-text("Login to your account")'), 'Login page is visible').toBeVisible();
});

//click on 'register/login' button
test('TC14 - Click on "register/login" button', async ({ page }) => {
    await page.goto('https://automationexercise.com/');
    await page.click('a[href="/login"]');
});

//fill in all details in signup form and create account
test('TC14 - Fill in all details in signup form and create account', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);
});

//click on 'cart' button using a logged-in account
test('TC14 - Click on "cart" button using John Doe\'s account', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    await page.goto('https://automationexercise.com/');
    await page.click('a[href="/view_cart"]');

    await expect(page).toHaveURL(/view_cart/);
});

//proceed to checkout with a logged-in account
test('TC14 - Proceed to checkout', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    await page.goto('https://automationexercise.com/products');
    await page.locator('.product-image-wrapper').first().locator('a.add-to-cart').first().click();
    await page.click('a:has-text("View Cart")');

    await expect(page).toHaveURL(/view_cart/);
    await page.click('a.check_out');

    // already logged in, so checkout goes straight to the address/review page
    await expect(page).toHaveURL(/\/checkout/);
});

//Verify Address Details and Review Your Order with a logged-in account
test('TC14 - Verify Address Details and Review Your Order', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    await page.goto('https://automationexercise.com/products');
    await page.locator('.product-image-wrapper').first().locator('a.add-to-cart').first().click();
    await page.click('a:has-text("View Cart")');

    await expect(page).toHaveURL(/view_cart/);
    await page.click('a.check_out');

    await expect(page.locator('h2:has-text("Address Details")'), 'Address Details section is visible').toBeVisible();
    await expect(page.locator('h2:has-text("Review Your Order")'), 'Review Your Order section is visible').toBeVisible();
});

//Enter John's Doe's payment details: Name on Card, Card Number, CVC, Expiration date
test('TC14 - Enter John Doe\'s payment details', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    await page.goto('https://automationexercise.com/products');
    await page.locator('.product-image-wrapper').first().locator('a.add-to-cart').first().click();
    await page.click('a:has-text("View Cart")');

    await expect(page).toHaveURL(/view_cart/);
    await page.click('a.check_out');

    await expect(page).toHaveURL(/\/checkout/);
    // navigate directly rather than clicking "Place Order" - that link is
    // occasionally intercepted by a Google ad interstitial on this site
    await page.goto('https://automationexercise.com/payment');

    await expect(page.locator('h2:has-text("Payment")'), 'Payment section is visible').toBeVisible();

    await page.fill('input[data-qa="name-on-card"]', 'John Doe');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2025');
});

//Click 'Pay and Confirm Order' button for John Doe's account and verify success message 'Your order has been placed successfully!'
test('TC14 - Click "Pay and Confirm Order" button', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    await page.goto('https://automationexercise.com/products');
    await page.locator('.product-image-wrapper').first().locator('a.add-to-cart').first().click();
    await page.click('a:has-text("View Cart")');

    await expect(page).toHaveURL(/view_cart/);
    await page.click('a.check_out');

    await expect(page).toHaveURL(/\/checkout/);
    // navigate directly rather than clicking "Place Order" - that link is
    // occasionally intercepted by a Google ad interstitial on this site
    await page.goto('https://automationexercise.com/payment');

    await expect(page.locator('h2:has-text("Payment")'), 'Payment section is visible').toBeVisible();

    await page.fill('input[data-qa="name-on-card"]', 'John Doe');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2025');

    await page.click('button[data-qa="pay-button"]');

    await expect(page.locator('h2:has-text("Order Placed!")'), 'Order Placed! message is visible').toBeVisible();
});

//Clicking 'Delete Account' button and verify success message 'ACCOUNT DELETED!' and click 'Continue' button
test('TC14 - Click "Delete Account" button', async ({ page }) => {
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;
    await signUpAndLogIn(page, uniqueEmail);

    // visiting /delete_account deletes the account immediately, no button to click
    await page.goto('https://automationexercise.com/delete_account');

    await expect(page.locator('h2:has-text("Account Deleted!")'), 'Account Deleted! message is visible').toBeVisible();
    await page.click('a[data-qa="continue-button"]');
});