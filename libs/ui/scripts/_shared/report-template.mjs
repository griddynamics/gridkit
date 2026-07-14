/**
 * Shared HTML dashboard generator for libs/ui verify pipeline.
 *
 * Used by build-summary.mjs (writes report.html and opens it as the final
 * step of verify:ui). Inputs are the JSON files produced by the phase scripts
 * under scripts/output/.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

// Inline vendored libs from node_modules so the report renders offline / in CI artifact
// viewers without CDN hits. Each falls back to its CDN if the local copy is missing.
const __dirname = dirname(fileURLToPath(import.meta.url));
const NODE_MODULES = resolve(__dirname, '../../../../node_modules');

const readIfExists = (p) => (existsSync(p) ? readFileSync(p, 'utf-8') : null);

const CHART_JS_INLINE = readIfExists(resolve(NODE_MODULES, 'chart.js/dist/chart.umd.min.js'));
const TABULATOR_JS_INLINE = readIfExists(resolve(NODE_MODULES, 'tabulator-tables/dist/js/tabulator.min.js'));
const TABULATOR_CSS_INLINE = readIfExists(
  resolve(NODE_MODULES, 'tabulator-tables/dist/css/tabulator_midnight.min.css')
);

// ─── Reading reports ──────────────────────────────────────────────────────────

const REPORT_FILES = {
  apiMap: 'public-api-map.json',
  depsMap: 'deps-map.json',
  treeshake: 'treeshake-report.json',
  buildLint: 'build-lint-report.json',
  ssr: 'ssr-report.json',
  cjs: 'cjs-report.json',
  knip: 'knip-report.json',
  agadoo: 'agadoo-report.json',
  attw: 'attw-report.json',
  sizeLimit: 'size-limit-report.json',
  rscRender: 'rsc-render-report.json',
  installCheck: 'install-check-report.json',
  madgeGraph: 'madge-graph.json',
};

export function readReports(outputDir) {
  const out = {};
  for (const [key, file] of Object.entries(REPORT_FILES)) {
    const p = resolve(outputDir, file);
    if (!existsSync(p)) {
      out[key] = null;
      continue;
    }
    try {
      out[key] = JSON.parse(readFileSync(p, 'utf-8'));
    } catch {
      out[key] = null;
    }
  }
  return out;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const n = (v) => (typeof v === 'number' ? v : Array.isArray(v) ? v.length : 0);
const st = (errors, warnings) => (n(errors) > 0 ? 'error' : n(warnings) > 0 ? 'warn' : 'pass');
const icon = (s) => (s === 'error' ? '✗' : s === 'warn' ? '⚠' : '✓');
const badge = (s, t) => `<span class="badge badge-${s}">${t}</span>`;
const statCard = (val, label, cls = 'neutral') =>
  `<div class="stat-card stat-${cls}"><div class="stat-value">${val}</div><div class="stat-label">${label}</div></div>`;

// Wraps tabular content in a <details> element when there are more than `threshold`
// items. Below threshold, renders as a regular open <div class="table-wrap">.
// `head` is plain text (becomes the summary), `body` is the inner HTML.
function collapsibleTable(head, body, count, threshold = 20) {
  if (count <= threshold) {
    return `<div class="table-wrap"><div class="table-head">${head}</div>${body}</div>`;
  }
  return `<details class="table-wrap collapsible">
    <summary class="table-head" style="cursor:pointer;list-style-position:inside">${head}  <span class="mut" style="font-weight:400">— click to expand</span></summary>
    ${body}
  </details>`;
}

// ─── Phase summary ────────────────────────────────────────────────────────────

export function computePhaseSummary(reports) {
  const { apiMap, depsMap, treeshake, buildLint, ssr, cjs, knip, agadoo, attw, sizeLimit } = reports;

  const knipFindings = n(knip?.unusedFiles) + n(knip?.unusedExports) + n(knip?.unusedDependencies);
  const agadooFail = agadoo && agadoo.passed === false ? 1 : 0;
  const sizeOverruns = n(sizeLimit?.overruns);
  const rscFails = reports.rscRender?.counts?.failed ?? 0;
  const installFails = reports.installCheck ? reports.installCheck.steps.filter((s) => !s.ok).length : 0;

  const phases = [
    {
      id: 1,
      name: 'Public API Audit',
      errors: 0,
      warnings: n(depsMap?.warnings) + knipFindings,
      detail: `${apiMap?.totalExports ?? '?'} exports · ${n(depsMap?.warnings)} dep warnings${
        knip ? ` · ${knipFindings} knip findings` : ''
      }`,
    },
    {
      id: 2,
      name: 'Tree-Shaking',
      errors: n(treeshake?.violations) + agadooFail + sizeOverruns,
      warnings: 0,
      detail: `${n(treeshake?.violations)} violations${agadoo ? ` · agadoo: ${agadoo.passed ? '✓' : '✗'}` : ''}${
        sizeLimit ? ` · ${sizeOverruns}/${n(sizeLimit?.entries)} budgets over` : ''
      }`,
    },
    {
      id: 3,
      name: 'Build Lint',
      errors: n(buildLint?.errors),
      warnings: n(buildLint?.warnings),
      detail: `${n(buildLint?.errors)} errors · ${n(buildLint?.warnings)} warnings`,
    },
    {
      id: 4,
      name: 'SSR Safety',
      errors: n(ssr?.errors),
      warnings: n(ssr?.warnings),
      detail: `${n(ssr?.errors)} errors · ${n(ssr?.warnings)} warnings`,
    },
    {
      id: 5,
      name: 'CJS Verification',
      errors: n(cjs?.errors),
      warnings: n(cjs?.warnings),
      detail: `${n(cjs?.errors)} errors · ${n(cjs?.warnings)} warnings`,
    },
  ];

  if (attw) {
    phases.push({
      id: 6,
      name: 'Types Compat (attw)',
      errors: n(attw?.errors),
      warnings: n(attw?.warnings),
      detail: `${n(attw?.errors)} errors · ${n(attw?.warnings)} warnings`,
    });
  }

  if (reports.rscRender) {
    phases.push({
      id: 7,
      name: 'SSR Render Harness',
      errors: rscFails,
      warnings: 0,
      detail: `${reports.rscRender.counts?.passed ?? 0} pass · ${rscFails} fail · ${reports.rscRender.counts?.skipped ?? 0} skip`,
    });
  }

  if (reports.installCheck) {
    phases.push({
      id: 8,
      name: 'Install Test (Verdaccio)',
      errors: installFails,
      warnings: 0,
      detail: `${reports.installCheck.steps.length - installFails}/${reports.installCheck.steps.length} steps · ESM:${reports.installCheck.esmExports ?? '?'} CJS:${reports.installCheck.cjsExports ?? '?'} exports`,
    });
  }

  for (const p of phases) p.s = st(p.errors, p.warnings);

  const totalErrors = phases.reduce((s, p) => s + p.errors, 0);
  const totalWarnings = phases.reduce((s, p) => s + p.warnings, 0);
  const overall = st(totalErrors, totalWarnings);

  return { phases, totals: { errors: totalErrors, warnings: totalWarnings, overall } };
}

// ─── History snapshots & regression ───────────────────────────────────────────

const HISTORY_DIR = 'history';
const HISTORY_LIMIT = 50;

function gitSha() {
  try {
    const r = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf-8' });
    return r.status === 0 ? r.stdout.trim() : null;
  } catch {
    return null;
  }
}

export function writeHistorySnapshot(summary, outputDir) {
  const dir = resolve(outputDir, HISTORY_DIR);
  mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const sha = gitSha();
  const snap = {
    ts: new Date().toISOString(),
    sha,
    totals: summary.totals,
    phases: summary.phases.map((p) => ({ id: p.id, name: p.name, errors: p.errors, warnings: p.warnings })),
  };
  const filename = `${ts}${sha ? `-${sha}` : ''}.json`;
  writeFileSync(resolve(dir, filename), JSON.stringify(snap, null, 2));

  // Cap retention so the dir doesn't grow unbounded across CI runs.
  const all = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  if (all.length > HISTORY_LIMIT) {
    for (const f of all.slice(0, all.length - HISTORY_LIMIT)) {
      try {
        unlinkSync(resolve(dir, f));
      } catch {}
    }
  }
  return resolve(dir, filename);
}

export function readHistory(outputDir, limit = 30) {
  const dir = resolve(outputDir, HISTORY_DIR);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  const tail = files.slice(-limit);
  const out = [];
  for (const f of tail) {
    try {
      out.push(JSON.parse(readFileSync(resolve(dir, f), 'utf-8')));
    } catch {}
  }
  return out;
}

// Returns deltas of the most recent snapshot vs the one before it. The current
// run has not been written to history yet at this point — so history.at(-1)
// is the previous run.
export function computeRegression(summary, history) {
  if (!history || history.length === 0) {
    return { prev: null, deltas: {}, totals: { errors: 0, warnings: 0 } };
  }
  const prev = history[history.length - 1];
  const deltas = {};
  for (const p of summary.phases) {
    const prevPhase = prev.phases?.find((q) => q.id === p.id);
    deltas[p.id] = {
      errors: p.errors - (prevPhase?.errors ?? 0),
      warnings: p.warnings - (prevPhase?.warnings ?? 0),
    };
  }
  return {
    prev,
    deltas,
    totals: {
      errors: summary.totals.errors - (prev.totals?.errors ?? 0),
      warnings: summary.totals.warnings - (prev.totals?.warnings ?? 0),
    },
  };
}

function deltaBadge(delta, kind) {
  if (delta === 0) return '';
  const cls = (kind === 'errors' ? delta > 0 : delta > 0) ? 'badge-error' : 'badge-pass';
  const sign = delta > 0 ? '+' : '';
  const label = kind === 'errors' ? 'err' : 'warn';
  return `<span class="badge ${cls} delta-badge">${sign}${delta} ${label}</span>`;
}

// ─── Console summary ──────────────────────────────────────────────────────────

export function logConsoleSummary(summary) {
  const { phases, totals } = summary;

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   gd-design-library  ·  Build Verify Summary   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  for (const p of phases) {
    const statusLabel = p.s === 'error' ? 'ERROR' : p.s === 'warn' ? 'WARN ' : 'PASS ';
    const mark = icon(p.s);
    console.log(`  Phase ${p.id} · ${p.name.padEnd(22)} ${mark} ${statusLabel}  ${p.detail}`);
  }

  console.log('\n── Totals ──────────────────────────────────────────');
  console.log(`  Errors + Violations : ${totals.errors}`);
  console.log(`  Warnings            : ${totals.warnings}`);
  console.log(
    '\n' +
      (totals.errors > 0
        ? '✗ Build verify completed with errors.'
        : totals.warnings > 0
          ? '⚠ Build verify completed with warnings.'
          : '✓ All phases passed.') +
      '\n'
  );
}

// ─── HTML rendering ───────────────────────────────────────────────────────────

const SC = '<' + '/script>'; // avoid literal </script> in template
const embed = (obj) => JSON.stringify(obj ?? null).replace(/<\/script>/gi, '<\\/script>');

function chartPrecompute(reports) {
  const { depsMap, treeshake, buildLint, ssr } = reports;

  const probeChartData = (treeshake?.probes ?? [])
    .filter((p) => p.exists)
    .sort((a, b) => (b.totalKB ?? b.totalKb ?? 0) - (a.totalKB ?? a.totalKb ?? 0))
    .map((p) => ({
      label: p.probe.split('/').slice(0, -1).join('/').replace('components/', ''),
      kb: p.totalKB ?? p.totalKb ?? 0,
      cross: (p.crossComponentDeps?.length ?? 0) > 0,
    }));

  const depsChartData = (() => {
    if (!depsMap) return null;
    const all = Object.keys(depsMap.actual ?? {});
    const deps = Object.keys(depsMap.declared?.dependencies ?? {});
    const peers = Object.keys(depsMap.declared?.peerDependencies ?? {});
    const decl = all.filter((p) => deps.includes(p) || peers.includes(p)).length;
    const und = n(depsMap.analysis?.undeclared);
    return { declared: decl, undeclared: und, dev: Math.max(0, all.length - decl - und) };
  })();

  const warnTypeData = (() => {
    const types = {};
    (buildLint?.warnings ?? []).forEach((w) => {
      types[w.type] = (types[w.type] ?? 0) + 1;
    });
    return types;
  })();

  const globalsCtx = (() => {
    const ctx = { safe: 0, guarded: 0, unguarded: 0 };
    (ssr?.browserGlobals?.unguardedDetails ?? []).forEach((u) => {
      ctx[u.context] = (ctx[u.context] ?? 0) + 1;
    });
    return ctx;
  })();

  return { probeChartData, depsChartData, warnTypeData, globalsCtx };
}

// ─── Per-phase section renderers ──────────────────────────────────────────────

function renderPhase1({ apiMap, depsMap, knip }, phase) {
  const knipBlock = knip
    ? `
  <div class="stats-row">
    ${statCard(n(knip?.unusedFiles), 'Unused Files (knip)', n(knip?.unusedFiles) > 0 ? 'warn' : 'pass')}
    ${statCard(n(knip?.unusedExports), 'Unused Exports (knip)', n(knip?.unusedExports) > 0 ? 'warn' : 'pass')}
    ${statCard(n(knip?.unusedDependencies), 'Unused Deps (knip)', n(knip?.unusedDependencies) > 0 ? 'warn' : 'pass')}
  </div>
  ${
    n(knip?.unusedExports) > 0
      ? collapsibleTable(
          `⚠ Unused exports (knip) · ${n(knip.unusedExports)}`,
          `<table class="sortable"><thead><tr><th>Export</th><th>File</th></tr></thead><tbody>${(
            knip.unusedExports ?? []
          )
            .map(
              (u) =>
                `<tr><td class="code">${u.name ?? u}</td><td class="fp">${u.file ?? ''}${u.line ? `:${u.line}` : ''}</td></tr>`
            )
            .join('')}</tbody></table>`,
          n(knip.unusedExports)
        )
      : ''
  }
  ${
    n(knip?.unusedFiles) > 0
      ? collapsibleTable(
          `⚠ Unused files (knip) · ${n(knip.unusedFiles)}`,
          `<table><thead><tr><th>File</th></tr></thead><tbody>${(knip.unusedFiles ?? [])
            .map((f) => `<tr><td class="fp">${f}</td></tr>`)
            .join('')}</tbody></table>`,
          n(knip.unusedFiles)
        )
      : ''
  }
  ${
    n(knip?.unusedEnumMembers) > 0
      ? collapsibleTable(
          `ℹ Unused enum members (knip) · ${n(knip.unusedEnumMembers)}`,
          `<table><thead><tr><th>Member</th><th>File</th></tr></thead><tbody>${(knip.unusedEnumMembers ?? [])
            .map(
              (e) =>
                `<tr><td class="code">${e.name}</td><td class="fp">${e.file}${e.line ? `:${e.line}` : ''}</td></tr>`
            )
            .join('')}</tbody></table>`,
          n(knip.unusedEnumMembers)
        )
      : ''
  }`
    : '';

  return `
<section id="p1" class="section">
  <div class="section-title">
    Phase 1 · Public API Audit
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">Export map from src/index.ts · dependency usage vs declared deps · knip unused-code scan</div>

  <div class="stats-row">
    ${statCard(apiMap?.totalExports ?? '?', 'Public Exports', 'info')}
    ${Object.entries(apiMap?.byCategory ?? {})
      .map(([cat, cnt]) => statCard(cnt, cat, 'neutral'))
      .join('')}
    ${statCard(n(depsMap?.warnings), 'Dep Warnings', n(depsMap?.warnings) > 0 ? 'warn' : 'pass')}
  </div>

  <div class="two-col">
    <div class="chart-wrap"><div class="chart-title">Exports by Category</div><canvas id="chart-exports"></canvas></div>
    <div class="chart-wrap"><div class="chart-title">Dependency Status</div><canvas id="chart-deps"></canvas></div>
  </div>

  ${
    n(depsMap?.warnings) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Dependency Warnings</div>
    <table><thead><tr><th>Type</th><th>Package / Detail</th></tr></thead><tbody>
    ${(depsMap.warnings ?? [])
      .map(
        (w) =>
          `<tr><td style="white-space:nowrap">${badge('warn', w.type)}</td><td class="code">${
            w.package ?? w.message ?? ''
          }</td></tr>`
      )
      .join('')}
    </tbody></table>
  </div>`
      : '<div class="alert alert-pass">✓ No dependency warnings.</div>'
  }

  ${
    n(depsMap?.analysis?.undeclared) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Undeclared packages</div>
    <table><thead><tr><th>Package</th></tr></thead><tbody>
    ${(depsMap.analysis.undeclared ?? []).map((p) => `<tr><td class="code">${p}</td></tr>`).join('')}
    </tbody></table>
  </div>`
      : ''
  }

  ${
    n(depsMap?.analysis?.unusedDeps) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Unused declared dependencies</div>
    <table><thead><tr><th>Package</th></tr></thead><tbody>
    ${(depsMap.analysis.unusedDeps ?? []).map((p) => `<tr><td class="code">${p}</td></tr>`).join('')}
    </tbody></table>
  </div>`
      : ''
  }

  ${knipBlock}
</section>`;
}

function renderPhase2({ treeshake, agadoo, sizeLimit }, phase) {
  const entries = agadoo?.entries ?? [];

  const sizeRows = sizeLimit?.entries ?? [];
  const fmtBytes = (b) => (b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} kB`);
  const sizeRow = (e) => {
    const used = Math.round((e.size / e.sizeLimit) * 100);
    const usedColor = used > 100 ? 'no' : used > 90 ? 'guarded' : 'yes';
    return `<tr>
      <td class="code">${e.name}</td>
      <td>${fmtBytes(e.size)}</td>
      <td>${fmtBytes(e.sizeLimit)}</td>
      <td><span class="tag tag-${usedColor}">${used}%</span></td>
      <td><span class="tag tag-${e.passed ? 'yes' : 'no'}">${e.passed ? 'within budget' : 'OVER'}</span></td>
    </tr>`;
  };
  const failingSize = sizeRows.filter((e) => !e.passed);
  const sizeAlert =
    sizeRows.length > 0
      ? `<div class="alert alert-${failingSize.length === 0 ? 'pass' : 'error'}">
      ${failingSize.length === 0 ? '✓' : '✗'} <strong>size-limit</strong>:
      ${failingSize.length === 0 ? `${sizeRows.length} entries within budget.` : `${failingSize.length} of ${sizeRows.length} entries OVER budget.`}
    </div>`
      : '';
  // Hide the full list when everything passes — listing every component is noise.
  // Show only failing entries when there's something actionable, and tuck the
  // full list behind a collapsible for inspection on demand.
  const sizeFailTable =
    failingSize.length > 0
      ? `<div class="table-wrap">
    <div class="table-head">size-limit overruns · ${failingSize.length} of ${sizeRows.length}</div>
    <table>
      <thead><tr><th>Entry</th><th>Size (gzipped)</th><th>Budget</th><th>Used</th><th>Status</th></tr></thead>
      <tbody>${failingSize.map(sizeRow).join('')}</tbody>
    </table>
  </div>`
      : '';
  const sizeAllDetails =
    sizeRows.length > 0
      ? `<details class="deps-block" style="margin-top:10px">
      <summary>Show all ${sizeRows.length} budgets</summary>
      <div style="padding:0 13px 11px">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead><tr style="color:var(--mut)"><th style="text-align:left;padding:6px 8px">Entry</th><th style="text-align:left;padding:6px 8px">Size</th><th style="text-align:left;padding:6px 8px">Budget</th><th style="text-align:left;padding:6px 8px">Used</th><th style="text-align:left;padding:6px 8px">Status</th></tr></thead>
          <tbody>${sizeRows.map(sizeRow).join('')}</tbody>
        </table>
      </div>
    </details>`
      : '';
  const sizeBlock = sizeAlert + sizeFailTable + sizeAllDetails;

  // Only render the per-entry table when there's something actionable to show
  // (a failing entry). When all entries pass, the alert above already says so;
  // listing every component again is noise and overlaps with size-limit below.
  const failingEntries = entries.filter((e) => !e.passed);
  const perEntryTable =
    failingEntries.length > 0
      ? `<div class="table-wrap">
    <div class="table-head">agadoo per-entry · ${failingEntries.length} failing of ${entries.length}</div>
    <table>
      <thead><tr><th>Entrypoint</th><th>Status</th><th>Survivors</th><th>Path</th></tr></thead>
      <tbody>
      ${failingEntries
        .map(
          (e) => `<tr>
        <td class="code">${e.name}</td>
        <td><span class="tag tag-no">${e.error ?? 'survivors'}</span></td>
        <td>${e.survivorsCount ?? 0}</td>
        <td class="fp" style="font-size:11px">${(e.entry ?? '').split('/').slice(-3).join('/')}</td>
      </tr>`
        )
        .join('')}
      </tbody>
    </table>
  </div>`
      : '';

  const agadooBlock = agadoo
    ? `<div class="alert alert-${agadoo.passed ? 'pass' : 'error'}">
    ${agadoo.passed ? '✓' : '✗'} <strong>agadoo</strong>: ${
      agadoo.passed
        ? `${entries.length || 1} dist entrypoint${entries.length === 1 ? '' : 's'} fully tree-shakable (Rollup eliminates all unused exports).`
        : `${entries.filter((e) => !e.passed).length || 1} dist entrypoint${entries.length === 1 ? '' : 's'} NOT fully tree-shakable. Some exports survived elimination.`
    }
    ${agadoo.error ? `<div class="sub code">${agadoo.error}</div>` : ''}
    ${
      !agadoo.passed && agadoo.unshakable?.length
        ? `<div class="sub" style="margin-top:6px">Survivors:<br>${agadoo.unshakable
            .slice(0, 10)
            .map((s) => `<span class="code">${s}</span>`)
            .join(', ')}</div>`
        : ''
    }
  </div>`
    : '';

  return `
<section id="p2" class="section">
  <div class="section-title">
    Phase 2 · Tree-Shaking
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">Import graph from dist · cross-component contamination · per-component KB footprint · agadoo round-trip</div>

  <div class="stats-row">
    ${statCard(treeshake?.distFiles ?? '?', 'Dist JS Files', 'info')}
    ${statCard(n(treeshake?.violations), 'Violations', n(treeshake?.violations) > 0 ? 'error' : 'pass')}
    ${statCard(
      treeshake?.sideEffects?.cssOnly ? '✓' : '⚠',
      'sideEffects CSS-only',
      treeshake?.sideEffects?.cssOnly ? 'pass' : 'warn'
    )}
    ${statCard(
      treeshake?.buildFormats?.hasCjs ? '✓' : '✗',
      'CJS Output',
      treeshake?.buildFormats?.hasCjs ? 'pass' : 'error'
    )}
    ${statCard(treeshake?.buildFormats?.hasMjs ? '✓' : '–', 'MJS Output', 'neutral')}
    ${statCard(`"${treeshake?.buildFormats?.pkgType ?? '?'}"`, 'package type', 'neutral')}
    ${agadoo ? statCard(agadoo.passed ? '✓' : '✗', 'agadoo tree-shake', agadoo.passed ? 'pass' : 'error') : ''}
  </div>

  ${agadooBlock}

  ${perEntryTable}

  ${sizeBlock}

  ${
    n(treeshake?.violations) > 0
      ? `<div class="table-wrap">
    <div class="table-head">✗ Violations</div>
    <ul class="issue-list">
    ${(treeshake.violations ?? [])
      .map(
        (v, i) => `
    <li>
      <span class="inum">${i + 1}.</span>
      <div>
        ${badge('error', v.type)}
        <div class="sub">${v.message}</div>
        ${
          v.unexpected
            ? `<div style="margin-top:5px;font-size:11px;color:var(--mut)">Unexpected: ${v.unexpected
                .map((d) => `<span class="code">${d.split('/').pop()}</span>`)
                .join(', ')}</div>`
            : ''
        }
      </div>
    </li>`
      )
      .join('')}
    </ul>
  </div>`
      : '<div class="alert alert-pass">✓ No violations.</div>'
  }

  <div class="chart-wrap">
    <div class="chart-title">Component KB Footprint — transitive deps · yellow = cross-component deps</div>
    <canvas id="chart-footprint" height="300"></canvas>
  </div>
</section>`;
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function buildDepsTreeView(mg) {
  const { graph = {}, structuralCycles = [], barrelCycles = [], knownCycles = [] } = mg;

  const nodes = Object.keys(graph);
  let edgeCount = 0;
  for (const k of nodes) edgeCount += (graph[k] || []).length;

  const fanIn = {};
  const fanOut = {};
  for (const [src, deps] of Object.entries(graph)) {
    fanOut[src] = (deps || []).length;
    for (const d of deps || []) fanIn[d] = (fanIn[d] || 0) + 1;
  }
  const topN = (obj, n = 10) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  const truncPath = (p, keep = 3) => {
    const parts = String(p).split('/');
    return parts.length <= keep ? p : '…/' + parts.slice(-keep).join('/');
  };

  const categoryOf = (p) => {
    if (!p) return 'other';
    if (p.startsWith('components/atoms/')) return 'atom';
    if (p.startsWith('components/molecules/')) return 'mol';
    if (p.startsWith('components/organisms/')) return 'org';
    if (p.startsWith('components/templates/')) return 'tpl';
    if (p.startsWith('components/layout/')) return 'lay';
    if (p.startsWith('components/core/')) return 'core';
    if (p.startsWith('hooks/')) return 'hook';
    if (p.startsWith('utils/')) return 'util';
    if (p.startsWith('ai/')) return 'ai';
    if (p.startsWith('tokens/')) return 'tok';
    if (p.startsWith('types/')) return 'type';
    return 'other';
  };

  const renderBarRow = (file, count, max) => {
    const pct = max > 0 ? Math.max(2, Math.round((count / max) * 100)) : 0;
    const cat = categoryOf(file);
    return `<div class="deps-bar-row">
      <div class="deps-bar-label" title="${escHtml(file)}"><code class="deps-cat-${cat}">${escHtml(truncPath(file))}</code></div>
      <div class="deps-bar"><span class="deps-bar-fill deps-cat-${cat}-bg" style="width:${pct}%"></span></div>
      <div class="deps-bar-num">${count}</div>
    </div>`;
  };

  const barColumn = (title, rows) => {
    if (!rows.length) return '';
    const max = rows[0][1];
    return `<div class="deps-bar-col">
      <div class="deps-bar-col-title">${title}<span class="deps-bar-col-max">max ${max}</span></div>
      ${rows.map(([f, c]) => renderBarRow(f, c, max)).join('')}
    </div>`;
  };

  const renderCycleRow = (cycle) => {
    const chips = cycle
      .map((f) => {
        const cat = categoryOf(f);
        return `<span class="deps-cycle-chip deps-cat-${cat}" data-explorer-file="${escHtml(f)}" title="open ${escHtml(f)} in explorer"><code>${escHtml(truncPath(f, 2))}</code></span>`;
      })
      .join('<span class="deps-cycle-arrow">→</span>');
    return `<li class="deps-cycle-row">
      <span class="deps-cycle-len" title="cycle length">${cycle.length}</span>
      <div class="deps-cycle-path">${chips}</div>
    </li>`;
  };

  const cycleBlock = (title, cycles, openByDefault, color, kind) => {
    if (!cycles.length) return '';
    const items = cycles.map(renderCycleRow).join('');
    return `<details class="deps-block deps-block-${kind}"${openByDefault ? ' open' : ''}>
      <summary>
        <span class="deps-count" style="color:${color}">${cycles.length}</span>
        <span>${title}</span>
        <span class="deps-block-hint">${cycles.length === 1 ? '1 cycle' : `${cycles.length} cycles`}</span>
      </summary>
      <ol class="deps-cycles">${items}</ol>
    </details>`;
  };

  const allCycles = [...structuralCycles, ...barrelCycles, ...knownCycles];
  const longestCycle = allCycles.reduce((m, c) => Math.max(m, c.length), 0);
  const avgFanOut = nodes.length ? (edgeCount / nodes.length).toFixed(1) : '0';

  // Tiny SVG layer-rollup graph: count files & edges by top-level directory,
  // place each category around a circle, draw curved edges proportional to
  // cross-layer import counts. Static SVG — no JS, no force layout.
  const CAT_LABELS = {
    atom: 'atoms', mol: 'molecules', org: 'organisms', tpl: 'templates', lay: 'layout',
    core: 'core', hook: 'hooks', util: 'utils', ai: 'ai', tok: 'tokens', type: 'types', other: 'other',
  };
  const CAT_PREFIXES = {
    atom: 'components/atoms/', mol: 'components/molecules/', org: 'components/organisms/',
    tpl: 'components/templates/', lay: 'components/layout/', core: 'components/core/',
    hook: 'hooks/', util: 'utils/', ai: 'ai/', tok: 'tokens/', type: 'types/', other: '',
  };
  const CAT_FILL = {
    atom: '#3fb950', mol: '#58a6ff', org: '#bc8cff', tpl: '#f0883e', lay: '#79c0ff',
    core: '#8b949e', hook: '#f85149', util: '#6e7681', ai: '#db6d6d', tok: '#d29922',
    type: '#79c0ff', other: '#6e7681',
  };

  const catCount = {};
  const catEdges = {};
  for (const [src, deps] of Object.entries(graph)) {
    const fc = categoryOf(src);
    catCount[fc] = (catCount[fc] || 0) + 1;
    for (const d of deps || []) {
      const tc = categoryOf(d);
      const k = `${fc}|${tc}`;
      catEdges[k] = (catEdges[k] || 0) + 1;
    }
  }
  const cats = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a]);

  const buildLayerGraph = () => {
    if (cats.length === 0) return '';
    const W = 640, H = 360, cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 64;
    const maxCount = Math.max(...Object.values(catCount));
    const crossEdges = Object.entries(catEdges).filter(([k]) => {
      const [f, t] = k.split('|');
      return f !== t;
    });
    const maxEdge = crossEdges.length ? Math.max(...crossEdges.map(([, v]) => v)) : 1;

    const positions = {};
    cats.forEach((c, i) => {
      const angle = (i / cats.length) * 2 * Math.PI - Math.PI / 2;
      positions[c] = {
        x: cx + R * Math.cos(angle),
        y: cy + R * Math.sin(angle),
        r: 9 + 16 * (catCount[c] / maxCount),
      };
    });

    const edgeSvg = crossEdges
      .map(([k, v]) => {
        const [from, to] = k.split('|');
        const a = positions[from];
        const b = positions[to];
        if (!a || !b) return '';
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const x1 = a.x + ux * a.r;
        const y1 = a.y + uy * a.r;
        const x2 = b.x - ux * (b.r + 5);
        const y2 = b.y - uy * (b.r + 5);
        const mx = (x1 + x2) / 2 - uy * 18;
        const my = (y1 + y2) / 2 + ux * 18;
        const w = (0.6 + 4 * (v / maxEdge)).toFixed(2);
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${CAT_FILL[from]}" stroke-width="${w}" stroke-opacity="0.45" marker-end="url(#deps-arrow)"><title>${CAT_LABELS[from]} → ${CAT_LABELS[to]}: ${v}</title></path>`;
      })
      .join('');

    const selfLoopBadges = cats
      .map((c) => {
        const self = catEdges[`${c}|${c}`] || 0;
        if (!self) return '';
        const p = positions[c];
        return `<circle cx="${(p.x + p.r * 0.7).toFixed(1)}" cy="${(p.y - p.r * 0.7).toFixed(1)}" r="6" fill="#161b22" stroke="${CAT_FILL[c]}" stroke-width="1"/><text x="${(p.x + p.r * 0.7).toFixed(1)}" y="${(p.y - p.r * 0.7 + 3).toFixed(1)}" text-anchor="middle" font-size="8" fill="${CAT_FILL[c]}" font-family="monospace">↻</text>`;
      })
      .join('');

    const nodeSvg = cats
      .map((c) => {
        const p = positions[c];
        return `<g class="deps-graph-node" data-explorer-cat="${c}" data-explorer-prefix="${CAT_PREFIXES[c] ?? ''}" style="cursor:pointer">
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${CAT_FILL[c]}" fill-opacity="0.85" stroke="${CAT_FILL[c]}" stroke-width="1.5"><title>${CAT_LABELS[c]}: ${catCount[c]} files — click to filter explorer</title></circle>
        <text x="${p.x.toFixed(1)}" y="${(p.y + p.r + 15).toFixed(1)}" text-anchor="middle" font-size="11" fill="#c9d1d9" font-family="-apple-system,system-ui,sans-serif">${CAT_LABELS[c]}</text>
        <text x="${p.x.toFixed(1)}" y="${(p.y + p.r + 27).toFixed(1)}" text-anchor="middle" font-size="9" fill="#8b949e" font-family="monospace">${catCount[c]}</text>
      </g>`;
      })
      .join('');

    return `<div class="deps-graph-wrap">
      <div class="deps-graph-title">Layer rollup · ${cats.length} categories · ${crossEdges.length} cross-layer edges<span class="deps-graph-hint">size ∝ files · stroke ∝ imports · ↻ self-imports</span></div>
      <svg viewBox="0 0 ${W} ${H}" class="deps-graph-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="deps-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#8b949e" fill-opacity="0.55"/>
          </marker>
        </defs>
        ${edgeSvg}
        ${nodeSvg}
        ${selfLoopBadges}
      </svg>
    </div>`;
  };

  const layerGraph = buildLayerGraph();

  const summaryStats = `<div class="deps-summary-row">
    <div class="deps-stat"><span>${nodes.length.toLocaleString()}</span><label>modules</label></div>
    <div class="deps-stat"><span>${edgeCount.toLocaleString()}</span><label>edges</label></div>
    <div class="deps-stat"><span>${avgFanOut}</span><label>avg fan-out</label></div>
    <div class="deps-stat ${structuralCycles.length > 0 ? 'deps-stat-bad' : 'deps-stat-good'}"><span>${structuralCycles.length}</span><label>structural</label></div>
    <div class="deps-stat"><span>${barrelCycles.length}</span><label>barrel</label></div>
    <div class="deps-stat"><span>${longestCycle || 0}</span><label>longest cycle</label></div>
  </div>`;

  const explorerBlock = `<details class="deps-block deps-block-explorer" open id="deps-explorer-block">
    <summary>
      <span class="deps-count" style="color:#d29922">⌕</span>
      <span>File explorer</span>
      <span class="deps-block-hint">click cycle chips, layer-graph nodes, or any file · / to focus search · ↑↓ to navigate</span>
    </summary>
    <div class="deps-explorer">
      <div class="deps-explorer-left">
        <input type="text" class="deps-explorer-search" id="deps-search" placeholder="Filter… (e.g. Button, atoms/, .types)" autocomplete="off" />
        <div class="deps-explorer-stats">
          <select class="deps-explorer-sort" id="deps-sort">
            <option value="fanIn">most imported (fan-in)</option>
            <option value="fanOut">most importers (fan-out)</option>
            <option value="name">name (A→Z)</option>
            <option value="cycle">in cycle first</option>
          </select>
          <span id="deps-stats" style="margin-left:8px"></span>
        </div>
        <ul class="deps-explorer-files" id="deps-file-list"></ul>
      </div>
      <div class="deps-explorer-right" id="deps-detail">
        <div class="deps-explorer-empty">Click a file to see its imports and dependents.<br><span style="font-size:10px;opacity:.7">→ direct imports · ← dependents · ⟳ in cycle · cycle chips and layer nodes are clickable</span></div>
      </div>
    </div>
  </details>`;

  return `<div class="chart-wrap">
    <div class="chart-title">Module Dependency Tree (madge) — explorer · cycles · hottest files</div>
    ${summaryStats}
    ${layerGraph}
    ${explorerBlock}
    ${cycleBlock('Structural cycles', structuralCycles, true, '#f85149', 'struct')}
    ${cycleBlock('Barrel cycles (safe in TS)', barrelCycles, false, '#58a6ff', 'barrel')}
    ${cycleBlock('Known intentional cycles', knownCycles, false, '#3fb950', 'known')}
    <div class="deps-bar-grid">
      ${barColumn('Top imported (fan-in)', topN(fanIn, 10))}
      ${barColumn('Top importers (fan-out)', topN(fanOut, 10))}
    </div>
  </div>`;
}

function renderPhase3({ buildLint, madgeGraph }, phase) {
  const graphPanel = madgeGraph?.graph ? buildDepsTreeView(madgeGraph) : '';

  return `
<section id="p3" class="section">
  <div class="section-title">
    Phase 3 · Build Lint
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">Circular imports (madge) · exports validity · .d.ts completeness · private leaks · publint</div>

  <div class="stats-row">
    ${statCard(n(buildLint?.errors), 'Errors', n(buildLint?.errors) > 0 ? 'error' : 'pass')}
    ${statCard(n(buildLint?.warnings), 'Warnings', n(buildLint?.warnings) > 0 ? 'warn' : 'pass')}
    ${statCard(buildLint?.circularDeps?.total ?? '?', 'Circular Deps', 'neutral')}
    ${statCard(
      buildLint?.circularDeps?.structural ?? '?',
      'Structural Cycles',
      (buildLint?.circularDeps?.structural ?? 0) > 0 ? 'error' : 'pass'
    )}
    ${statCard(buildLint?.circularDeps?.barrel ?? '?', 'Barrel Cycles (safe)', 'info')}
    ${statCard(buildLint?.sourceFiles ?? '?', 'Source Files', 'neutral')}
  </div>

  <div class="two-col">
    <div class="chart-wrap"><div class="chart-title">Circular Deps Breakdown</div><canvas id="chart-circulars"></canvas></div>
    <div class="chart-wrap"><div class="chart-title">Warning Types</div><canvas id="chart-lint-warns"></canvas></div>
  </div>

  ${graphPanel}

  ${
    n(buildLint?.errors) > 0
      ? `<div class="table-wrap">
    <div class="table-head">✗ Errors</div>
    <ul class="issue-list">
    ${(buildLint.errors ?? [])
      .map(
        (e, i) => `
    <li>
      <span class="inum">${i + 1}.</span>
      <div>
        ${badge('error', e.type)}
        ${e.issues ? `<ol class="err-issues">${e.issues.map((iss) => `<li>${iss}</li>`).join('')}</ol>` : ''}
        ${e.message ? `<div class="sub">${e.message}</div>` : ''}
        ${e.cycle ? `<div class="sub code" style="font-size:11px">${e.cycle.join(' → ')}</div>` : ''}
      </div>
    </li>`
      )
      .join('')}
    </ul>
  </div>`
      : '<div class="alert alert-pass">✓ No errors.</div>'
  }

  ${
    n(buildLint?.warnings) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Warnings (${n(buildLint?.warnings)})</div>
    <table class="sortable"><thead><tr><th>Type</th><th>Detail</th></tr></thead><tbody>
    ${(buildLint.warnings ?? [])
      .map(
        (w) => `
    <tr>
      <td style="white-space:nowrap">${badge('warn', w.type)}</td>
      <td style="font-size:12px">${
        w.message ?? (w.jsFile ? `<span class="fp">${w.jsFile}</span>` : JSON.stringify(w))
      }</td>
    </tr>`
      )
      .join('')}
    </tbody></table>
  </div>`
      : ''
  }

  ${
    (buildLint?.circularDeps?.barrelList ?? []).length > 0
      ? `<details class="table-wrap" style="padding:0">
    <summary style="padding:11px 14px;cursor:pointer;font-size:11px;font-weight:600;color:var(--mut);text-transform:uppercase;letter-spacing:.5px">
      Barrel cycles · ${buildLint.circularDeps.barrelList.length} (safe — click to expand)
    </summary>
    <ol class="err-issues" style="padding:8px 32px 12px">
      ${buildLint.circularDeps.barrelList
        .map((cycle) => `<li class="fp" style="font-size:11px">${cycle.join(' → ')}</li>`)
        .join('')}
    </ol>
  </details>`
      : ''
  }
</section>`;
}

function renderPhase4({ ssr }, phase) {
  return `
<section id="p4" class="section">
  <div class="section-title">
    Phase 4 · SSR Safety
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">Node.js import test · browser globals · RSC "use client" coverage</div>

  <div class="stats-row">
    ${statCard(
      ssr?.nodeImport?.status === 'pass' ? '✓' : '✗',
      'Node.js Import',
      ssr?.nodeImport?.status === 'pass' ? 'pass' : 'error'
    )}
    ${statCard(ssr?.nodeImport?.exports ?? '?', 'Exports in Node', 'info')}
    ${statCard(n(ssr?.errors), 'Errors', n(ssr?.errors) > 0 ? 'error' : 'pass')}
    ${statCard(n(ssr?.warnings), 'Warnings', n(ssr?.warnings) > 0 ? 'warn' : 'pass')}
    ${statCard(ssr?.browserGlobals?.filesTotal ?? '?', 'Files w/ Browser Globals', 'neutral')}
    ${statCard(
      ssr?.browserGlobals?.unguardedFiles ?? '?',
      'Unguarded Files',
      (ssr?.browserGlobals?.unguardedFiles ?? 0) > 0 ? 'error' : 'pass'
    )}
  </div>

  <div class="two-col">
    <div class="chart-wrap"><div class="chart-title">RSC Readiness ("use client" coverage)</div><canvas id="chart-rsc"></canvas></div>
    <div class="chart-wrap"><div class="chart-title">Browser Global Contexts</div><canvas id="chart-globals"></canvas></div>
  </div>

  ${
    n(ssr?.browserGlobals?.unguardedByFile) > 0
      ? `<div class="table-wrap">
    <div class="table-head">Unguarded Browser Globals · ${ssr.browserGlobals.unguardedByFile.length} file(s)</div>
    <table class="sortable">
      <thead><tr><th>File</th><th>Globals</th><th>Lines</th><th>use client</th><th>Sample</th></tr></thead>
      <tbody>
      ${(ssr.browserGlobals.unguardedByFile ?? [])
        .map((f) => {
          const sample = (f.lines ?? [])
            .slice(0, 3)
            .map(
              (l) =>
                `<div class="sub" style="font-size:11px"><span class="lnum">:${l.lineNum}</span> <span class="code">${l.glob}</span></div>`
            )
            .join('');
          const more =
            f.lines && f.lines.length > 3
              ? `<div class="sub" style="font-size:11px;color:var(--mut)">+${f.lines.length - 3} more</div>`
              : '';
          return `
      <tr>
        <td class="fp">${f.file}</td>
        <td>${(f.globals ?? []).map((g) => `<span class="code" style="margin-right:4px">${g}</span>`).join('')}</td>
        <td>${f.count}</td>
        <td><span class="tag tag-${f.hasUseClient ? 'yes' : 'no'}">${f.hasUseClient ? 'yes' : 'no'}</span></td>
        <td>${sample}${more}</td>
      </tr>`;
        })
        .join('')}
      </tbody>
    </table>
  </div>`
      : '<div class="alert alert-pass">✓ No unguarded browser globals.</div>'
  }

  ${
    n(ssr?.rsc?.missingUseClient) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Hook-using files missing "use client" (${n(ssr.rsc.missingUseClient)})</div>
    <table><thead><tr><th>File</th></tr></thead><tbody>
    ${(ssr.rsc.missingUseClient ?? []).map((f) => `<tr><td class="fp">${f}</td></tr>`).join('')}
    </tbody></table>
  </div>`
      : ''
  }
</section>`;
}

function renderPhase5({ cjs }, phase) {
  return `
<section id="p5" class="section">
  <div class="section-title">
    Phase 5 · CJS Verification
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">require() · exports "require" conditions · CJS syntax · "main" field</div>

  <div class="stats-row">
    ${statCard(n(cjs?.errors), 'Errors', n(cjs?.errors) > 0 ? 'error' : 'pass')}
    ${statCard(n(cjs?.warnings), 'Warnings', n(cjs?.warnings) > 0 ? 'warn' : 'pass')}
  </div>

  ${
    n(cjs?.errors) === 0 && n(cjs?.warnings) === 0 ? '<div class="alert alert-pass">✓ All CJS checks passed.</div>' : ''
  }

  ${
    n(cjs?.errors) > 0
      ? `<div class="table-wrap">
    <div class="table-head">✗ Errors</div>
    <ul class="issue-list">
    ${(cjs.errors ?? [])
      .map(
        (e, i) => `
    <li>
      <span class="inum">${i + 1}.</span>
      <div>
        ${badge('error', e.type)}
        ${e.message ? `<div class="sub">${e.message}</div>` : ''}
      </div>
    </li>`
      )
      .join('')}
    </ul>
  </div>`
      : ''
  }

  ${
    n(cjs?.warnings) > 0
      ? `<div class="table-wrap">
    <div class="table-head">⚠ Warnings</div>
    <table><thead><tr><th>Type</th><th>Detail</th></tr></thead><tbody>
    ${(cjs.warnings ?? [])
      .map(
        (w) => `
    <tr>
      <td style="white-space:nowrap">${badge('warn', w.type)}</td>
      <td style="font-size:12px">${w.message ?? w.exportPath ?? w.main ?? JSON.stringify(w)}</td>
    </tr>`
      )
      .join('')}
    </tbody></table>
  </div>`
      : ''
  }
</section>`;
}

function renderPhase6({ attw }, phase) {
  if (!attw) return '';

  const problems = attw.problems ?? [];
  const resolutions = attw.resolutions ?? {};

  return `
<section id="p6" class="section">
  <div class="section-title">
    Phase 6 · Types Compat (attw)
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">@arethetypeswrong/cli · dual-package types resolution · ESM/CJS/node10/bundler/node16 entry points</div>

  <div class="stats-row">
    ${statCard(n(attw?.errors), 'Errors', n(attw?.errors) > 0 ? 'error' : 'pass')}
    ${statCard(n(attw?.warnings), 'Warnings', n(attw?.warnings) > 0 ? 'warn' : 'pass')}
    ${statCard(n(problems), 'Problem rules', n(problems) > 0 ? 'warn' : 'pass')}
  </div>

  ${
    n(problems) === 0 && n(attw?.errors) === 0
      ? '<div class="alert alert-pass">✓ All resolutions match expected types.</div>'
      : ''
  }

  ${
    n(problems) > 0
      ? `<div class="table-wrap">
    <div class="table-head">Problems</div>
    <ul class="issue-list">
    ${problems
      .map(
        (p, i) => `
    <li>
      <span class="inum">${i + 1}.</span>
      <div>
        ${badge(p.severity === 'error' ? 'error' : 'warn', p.kind ?? p.type ?? 'problem')}
        <div class="sub">${p.message ?? JSON.stringify(p)}</div>
        ${p.entrypoint ? `<div class="sub fp">entry: ${p.entrypoint}</div>` : ''}
      </div>
    </li>`
      )
      .join('')}
    </ul>
  </div>`
      : ''
  }

  ${
    Object.keys(resolutions).length > 0
      ? `<div class="table-wrap">
    <div class="table-head">Per-resolution status</div>
    <table><thead><tr><th>Entrypoint</th><th>node10</th><th>node16-cjs</th><th>node16-esm</th><th>bundler</th></tr></thead><tbody>
    ${Object.entries(resolutions)
      .map(
        ([entry, res]) => `
    <tr>
      <td class="fp">${entry}</td>
      <td><span class="tag tag-${res.node10 === 'ok' ? 'yes' : 'no'}">${res.node10 ?? '–'}</span></td>
      <td><span class="tag tag-${res['node16-cjs'] === 'ok' ? 'yes' : 'no'}">${res['node16-cjs'] ?? '–'}</span></td>
      <td><span class="tag tag-${res['node16-esm'] === 'ok' ? 'yes' : 'no'}">${res['node16-esm'] ?? '–'}</span></td>
      <td><span class="tag tag-${res.bundler === 'ok' ? 'yes' : 'no'}">${res.bundler ?? '–'}</span></td>
    </tr>`
      )
      .join('')}
    </tbody></table>
  </div>`
      : ''
  }
</section>`;
}

function renderPhase7({ rscRender }, phase) {
  if (!rscRender) return '';

  const { counts = {}, results = [], importMs, exportsVisible } = rscRender;

  return `
<section id="p7" class="section">
  <div class="section-title">
    Phase 7 · SSR Render Harness
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">react-dom/server.renderToStaticMarkup against dist · catches runtime SSR crashes the regex check can't see</div>

  <div class="stats-row">
    ${statCard(counts.passed ?? 0, 'Passed', 'pass')}
    ${statCard(counts.failed ?? 0, 'Failed', counts.failed > 0 ? 'error' : 'pass')}
    ${statCard(counts.skipped ?? 0, 'Skipped', 'neutral')}
    ${statCard(`${importMs ?? '?'} ms`, 'Import time', 'info')}
    ${statCard(exportsVisible ?? '?', 'Exports in Node', 'info')}
  </div>

  ${
    counts.failed > 0
      ? `<div class="table-wrap">
    <div class="table-head">✗ Failures</div>
    <ul class="issue-list">
    ${results
      .filter((r) => r.status === 'fail')
      .map(
        (r, i) => `
    <li>
      <span class="inum">${i + 1}.</span>
      <div>
        ${badge('error', r.name)}
        <div class="sub">${r.error ?? 'unknown'}</div>
        ${r.stack ? `<pre class="sub code" style="font-size:11px;white-space:pre-wrap">${r.stack}</pre>` : ''}
      </div>
    </li>`
      )
      .join('')}
    </ul>
  </div>`
      : '<div class="alert alert-pass">✓ All tested components render under SSR.</div>'
  }

  <div class="table-wrap">
    <div class="table-head">Per-component results · ${results.length} components · ${counts.passed ?? 0} ✓ · ${counts.failed ?? 0} ✗ · ${counts.skipped ?? 0} ⊘</div>
    <table class="sortable">
      <thead><tr><th>Component</th><th>Status</th><th>HTML bytes</th><th>Source</th><th>Notes</th></tr></thead>
      <tbody>
      ${results
        .map((r) => {
          const tag =
            r.status === 'pass' ? (r.htmlLength === 0 ? 'guarded' : 'yes') : r.status === 'fail' ? 'no' : 'unguarded';
          return `<tr>
        <td class="code">${r.name}</td>
        <td><span class="tag tag-${tag}">${r.status}</span></td>
        <td>${r.htmlLength ?? '–'}</td>
        <td><span class="tag tag-${r.source === 'curated' ? 'yes' : 'guarded'}">${r.source ?? '–'}</span></td>
        <td style="font-size:11px;color:var(--mut)">${r.note ?? r.reason ?? r.error ?? ''}</td>
      </tr>`;
        })
        .join('')}
      </tbody>
    </table>
  </div>
</section>`;
}

function renderPhase8({ installCheck }, phase) {
  if (!installCheck) return '';
  const { steps = [], registry, publishedVersion, esmExports, cjsExports } = installCheck;
  const failed = steps.filter((s) => !s.ok).length;

  return `
<section id="p8" class="section">
  <div class="section-title">
    Phase 8 · Install Test (Verdaccio)
    ${badge(phase.s, `${icon(phase.s)} ${phase.detail}`)}
  </div>
  <div class="section-sub">Publish dist to a private Verdaccio · install into a fresh fixture · smoke-test ESM + CJS resolution</div>

  <div class="stats-row">
    ${statCard(steps.length - failed, 'Passed steps', 'pass')}
    ${statCard(failed, 'Failed steps', failed > 0 ? 'error' : 'pass')}
    ${statCard(esmExports ?? '?', 'ESM exports', 'info')}
    ${statCard(cjsExports ?? '?', 'CJS exports', 'info')}
  </div>

  ${
    publishedVersion
      ? `<div class="alert alert-pass" style="font-size:12px"><strong>Published:</strong> <code>${publishedVersion}</code> to <code>${registry}</code></div>`
      : ''
  }

  <div class="table-wrap">
    <div class="table-head">Step results</div>
    <table>
      <thead><tr><th>Step</th><th>Status</th><th>Detail</th></tr></thead>
      <tbody>
      ${steps
        .map(
          (s) => `<tr>
        <td class="code">${s.label}</td>
        <td><span class="tag tag-${s.ok ? 'yes' : 'no'}">${s.ok ? 'pass' : 'fail'}</span></td>
        <td style="font-size:11px;color:var(--mut)">${(s.detail ?? '').slice(0, 200)}</td>
      </tr>`
        )
        .join('')}
      </tbody>
    </table>
  </div>
</section>`;
}

const PHASE_RENDERERS = {
  1: renderPhase1,
  2: renderPhase2,
  3: renderPhase3,
  4: renderPhase4,
  5: renderPhase5,
  6: renderPhase6,
  7: renderPhase7,
  8: renderPhase8,
};

// ─── Top-level HTML render ────────────────────────────────────────────────────

export function renderHtmlReport(reports, summary = computePhaseSummary(reports), opts = {}) {
  const { phases, totals } = summary;
  const { regression = { prev: null, deltas: {}, totals: { errors: 0, warnings: 0 } }, history = [] } = opts;
  const charts = chartPrecompute(reports);

  const phaseColors = JSON.stringify(
    phases.map((p) => (p.s === 'error' ? '#f85149' : p.s === 'warn' ? '#d29922' : '#3fb950'))
  );
  const phaseLabels = JSON.stringify(phases.map((p) => `P${p.id}`));

  const phaseDelta = (id) => {
    const d = regression.deltas[id];
    if (!d) return '';
    return `${deltaBadge(d.errors, 'errors')}${deltaBadge(d.warnings, 'warnings')}`;
  };

  const navHtml = phases
    .map(
      (p) =>
        `<a onclick="show('p${p.id}')" id="nav-p${p.id}"><span class="dot dot-${p.s}"></span>Phase ${p.id} · ${p.name}</a>`
    )
    .join('\n  ');

  const sectionsHtml = phases.map((p) => PHASE_RENDERERS[p.id]?.(reports, p) ?? '').join('\n');

  const errorsByPhase = phases.map((p) => p.errors);
  const warningsByPhase = phases.map((p) => p.warnings);

  // Build trend series for the summary chart from the most recent N snapshots,
  // appending the current run as the rightmost point.
  const trendPoints = [
    ...history.slice(-19).map((h) => ({
      label: (h.sha ?? h.ts?.slice(0, 10) ?? '?').slice(0, 7),
      errors: h.totals?.errors ?? 0,
      warnings: h.totals?.warnings ?? 0,
    })),
    { label: 'now', errors: totals.errors, warnings: totals.warnings },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GridKit · Build Verify Report</title>
${
  CHART_JS_INLINE
    ? `<script>${CHART_JS_INLINE.replace(/<\/script>/gi, '<\\/script>')}${SC}`
    : `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js">${SC}`
}
${
  TABULATOR_JS_INLINE
    ? `<script>${TABULATOR_JS_INLINE.replace(/<\/script>/gi, '<\\/script>')}${SC}`
    : `<script src="https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min.js">${SC}`
}
${
  TABULATOR_CSS_INLINE
    ? `<style>${TABULATOR_CSS_INLINE}</style>`
    : `<link href="https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/css/tabulator_midnight.min.css" rel="stylesheet">`
}
<style>
:root{--bg:#0d1117;--surf:#161b22;--surf2:#1c2128;--brd:#30363d;--txt:#e6edf3;--mut:#8b949e;--pass:#3fb950;--warn:#d29922;--err:#f85149;--info:#58a6ff;--pur:#bc8cff}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--txt);display:flex;min-height:100vh;font-size:14px}
nav{width:228px;min-height:100vh;background:var(--surf);border-right:1px solid var(--brd);position:sticky;top:0;height:100vh;overflow-y:auto;flex-shrink:0}
.nav-logo{padding:20px 16px 14px;border-bottom:1px solid var(--brd);font-weight:700;font-size:13px;color:var(--info)}
.nav-logo small{color:var(--mut);font-weight:400;display:block;font-size:11px;margin-top:3px}
nav a{display:flex;align-items:center;gap:9px;padding:10px 14px;text-decoration:none;color:var(--mut);font-size:12.5px;border-left:3px solid transparent;transition:all .15s;cursor:pointer;user-select:none}
nav a:hover{color:var(--txt);background:var(--surf2)}
nav a.active{color:var(--txt);border-left-color:var(--info);background:var(--surf2)}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.dot-pass{background:var(--pass)}.dot-warn{background:var(--warn)}.dot-error{background:var(--err)}.dot-none{background:var(--mut)}
.nav-sep{border-top:1px solid var(--brd);margin:6px 0}
main{flex:1;padding:32px;overflow:auto}
.section{display:none}.section.active{display:block}
.section-title{font-size:20px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.section-sub{color:var(--mut);font-size:12px;margin-bottom:24px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-pass{background:rgba(63,185,80,.15);color:var(--pass)}
.badge-warn{background:rgba(210,153,34,.15);color:var(--warn)}
.badge-error{background:rgba(248,81,73,.15);color:var(--err)}
.badge-info{background:rgba(88,166,255,.15);color:var(--info)}
.stats-row{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.stat-card{background:var(--surf);border:1px solid var(--brd);border-radius:8px;padding:14px 18px;min-width:100px;flex:1}
.stat-value{font-size:26px;font-weight:700;line-height:1;margin-bottom:4px}
.stat-label{font-size:11px;color:var(--mut)}
.stat-pass .stat-value{color:var(--pass)}.stat-warn .stat-value{color:var(--warn)}.stat-error .stat-value{color:var(--err)}.stat-info .stat-value{color:var(--info)}.stat-neutral .stat-value{color:var(--txt)}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:28px}
.phase-card{background:var(--surf);border:1px solid var(--brd);border-radius:10px;padding:16px 10px;cursor:pointer;transition:border-color .15s,transform .12s;text-align:center}
.phase-card:hover{border-color:var(--info);transform:translateY(-2px)}
.card-error{border-color:rgba(248,81,73,.45)}.card-warn{border-color:rgba(210,153,34,.45)}.card-pass{border-color:rgba(63,185,80,.3)}
.phase-num{font-size:10px;color:var(--mut);margin-bottom:6px;letter-spacing:1px;text-transform:uppercase}
.phase-icon{font-size:20px;margin-bottom:8px}
.phase-card-name{font-size:11px;font-weight:600;margin-bottom:6px}
.phase-detail{font-size:10px;color:var(--mut);line-height:1.5}
.totals-banner{background:var(--surf);border:1px solid var(--brd);border-radius:10px;padding:20px 28px;display:flex;gap:28px;align-items:center;margin-bottom:28px}
.total-item{text-align:center}
.total-num{font-size:40px;font-weight:800;line-height:1}
.total-label{font-size:11px;color:var(--mut);margin-top:4px}
.t-err .total-num{color:${totals.errors > 0 ? 'var(--err)' : 'var(--pass)'}}
.t-warn .total-num{color:${totals.warnings > 0 ? 'var(--warn)' : 'var(--pass)'}}
.vdiv{width:1px;height:44px;background:var(--brd)}
.totals-right{margin-left:auto}
.chart-wrap{background:var(--surf);border:1px solid var(--brd);border-radius:8px;padding:18px;margin-bottom:18px}
.chart-title{font-size:11px;font-weight:600;color:var(--mut);margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.table-wrap{background:var(--surf);border:1px solid var(--brd);border-radius:8px;overflow:hidden;margin-bottom:18px}
.table-head{padding:11px 14px;border-bottom:1px solid var(--brd);font-size:11px;font-weight:600;color:var(--mut);text-transform:uppercase;letter-spacing:.5px}
table{width:100%;border-collapse:collapse}
th{padding:9px 14px;text-align:left;font-size:11px;font-weight:600;color:var(--mut);text-transform:uppercase;letter-spacing:.3px;background:var(--surf2);border-bottom:1px solid var(--brd)}
td{padding:9px 14px;border-bottom:1px solid rgba(48,54,61,.5);font-size:13px;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.025)}
.code{font-family:'SF Mono','Fira Code',monospace;font-size:12px;color:var(--pur)}
.fp{font-family:'SF Mono','Fira Code',monospace;font-size:11px;color:var(--info)}
.lnum{color:var(--mut);font-family:monospace;font-size:11px}
.tag{display:inline-block;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:500}
.tag-safe{background:rgba(63,185,80,.15);color:var(--pass)}
.tag-guarded{background:rgba(88,166,255,.15);color:var(--info)}
.tag-unguarded{background:rgba(248,81,73,.15);color:var(--err)}
.tag-yes{background:rgba(63,185,80,.15);color:var(--pass)}
.tag-no{background:rgba(248,81,73,.15);color:var(--err)}
.alert{border-radius:8px;padding:13px 16px;margin-bottom:16px;font-size:13px;display:flex;gap:10px;align-items:flex-start}
.alert-pass{background:rgba(63,185,80,.08);border:1px solid rgba(63,185,80,.25)}
.alert-error{background:rgba(248,81,73,.08);border:1px solid rgba(248,81,73,.25)}
.alert-warn{background:rgba(210,153,34,.08);border:1px solid rgba(210,153,34,.25)}
.issue-list{list-style:none}
.issue-list li{padding:11px 14px;border-bottom:1px solid rgba(48,54,61,.5);font-size:13px;display:flex;gap:10px;align-items:flex-start}
.issue-list li:last-child{border-bottom:none}
.inum{color:var(--mut);font-size:11px;min-width:22px;font-family:monospace;padding-top:2px}
.sub{margin-top:7px;font-size:12px;color:var(--txt)}
ol.err-issues{margin:8px 0 0 16px;padding:0}
ol.err-issues li{margin-bottom:5px;font-size:12px;color:var(--txt)}
.delta-badge{font-size:11px;padding:2px 7px;margin-left:4px}
.delta-since{color:var(--mut);font-size:11px;margin-left:8px;font-weight:400}
.deps-summary-row{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:6px 0 14px}
.deps-stat{background:var(--bg);border:1px solid var(--brd);border-radius:6px;padding:10px 12px;text-align:center}
.deps-stat>span{display:block;font-size:18px;font-weight:600;color:var(--txt);font-variant-numeric:tabular-nums;line-height:1.1}
.deps-stat>label{display:block;font-size:9px;color:var(--mut);margin-top:4px;text-transform:uppercase;letter-spacing:.6px}
.deps-stat.deps-stat-bad>span{color:#f85149}
.deps-stat.deps-stat-good>span{color:#3fb950}

.deps-block{margin-top:10px;border:1px solid var(--brd);border-radius:6px;background:var(--bg);overflow:hidden}
.deps-block>summary{cursor:pointer;padding:9px 13px;font-size:13px;color:var(--txt);user-select:none;list-style:none;display:flex;align-items:center;gap:6px}
.deps-block>summary::-webkit-details-marker{display:none}
.deps-block>summary::before{content:'▸';display:inline-block;color:var(--mut);font-size:10px;transition:transform .15s}
.deps-block[open]>summary::before{transform:rotate(90deg)}
.deps-block-struct{border-color:rgba(248,81,73,.35)}
.deps-block-barrel{border-color:rgba(88,166,255,.25)}
.deps-block-known{border-color:rgba(63,185,80,.25)}
.deps-count{font-weight:600;font-family:monospace}
.deps-block-hint{margin-left:auto;font-size:11px;color:var(--mut)}

ol.deps-cycles{list-style:none;padding:0;margin:0;max-height:380px;overflow:auto}
.deps-cycle-row{display:flex;align-items:center;gap:10px;padding:7px 12px;border-top:1px solid rgba(48,54,61,.4)}
.deps-cycle-row:first-child{border-top:none}
.deps-cycle-len{display:inline-block;min-width:22px;height:22px;line-height:22px;text-align:center;border-radius:11px;background:var(--surf2);color:var(--mut);font-size:10px;font-weight:600;font-family:monospace;flex-shrink:0}
.deps-cycle-path{display:flex;flex-wrap:wrap;align-items:center;gap:4px;flex:1;min-width:0}
.deps-cycle-chip{padding:2px 7px;border-radius:4px;background:var(--surf2);border:1px solid var(--brd);font-size:11px;line-height:1.5;white-space:nowrap;cursor:pointer;transition:border-color .15s,background .15s}
.deps-cycle-chip:hover{border-color:#58a6ff;background:rgba(88,166,255,.12)}
.deps-explorer-sort{background:var(--surf2);color:var(--txt);border:1px solid var(--brd);border-radius:4px;font-size:11px;padding:3px 6px;font-family:inherit;cursor:pointer}
.deps-explorer-sort:focus{outline:none;border-color:#58a6ff}
.deps-file-cycle{color:#d29922;font-size:10px;margin-left:4px}
.deps-detail-cat-pill{display:inline-block;padding:1px 8px;border-radius:10px;background:var(--surf2);font-size:10px;text-transform:uppercase;letter-spacing:.5px;margin-right:8px;font-family:inherit}
.deps-cycle-chip code{font-size:10px;color:var(--txt)}
.deps-cycle-arrow{color:var(--mut);font-size:10px;margin:0 2px;flex-shrink:0}

.deps-bar-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
.deps-bar-col{border:1px solid var(--brd);border-radius:6px;background:var(--bg);padding:10px 14px}
.deps-bar-col-title{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--brd);display:flex;justify-content:space-between;align-items:baseline}
.deps-bar-col-max{font-family:monospace;font-size:10px;color:var(--mut);text-transform:none;letter-spacing:0}
.deps-bar-row{display:grid;grid-template-columns:1fr 110px 36px;gap:10px;align-items:center;padding:5px 0;font-size:11px}
.deps-bar-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.deps-bar-label code{font-size:10px}
.deps-bar{height:7px;background:var(--surf2);border-radius:4px;overflow:hidden}
.deps-bar-fill{display:block;height:100%;border-radius:4px;background:#58a6ff;transition:width .25s}
.deps-bar-num{text-align:right;color:var(--mut);font-family:monospace;font-size:11px;font-variant-numeric:tabular-nums}

.deps-graph-wrap{margin-top:14px;border:1px solid var(--brd);border-radius:6px;background:var(--bg);padding:12px 14px}
.deps-graph-title{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:baseline;gap:14px;flex-wrap:wrap}
.deps-graph-hint{font-size:10px;color:var(--mut);text-transform:none;letter-spacing:0;font-weight:400}
.deps-graph-svg{width:100%;height:auto;max-height:380px;display:block}
.deps-graph-node circle{transition:fill-opacity .15s,stroke-width .15s}
.deps-graph-node:hover circle{fill-opacity:1;stroke-width:2.5}

.deps-cat-atom{color:#7ee787}.deps-cat-atom-bg{background:#3fb950}
.deps-cat-mol{color:#79c0ff}.deps-cat-mol-bg{background:#58a6ff}
.deps-cat-org{color:#d2a8ff}.deps-cat-org-bg{background:#bc8cff}
.deps-cat-tpl{color:#ffa657}.deps-cat-tpl-bg{background:#f0883e}
.deps-cat-lay{color:#a5d6ff}.deps-cat-lay-bg{background:#79c0ff}
.deps-cat-core{color:#c9d1d9}.deps-cat-core-bg{background:#8b949e}
.deps-cat-hook{color:#ff7b72}.deps-cat-hook-bg{background:#f85149}
.deps-cat-util{color:#8b949e}.deps-cat-util-bg{background:#6e7681}
.deps-cat-ai{color:#ffa198}.deps-cat-ai-bg{background:#db6d6d}
.deps-cat-tok{color:#f0883e}.deps-cat-tok-bg{background:#d29922}
.deps-cat-type{color:#a5d6ff}.deps-cat-type-bg{background:#79c0ff}
.deps-cat-other{color:#8b949e}.deps-cat-other-bg{background:#6e7681}
.deps-block-explorer{border-color:rgba(210,153,34,.3)}
.deps-explorer{display:grid;grid-template-columns:minmax(280px,1fr) 1.5fr;gap:0;border-top:1px solid var(--brd);max-height:520px}
.deps-explorer-left{display:flex;flex-direction:column;border-right:1px solid var(--brd);background:var(--bg);min-width:0}
.deps-explorer-search{margin:9px 9px 4px;padding:7px 10px;background:var(--surf2);border:1px solid var(--brd);color:var(--txt);border-radius:4px;font-size:12px;font-family:inherit}
.deps-explorer-search:focus{outline:none;border-color:#58a6ff}
.deps-explorer-stats{padding:0 11px 7px;font-size:10px;color:var(--mut);font-family:monospace}
.deps-explorer-files{list-style:none;margin:0;padding:0;overflow:auto;flex:1;max-height:430px}
.deps-file{display:flex;align-items:center;justify-content:space-between;padding:5px 12px;font-size:11px;cursor:pointer;border-bottom:1px solid rgba(48,54,61,.3);min-width:0}
.deps-file:hover{background:rgba(255,255,255,.03)}
.deps-file-sel{background:rgba(88,166,255,.15);border-left:2px solid #58a6ff;padding-left:10px}
.deps-file-label{color:var(--txt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace;flex:1;min-width:0}
.deps-file-counts{color:var(--mut);font-size:10px;font-family:monospace;margin-left:8px;flex-shrink:0}
.deps-file-truncated{padding:11px;color:var(--mut);font-size:11px;text-align:center;font-style:italic}
.deps-explorer-right{padding:13px 16px;overflow:auto;background:var(--surf);max-height:520px;min-width:0}
.deps-explorer-empty{color:var(--mut);font-size:12px;font-style:italic;padding:22px;text-align:center}
.deps-detail-header{padding-bottom:10px;border-bottom:1px solid var(--brd);margin-bottom:11px}
.deps-detail-path{font-size:12px;color:var(--txt);word-break:break-all;font-family:monospace}
.deps-detail-stats{font-size:11px;color:var(--mut);margin-top:5px;font-family:monospace}
.deps-explorer-section{margin-bottom:14px}
.deps-detail-h{font-size:11px;color:var(--mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;display:flex;align-items:center;gap:7px}
.deps-detail-count{background:var(--surf2);color:var(--txt);padding:1px 6px;border-radius:9px;font-size:10px;font-family:monospace}
.deps-detail-list{list-style:none;margin:0;padding:0}
.deps-detail-list li{padding:3px 0;border-bottom:1px solid rgba(48,54,61,.3)}
.deps-detail-list li:last-child{border-bottom:none}
.deps-detail-link{color:#58a6ff;text-decoration:none;font-size:11px}
.deps-detail-link:hover{text-decoration:underline}
.deps-detail-empty{color:var(--mut);font-size:11px;padding:6px 0;font-family:monospace}
@media (max-width: 800px){.deps-explorer{grid-template-columns:1fr;max-height:none}.deps-explorer-right{max-height:none;border-top:1px solid var(--brd)}}
/* Scope generic table styles so tabulator's own DOM isn't affected */
.tabulator{background:var(--surf);border:1px solid var(--brd);border-radius:0;font-size:13px}
.tabulator .tabulator-header{background:var(--surf2);border-bottom:1px solid var(--brd)}
.tabulator .tabulator-col{background:var(--surf2);border-right:1px solid var(--brd);color:var(--mut)}
.tabulator .tabulator-row{background:var(--surf);border-bottom:1px solid rgba(48,54,61,.5)}
.tabulator .tabulator-row.tabulator-row-even{background:var(--surf)}
.tabulator .tabulator-row:hover{background:rgba(255,255,255,.03)!important}
.tabulator .tabulator-cell{color:var(--txt);border-right:none;padding:8px 12px}
.tabulator .tabulator-header-filter input{background:var(--bg);color:var(--txt);border:1px solid var(--brd);border-radius:3px;padding:3px 6px;font-size:12px}
.tabulator .tabulator-paginator{color:var(--mut);font-size:12px}
.tabulator-host{background:var(--surf);border-radius:0 0 8px 8px;overflow:hidden}
</style>
</head>
<body>

