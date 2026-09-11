import { test, expect, type APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Automation Exercise's API always responds with HTTP 200 at the transport
 * level - the documented status is embedded in the JSON body as
 * `responseCode` instead. See ISSUES.md.
 */
const API_BASE = '/api';

async function createAccount(request: APIRequestContext, email: string, password: string) {
    const response = await request.post(`${API_BASE}/createAccount`, {
        form: {
            name: faker.person.fullName(),
            email,
            password,
            title: 'Mr',
            birth_date: '10',
            birth_month: '5',
            birth_year: '1990',
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            company: faker.company.name(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            country: 'New Zealand',
            zipcode: faker.location.zipCode(),
            state: faker.location.state(),
            city: faker.location.city(),
            mobile_number: faker.phone.number(),
        },
    });

    const body = await response.json();
    expect(body.responseCode, 'account creation prerequisite must succeed').toBe(201);
}

test.describe('verifyLogin API', () => {
    // API 7: POST To Verify Login with valid details
    test('API 7 - returns "User exists!" for a valid, registered account', async ({ request }) => {
        const email = faker.internet.email();
        const password = faker.internet.password();
        await createAccount(request, email, password);

        const response = await request.post(`${API_BASE}/verifyLogin`, {
            form: { email, password },
        });
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });

    // API 8: POST To Verify Login without email parameter
    test('API 8 - returns a 400 when the email parameter is missing', async ({ request }) => {
        const response = await request.post(`${API_BASE}/verifyLogin`, {
            form: { password: faker.internet.password() },
        });
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    // API 9: DELETE To Verify Login
    test('API 9 - returns a 405 for an unsupported DELETE request', async ({ request }) => {
        const response = await request.delete(`${API_BASE}/verifyLogin`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    // API 10: POST To Verify Login with invalid details
    test('API 10 - returns a 404 for credentials that do not match any account', async ({ request }) => {
        const response = await request.post(`${API_BASE}/verifyLogin`, {
            form: {
                email: faker.internet.email(),
                password: faker.internet.password(),
            },
        });
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.responseCode).toBe(404);
        expect(body.message).toBe('User not found!');
    });
});