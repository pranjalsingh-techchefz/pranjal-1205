import { test, expect } from '@playwright/test';

test('Home Page', async ({ page }) => {

    await page.goto('https://stagecdn.royalenfield.com/in/en/reown/');

    const pageTitle = await page.title(); // Add await here as it returns a promise

    console.log('Page title is:', pageTitle);

    await expect(page).toHaveTitle('Sell/Buy Motorcycle in India | Royal Enfield India');

    const pageURL = page.url();

    console.log('Page URL is:', pageURL);

    await expect(page).toHaveURL('https://stagecdn.royalenfield.com/in/en/reown/');

    await page.close();

});