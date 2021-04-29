"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitFLow = exports.ProjectComponentType = exports.ProjectComponentPlatform = exports.ProjectComponentFramework = exports.PackageManagementFramework = exports.IntegrationTestFramework = exports.UnitTestFramework = exports.E2ETestFramework = exports.PracticeEvaluationResult = exports.PracticeImpact = exports.ProgrammingLanguage = void 0;
var ProgrammingLanguage;
(function (ProgrammingLanguage) {
    ProgrammingLanguage["CPlusPlus"] = "C++";
    ProgrammingLanguage["CSharp"] = "C#";
    ProgrammingLanguage["Java"] = "Java";
    ProgrammingLanguage["Kotlin"] = "Kotlin";
    ProgrammingLanguage["Swift"] = "Swift";
    ProgrammingLanguage["Ruby"] = "Ruby";
    ProgrammingLanguage["Groovy"] = "Groovy";
    ProgrammingLanguage["JavaScript"] = "JavaScript";
    ProgrammingLanguage["TypeScript"] = "TypeScript";
    ProgrammingLanguage["Go"] = "Go";
    ProgrammingLanguage["PHP"] = "PHP";
    ProgrammingLanguage["Clojure"] = "Clojure";
    ProgrammingLanguage["Haskell"] = "Haskell";
    ProgrammingLanguage["Elixir"] = "Elixir";
    ProgrammingLanguage["Python"] = "Python";
    ProgrammingLanguage["Rust"] = "Rust";
    ProgrammingLanguage["UNKNOWN"] = "UNKNOWN";
})(ProgrammingLanguage = exports.ProgrammingLanguage || (exports.ProgrammingLanguage = {}));
var PracticeImpact;
(function (PracticeImpact) {
    PracticeImpact["high"] = "high";
    PracticeImpact["medium"] = "medium";
    PracticeImpact["small"] = "small";
    PracticeImpact["hint"] = "hint";
    PracticeImpact["off"] = "off";
})(PracticeImpact = exports.PracticeImpact || (exports.PracticeImpact = {}));
var PracticeEvaluationResult;
(function (PracticeEvaluationResult) {
    PracticeEvaluationResult["practicing"] = "practicing";
    PracticeEvaluationResult["notPracticing"] = "notPracticing";
    PracticeEvaluationResult["unknown"] = "unknown";
})(PracticeEvaluationResult = exports.PracticeEvaluationResult || (exports.PracticeEvaluationResult = {}));
var E2ETestFramework;
(function (E2ETestFramework) {
    E2ETestFramework["Nightwatch"] = "Nightwatch.js";
    E2ETestFramework["Selenium"] = "Selenium";
    E2ETestFramework["UNKNOWN"] = "UNKNOWN";
})(E2ETestFramework = exports.E2ETestFramework || (exports.E2ETestFramework = {}));
var UnitTestFramework;
(function (UnitTestFramework) {
    UnitTestFramework["Jest"] = "Jest";
    UnitTestFramework["spec"] = "spec";
    UnitTestFramework["JUnit"] = "JUnit";
    UnitTestFramework["UNKNOWN"] = "UNKNOWN";
})(UnitTestFramework = exports.UnitTestFramework || (exports.UnitTestFramework = {}));
var IntegrationTestFramework;
(function (IntegrationTestFramework) {
    IntegrationTestFramework["newman"] = "newman";
    IntegrationTestFramework["pact"] = "pact";
    IntegrationTestFramework["UNKNOWN"] = "UNKNOWN";
})(IntegrationTestFramework = exports.IntegrationTestFramework || (exports.IntegrationTestFramework = {}));
var PackageManagementFramework;
(function (PackageManagementFramework) {
    PackageManagementFramework["Bundler"] = "Bundler";
    PackageManagementFramework["NPM"] = "NPM";
    PackageManagementFramework["Yarn"] = "Yarn";
    PackageManagementFramework["Cocoapods"] = "Cocoapods";
    PackageManagementFramework["Carthage"] = "Carthage";
    PackageManagementFramework["Maveb"] = "Maven";
    PackageManagementFramework["UNKNOWN"] = "UNKNOWN";
})(PackageManagementFramework = exports.PackageManagementFramework || (exports.PackageManagementFramework = {}));
var ProjectComponentFramework;
(function (ProjectComponentFramework) {
    ProjectComponentFramework["RubyOnRails"] = "RubyOnRails";
    ProjectComponentFramework["React"] = "React";
    ProjectComponentFramework["Angular"] = "Angular";
    ProjectComponentFramework["ReactNative"] = "ReactNative";
    ProjectComponentFramework["Xamarin"] = "Xamarin";
    ProjectComponentFramework["Express"] = "Express";
    ProjectComponentFramework["UNKNOWN"] = "UNKNOWN";
})(ProjectComponentFramework = exports.ProjectComponentFramework || (exports.ProjectComponentFramework = {}));
var ProjectComponentPlatform;
(function (ProjectComponentPlatform) {
    ProjectComponentPlatform["BackEnd"] = "BackEnd";
    ProjectComponentPlatform["FrontEnd"] = "FrontEnd";
    ProjectComponentPlatform["iOS"] = "iOS";
    ProjectComponentPlatform["Android"] = "Android";
    ProjectComponentPlatform["MobileMultiplatform"] = "MobileMultiplatform";
    ProjectComponentPlatform["UNKNOWN"] = "UNKNOWN";
})(ProjectComponentPlatform = exports.ProjectComponentPlatform || (exports.ProjectComponentPlatform = {}));
var ProjectComponentType;
(function (ProjectComponentType) {
    ProjectComponentType["Application"] = "Application";
    ProjectComponentType["Library"] = "Library";
    ProjectComponentType["Documentation"] = "Documentation";
    ProjectComponentType["UNKNOWN"] = "UNKNOWN";
})(ProjectComponentType = exports.ProjectComponentType || (exports.ProjectComponentType = {}));
var GitFLow;
(function (GitFLow) {
    GitFLow["UNKNOWN"] = "UNKNOWN";
    GitFLow["Github"] = "Github";
    GitFLow["Git"] = "Git";
})(GitFLow = exports.GitFLow || (exports.GitFLow = {}));
//# sourceMappingURL=model.js.map