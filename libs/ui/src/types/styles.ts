export type BoxStyles<T = number> = Record<string, string | boolean | T | undefined>;
export type BoxComputedStyles<T = number> = Record<string, string | boolean | T | never>;
export type InlineBoxStyles = Record<string, string | number | undefined>;

export type Rounded = 'none' | 'default' | 'round' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
