/**
 * CTORNDSD-646b — W7 verification harness.
 *
 * Answers two questions the spike previously listed as unsupported in
 * `libs/web-components/README.md`:
 *
 *   1. Does `ElementInternals` form participation work? (`gd-input`, `gd-checkbox`)
 *   2. Does `::part()` let consumer CSS cross the shadow boundary? (`gd-button`, `gd-input`,
 *      `gd-checkbox`)
 *
 * Results are written to `window.__formCheck` and logged, so a browser driver can read them
 * without scraping the DOM. Interaction that depends on the browser's own algorithms — real
 * clicks, `reportValidity()` UI — must be driven with TRUSTED input (chrome-devtools-mcp CDP),
 * never `evaluate_script` synthetic events: FINDINGS.md Section 6 documents a concrete false
 * negative from exactly that mistake.
 */
import '../src/index';
import { defaultTheme } from 'gd-design-library/tokens';
import type { GdCheckbox } from '../src/components/gd-checkbox/gd-checkbox';
import type { GdInput } from '../src/components/gd-input/gd-input';

const root = document.getElementById('root')!;

root.innerHTML = `
  <form id="probe-form">
    <fieldset>
      <legend>Form participation</legend>
      <gd-input id="email" name="email" label="Email" required placeholder="you@example.com"></gd-input>
      <br /><br />
      <gd-checkbox id="terms" name="terms" required>Accept terms</gd-checkbox>
      <br /><br />
      <gd-checkbox id="optin" name="optin" value="yes">Opt in (value="yes")</gd-checkbox>
      <br /><br />
      <gd-button id="submit-btn" type="submit" variant="primary">Submit</gd-button>
      <gd-button id="reset-btn" type="reset" variant="tertiary">Reset</gd-button>
    </fieldset>
  </form>

  <fieldset id="fieldset-probe" disabled>
    <legend>formDisabledCallback probe (ancestor fieldset is disabled)</legend>
    <gd-input id="nested" name="nested" label="Nested"></gd-input>
  </fieldset>

  <div id="parts-probe">
    <fieldset>
      <legend>CSS Parts</legend>
      <gd-button id="parts-button">Styled via ::part()</gd-button>
      <br /><br />
      <gd-input id="parts-input" label="Part-styled label"></gd-input>
      <br /><br />
      <gd-checkbox id="parts-checkbox">Part-styled indicator</gd-checkbox>
    </fieldset>
  </div>

  <h2>Results</h2>
  <pre id="out">running…</pre>
`;

// Every component resolves the REAL token files, whose own fallbacks are debug placeholder
// strings — a themeless render produces invalid CSS (FINDINGS.md Sections 13, 16). A real theme
// is mandatory, not cosmetic.
document.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-input, gd-checkbox, gd-button').forEach((el) => {
  el.theme = defaultTheme;
});

const form = document.getElementById('probe-form') as HTMLFormElement;
const email = document.getElementById('email') as GdInput;
const terms = document.getElementById('terms') as GdCheckbox;
const optin = document.getElementById('optin') as GdCheckbox;
const nested = document.getElementById('nested') as GdInput;

const partsButton = document.getElementById('parts-button')!;
const partsInput = document.getElementById('parts-input')!;
const partsCheckbox = document.getElementById('parts-checkbox')!;

const submitButton = document.getElementById('submit-btn')!;
const resetButton = document.getElementById('reset-btn')!;

/**
 * NOTE — no light-DOM bridge here, on purpose. `<gd-button type="submit">` renders its real
 * `<button>` inside a shadow root, whose tree owns no `<form>`, so `innerButton.form` is `null`
 * and the platform will never submit on its own. `gd-button._onClick` reproduces that activation
 * behaviour itself (CTORNDSD-646b), so a consumer writes nothing. The probe below asserts the
 * component is doing it — if it regresses, `lastSubmit` stays `null` under a trusted click and
 * `submitButtonParticipation` shows a null form owner with no bridge compensating for it.
 */

let lastSubmit: Record<string, string> | null = null;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  lastSubmit = Object.fromEntries(new FormData(form) as unknown as Iterable<[string, string]>);
  render();
});

function formDataSnapshot(): Record<string, string> {
  return Object.fromEntries(new FormData(form) as unknown as Iterable<[string, string]>);
}

