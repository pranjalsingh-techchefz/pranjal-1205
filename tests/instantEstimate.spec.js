import { test, expect } from '@playwright/test';

// Define an array of test data objects to make the test case comprehensive and easier to maintain.
const testData = [
    {
        model: 'Classic 350',
        distance: '2500', // Value for 'Upto 5000'
        ownerStatus: '1', // Value for '1st'
        year: '2023',
        // This value is an assumption. You must update it with the actual expected estimate from the modal.
        expectedEstimate: '₹ 1,80,000' 
    },
    {
        model: 'Scram 411',
        distance: '7500', // Value for '5000-10000'
        ownerStatus: '2', // Value for '2nd'
        year: '2022',
        // This is a new assumption. Update this with a valid expected estimate.
        expectedEstimate: '₹ 1,50,000'
    },
    {
        model: 'Hunter 350',
        distance: '37500', // Value for '35000-40000'
        ownerStatus: '3', // Value for '3rd'
        year: '2021',
        // This is another new assumption. Update this with a valid expected estimate.
        expectedEstimate: '₹ 1,20,000'
    }
];

test.beforeEach(async ({ page }) => {
    // Navigate to the Royal Enfield Reown page.
    await page.goto('https://stagecdn.royalenfield.com/in/en/reown/');
});

test.describe('Instant Estimate Calculator', () => {

    // Use a standard for-of loop to iterate through the test data.
    // This approach works on all Playwright versions.
    for (const testCase of testData) {
        test(`should generate an estimate for ${testCase.model} with correct inputs`, async ({ page }) => {
            // --- Step 1: Locate the calculator section. ---
            const calculatorSection = page.locator('.estimationForm');
            await expect(calculatorSection).toBeVisible();

            // --- Step 2: Interact with each dropdown and select values based on the current testCase. ---
            
            // Find the Model dropdown and select an option.
            const modelDropdown = page.locator('select#engineCcValue');
            await modelDropdown.selectOption({ value: testCase.model });

            // Find the Kilometers dropdown and select an option.
            const distanceDropdown = page.locator('select#distanceCovered');
            await distanceDropdown.selectOption({ value: testCase.distance });

            // Find the Ownership Status dropdown and select an option.
            const ownerStatusDropdown = page.locator('select#ownershipStatusVal');
            await ownerStatusDropdown.selectOption({ value: testCase.ownerStatus });

            // The year dropdown is dynamically populated after the model is selected.
            const yearDropdown = page.locator('select#ie-year-name');
            // Wait for the dropdown to be enabled before attempting to select a value.
            await expect(yearDropdown).toBeEnabled();
            
            // Wait for the options to be populated after the AJAX call completes.
            await yearDropdown.locator('option:not([value="null"])').first().waitFor();
            
            // Select the year.
            await yearDropdown.selectOption({ value: testCase.year });
            
            // --- Step 3: Click the "Get Estimate" button. ---
            const getEstimateButton = calculatorSection.getByRole('button', { name: 'Get An Estimate' });
            await getEstimateButton.click();
            
            // --- Step 4: Assert the final estimated value. ---
            // Wait for the API call to complete before checking for the modal.
            await page.waitForResponse(response => 
                response.url().includes('v3/vintage/sell-motorcycle/cost-estimator') && response.status() === 200
            );

            const estimateModal = page.locator('.estimation-modal');
            await expect(estimateModal).toBeVisible({ timeout: 30000 });

            const estimatedPriceDisplay = estimateModal.locator('#upperRange_v');
            
            // Assert that the displayed price matches the expected value from the test data.
            await expect(estimatedPriceDisplay).toHaveText(testCase.expectedEstimate, { timeout: 10000 });
        });
    }
});
