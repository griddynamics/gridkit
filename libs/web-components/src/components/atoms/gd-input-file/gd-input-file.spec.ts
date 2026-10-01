import { describe, expect, it, vi } from 'vitest';
import './gd-input-file';

describe('gd-input-file', () => {
  it('maps selected files to a bubbling composed gd-change event', async () => {
    const el = document.createElement('gd-input-file');
    document.body.append(el);
    await el.updateComplete;
    Object.defineProperty(el.input, 'files', { value: [{ name: 'a.txt', size: 4, type: 'text/plain' }] });
    const listener = vi.fn();
    el.addEventListener('gd-change', listener);
    el.input.dispatchEvent(new Event('change'));
    expect(listener.mock.calls[0][0].detail).toEqual({ files: [{ name: 'a.txt', size: 4, type: 'text/plain' }] });
    el.remove();
  });
});
