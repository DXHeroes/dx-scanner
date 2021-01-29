export declare const eslintrRcJson: {
    parser: string;
    plugins: string[];
    env: {
        es6: boolean;
        node: boolean;
    };
    extends: string[];
    globals: {
        Atomics: string;
        SharedArrayBuffer: string;
    };
    parserOptions: {
        ecmaVersion: number;
        sourceType: string;
        project: string;
    };
    rules: {
        quotes: string[];
        eqeqeq: string[];
        'no-process-env': string[];
        'no-var': string[];
        'sort-imports': string[];
        'func-style': string[];
        'prefer-arrow-callback': string[];
        '@typescript-eslint/explicit-function-return-type': (string | {
            allowTypedFunctionExpressions: boolean;
            allowExpressions: boolean;
        })[];
        '@typescript-eslint/await-thenable': string[];
        '@typescript-eslint/no-use-before-define': string[];
        '@typescript-eslint/no-angle-bracket-type-assertion': string[];
        '@typescript-eslint/no-require-imports': string[];
        '@typescript-eslint/no-unnecessary-type-assertion': string[];
        '@typescript-eslint/prefer-string-starts-ends-with': string[];
        '@typescript-eslint/interface-name-prefix': string[];
        '@typescript-eslint/prefer-interface': string[];
        '@typescript-eslint/explicit-member-accessibility': (string | {
            accessibility: string;
        })[];
        '@typescript-eslint/no-misused-promises': string[];
        '@typescript-eslint/no-floating-promises': string[];
        '@typescript-eslint/consistent-type-assertions': string[];
        '@typescript-eslint/no-non-null-assertion': string[];
        'prettier/prettier': (string | {
            trailingComma: string;
            singleQuote: boolean;
            printWidth: number;
            tabWidth: number;
            arrowParens: string;
            usePrettierrc?: undefined;
        } | {
            usePrettierrc: boolean;
            trailingComma?: undefined;
            singleQuote?: undefined;
            printWidth?: undefined;
            tabWidth?: undefined;
            arrowParens?: undefined;
        })[];
    };
    overrides: {
        files: string[];
        excludedFiles: string[];
        rules: {
            '@typescript-eslint/explicit-function-return-type': string;
        };
    }[];
};
//# sourceMappingURL=eslintRcMockJson.d.ts.map