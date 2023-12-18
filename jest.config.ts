export default {
    clearMocks: true,
    moduleFileExtensions: ['ts', 'js'],
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': "ts-jest"
    },
    setupFilesAfterEnv: ['jest-extended', '<rootDir>/jest.setup.ts'],
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    coveragePathIgnorePatterns: [
        "<rootDir>/src/access/api",
        "<rootDir>/src/access/file",
        "<rootDir>/src/access/database/utils",
        "<rootDir>/src/access/database/exceptions",
        "<rootDir>/src/access/database/models",
        "<rootDir>/src/controllers/DTO",
        "<rootDir>/src/controllers/exceptions",
        "<rootDir>/src/config",
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
}