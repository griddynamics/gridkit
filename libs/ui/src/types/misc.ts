export type NullableType<T = undefined> = T | null;

export type EnumOrPrimitive<T extends string | number> = T | `${T}`;

/**
 * Extracts keys from a given type `T` where the key starts with a given string prefix.
 *
 * @example
 * type MarginKeys = ExtractKeysByPrefix<BoxCssComponentProps, 'margin'>;
 *
 * Result: "margin" | "marginTop" | "marginBottom" ...
 */
export type KeysByPrefix<T, Prefix extends string> = Extract<
  {
    [K in keyof T]: K extends `${Prefix}${string}` ? K : never;
  }[keyof T],
  keyof T
>;

export type Maybe<T> = T | null;
