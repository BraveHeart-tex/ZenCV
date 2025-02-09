export type ValueOf<T> = T[keyof T];

export type NestedValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: NestedValueOf<T[K]> }>
  : T;

export type ValueOfNestedObject<T, K extends keyof T> = T[K][keyof T[K]];

export type Nullable<T> = T | null;
