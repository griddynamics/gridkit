import { describe, expect, it } from 'vitest';
import { iconCatalog, registerCustomIcons } from './catalog';

describe('custom icon catalog', () => {
  it('registers an application-owned icon by a previously unknown name', () => {
    registerCustomIcons({
      projectOrbit: {
        viewBox: '0 0 24 24',
        body: '<circle cx="12" cy="12" r="3" fill="var(--gd-icon-fill)"></circle>',
      },
    });

    expect((iconCatalog as Record<string, { viewBox: string; body: string }>).projectOrbit).toEqual({
      viewBox: '0 0 24 24',
      body: '<circle cx="12" cy="12" r="3" fill="var(--gd-icon-fill)"></circle>',
    });
  });
});
