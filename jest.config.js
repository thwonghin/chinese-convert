module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^lodash-es$': 'lodash', // Workaround for es module
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: true,
                tsconfig: 'tests/tsconfig.json',
            },
        ],
    },
};
