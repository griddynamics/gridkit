import { element, stack } from './helpers';

function example(mode: 'section' | 'button-section' | 'button-inline') {
  const root = stack('column', '0', element('gd-typography', { variant: 'h3' }, 'Section 1'));
  root.style.cssText += ';width:100%;margin:0 auto;background:#a5ffb4;padding:10px;position:relative';
  let showing = false;
  const button = element('gd-button', { variant: 'outlined', styles: { position: 'relative' } }, 'Click me!');
  const link = element('gd-link', {});
  const innerLink = element('gd-link', {});
  const section = stack(
    'column',
    '0',
    stack('row', '0', element('gd-typography', { variant: 'h3' }, 'Section 2')),
    stack('row', '0', innerLink)
  );
  section.style.cssText += ';margin-top:20px;background:#ffa5a5;padding:10px;position:relative';
  const loader = element('gd-loader', {
    variant: mode === 'button-inline' ? 'inline' : 'section',
    name: mode === 'button-inline' ? 'circle' : 'dots',
    size: mode === 'section' ? 'md' : 'sm',
    withWrapper: mode !== 'button-inline',
  });
  if (mode === 'button-inline') loader.slot = 'icon-end';
  const update = () => {
    link.textContent = `${showing ? 'Hide' : 'Show'} Loader in ${mode === 'section' ? 'section 2' : 'button'}`;
    innerLink.textContent = `${showing ? 'Hide' : 'Show'} Loader`;
    button.textContent = showing ? 'Loading...' : 'Click me!';
    loader.remove();
    if (showing) (mode === 'section' ? section : button).append(loader);
  };
  const toggle = () => {
    showing = !showing;
    update();
  };
  button.addEventListener('click', toggle);
  link.addEventListener('click', toggle);
  innerLink.addEventListener('click', toggle);
  if (mode === 'section') root.append(link, section);
  else {
    if (mode === 'button-section') root.append(stack('row', '0', link));
    root.append(stack('row', '0', button));
  }
  update();
  return root;
}

export const loaderStories = {
  LoaderSectionVariant: () => example('section'),
  SectionLoaderButtonVariant: () => example('button-section'),
  InlineLoaderButtonVariant: () => example('button-inline'),
};