<nav>
  <div class="nav-logo">GridKit <small>Build Verify Report</small></div>
  <a onclick="show('summary')" id="nav-summary">
    <span class="dot dot-${totals.overall}"></span>Overview
  </a>
  <div class="nav-sep"></div>
  ${navHtml}
</nav>

<main>

<section id="summary" class="section active">
  <div class="section-title">Build Verify Report</div>
  <div class="section-sub">Verification pipeline · libs/ui · ${new Date().toLocaleString()}</div>

  <div class="totals-banner">
    <div class="total-item t-err">
      <div class="total-num">${totals.errors}</div>
      <div class="total-label">Errors + Violations ${deltaBadge(regression.totals.errors, 'errors')}</div>
    </div>
    <div class="vdiv"></div>
    <div class="total-item t-warn">
      <div class="total-num">${totals.warnings}</div>
      <div class="total-label">Warnings ${deltaBadge(regression.totals.warnings, 'warnings')}</div>
    </div>
    <div class="totals-right">
      ${badge(
        totals.overall,
        `${icon(totals.overall)} ${
          totals.overall === 'pass'
            ? 'All Phases Passed'
            : totals.overall === 'warn'
              ? 'Warnings Found'
              : 'Needs Attention'
        }`
      )}
      ${
        regression.prev
          ? `<span class="delta-since">vs ${regression.prev.sha ?? regression.prev.ts?.slice(0, 16)}</span>`
          : ''
      }
    </div>
  </div>

  <div class="cards-grid">
    ${phases
      .map(
        (p) => `
    <div class="phase-card card-${p.s}" onclick="show('p${p.id}')">
      <div class="phase-num">Phase ${p.id}</div>
      <div class="phase-icon">${icon(p.s)}</div>
      <div class="phase-card-name">${p.name}</div>
      <div class="phase-detail">${p.detail}</div>
      <div style="margin-top:8px">${phaseDelta(p.id)}</div>
    </div>`
      )
      .join('')}
  </div>

  <div class="two-col">
    <div class="chart-wrap">
      <div class="chart-title">Phase Status</div>
      <canvas id="chart-summary"></canvas>
    </div>
    <div class="chart-wrap">
      <div class="chart-title">Errors &amp; Warnings by Phase</div>
      <canvas id="chart-totals"></canvas>
    </div>
  </div>

  ${
    trendPoints.length > 1
      ? `<div class="chart-wrap">
    <div class="chart-title">Trend — Errors &amp; Warnings across recent runs (${trendPoints.length} snapshots)</div>
    <canvas id="chart-trend" height="160"></canvas>
  </div>`
      : ''
  }
