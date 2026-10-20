export const legacyReactIds: string[];
export const sharedDocs: Record<string, string>;
export const sharedDocIds: string[];
export const storybookOrigin: string;
export function legacyRedirect(href: string, ids: string[], sharedIds?: string[]): string | null;
export function legacyRedirectHead(): string;
export function migratedReactId(id: string): string;
export function webComponentsRedirect(href: string): string | null;
export function webComponentsRedirectHead(): string;
