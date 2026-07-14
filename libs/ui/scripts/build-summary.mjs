#!/usr/bin/env node
/**
 * Build Summary: Reads JSON reports from all phases, prints a compact table,
 * generates output/report.html, and opens it in the browser.
 *
 * Usage:
 *   node libs/ui/scripts/build-summary.mjs            # print table + write HTML + open
 *   node libs/ui/scripts/build-summary.mjs --no-open  # skip opening in browser
 *   node libs/ui/scripts/build-summary.mjs --check    # CI mode: skip open, exit 1 on errors
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  readReports,
  computePhaseSummary,
  logConsoleSummary,
  renderHtmlReport,
  writeReportHtml,
  openInBrowser,
  readHistory,
  computeRegression,
  writeHistorySnapshot,
} from './_shared/report-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, 'output');
const NO_OPEN = process.argv.includes('--no-open');
const CHECK_MODE = process.argv.includes('--check');

const reports = readReports(OUTPUT_DIR);
const summary = computePhaseSummary(reports);
const history = readHistory(OUTPUT_DIR);
const regression = computeRegression(summary, history);

logConsoleSummary(summary);

const html = renderHtmlReport(reports, summary, { regression, history });
const htmlPath = writeReportHtml(html, OUTPUT_DIR);
writeHistorySnapshot(summary, OUTPUT_DIR);
console.log(`  ✓ HTML report written → ${htmlPath}`);

if (!NO_OPEN && !CHECK_MODE) {
  openInBrowser(htmlPath);
  console.log('  ✓ Opened in browser\n');
}

if (CHECK_MODE && (summary.totals.errors > 0 || summary.totals.warnings > 0)) {
  process.exit(summary.totals.errors > 0 ? 1 : 0);
}