</section>

${sectionsHtml}

</main>

<script>
const R = ${embed(reports)};
const PRE = ${embed(charts.probeChartData)};
const DEPS = ${embed(charts.depsChartData)};
const WTYPE = ${embed(charts.warnTypeData)};
const GCTX = ${embed(charts.globalsCtx)};
const PHASE_NAMES = ${JSON.stringify(phases.map((p) => `P${p.id} ${p.name}`))};
const PHASE_COLORS = ${phaseColors};
const PHASE_LABELS = ${phaseLabels};
const PHASE_ERRORS = ${JSON.stringify(errorsByPhase)};
const PHASE_WARNS = ${JSON.stringify(warningsByPhase)};
const TREND = ${JSON.stringify(trendPoints)};
function show(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
}

const C8 = ['#58a6ff','#3fb950','#d29922','#f85149','#bc8cff','#ffa657','#79c0ff','#56d364'];

function pie(id, labels, data, colors) {
  const el = document.getElementById(id);
  if (!el || !data || !data.some(v => v > 0)) return;
  new Chart(el, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors || C8, borderWidth: 0 }] },
    options: { responsive: true, plugins: { legend: { position: 'right', labels: { color: '#8b949e', boxWidth: 12, font: { size: 11 } } } } }
  });
}

function hbar(id, labels, data, colors) {
  const el = document.getElementById(id);
  if (!el) return;
  new Chart(el, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: colors || '#58a6ff', borderRadius: 3, borderWidth: 0 }] },
    options: {
      indexAxis: 'y', responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(48,54,61,.5)' }, ticks: { color: '#8b949e' } },
        y: { grid: { display: false }, ticks: { color: '#c9d1d9', font: { size: 11 } } }
      }
    }
  });
}

