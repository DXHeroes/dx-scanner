"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoContentType = exports.GitService = void 0;
var GitService;
(function (GitService) {
    GitService["github"] = "github.com";
    GitService["bitbucket"] = "bitbucket.org";
    GitService["gitlab"] = "gitlab.com";
})(GitService = exports.GitService || (exports.GitService = {}));
var RepoContentType;
(function (RepoContentType) {
    RepoContentType["dir"] = "dir";
    RepoContentType["file"] = "file";
    RepoContentType["symlink"] = "symlink";
})(RepoContentType = exports.RepoContentType || (exports.RepoContentType = {}));
//# sourceMappingURL=model.js.map