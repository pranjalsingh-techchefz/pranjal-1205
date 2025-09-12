import { test, expect } from '@playwright/test';

// Before each test, navigate to the specific page URL.
test.beforeEach(async ({ page }) => {
    // The URL is now fixed to your page.
    await page.goto('https://stagecdn.royalenfield.com/in/en/reown/');
});

test.describe('Tab Component', () => {

    test('should display the first tab and its content by default', async ({ page }) => {
        // Updated locators to match the provided HTML structure.
        // We are now targeting the button by its text and the parent <li> to check for the 'active' class.
        const firstTabButton = page.getByRole('button', { name: 'Model' });
        const firstTabListItem = page.locator('.tabs-btns li').filter({ has: firstTabButton });
        const firstContent = page.locator('.card-con.modelshow');
        
        const secondTabButton = page.getByRole('button', { name: 'Budget' });
        const secondTabListItem = page.locator('.tabs-btns li').filter({ has: secondTabButton });
        const secondContent = page.locator('.card-con.budgetshow');

        const thirdTabButton = page.getByRole('button', { name: 'Mfg. Year' });
        const thirdTabListItem = page.locator('.tabs-btns li').filter({ has: thirdTabButton });
        const thirdContent = page.locator('.card-con.mfgshow');

        // Assert that the first tab's list item has the 'active' class.
        await expect(firstTabListItem).toHaveClass(/active/);
        
        // Assert that the second tab's list item does NOT have the 'active' class.
        await expect(secondTabListItem).not.toHaveClass(/active/);

        // Assert that the second tab's list item does NOT have the 'active' class.
        await expect(thirdTabListItem).not.toHaveClass(/active/);
        
        // Assert that the first content is visible. Playwright automatically waits for this.
        await expect(firstContent).toBeVisible();

        // Assert that the second content is not visible.
        await expect(secondContent).not.toBeVisible();

        // Assert that the second content is not visible.
        await expect(thirdContent).not.toBeVisible();
    });

    test('should switch to a different tab and display its content on click', async ({ page }) => {
        // Updated locators to match the provided HTML structure.
        const firstTabButton = page.getByRole('button', { name: 'Model' });
        const firstTabListItem = page.locator('.tabs-btns li').filter({ has: firstTabButton });
        const firstContent = page.locator('.card-con.modelshow');

        const secondTabButton = page.getByRole('button', { name: 'Budget' });
        const secondTabListItem = page.locator('.tabs-btns li').filter({ has: secondTabButton });
        const secondContent = page.locator('.card-con.budgetshow');
        
        // Click on the second tab button.
        await secondTabButton.click();
        
        // --- ADDED ROBUSTNESS ---
        // Explicitly wait for the new content to become visible and the old content to become hidden.
        // Playwright will wait a few seconds for these conditions to be met before failing.
        await expect(secondContent).toBeVisible();
        await expect(firstContent).not.toBeVisible();
        
        // Now, assert that the classes have been updated correctly.
        await expect(secondTabListItem).toHaveClass(/active/);
        await expect(firstTabListItem).not.toHaveClass(/active/);
    });

    test('should correctly switch between multiple tabs', async ({ page }) => {
        // Find all tabs and their corresponding content.
        const modelTabButton = page.getByRole('button', { name: 'Model' });
        const modelTabListItem = page.locator('.tabs-btns li').filter({ has: modelTabButton });
        const modelContent = page.locator('.card-con.modelshow');

        const budgetTabButton = page.getByRole('button', { name: 'Budget' });
        const budgetTabListItem = page.locator('.tabs-btns li').filter({ has: budgetTabButton });
        const budgetContent = page.locator('.card-con.budgetshow');

        const yearTabButton = page.getByRole('button', { name: 'Mfg. Year' });
        const yearTabListItem = page.locator('.tabs-btns li').filter({ has: yearTabButton });
        const yearContent = page.locator('.card-con.mfgshow');

        // Click on the 'Budget' tab and verify its state.
        await budgetTabButton.click();
        await expect(budgetContent).toBeVisible(); // Wait for content to appear
        await expect(modelContent).not.toBeVisible(); // Wait for old content to disappear
        await expect(yearContent).not.toBeVisible();
        await expect(budgetTabListItem).toHaveClass(/active/);
        await expect(modelTabListItem).not.toHaveClass(/active/);
        
        // Click on the 'Mfg. Year' tab and verify its state.
        await yearTabButton.click();
        await expect(yearContent).toBeVisible(); // Wait for content to appear
        await expect(budgetContent).not.toBeVisible(); // Wait for old content to disappear
        await expect(modelContent).not.toBeVisible();
        await expect(yearTabListItem).toHaveClass(/active/);
        await expect(budgetTabListItem).not.toHaveClass(/active/);

        // Click back on the 'Model' tab and verify its state.
        await modelTabButton.click();
        await expect(modelContent).toBeVisible(); // Wait for content to appear
        await expect(yearContent).not.toBeVisible(); // Wait for old content to disappear
        await expect(budgetContent).not.toBeVisible();
        await expect(modelTabListItem).toHaveClass(/active/);
        await expect(yearTabListItem).not.toHaveClass(/active/);
    });
});