function sbar(id, labels, datasets) {
  const el = document.getElementById(id);
  if (!el) return;
  new Chart(el, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8b949e', font: { size: 11 } } } },
      scales: {
        x: { stacked: true, grid: { color: 'rgba(48,54,61,.5)' }, ticks: { color: '#8b949e' } },
        y: { stacked: true, grid: { color: 'rgba(48,54,61,.5)' }, ticks: { color: '#8b949e' } }
      }
    }
  });
}

function trendChart(id, points) {
  const el = document.getElementById(id);
  if (!el || !points || points.length < 2) return;
  new Chart(el, {
    type: 'line',
    data: {
      labels: points.map(p => p.label),
      datasets: [
        { label: 'Errors', data: points.map(p => p.errors), borderColor: '#f85149', backgroundColor: 'rgba(248,81,73,.15)', tension: .3, fill: true, pointRadius: 3 },
        { label: 'Warnings', data: points.map(p => p.warnings), borderColor: '#d29922', backgroundColor: 'rgba(210,153,34,.15)', tension: .3, fill: true, pointRadius: 3 },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8b949e', font: { size: 11 } } } },
      scales: {
        x: { grid: { color: 'rgba(48,54,61,.5)' }, ticks: { color: '#8b949e', font: { size: 10 } } },
        y: { grid: { color: 'rgba(48,54,61,.5)' }, ticks: { color: '#8b949e' }, beginAtZero: true },
      },
    },
  });
}

function initDepsExplorer() {
  const mg = R.madgeGraph;
  const data = mg?.graph;
  if (!data) return;
  const listEl = document.getElementById('deps-file-list');
  const detailEl = document.getElementById('deps-detail');
  const searchEl = document.getElementById('deps-search');
  const sortEl = document.getElementById('deps-sort');
  const statsEl = document.getElementById('deps-stats');
  const blockEl = document.getElementById('deps-explorer-block');
  if (!listEl || !detailEl || !searchEl) return;

  const cycleSet = new Set();
  for (const c of [...(mg.structuralCycles||[]), ...(mg.barrelCycles||[]), ...(mg.knownCycles||[])]) {
    for (const f of c) cycleSet.add(f);
  }

  const reverse = {};
  const allFiles = new Set();
  for (const [src, deps] of Object.entries(data)) {
    allFiles.add(src);
    for (const d of (deps || [])) {
      allFiles.add(d);
      (reverse[d] || (reverse[d] = [])).push(src);
    }
  }
  const files = [...allFiles];
  const fanIn = {};
  const fanOut = {};
  for (const f of files) {
    fanIn[f] = (reverse[f] || []).length;
    fanOut[f] = (data[f] || []).length;
  }

  function categoryOf(p) {
    if (!p) return 'other';
    if (p.startsWith('components/atoms/')) return 'atom';
    if (p.startsWith('components/molecules/')) return 'mol';
    if (p.startsWith('components/organisms/')) return 'org';
    if (p.startsWith('components/templates/')) return 'tpl';
    if (p.startsWith('components/layout/')) return 'lay';
    if (p.startsWith('components/core/')) return 'core';
    if (p.startsWith('hooks/')) return 'hook';
    if (p.startsWith('utils/')) return 'util';
    if (p.startsWith('ai/')) return 'ai';
    if (p.startsWith('tokens/')) return 'tok';
    if (p.startsWith('types/')) return 'type';
    return 'other';
  }
  const CAT_NAME = { atom:'atoms', mol:'molecules', org:'organisms', tpl:'templates', lay:'layout', core:'core', hook:'hooks', util:'utils', ai:'ai', tok:'tokens', type:'types', other:'other' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
  }
  function shortLabel(f) {
    const parts = f.split('/');
    return parts.length <= 3 ? f : '…/' + parts.slice(-3).join('/');
  }

  let filter = '';
  let sortKey = 'fanIn';
  let selected = null;
  let visibleFiles = [];
  const MAX_VISIBLE = 800;

  function compute() {
    const f = filter.trim().toLowerCase();
    let matched = f ? files.filter(p => p.toLowerCase().includes(f)) : files.slice();
    if (sortKey === 'name') {
      matched.sort();
    } else if (sortKey === 'fanIn') {
      matched.sort((a, b) => (fanIn[b]||0) - (fanIn[a]||0) || a.localeCompare(b));
    } else if (sortKey === 'fanOut') {
      matched.sort((a, b) => (fanOut[b]||0) - (fanOut[a]||0) || a.localeCompare(b));
    } else if (sortKey === 'cycle') {
      matched.sort((a, b) => {
        const ac = cycleSet.has(a) ? 0 : 1;
        const bc = cycleSet.has(b) ? 0 : 1;
        if (ac !== bc) return ac - bc;
        return (fanIn[b]||0) - (fanIn[a]||0) || a.localeCompare(b);
      });
    }
    return matched;
  }

  function renderFileList() {
    const matched = compute();
    visibleFiles = matched.slice(0, MAX_VISIBLE);
    statsEl.textContent = filter.trim()
      ? matched.length + ' / ' + files.length
      : files.length + ' files';
    let html = visibleFiles.map(p => {
      const cat = categoryOf(p);
      const sel = p === selected ? ' deps-file-sel' : '';
      const cyc = cycleSet.has(p) ? '<span class="deps-file-cycle" title="in cycle">⟳</span>' : '';
      return '<li class="deps-file' + sel + '" data-file="' + esc(p) + '">'
        + '<span class="deps-file-label deps-cat-' + cat + '" title="' + esc(p) + '">' + esc(shortLabel(p)) + cyc + '</span>'
        + '<span class="deps-file-counts" title="↓ imported by · ↑ direct imports">↓' + fanIn[p] + ' ↑' + fanOut[p] + '</span>'
        + '</li>';
    }).join('');
    if (matched.length > MAX_VISIBLE) {
      html += '<li class="deps-file-truncated">… ' + (matched.length - MAX_VISIBLE) + ' more — refine the filter</li>';
    }
    if (visibleFiles.length === 0) {
      html = '<li class="deps-file-truncated">No files match.</li>';
    }
    listEl.innerHTML = html;
  }

  function groupedSection(label, arr) {
    if (!arr.length) {
      return '<div class="deps-explorer-section">'
        + '<div class="deps-detail-h">' + label + ' <span class="deps-detail-count">0</span></div>'
        + '<div class="deps-detail-empty">— none —</div></div>';
    }
    // Group by category, sorted by count desc, then file name within each group
    const groups = {};
    for (const p of arr) {
      const c = categoryOf(p);
      (groups[c] || (groups[c] = [])).push(p);
    }
    const orderedCats = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
    const html = orderedCats.map(c => {
      const items = groups[c].slice().sort().map(p =>
        '<li><a href="javascript:void(0)" class="deps-detail-link deps-cat-' + c + '" data-file="' + esc(p) + '" title="' + esc(p) + '">' + esc(shortLabel(p)) + (cycleSet.has(p) ? ' <span class="deps-file-cycle">⟳</span>' : '') + '</a></li>'
      ).join('');
      return '<div style="margin-bottom:8px"><div class="deps-detail-h" style="text-transform:none;font-size:10px;letter-spacing:0;margin-bottom:3px"><span class="deps-cat-' + c + '">' + CAT_NAME[c] + '</span> <span class="deps-detail-count">' + groups[c].length + '</span></div><ul class="deps-detail-list">' + items + '</ul></div>';
    }).join('');
    return '<div class="deps-explorer-section">'
      + '<div class="deps-detail-h">' + label + ' <span class="deps-detail-count">' + arr.length + '</span></div>'
      + html + '</div>';
  }

  function renderDetail(file) {
    if (!file) {
      detailEl.innerHTML = '<div class="deps-explorer-empty">Click a file to see its imports and dependents.</div>';
      return;
    }
    const imports = data[file] || [];
    const dependents = reverse[file] || [];
    const cat = categoryOf(file);
    const inCycle = cycleSet.has(file);
    detailEl.innerHTML =
      '<div class="deps-detail-header">'
      + '<span class="deps-detail-cat-pill deps-cat-' + cat + '">' + CAT_NAME[cat] + '</span>'
      + '<code class="deps-detail-path" title="' + esc(file) + '">' + esc(file) + '</code>'
      + '<div class="deps-detail-stats">imports ' + imports.length + ' · imported by ' + dependents.length + (inCycle ? ' · <span style="color:#d29922">in cycle ⟳</span>' : '') + '</div>'
      + '</div>'
      + groupedSection('Imports (this file uses)', imports)
      + groupedSection('Dependents (use this file)', dependents);
  }

  function selectFile(file, opts) {
    if (!allFiles.has(file)) return;
    selected = file;
    if (opts && opts.clearFilter) {
      filter = '';
      searchEl.value = '';
    }
    if (blockEl && !blockEl.open) blockEl.open = true;
    renderFileList();
    renderDetail(file);
    const sel = listEl.querySelector('.deps-file-sel');
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
    if (opts && opts.scrollToBlock && blockEl && blockEl.scrollIntoView) {
      blockEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  searchEl.addEventListener('input', (e) => { filter = e.target.value || ''; renderFileList(); });
  if (sortEl) sortEl.addEventListener('change', (e) => { sortKey = e.target.value; renderFileList(); });

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li.deps-file');
    if (!li) return;
    selectFile(li.dataset.file);
  });
  detailEl.addEventListener('click', (e) => {
    const a = e.target.closest('a.deps-detail-link');
    if (!a) return;
    selectFile(a.dataset.file, { clearFilter: true });
  });

  // Make cycle chips and layer-graph nodes feel like part of the explorer
  document.body.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-explorer-file]');
    if (chip) { selectFile(chip.getAttribute('data-explorer-file'), { clearFilter: true, scrollToBlock: true }); return; }
    const node = e.target.closest('[data-explorer-prefix]');
    if (node) {
      const prefix = node.getAttribute('data-explorer-prefix');
      filter = prefix;
      searchEl.value = prefix;
      if (blockEl && !blockEl.open) blockEl.open = true;
      renderFileList();
      if (blockEl && blockEl.scrollIntoView) blockEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });

  // Keyboard navigation
  function moveSelection(delta) {
    if (visibleFiles.length === 0) return;
    let idx = visibleFiles.indexOf(selected);
    idx = idx === -1 ? 0 : Math.max(0, Math.min(visibleFiles.length - 1, idx + delta));
    selectFile(visibleFiles[idx]);
  }
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const inField = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
    if (e.key === '/' && !inField) { e.preventDefault(); searchEl.focus(); searchEl.select(); return; }
    if (inField && e.target !== searchEl) return;
    if (e.target === searchEl && e.key === 'Escape') { filter = ''; searchEl.value = ''; renderFileList(); return; }
    if (e.key === 'ArrowDown' && (e.target === searchEl || !inField)) { e.preventDefault(); moveSelection(1); }
    else if (e.key === 'ArrowUp' && (e.target === searchEl || !inField)) { e.preventDefault(); moveSelection(-1); }
  });

  renderFileList();
}

