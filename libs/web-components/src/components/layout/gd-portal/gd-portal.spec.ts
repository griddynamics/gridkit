import { describe, expect, it } from 'vitest';
import { defaultTheme } from 'gd-design-library/tokens';
import './gd-portal';

describe('gd-portal', () => {
  it('renders into document.body with the same default wrapper contract as React Portal', async () => {
    const portal = document.createElement('gd-portal');
    portal.theme = defaultTheme;
    const content = document.createElement('span');
    content.textContent = 'Hello World';
    portal.append(content);
    document.body.append(portal);
    await portal.updateComplete;

    expect(portal.portalRoot?.tagName).toBe('DIV');
    expect(portal.portalRoot?.contains(content)).toBe(true);
    expect(document.body.contains(content)).toBe(true);
    expect(getComputedStyle(portal.portalRoot!).position).toBe('fixed');
    portal.remove();
  });

  it('moves the original nodes directly into a supplied container without a wrapper', async () => {
    const target = document.createElement('div');
    const portal = document.createElement('gd-portal');
    const content = document.createElement('button');
    portal.container = target;
    portal.withWrapper = false;
    portal.append(content);
    document.body.append(target, portal);
    await portal.updateComplete;

    expect(target.contains(content)).toBe(true);
    expect(portal.portalRoot).toBeNull();
    expect(portal.childNodes).toHaveLength(0);
    portal.remove();
    expect(target.contains(content)).toBe(false);
    target.remove();
  });

  it('supports wrapper variant, semantic WrapperView, styles, and forwarded HTML attributes', async () => {
    const target = document.createElement('div');
    const portal = document.createElement('gd-portal');
    Object.assign(portal, {
      container: target,
      wrapperVariant: 'section',
      WrapperView: 'main',
      styles: { padding: '12px' },
      theme: defaultTheme,
    });
    portal.className = 'custom-wrapper';
    portal.setAttribute('aria-label', 'Portal content');
    portal.textContent = 'Content';
    document.body.append(target, portal);
    await portal.updateComplete;

    expect(portal.portalRoot?.tagName).toBe('MAIN');
    expect(portal.portalRoot?.className).toBe('custom-wrapper');
    expect(portal.portalRoot?.getAttribute('aria-label')).toBe('Portal content');
    expect(getComputedStyle(portal.portalRoot!).position).toBe('absolute');
    expect(getComputedStyle(portal.portalRoot!).padding).toBe('12px');
    portal.remove();
    target.remove();
  });

  it('blocks body scrolling only while requested', async () => {
    const portal = document.createElement('gd-portal');
    portal.blocksScroll = true;
    document.body.append(portal);
    await portal.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');

    portal.blocksScroll = false;
    await portal.updateComplete;
    expect(document.body.style.overflow).toBe('');
    portal.remove();
  });

  it('keeps original node identity and listeners while retargeting dynamically', async () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');
    const portal = document.createElement('gd-portal');
    const button = document.createElement('button');
    let clicks = 0;
    button.addEventListener('click', () => clicks++);
    portal.container = firstTarget;
    portal.withWrapper = false;
    portal.append(button);
    document.body.append(firstTarget, secondTarget, portal);
    await portal.updateComplete;

    expect(firstTarget.firstElementChild).toBe(button);
    portal.container = secondTarget;
    await portal.updateComplete;
    expect(secondTarget.firstElementChild).toBe(button);
    button.click();
    expect(clicks).toBe(1);

    portal.remove();
    expect(secondTarget.contains(button)).toBe(false);
    firstTarget.remove();
    secondTarget.remove();
  });

  it('owns marker ranges after a plain DocumentFragment is consumed and handles late children', async () => {
    const target = document.createElement('div');
    const fragment = document.createDocumentFragment();
    const portal = document.createElement('gd-portal');
    const first = document.createElement('span');
    first.textContent = 'First';
    portal.container = fragment;
    portal.withWrapper = false;
    portal.append(first);
    document.body.append(target, portal);
    await portal.updateComplete;

    target.append(fragment);
    expect(target.contains(first)).toBe(true);

    const second = document.createElement('span');
    second.textContent = 'Second';
    portal.append(second);
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(target.contains(second)).toBe(true);
    expect(target.textContent).toBe('FirstSecond');

    portal.remove();
    expect(target.textContent).toBe('');
    target.remove();
  });

  it('reference-counts concurrent body locks and restores the prior overflow value', async () => {
    document.body.style.overflow = 'scroll';
    const first = document.createElement('gd-portal');
    const second = document.createElement('gd-portal');
    first.blocksScroll = true;
    second.blocksScroll = true;
    document.body.append(first, second);
    await Promise.all([first.updateComplete, second.updateComplete]);
    expect(document.body.style.overflow).toBe('hidden');

    first.remove();
    expect(document.body.style.overflow).toBe('hidden');
    second.remove();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });
});
