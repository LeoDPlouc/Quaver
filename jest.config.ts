export default {
    clearMocks: true,
    moduleFileExtensions: ['ts','js'],
    roots: ['<rootDir>'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': "ts-jest"
    },
    setupFilesAfterEnv: ['jest-extended'],
    globals: {
        'ts-jest' : {
            diagnostics: false
        }
    }
}