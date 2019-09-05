# [1.4.0](https://github.com/dxheroes/dx-scanner/compare/v1.3.0...v1.4.0) (2019-08-30)


### Bug Fixes

* Improve the JSONReport. ([da37a50](https://github.com/dxheroes/dx-scanner/commit/da37a50))
* Improve the reporter interface. ([e4c0465](https://github.com/dxheroes/dx-scanner/commit/e4c0465))
* Remove reporting in the new file. ([eac49c1](https://github.com/dxheroes/dx-scanner/commit/eac49c1))


### Features

* Add JSON Reporter. ([80a0bd4](https://github.com/dxheroes/dx-scanner/commit/80a0bd4))
* Add possibility to have an output in JSON. ([3142f0f](https://github.com/dxheroes/dx-scanner/commit/3142f0f))
* Write JSON report to the new file. ([fe4fb26](https://github.com/dxheroes/dx-scanner/commit/fe4fb26))

# [1.3.0](https://github.com/dxheroes/dx-scanner/compare/v1.2.0...v1.3.0) (2019-08-27)


### Bug Fixes

* remove unnecessary condition ([d0a80fa](https://github.com/dxheroes/dx-scanner/commit/d0a80fa))
* **cli:** Remove console.log when a 404 error happens. Use debug() instead. ([d8917f3](https://github.com/dxheroes/dx-scanner/commit/d8917f3))
* Catch the auth error and handle it in index.ts instead of ScanningStrategyDetector ([af617c8](https://github.com/dxheroes/dx-scanner/commit/af617c8))
* determining private/public repo, ([f9966f5](https://github.com/dxheroes/dx-scanner/commit/f9966f5))
* Logic with accessType and tests for private repo. ([95c7036](https://github.com/dxheroes/dx-scanner/commit/95c7036))
* Remove nonsense condition. ([b5d3d99](https://github.com/dxheroes/dx-scanner/commit/b5d3d99))
* Remove unnecessary import ([e2c391a](https://github.com/dxheroes/dx-scanner/commit/e2c391a))
* Remove unnecessary piece of code ([8e0e42a](https://github.com/dxheroes/dx-scanner/commit/8e0e42a))
* Remove unused import. ([c3b22d0](https://github.com/dxheroes/dx-scanner/commit/c3b22d0))
* Remove unused interface. ([0f7fe62](https://github.com/dxheroes/dx-scanner/commit/0f7fe62))
* Remove unused interface. ([bf5b5c5](https://github.com/dxheroes/dx-scanner/commit/bf5b5c5))
* Remove unused variable. ([f0031b1](https://github.com/dxheroes/dx-scanner/commit/f0031b1))
* Tests for private repos. ([1bb96ed](https://github.com/dxheroes/dx-scanner/commit/1bb96ed))
* throw right error ([4f83feb](https://github.com/dxheroes/dx-scanner/commit/4f83feb))
* throwing error ([9696f91](https://github.com/dxheroes/dx-scanner/commit/9696f91))


### Features

* **cli:** add possibility to insert AT after running scanner if the AT was not provided. ([47353dd](https://github.com/dxheroes/dx-scanner/commit/47353dd))

# [1.2.0](https://github.com/dxheroes/dx-scanner/compare/v1.1.4...v1.2.0) (2019-08-21)


### Features

* **CI:** add scripts to run on travis ([#39](https://github.com/dxheroes/dx-scanner/issues/39)) ([c701407](https://github.com/dxheroes/dx-scanner/commit/c701407))

## [1.1.4](https://github.com/dxheroes/dx-scanner/compare/v1.1.3...v1.1.4) (2019-08-20)


### Bug Fixes

* **practices:** add dependsOn in related practices ([#38](https://github.com/dxheroes/dx-scanner/issues/38)) ([019ee6a](https://github.com/dxheroes/dx-scanner/commit/019ee6a))

## [1.1.3](https://github.com/dxheroes/dx-scanner/compare/v1.1.2...v1.1.3) (2019-08-19)


### Bug Fixes

* move misuesed devDependencies to dependencies ([#37](https://github.com/dxheroes/dx-scanner/issues/37)) ([62fcc4f](https://github.com/dxheroes/dx-scanner/commit/62fcc4f))

## [1.1.2](https://github.com/dxheroes/dx-scanner/compare/v1.1.1...v1.1.2) (2019-08-19)


### Bug Fixes

* remote url is ssh ([f9d57bc](https://github.com/dxheroes/dx-scanner/commit/f9d57bc))
* **cli:** set relative path to correct index.js file for real runtime ([4bc4051](https://github.com/dxheroes/dx-scanner/commit/4bc4051))

## [1.1.1](https://github.com/dxheroes/dx-scanner/compare/v1.1.0...v1.1.1) (2019-08-16)


### Bug Fixes

* **README:** fix command for installing ([#29](https://github.com/dxheroes/dx-scanner/issues/29)) ([81fff27](https://github.com/dxheroes/dx-scanner/commit/81fff27))

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Works on Windows
- Possible to develop on Windows

## [1.0.0] - 2019-07-31

### Added

- First version of DX Scanner
