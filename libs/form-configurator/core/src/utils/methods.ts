export function getValue<T>(obj: object, path: string, defaultValue?: T): T | unknown {
  const keys = path.split('.');
  const result = keys.reduce((currentObject: any, key: string) => {
    return currentObject?.[key];
  }, obj);
  return result === undefined ? defaultValue : result;
}

export function setImmutable<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split('.');
  const newObj = { ...obj };
  let currentLevel: any = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextLevel = { ...(currentLevel[key] ?? {}) };
    currentLevel[key] = nextLevel;
    currentLevel = nextLevel;
  }
  currentLevel[keys[keys.length - 1]] = value;

  return newObj;
}

export function unsetImmutable<T extends object>(obj: T, path: string): T {
  const keys = path.split('.');
  const lastKey = keys.pop();
  if (lastKey === undefined) {
    return { ...obj };
  }

  const newObj = { ...obj };
  let parentLevel: any = newObj;
  for (const key of keys) {
    const currentVal = parentLevel[key];
    if (typeof currentVal !== 'object' || currentVal === null) {
      return { ...obj };
    }
    parentLevel[key] = { ...currentVal };
    parentLevel = parentLevel[key];
  }

  delete parentLevel[lastKey];

  return newObj;
}

export function generateControlId(controlType: string, path?: string, scope?: string): string {
  const identifier = path || scope || 'unknown';
  const sanitized = identifier.replace(/[^a-zA-Z0-9]/g, '-');
  return `${controlType}-${sanitized}`;
}

export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

export function parseScopePath(scope: string): string {
  return scope.replace('#/properties/', '').replace(/\//g, '.');
}

export function parseFieldName(scope: string): string {
  return scope.replace('#/properties/', '').replace('/properties/', '.');
}
