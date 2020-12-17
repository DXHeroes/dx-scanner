"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageJSONContents = void 0;
exports.packageJSONContents = `
    { "name": "dx-scanner",
  "version": "0.0.1",
  "main": "index.js",
  "repository": "ssh://git@github.com/dxheroes/dx-scanner.git",
  "author": "DX Heroes LTD <info@dxheroes.io> (https://dxheroes.io)",
  "contributors": [
    {
      "name": "Prokop Simek",
      "email": "prokop@dxheroes.io",
      "url": "https://dxheroes.io"
    },
    {
      "name": "Vratislav Kalenda",
      "email": "vrata@dxheroes.io",
      "url": "https://dxheroes.io"
    }
  ],
  "license": "SEE LICENSE IN LICENSE.txt",
  "engineStrict": true,
  "engines": {
    "node": ">=10.15.3",
    "yarn": "^1.15.2"
  },
  "scripts": {
    "start": "ts-node src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "build": "rimraf build && tsc",
    "lint": "eslint 'src/**/*.ts'",
    "lint:fix": "yarn lint --fix"
  },
  "dependencies": {
    "@types/glob": "^7.1.1",
    "@types/semver": "^6.0.0",
    "axios": "^0.18.0",
    "colors": "^1.3.3",
    "debug": "^4.1.1",
    "git-url-parse": "^11.1.2",
    "glob": "^7.1.4",
    "inversify": "^5.0.1",
    "lodash": "^4.17.11",
    "reflect-metadata": "^0.1.13",
    "semver": "^6.1.1",
    "simple-git": "^1.113.0",
    "ts-node": "^8.1.0",
    "typescript": "^3.4.5"
  },
  "devDependencies": {
    "@octokit/rest": "^16.26.0",
    "@types/debug": "^4.1.4",
    "@types/git-url-parse": "^9.0.0",
    "@types/jest": "^24.0.12",
    "@types/lodash": "^4.14.124",
    "@types/nock": "^10.0.3",
    "@types/node": "^12.0.0",
    "@typescript-eslint/eslint-plugin": "^1.7.0",
    "@typescript-eslint/parser": "^1.7.0",
    "eslint": "^5.16.0",
    "eslint-config-prettier": "^4.3.0",
    "eslint-plugin-prettier": "^3.1.0",
    "jest": "^24.8.0",
    "nock": "^10.0.6",
    "prettier": "^1.17.1",
    "rimraf": "^2.6.3",
    "ts-jest": "^24.0.2"
  }
}
`;
//# sourceMappingURL=packageJSONContents.mock.js.map