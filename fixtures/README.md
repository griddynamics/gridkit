# fixtures

Throwaway verification harnesses for the CTORNDSD-646 web-components spike. Each one answers a
question that could not be answered inside this repo's own toolchain.

**Run them from the repo root — you never need to `cd` in here.**

```bash
npm run demo:setup      # once: builds dist + installs both fixtures
npm run demo:react19    # → http://localhost:5273
npm run demo:next       # → http://localhost:5373
```

| Fixture          | Port | Question it answers                                                                                               | Findings            |
| ---------------- | ---- | ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| `react19-check`  | 5273 | Does React 19 assign custom-element properties natively, and does it auto-wire custom events?                     | `FINDINGS.md` §17.3 |
| `next-ssr-check` | 5373 | Does Next.js server-render these components, emit Declarative Shadow DOM, and where must the client boundary sit? | `FINDINGS.md` §17.4 |

Both print their results into the page **and** onto `window` (`__react19Check`, `__nextCheck`), so a
browser driver can read them without scraping the DOM.

## Why these are outside npm workspaces

Both need **React 19**. The repo root is pinned to **React 18.3.1**, and that pin is load-bearing —
`libs/ui` builds and tests against it. So each fixture carries its own `node_modules` and is
deliberately absent from the root `package.json` `workspaces` array, exactly like `spike-react-native`.

Verified consequence: installing these does **not** touch the root `react` version or
`package-lock.json`.

## What to look for

### `react19-check`

Confirms the split that decides whether the React wrapper layer is optional:

- **Property assignment works natively.** An object prop (`theme`) reaches the property by reference
  and is not stringified into an attribute.
- **Custom events do not.** An `onGdChange` prop fires **zero** times and is _silently_ dropped — no
  attribute, no warning, no error. That silence is why the wrapper layer should be generated rather
  than hand-maintained.

### `next-ssr-check`

Three findings, all visible in the page or in `curl` output:

- **No Declarative Shadow DOM.** `curl http://localhost:5373/ | grep -c shadowrootmode` returns `0`,
  and `grep -c '<h2'` also returns `0` — so with JavaScript disabled the page has unstyled text and no
  headings.
- **The token barrel is not RSC-safe.** The page renders a server-side import probe showing
  `createContext is not a function` — `gd-design-library/tokens` transitively pulls in `@emotion/react`.
- **Built output only.** The Turbopack aliases point at `dist/`, not source. Pointing them at source
  silently breaks all reactivity (components register, attach a shadow root, and render nothing) because
  Turbopack does not apply this repo's `useDefineForClassFields: false` to out-of-project source.

## Housekeeping

- `.next/` and `next-env.d.ts` are gitignored; the fixture sources are tracked.
- A `.nxignore` at the repo root excludes `fixtures/**`. This is **required**: Next generates
  `.next/dev/package.json` with no `name` field, and Nx then refuses to build the project graph for the
  entire repo until it is excluded.
- Next also generates its own `CLAUDE.md` / `AGENTS.md` in the fixture directory. Delete them if they
  reappear — they would shadow the repo's own conventions.
