import { chromium } from 'playwright';
import { checkStoryInventory, checkRenderedStoryParity } from './story-parity.mjs';

console.log(`Story inventory: ${await checkStoryInventory()} paired stories.`);
if (process.argv.includes('--browser')) {
  const browser = await chromium.launch({ headless: true });
  try {
    const report = await checkRenderedStoryParity(
      browser,
      process.env.REACT_STORYBOOK_URL ?? 'http://localhost:6006',
      process.env.WEB_STORYBOOK_URL ?? 'http://localhost:6007',
      process.env.STORY_FILTER ?? ''
    );
    console.log(`Compared ${report.count} rendered stories.`);
    report.failures.forEach((failure) => console.error(failure));
    if (report.failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
