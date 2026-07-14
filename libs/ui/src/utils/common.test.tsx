import React from 'react';
import { isChildPrimitive } from './common';

describe('isChildPrimitive', () => {
  it('SHOULD return TRUE if passing a string ', () => {
    const isPrimitive = isChildPrimitive('Simple text');
    expect(isPrimitive).toBe(true);
  });
  it('SHOULD return TRUE if passing a number ', () => {
    const isPrimitive = isChildPrimitive(100);
    expect(isPrimitive).toBe(true);
  });
  it('SHOULD return FALSE if passing a react node', () => {
    const isPrimitive = isChildPrimitive(<div>Simple JSX</div>);
    expect(isPrimitive).toBe(false);
  });
});
