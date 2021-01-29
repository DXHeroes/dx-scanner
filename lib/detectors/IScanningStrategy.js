"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessType = exports.ServiceType = void 0;
var ServiceType;
(function (ServiceType) {
    ServiceType["github"] = "github";
    ServiceType["bitbucket"] = "bitbucket";
    ServiceType["gitlab"] = "gitlab";
    ServiceType["git"] = "git";
    ServiceType["local"] = "local";
})(ServiceType = exports.ServiceType || (exports.ServiceType = {}));
var AccessType;
(function (AccessType) {
    AccessType["private"] = "private";
    AccessType["public"] = "public";
    AccessType["unknown"] = "unknown";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
//# sourceMappingURL=IScanningStrategy.js.map