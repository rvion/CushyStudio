// 💬 2024-10-16 rvion:
// | for some reason, vscode eslint plugin runs eslint on this file despite it not beeing
// | part of our imports; so lets' disable its errors since they all come from a single rule.
/* eslint-disable @typescript-eslint/no-require-imports */

const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const reactRefresh = require('eslint-plugin-react-refresh')
const path = require('path')
const globals = require('globals')
const tsParser = require('@typescript-eslint/parser')
const js = require('@eslint/js')
const unocss = require('@unocss/eslint-config/flat')
const { FlatCompat } = require('@eslint/eslintrc')

// 💬 2024-10-16 rvion:
// | this localRules stuff seems pretty cool; probably something to investigate soon
// |> const localRules = require('eslint-plugin-local-rules')

const USE_SLOW_TYPECHECKING_RULES = false
const ERROR_LEVEL = 'error' // : 'warn' | 'error'

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

// 💬 2024-10-16 rvion:
// | modern configs seems to use some kind of layered apporach like this
// | https://github.com/prisma/prisma/blob/6819678dd575677ccd5c6a72ea51f8421f6a82ce/eslint.config.cjs#L4
module.exports = [
    // 1. add core includes
    {
        files: ['src/**/*.{ts,tsx}'],
    },

    // 2. add core excludes
    // why in a separate object? because eslint is doing BATSHIT CRAZY impossible to know stuff
    // | when config have a single keys... who thought it was a good idea to add such special cases!?)
    // | e.g. https://eslint.org/docs/latest/use/configure/ignore
    {
        ignores: [
            // top-level folders to ignore
            'ios/',
            'android/',
            'dist/',
            'lib/',
            'coverage/',
            // ignore formats
            '**/*.d.ts',
            '**/*.js',
            '**/*.cjs',
            '**/*.mjs',
            // misc
            'src/loco/scripts.next/',
            'src/loco/script-next.ts',
            'src/loco/scripts.current/',
            'src/loco/script-current.ts',
        ],
    },

    // 3. addd
    ...compat.extends(
        //
        'eslint:recommended',

        // 💬 2024-10-16 rvion:
        // | unlike the rule below, those do not require a full typescript typechecking
        // | and are great to include by defaul;t next config layer will anyway remove some of them.
        'plugin:@typescript-eslint/recommended',

        // 💬 2024-10-16 rvion:
        // |🐌 this is handy, but super slow. 100ms => 23 seconds => 230 times slower !!!!!!
        // |> 'plugin:@typescript-eslint/recommended-requiring-type-checking',

        // 💬 2024-10-16 rvion:
        // | we're not at the point where cosmetic shit matters. prettier already does it's job
        // | at making sure we have files somewhat coherent. let's leave it as that.
        // |> 'plugin:prettier/recommended',
    ),

    // 💬 2024-10-17 rvion:
    // | we never setup tailwind linting before, but since we're working on eslint
    // | let's just install the official plugin https://unocss.dev/integrations/eslint
    // | TODO: review if we want all the rules;
    // |   - @unocss/order - Enforce a specific order for class selectors.
    // |   - @unocss/order-attributify - Enforce a specific order for attributify selectors.
    // |   - @unocss/blocklist - Disallow specific class selectors [Optional].
    // |   - @unocss/enforce-class-compile - Enforce class compile [Optional].
    unocss,
    // 4. our actual main config.
    {
        // cache: true,
        languageOptions: {
            globals: { ...globals.node },
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',

            // 💬 2024-10-16 rvion:
            // | THIS MOTHERFUCKING LINE makes everything 100 times slower.
            // | parserOptions: { project: path.resolve(__dirname, 'tsconfig.json') },
        },
        plugins: {
            'react-refresh': reactRefresh,
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            'no-restricted-properties': [
                'error',
                {
                    object: 'window',
                    property: 'addEventListener',
                    message: "Please use 'window_addEventListener' instead of 'window.addEventListener'.",
                },
            ],
            // "no-restricted-imports": [
            //     "error",
            //     {
            //         "paths": [
            //             {
            //                 "name": "mobx",
            //                 "importNames": ["makeAutoObservable"],
            //                 "message": "Please use 'makeAutoObservableV2' instead of 'makeAutoObservable' from 'mobx'."
            //             }
            //         ]
            //     }
            // ],

            // 💬 2024-10-16 rvion:
            // | this one is useless since we use typescript
            // | not sure why it suddenly started to appear after bumping eslint various packages.
            'no-unused-vars': 'off',

            // 🦊🦄👋 this helps (a lot) with hot-reloading!!
            // see: https://github.com/ArnaudBarre/eslint-plugin-react-refresh
            // see: https://github.com/vitejs/vite-plugin-react-swc#consistent-components-exports
            'react-refresh/only-export-components': [ERROR_LEVEL, { allowConstantExport: true }],
            '@typescript-eslint/explicit-function-return-type': ERROR_LEVEL,

            // // AVOID WRITING AND MAINTAINING WEIRD CONDITIONALS ==========================================
            '@typescript-eslint/strict-boolean-expressions': USE_SLOW_TYPECHECKING_RULES
                ? [
                      ERROR_LEVEL,
                      {
                          allowNullableString: true,
                          allowNullableBoolean: true,
                          allowAny: true,
                      },
                  ]
                : 'off',
            // 💬 2024-10-17 rvion:
            // 🔶 if the string-boolean-expressions lint rule above is disabled, then we need to
            // at least manually remove the following rules that will otherwise make our code
            // actively worse
            'no-extra-boolean-cast': 'off',

            //# PROMISES
            // https://typescript-eslint.io/rules/no-misused-promises
            // Disallows Promises in places not designed to handle them.
            '@typescript-eslint/no-misused-promises': USE_SLOW_TYPECHECKING_RULES
                ? [ERROR_LEVEL, { checksVoidReturn: false }]
                : 'off',

            // https://typescript-eslint.io/rules/require-await
            '@typescript-eslint/require-await': USE_SLOW_TYPECHECKING_RULES //
                ? ERROR_LEVEL
                : 'off',

            // https://typescript-eslint.io/rules/no-floating-promises
            '@typescript-eslint/no-floating-promises': USE_SLOW_TYPECHECKING_RULES //
                ? ERROR_LEVEL
                : 'off',

            // https://typescript-eslint.io/rules/await-thenable
            '@typescript-eslint/await-thenable': USE_SLOW_TYPECHECKING_RULES //
                ? ERROR_LEVEL
                : 'off',

            // avoid errors due to empty strings and 0 values
            '@typescript-eslint/return-await': USE_SLOW_TYPECHECKING_RULES //
                ? [ERROR_LEVEL, 'in-try-catch']
                : 'off', // nice but 400+ errors to fix

            'no-return-await': ERROR_LEVEL, // nice but 400+ errors to fix
            'consistent-this': [2, 'self', 'that'], // as a palliative solution to above permissive rule

            // 💬 2024-10-16 rvion:
            // | 🔴 this one seems to not work properly.
            // | we need to investigate the exact conditions that make it triggers.
            // Removing false-positive circular dependencies by forcing type imports
            '@typescript-eslint/consistent-type-imports': [
                ERROR_LEVEL,
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],

            '@typescript-eslint/no-non-null-assertion': 'off', // 🔶 prevent ! to check if null

            //# DISABLED  -------------------------------------------------------------------------------------------
            '@typescript-eslint/no-inferrable-types': 'off', // explicit types are sometimes useful.
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off', //       nice but not tolerant of our exhaust patterns

            '@typescript-eslint/no-use-before-define': 'off', //           ???
            '@typescript-eslint/no-unnecessary-type-constraint': 'off', // ???
            '@typescript-eslint/prefer-as-const': 'off', //                ???

            '@typescript-eslint/no-this-alias': 'off', //                  sometimes, we need to preserve this.

            '@typescript-eslint/no-empty-function': 'off', //              OVER-ZEALOUS
            '@typescript-eslint/no-var-requires': 'off', //                OVER-ZEALOUS
            '@typescript-eslint/no-unused-vars': 'off', //                 OVER-ZEALOUS
            '@typescript-eslint/no-empty-object-type': 'off', //           OVER-ZEALOUS

            // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-empty-interface.md
            // this one is buggy: because we use empty interface with extends clause for interface merging with types in various B_... files
            // this could also be used for
            '@typescript-eslint/no-empty-interface': 'off',

            '@typescript-eslint/no-explicit-any': 'off', //                DANGEROUS BUT ACCEPTABLE FOR NOW
            '@typescript-eslint/ban-ts-ignore': 'off', //                  DANGEROUS BUT ACCEPTABLE FOR NOW
            '@typescript-eslint/no-unsafe-declaration-merging': 'off', //  DANGEROUS BUT ACCEPTABLE FOR NOW
            '@typescript-eslint/interface-name-prefix': 'off', //          USELESS STYLE / NAMING STUFF
            '@typescript-eslint/class-name-casing': 'off', //              USELESS STYLE / NAMING STUFF
            '@typescript-eslint/member-delimiter-style': 'off', //         USELESS STYLE / NAMING STUFF
            '@typescript-eslint/camelcase': 'off', //                      USELESS STYLE / NAMING STUFF

            semi: 'off', //                                                USELESS STYLE / NAMING STUFF
        },
    },
]
