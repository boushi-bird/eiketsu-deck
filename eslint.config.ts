import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { flatConfigs as importFlatConfigs } from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { configs } from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/node_modules/', 'dist/', 'public/']),
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat['recommended-latest'],
  configs.recommended,
  react.configs.flat['jsx-runtime'],
  importFlatConfigs.recommended,
  importFlatConfigs.typescript,
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],

    languageOptions: {
      globals: globals.browser,

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
        },
      ],

      'import-x/no-unresolved': ['off'],
      'import-x/no-commonjs': ['warn'],
      'import-x/newline-after-import': ['warn'],

      'import-x/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
          },

          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  {
    files: ['src/**'],
    rules: {
      'no-process-env': ['error'],
    },
  },
]);
