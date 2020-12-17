"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
beforeEach(() => {
    nock_1.default.cleanAll();
});
afterAll(() => {
    nock_1.default.restore();
});
//# sourceMappingURL=jest.setupFileAfterEnv.js.map