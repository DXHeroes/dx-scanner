"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const model_1 = require("../model");
const nodePath = __importStar(require("path"));
describe('DetectorUtils', () => {
    describe('#sharedSubpath', () => {
        it('returns shared path when root is the same', () => {
            expect(utils_1.sharedSubpath(['/var', '/foo', '/foo/bar'])).toEqual(nodePath.sep);
        });
        it('returns shared path when dir is the same', () => {
            expect(utils_1.sharedSubpath(['/foo', '/foo', '/foo/bar'])).toEqual(nodePath.normalize('/foo'));
        });
        it('returns shared path when dir has same prefixes', () => {
            expect(utils_1.sharedSubpath(['/foo', '/foor', '/foo/bar'])).toEqual(nodePath.sep);
        });
        it('works with relative paths', () => {
            expect(utils_1.sharedSubpath(['./foo', './foo', './foo/bar'])).toEqual('.' + nodePath.sep + 'foo');
        });
        it('works with relative paths - implicit relative path', () => {
            expect(utils_1.sharedSubpath(['./foo', 'foo', './foo/bar'])).toEqual('.' + nodePath.sep + 'foo');
        });
        it('works with relative paths - mixed in absolute path', () => {
            // @todo improve sharedSubpath so it can resolve relative paths to absolute ones. Considered edge case for now.
            expect(utils_1.sharedSubpath(['./foo', '/foo', './foo/bar'])).toEqual(nodePath.sep);
        });
    });
    describe('#hasOneOfPackages', () => {
        it('returns true if it has one of the packages', () => {
            const pkg = ['@types/node'];
            const pkgManag = {
                framework: model_1.PackageManagementFramework.NPM,
                hasLockfile: true,
                packages: {
                    '@types/node': {
                        name: '',
                    },
                },
            };
            const result = utils_1.hasOneOfPackages(pkg, pkgManag);
            expect(result).toEqual(true);
        });
        it('returns false if there is no package management', () => {
            const pkg = ['@types/node'];
            const result = utils_1.hasOneOfPackages(pkg);
            expect(result).toEqual(false);
        });
        it('returns false if the package from packages is not in packaga management packages', () => {
            const pkg = ['@types/node'];
            const pkgManag = {
                framework: model_1.PackageManagementFramework.NPM,
                hasLockfile: true,
                packages: {
                    '@no/package': {
                        name: '',
                    },
                },
            };
            const result = utils_1.hasOneOfPackages(pkg, pkgManag);
            expect(result).toEqual(false);
        });
    });
});
//# sourceMappingURL=utils.spec.js.map