function initSortableTables() {
  if (!window.Tabulator) return;
  document.querySelectorAll('table.sortable').forEach((table) => {
    const headerCells = [...table.querySelectorAll('thead th')];
    if (headerCells.length === 0) return;
    const cols = headerCells.map((th, i) => ({
      title: (th.innerText || '').trim() || ('col' + i),
      field: 'c' + i,
      formatter: 'html',
      headerFilter: 'input',
      headerSort: true,
      resizable: true,
      tooltip: true,
    }));
    const rows = [...table.querySelectorAll('tbody tr')].map((tr) => {
      const tds = [...tr.querySelectorAll('td')];
      const obj = {};
      tds.forEach((td, i) => { obj['c' + i] = td.innerHTML; });
      return obj;
    });
    if (rows.length === 0) return;
    const host = document.createElement('div');
    host.className = 'tabulator-host';
    table.parentNode.replaceChild(host, table);
    new Tabulator(host, {
      data: rows,
      columns: cols,
      layout: 'fitColumns',
      pagination: rows.length > 100 ? 'local' : false,
      paginationSize: 100,
      paginationSizeSelector: [25, 50, 100, 200, 500, true],
      height: rows.length > 50 ? 820 : false,
      placeholder: 'No matching rows',
    });
  });
}

window.addEventListener('load', () => {
  pie('chart-summary', PHASE_NAMES, PHASE_LABELS.map(() => 1), PHASE_COLORS);
  sbar('chart-totals', PHASE_LABELS, [
    { label: 'Errors/Violations', backgroundColor: '#f85149', data: PHASE_ERRORS },
    { label: 'Warnings', backgroundColor: '#d29922', data: PHASE_WARNS },
  ]);
  trendChart('chart-trend', TREND);

  if (R.apiMap?.byCategory)
    pie('chart-exports', Object.keys(R.apiMap.byCategory), Object.values(R.apiMap.byCategory));
  if (DEPS)
    pie('chart-deps', ['Declared','Undeclared','Dev'], [DEPS.declared, DEPS.undeclared, DEPS.dev], ['#3fb950','#f85149','#58a6ff']);

  if (PRE && PRE.length)
    hbar('chart-footprint', PRE.map(p => p.label), PRE.map(p => p.kb), PRE.map(p => p.cross ? '#d29922' : '#58a6ff'));

  const cd = R.buildLint?.circularDeps || {};
  pie('chart-circulars', ['Barrel (safe)','Structural','Known'], [cd.barrel||0, cd.structural||0, cd.known||0], ['#58a6ff','#f85149','#3fb950']);
  if (WTYPE && Object.keys(WTYPE).length)
    pie('chart-lint-warns', Object.keys(WTYPE), Object.values(WTYPE));

  const rsc = R.ssr?.rsc || {};
  pie('chart-rsc', ['Has "use client"','Missing'], [rsc.filesWithUseClient||0, (rsc.missingUseClient||[]).length], ['#3fb950','#f85149']);
  if (GCTX)
    pie('chart-globals', ['Safe','Guarded','Unguarded'], [GCTX.safe||0, GCTX.guarded||0, GCTX.unguarded||0], ['#3fb950','#58a6ff','#f85149']);

  initSortableTables();
  initDepsExplorer();
});

show('summary');
document.getElementById('nav-summary').classList.add('active');
${SC}
</body>
</html>`;
}

// ─── File I/O helpers ─────────────────────────────────────────────────────────

export function writeReportHtml(html, outputDir) {
  mkdirSync(outputDir, { recursive: true });
  const htmlPath = resolve(outputDir, 'report.html');
  writeFileSync(htmlPath, html, 'utf-8');
  return htmlPath;
}

export function openInBrowser(htmlPath) {
  const cmd = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', htmlPath] : [htmlPath];
  spawnSync(cmd, args);
}
