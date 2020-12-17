"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
const inversify_1 = require("inversify");
let InMemoryCache = class InMemoryCache {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.storage = {};
    }
    get(key) {
        return this.storage[key];
    }
    set(key, value) {
        this.storage[key] = value;
    }
    purge() {
        this.storage = {};
    }
    delete(key) {
        const previous = this.get(key);
        this.storage[key] = undefined;
        return previous;
    }
    async getOrSet(key, setter) {
        const previous = this.get(key);
        if (previous !== undefined) {
            return previous;
        }
        const newValue = await setter();
        this.set(key, newValue);
        return newValue;
    }
};
InMemoryCache = __decorate([
    inversify_1.injectable()
], InMemoryCache);
exports.InMemoryCache = InMemoryCache;
//# sourceMappingURL=InMemoryCache.js.map