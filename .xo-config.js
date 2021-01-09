module.exports = {
    space: true,
    prettier: true,
    overrides: [
        {
            "files": "tests/**/*.ts",
            extends: ["plugin:jest/all"]
        }
    ]
};