async function collect() {
  await Promise.all(
    [email, terms, optin, nested].map((el) => (el as unknown as { updateComplete: Promise<unknown> }).updateComplete)
  );

  // ---- 1. Form association -------------------------------------------------------------
  const formAssociation = {
    'gd-input appears in form.elements': Array.from(form.elements).includes(email),
    'gd-checkbox appears in form.elements': Array.from(form.elements).includes(terms),
    'gd-input.form points at the form': email.form === form,
    'gd-checkbox.form points at the form': terms.form === form,
  };

  // ---- 2. Constraint validation (both required, both empty/unchecked) ------------------
  const validationEmpty = {
    'email.validity.valueMissing — expect true': email.validity.valueMissing,
    'terms.validity.valueMissing — expect true': terms.validity.valueMissing,
    'email.checkValidity() — expect false': email.checkValidity(),
    'form.checkValidity() — expect false': form.checkValidity(),
    'email.validationMessage is non-empty': email.validationMessage.length > 0,
    'host matches :invalid — expect true': email.matches(':invalid'),
  };

  // ---- 3. FormData: unchecked box submits NOTHING, matching native ---------------------
  const emptyFormData = formDataSnapshot();
  const nativeSemantics = {
    'unchecked gd-checkbox absent from FormData — expect true': !('terms' in emptyFormData),
    'empty gd-input present as empty string — expect true': emptyFormData.email === '',
  };

  // ---- 4. Fill values, re-check ---------------------------------------------------------
  email.value = 'user@example.com';
  terms.checked = true;
  optin.checked = true;
  await Promise.all(
    [email, terms, optin].map((el) => (el as unknown as { updateComplete: Promise<unknown> }).updateComplete)
  );

  const filledFormData = formDataSnapshot();
  const afterFill = {
    'FormData.email': filledFormData.email,
    'FormData.terms (default value)': filledFormData.terms,
    'FormData.optin (custom value="yes")': filledFormData.optin,
    'email.validity.valueMissing — expect false': email.validity.valueMissing,
    'form.checkValidity() — expect true': form.checkValidity(),
    'host matches :valid — expect true': email.matches(':valid'),
  };

  // ---- 5. formDisabledCallback via ancestor <fieldset disabled> ------------------------
  const disabledPropagation = {
    'nested gd-input.disabled set by ancestor fieldset — expect true': nested.disabled,
  };

  // ---- 6. formResetCallback -------------------------------------------------------------
  form.reset();
  await Promise.all(
    [email, terms, optin].map((el) => (el as unknown as { updateComplete: Promise<unknown> }).updateComplete)
  );
  const afterResetFormData = formDataSnapshot();
  const afterReset = {
    'email.value after reset — expect empty string': email.value,
    'terms.checked after reset': String(terms.checked),
    'terms absent from FormData after reset — expect true': !('terms' in afterResetFormData),
    'email.validity.valueMissing back to true — expect true': email.validity.valueMissing,
  };

  // ---- 7. Submit/reset via gd-button, with NO consumer-side bridge -----------------------
  const submitInner = submitButton.shadowRoot!.querySelector('button')!;
  const resetInner = resetButton.shadowRoot!.querySelector('button')!;
  const submitButtonParticipation = {
    'submit gd-button forwards type to inner button — expect submit': submitInner.type,
    'reset gd-button forwards type to inner button — expect reset': resetInner.type,
    // Both null: the shadow tree owns no <form>, so the PLATFORM cannot submit. That is why
    // gd-button._onClick exists — these two staying null is the normal, expected state.
    'inner submit <button>.form is null — expect true': submitInner.form === null,
    'inner reset <button>.form is null — expect true': resetInner.form === null,
    'gd-button host appears in form.elements — expect false (not form-associated)': Array.from(form.elements).includes(
      submitButton
    ),
    'gd-button resolves the form itself via closest() — expect true': submitButton.closest('form') === form,
    // Trusted-click outcomes are NOT asserted here: `lastSubmit` below is the evidence, and only a
    // real CDP/userEvent click can produce it (FINDINGS.md Section 6).
    'no consumer-side submit/reset bridge is installed — expect true': true,
  };

  // ---- 8. CSS Parts ---------------------------------------------------------------------
  const innerButton = partsButton.shadowRoot!.querySelector('button')!;
  const innerContent = partsButton.shadowRoot!.querySelector('.gd-button__content');
  const innerInput = partsInput.shadowRoot!.querySelector('input')!;
  const innerLabel = partsInput.shadowRoot!.querySelector('.label')!;
  const innerIndicator = partsCheckbox.shadowRoot!.querySelector('.indicator')!;

  const cssParts = {
    '::part(button) border reached the shadow root — expect rgb(255, 0, 255) dashed':
      getComputedStyle(innerButton).borderTopColor + ' / ' + getComputedStyle(innerButton).borderTopStyle,
    '::part(content) letter-spacing — expect 4px': innerContent
      ? getComputedStyle(innerContent).letterSpacing
      : '(content span not rendered)',
    '::part(input) background — expect rgb(0, 255, 255)': getComputedStyle(innerInput).backgroundColor,
    '::part(label) text-transform — expect uppercase': getComputedStyle(innerLabel).textTransform,
    '::part(indicator) outline — expect rgb(255, 0, 0) solid':
      getComputedStyle(innerIndicator).outlineColor + ' / ' + getComputedStyle(innerIndicator).outlineStyle,
    'CONTROL: descendant selector did NOT cross the boundary — expect NOT 99px':
      getComputedStyle(innerButton).borderTopWidth,
  };

  return {
    formAssociation,
    validationEmpty,
    nativeSemantics,
    afterFill,
    disabledPropagation,
    afterReset,
    submitButtonParticipation,
    cssParts,
    lastSubmit,
  };
}

let results: unknown = null;

function render() {
  document.getElementById('out')!.textContent = JSON.stringify({ ...(results as object), lastSubmit }, null, 2);
}

collect().then((r) => {
  results = r;
  (window as unknown as { __formCheck: unknown }).__formCheck = r;
  render();
  console.log('__formCheck', r);
});
