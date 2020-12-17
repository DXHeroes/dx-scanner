declare type NotNill<T> = T extends null | undefined ? never : T;
declare type Primitive = undefined | null | boolean | string | number | Function;
export declare type DeepRequired<T> = T extends Primitive ? NotNill<T> : {
    [P in keyof T]-?: T[P] extends Array<infer U> ? Array<DeepRequired<U>> : T[P] extends ReadonlyArray<infer U2> ? DeepRequired<U2> : DeepRequired<T[P]>;
};
export {};
//# sourceMappingURL=deepRequired.d.ts.map