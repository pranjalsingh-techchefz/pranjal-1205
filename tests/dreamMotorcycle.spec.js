import { test, expect } from '@playwright/test';

test.describe('Find Your Dream Motorcycle Section', () => {

    test('should correctly toggle tabs and display active state', async ({ page }) => {

        const timeOut = 10000; // 10 seconds timeout for waiting elements

        // Note: Replace with the actual URL of your page
        await page.goto('https://stagecdn.royalenfield.com/in/en/reown/');

        // Locators for the tab buttons
        const modelTabButton = page.getByRole('button', { name: 'Model' });
        const budgetTabButton = page.getByRole('button', { name: 'Budget' });
        const mfgYearTabButton = page.getByRole('button', { name: 'Mfg. Year' });

        // ADDED FIX: Explicitly wait for one of the tabs to be visible.
        // This makes the test robust and not dependent on a fixed timeout.
        await expect(modelTabButton).toBeVisible();

        // Step 1: Verify the initial state of the tabs.
        // The page snapshot indicates the 'Model' tab is the default active one.
        await expect(modelTabButton.locator('..')).toHaveClass(/active/);
        await expect(budgetTabButton.locator('..')).not.toHaveClass(/active/);
        await expect(mfgYearTabButton.locator('..')).not.toHaveClass(/active/);
        
        // Step 2: Click the 'Mfg. Year' tab.
        await mfgYearTabButton.click();
        
        // Step 3: Assert that the 'Mfg. Year' tab becomes active.
        // The locator('..') is used to check the parent <li> for the 'active' class.
        await expect(mfgYearTabButton.locator('..')).toHaveClass(/active/, {
            timeout: timeOut
        });
        
        // Step 4: Assert that the 'Model' tab is now inactive.
        await expect(modelTabButton.locator('..')).not.toHaveClass(/active/, {
            timeout: timeOut
        });
        await expect(budgetTabButton.locator('..')).not.toHaveClass(/active/, {
            timeout: timeOut
        });

        
        // Step 5: Click the 'Budget' tab.
        await budgetTabButton.click();
        
        // Step 6: Assert that the 'Budget' tab becomes active.
        await expect(budgetTabButton.locator('..')).toHaveClass(/active/, {
            timeout: timeOut
        });
        
        // Step 7: Assert that the 'Mfg. Year' tab is now inactive.
        await expect(mfgYearTabButton.locator('..')).not.toHaveClass(/active/, {
            timeout: timeOut
        });
        await expect(mfgYearTabButton.locator('..')).not.toHaveClass(/active/, {
            timeout: timeOut
        });
    });
});

