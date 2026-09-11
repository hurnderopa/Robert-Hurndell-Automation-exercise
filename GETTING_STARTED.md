# Getting Started

## Purpose

This repository is a Playwright test suite covering UI test cases (TC14, TC15) and API tests
(`verifyLogin`) for [automationexercise.com](https://automationexercise.com). It's intended to
be picked up and run by anyone on the team without prior context.

## Getting the Latest Code

Clone the repository and switch into it:

```bash
git clone <repository-url>
cd automation-exercise-main
```

To pick up changes after the initial clone:

```bash
git pull
```

## Setting Up the Environment

Requires [Node.js](https://nodejs.org/) 18+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install the browsers Playwright drives (Chromium, Firefox, WebKit). This is a one-time step,
   and only needs repeating after a Playwright version upgrade:

   ```bash
   npx playwright install
   ```

## Running the Tests

Run the full suite (UI tests across Chromium/Firefox/WebKit, plus the API tests):

```bash
npm test
npx playwright test
```

Run a single spec file:

```bash
npx playwright test tests/TC15.spec.js
```

Run only against one browser:

```bash
npx playwright test --project=chromium
```

Run only the API tests (fast - no browser involved):

```bash
npx playwright test --project=api
```

Run tests interactively with Playwright's UI mode (step through, inspect locators, view traces):

```bash
npm run test:ui
```

After a run, view the HTML report (screenshots, traces, and failure details):

```bash
npm run test:report
```

## Additional Details

- **Live external site:** these tests run against the real `https://automationexercise.com`
  (configured as `baseURL` in `playwright.config.js`), not a mock or local instance. Test data
  (emails, etc.) is generated fresh per run with [Faker](https://fakerjs.dev/) to avoid
  collisions with data from previous runs.
- **Known site quirk:** the `verifyLogin` API always responds with HTTP `200` at the transport
  level - the real result is in the `responseCode` field of the JSON body, not the HTTP status
  code. The API tests assert on `body.responseCode`, not `response.status()`, to account for this.
  See [ISSUES](ISSUES.md).
- **Flaky ad interstitial:** the checkout flow's "Place Order" link is occasionally intercepted
  by a Google ad overlay on the live site. The affected tests navigate directly to `/payment`
  instead of clicking through it.
- **Linting:** run `npm run lint` to check formatting/lint rules (`npm run format` to auto-fix).

---

## Links

[README](README.md) | [EXERCISE](EXERCISE.md) | [ISSUES](ISSUES.md) | [FEEDBACK](FEEDBACK.md)
