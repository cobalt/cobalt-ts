/* eslint-disable */
export default {
    displayName: "hexworks-cobalt-graphql",
    preset: "../../../jest.preset.js",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json",
        },
    },
    transform: {
        "^.+\\.[tj]sx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
