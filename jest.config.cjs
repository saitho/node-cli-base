module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    transform: {
        "\\.jsx?$": "babel-jest",
        '\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(read-package-up)/)'],
    testMatch: [
        '**/test/**/*.test.ts',
    ],

    // Code Coverage
    coverageReporters: ['lcovonly', 'text'],
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
};
