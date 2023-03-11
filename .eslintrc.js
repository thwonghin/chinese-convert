module.exports = {
    extends: [
        'xo',
        'xo-typescript',
        "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
    },
    rules: {
        "unicorn/no-array-callback-reference": "off",
        "node/file-extension-in-import": "off",
        'no-await-in-loop': 'off'
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
            },
        },
    },
};
