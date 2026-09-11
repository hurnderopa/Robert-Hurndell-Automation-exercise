//tests/TC14.spec.js
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('TC14 - open Automation Exercise website', async ({ page }) => {
	await expect(page).toHaveTitle(/Automation Exercise/);
});

//Home page is visible successfully
test('TC14 - Home page is visible successfully', async ({ page }) => {
	await expect(page.locator('body'), 'Home page is visible successfully').toBeVisible();
});

//Add, viewing products to cart
test('TC14 - Add products to cart', async ({ page }) => {
	const firstProduct = page.locator('.product-image-wrapper').first();
	const productName = await firstProduct.locator('.productinfo p').innerText();

	await firstProduct.locator('.productinfo a.add-to-cart').click();

	await expect(page.locator('#cartModal')).toBeVisible();
	await expect(page.locator('#cartModal')).toContainText('Added!');

	await page.locator('#cartModal a', { hasText: 'View Cart' }).click();

	await expect(page).toHaveURL(/view_cart/);
	await expect(page.locator('#cart_info')).toContainText(productName);
});

//View All Products page
test('TC14 - View All Products page', async ({ page }) => {
	await page.goto('/products');
	await expect(page.locator('h2:has-text("All Products")'), 'All Products page is visible').toBeVisible();
});

//checkout page
test('TC14 - Checkout page', async ({ page }) => {
	await page.goto('/view_cart');
	await expect(page.locator('.breadcrumb li.active:has-text("Shopping Cart")'), 'Checkout page is visible').toBeVisible();
});