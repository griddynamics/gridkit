/**
 * SERVER component (no 'use client'). CTORNDSD-646b / CTORNDSD-646 acceptance criteria 9 and 10.
 *
 * Three things are under test here, and each is measured rather than assumed:
 *
 *  1. Raw custom-element tags in server-rendered JSX. React emits `<gd-button>` into the HTML
 *     stream, but nothing has registered the element server-side, so the question is what the
 *     no-JavaScript HTML actually contains — an empty tag, or a populated Declarative Shadow DOM
 *     template.
 *  2. Whether the element module can be imported at all in a server component. Handled as a
 *     try/catch probe so the failure mode is captured as data instead of crashing the route.
 *  3. Where the client boundary must sit — see ./client-island.tsx.
 */
import ClientIsland from './client-island';

async function serverImportProbe(): Promise<{ ok: boolean; error: string | null }> {
  try {
    await import('gd-design-web');
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }
}

export default async function Page() {
  const probe = await serverImportProbe();

  return (
    <>
      <h1>Next.js + Lit custom elements</h1>

      <fieldset>
        <legend>1. Raw tags rendered by a SERVER component</legend>
        {/* @ts-expect-error custom elements have no JSX typings in this fixture */}
        <gd-button id="server-button" variant="primary">
          Server-rendered label
        </gd-button>
        <br />
        <br />
        {/* @ts-expect-error custom elements have no JSX typings in this fixture */}
        <gd-typography id="server-typography" variant="h2" as="h2">
          Server-rendered heading
        </gd-typography>
      </fieldset>

      <fieldset>
        <legend>2. Server-side import probe</legend>
        <pre id="server-import-probe">{JSON.stringify(probe, null, 2)}</pre>
      </fieldset>

      <ClientIsland />
    </>
  );
}
