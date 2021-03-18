module.exports = {
    extends: [
        'xo',
        'xo/esnext',
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
        "node/file-extension-in-import": "off"
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
            },
        },
    },
};
