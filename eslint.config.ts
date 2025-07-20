import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['**/node_modules/', 'dist/', 'public/']),
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  tseslint.configs.recommended,
  react.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
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

      'import/no-unresolved': ['off'],
      'import/no-commonjs': ['warn'],
      'import/newline-after-import': ['warn'],

      'import/order': [
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
