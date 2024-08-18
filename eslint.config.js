export default [
    {
        root: true,
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 6,
            sourceType: 'module',
            project: './tsconfig.json',
        },
        plugins: ['@typescript-eslint', 'unused-imports'],
        rules: {
            'unused-imports/no-unused-imports': 'error',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/semi': 'off',
            curly: 'off',
            eqeqeq: 'off',
            'no-throw-literal': 'warn',
            semi: 'off',
            '@typescript-eslint/prefer-as-const': 'off',
            // https://typescript-eslint.io/rules/no-floating-promises
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-this-alias': 'off', // sometimes, we need to preserve this.
            '@typescript-eslint/explicit-function-return-type': 'error',
            'consistent-this': [2, 'self', 'that'], // as a paliative solution to above permissive rule
        },
        ignorePatterns: [
            //
            'out',
            'dist',
            'release',
            '**/*.d.ts',
        ],
    },
]
