import { test, expect } from '@playwright/test';

test.describe('MD5 Tool - Modernized Framework', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/test-md5.html');
    // Wait for CryptoJS to load
    await page.waitForFunction(() => typeof window.CryptoJS !== 'undefined', { timeout: 5000 });
  });

  test('should load page and framework', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('MD5 Hash');
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should calculate MD5 hash for "abc"', async ({ page }) => {
    await page.fill('#input', 'abc');
    await page.waitForTimeout(150); // Wait for auto-update delay

    const output = await page.inputValue('#output');
    expect(output).toBe('900150983cd24fb0d6963f7d28e17f72');
  });

  test('should calculate MD5 hash for "hello world"', async ({ page }) => {
    await page.fill('#input', 'hello world');
    await page.waitForTimeout(150);

    const output = await page.inputValue('#output');
    expect(output).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
  });

  test('should calculate MD5 hash for empty string', async ({ page }) => {
    await page.fill('#input', '');
    await page.click('.btn-execute'); // Manual execute

    const output = await page.inputValue('#output');
    expect(output).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  test('should work with manual execute button', async ({ page }) => {
    // Disable auto-update
    await page.uncheck('#auto-update');

    // Type input
    await page.fill('#input', 'test123');

    // Output should be empty (auto-update disabled)
    let output = await page.inputValue('#output');
    expect(output).toBe('');

    // Click execute button
    await page.click('.btn-execute');

    // Now output should have hash
    output = await page.inputValue('#output');
    expect(output).toBe('cc03e747a6afbbcbf8be7668acfebee5');
  });

  test('should auto-update when checkbox is enabled', async ({ page }) => {
    // Ensure auto-update is checked
    await page.check('#auto-update');

    await page.fill('#input', 'auto-update-test');
    await page.waitForTimeout(150);

    const output = await page.inputValue('#output');
    expect(output).toBe('27b24c396498fd279ceae04c5fcc3682');
  });

  test('should run all automated tests successfully', async ({ page }) => {
    await page.click('#run-tests');

    // Wait for test results to appear
    await page.waitForSelector('.test-case', { timeout: 2000 });

    // Check that all tests passed
    const passedTests = await page.locator('.test-case.pass').count();
    const failedTests = await page.locator('.test-case.fail').count();

    console.log(`Automated tests: ${passedTests} passed, ${failedTests} failed`);

    expect(passedTests).toBeGreaterThan(0);
    expect(failedTests).toBe(0);
  });

  test('should calculate correct hashes for various inputs', async ({ page }) => {
    const testCases = [
      { input: 'The quick brown fox jumps over the lazy dog', expected: '9e107d9d372bb6826bd81d3542a419d6' },
      { input: '123456', expected: 'e10adc3949ba59abbe56e057f20f883e' },
      { input: 'password', expected: '5f4dcc3b5aa765d61d8327deb882cf99' },
      { input: 'MD5 Test', expected: '6e1fd0f5e63d3b2db4fa6cb8d6d16ad4' }
    ];

    for (const testCase of testCases) {
      await page.fill('#input', testCase.input);
      await page.waitForTimeout(150);

      const output = await page.inputValue('#output');
      expect(output).toBe(testCase.expected);
    }
  });

  test('should handle rapid input changes correctly', async ({ page }) => {
    // Type rapidly
    await page.fill('#input', 'a');
    await page.fill('#input', 'ab');
    await page.fill('#input', 'abc');

    // Wait for auto-update
    await page.waitForTimeout(150);

    const output = await page.inputValue('#output');
    expect(output).toBe('900150983cd24fb0d6963f7d28e17f72'); // MD5 of "abc"
  });

  test('should preserve output field readonly attribute', async ({ page }) => {
    const isReadonly = await page.locator('#output').getAttribute('readonly');
    expect(isReadonly).not.toBeNull();
  });

  test('should have functional checkboxes', async ({ page }) => {
    // Test auto-update checkbox
    const autoUpdateChecked = await page.isChecked('#auto-update');
    expect(autoUpdateChecked).toBe(true); // Default is checked

    await page.uncheck('#auto-update');
    const nowUnchecked = await page.isChecked('#auto-update');
    expect(nowUnchecked).toBe(false);

    // Test remember-input checkbox
    await page.check('#remember-input');
    const rememberChecked = await page.isChecked('#remember-input');
    expect(rememberChecked).toBe(true);
  });
});
