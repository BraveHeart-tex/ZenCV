import { Dispatch, SetStateAction } from 'react';

export type ValueOf<T> = T[keyof T];

export type NestedValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: NestedValueOf<T[K]> }>
  : T;

export type ValueOfNestedObject<T, K extends keyof T> = T[K][keyof T[K]];

export type Nullable<T> = T | null;

export type UseState<T> = Dispatch<SetStateAction<T>>;

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type DeepOmit<T, K extends keyof any> = T extends any[]
  ? DeepOmit<T[number], K>[]
  : T extends object
    ? {
        [P in keyof T as P extends K ? never : P]: DeepOmit<T[P], K>;
      }
    : T;
