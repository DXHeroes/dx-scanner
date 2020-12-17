"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DxPractice = void 0;
const inversify_1 = require("inversify");
function DxPracticeWrapperDecorator(practiceMetadata) {
    return function classDecorator(constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.getMetadata = () => {
                    return Object.assign(Object.assign({}, practiceMetadata), { defaultImpact: practiceMetadata.impact, matcher: this });
                };
            }
        };
    };
}
function DxPractice(metadata) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return (target) => {
        return DxPracticeWrapperDecorator(metadata)(inversify_1.injectable()(target));
    };
}
exports.DxPractice = DxPractice;
//# sourceMappingURL=DxPracticeDecorator.js.map