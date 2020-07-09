# [3.29.0](https://github.com/dxheroes/dx-scanner/compare/v3.28.2...v3.29.0) (2020-07-09)


### Features

* send statistics of security issues from npm and yarn audit ([6b28126](https://github.com/dxheroes/dx-scanner/commit/6b28126c6b8077cf580fc31b1620b1110369f1c7))
* send yarn audit detailed data to dxse ([f2e910a](https://github.com/dxheroes/dx-scanner/commit/f2e910a3a0a3ac00c7ab1fd2b5b45398f058d5d1))

## [3.28.2](https://github.com/dxheroes/dx-scanner/compare/v3.28.1...v3.28.2) (2020-07-09)


### Bug Fixes

* lower the bitbucket as it has breaking changes ([a2c8895](https://github.com/dxheroes/dx-scanner/commit/a2c889537d039030f44dfe3dbf1a77f1d6302589))

## [3.28.1](https://github.com/dxheroes/dx-scanner/compare/v3.28.0...v3.28.1) (2020-07-02)


### Bug Fixes

* component paths ([9733969](https://github.com/dxheroes/dx-scanner/commit/97339697d334ea8a03d624deb610ba27929a3219))
* component repo url ([fdd9217](https://github.com/dxheroes/dx-scanner/commit/fdd9217c0d0086919e9a7c9375c806a03a314352))
* correct component paths ([1cd53f9](https://github.com/dxheroes/dx-scanner/commit/1cd53f959961e2720800b64af6a07187f8de786e))
* full repositoryPath in report including fixes for local path ([b54a885](https://github.com/dxheroes/dx-scanner/commit/b54a885f3b9d9ecceeb7f90080268349c7ef12a6))

# [3.28.0](https://github.com/dxheroes/dx-scanner/compare/v3.27.0...v3.28.0) (2020-07-02)


### Features

* add updated dependencies dto ([1d79530](https://github.com/dxheroes/dx-scanner/commit/1d795306e4341e482c0e77d70dd2baf4239013ba))
* add updated dependencies property ([dde517b](https://github.com/dxheroes/dx-scanner/commit/dde517b191af45dae71c9663e9d8de58b66ccb59))

# [3.27.0](https://github.com/dxheroes/dx-scanner/compare/v3.26.8...v3.27.0) (2020-06-30)


### Bug Fixes

* recursion when then flag is false ([0d04fe8](https://github.com/dxheroes/dx-scanner/commit/0d04fe88a3c644142cf66b5a894c1529904f0a00))


### Features

* do not require auth input ([75fba94](https://github.com/dxheroes/dx-scanner/commit/75fba948f2e22ac1f48f8a096ee45c641182b606))
* remove unused libs & lockfile maintenance ([41ff45c](https://github.com/dxheroes/dx-scanner/commit/41ff45c5b20c7cf95046027e084eeb1df505cee2))

## [3.26.8](https://github.com/dxheroes/dx-scanner/compare/v3.26.7...v3.26.8) (2020-06-29)


### Bug Fixes

* add nestjs to backend packages for JS/TS ([b6264e4](https://github.com/dxheroes/dx-scanner/commit/b6264e4f38ef21e7d445c7b14d9ca28e803c6651))

## [3.26.7](https://github.com/dxheroes/dx-scanner/compare/v3.26.6...v3.26.7) (2020-06-29)


### Bug Fixes

* relaxing conditions for .gitignore & fix tests ([1afdcbe](https://github.com/dxheroes/dx-scanner/commit/1afdcbed68383fbd4e3b288901b8a1edee43fe7d))

## [3.26.6](https://github.com/dxheroes/dx-scanner/compare/v3.26.5...v3.26.6) (2020-06-24)


### Bug Fixes

* use repository root path as a root path for FileInspector ([5763a18](https://github.com/dxheroes/dx-scanner/commit/5763a187a9f62ab0a730a46b88a388a0feb79c58))

## [3.26.5](https://github.com/dxheroes/dx-scanner/compare/v3.26.4...v3.26.5) (2020-06-23)


### Bug Fixes

* **deps:** update commitlint monorepo to v9 ([736dc6d](https://github.com/dxheroes/dx-scanner/commit/736dc6d8c7f48d9905b7ef8c7f42993b1e596e49))

## [3.26.4](https://github.com/dxheroes/dx-scanner/compare/v3.26.3...v3.26.4) (2020-06-23)


### Bug Fixes

* **enterprise-reporter:** do not add undefined auth header ([268a36f](https://github.com/dxheroes/dx-scanner/commit/268a36f1a54a34e77042b004acef0c2ba5d39334))

## [3.26.3](https://github.com/dxheroes/dx-scanner/compare/v3.26.2...v3.26.3) (2020-06-22)


### Bug Fixes

* move tsconfig require ([c5a7aa9](https://github.com/dxheroes/dx-scanner/commit/c5a7aa941f4343d0b12d113d00519bd676bd156f))
* rename tsconfig ([eafbc2b](https://github.com/dxheroes/dx-scanner/commit/eafbc2b336cc217faad9d3230a53887df5c40902))

## [3.26.2](https://github.com/dxheroes/dx-scanner/compare/v3.26.1...v3.26.2) (2020-06-19)


### Bug Fixes

* octokit types due to changes in library ([3bf1d6f](https://github.com/dxheroes/dx-scanner/commit/3bf1d6fc4df8f98d3a8d58c8fb6522cd10bfbaaf))
* **deps:** update dependency @octokit/plugin-rest-endpoint-methods to v4 ([d10bd32](https://github.com/dxheroes/dx-scanner/commit/d10bd32c6a49d2166eab74e553330cb07b1f48fa))
* **deps:** update dependency @octokit/plugin-rest-endpoint-methods to v4 ([6a3461f](https://github.com/dxheroes/dx-scanner/commit/6a3461fc550a5c2db6e90efdf9d508c8ed47ec3d))

## [3.26.1](https://github.com/dxheroes/dx-scanner/compare/v3.26.0...v3.26.1) (2020-06-19)


### Bug Fixes

* add missing security issue array ([8711b8b](https://github.com/dxheroes/dx-scanner/commit/8711b8b34025e62a8ef0b57ecf6ee69b25e46f73))

# [3.26.0](https://github.com/dxheroes/dx-scanner/compare/v3.25.0...v3.26.0) (2020-06-18)


### Features

* add exported types ([b1ec9b0](https://github.com/dxheroes/dx-scanner/commit/b1ec9b094e8a63c98b809400c606117ccb133b79))

# [3.25.0](https://github.com/dxheroes/dx-scanner/compare/v3.24.1...v3.25.0) (2020-06-17)


### Features

* **types:** export types from the index.ts ([f617c57](https://github.com/dxheroes/dx-scanner/commit/f617c573cd2185420d7925aeca5870f5c48e23b9))

## [3.24.1](https://github.com/dxheroes/dx-scanner/compare/v3.24.0...v3.24.1) (2020-06-03)


### Bug Fixes

* importing and using axios ([71a554a](https://github.com/dxheroes/dx-scanner/commit/71a554a74c878a6be2b2e7d83dfefee5b4050af0))
* lint issues ([231ef8b](https://github.com/dxheroes/dx-scanner/commit/231ef8b9f9cfba508d3212c78788b46ed2eb34c8))
* **deps:** update all non-major dependencies ([abdae57](https://github.com/dxheroes/dx-scanner/commit/abdae57d174b592ad1de46a8b8c0978ce92930ab))
* **deps:** update all non-major dependencies ([76dbc10](https://github.com/dxheroes/dx-scanner/commit/76dbc101fdbc45536946b7926736f810f3bcbdce))

# [3.24.0](https://github.com/dxheroes/dx-scanner/compare/v3.23.5...v3.24.0) (2020-05-26)


### Features

* allow user to pass apiToken in CLI or env variables ([c9a4417](https://github.com/dxheroes/dx-scanner/commit/c9a4417923db512b420017620da4538a9d0c21ef))

## [3.23.5](https://github.com/dxheroes/dx-scanner/compare/v3.23.4...v3.23.5) (2020-05-21)


### Bug Fixes

* OctokitTypes and lower the TS version because of breaking changes ([04d71b0](https://github.com/dxheroes/dx-scanner/commit/04d71b09ba092c33a5d779b2fcef29917ca3e6b1))
* **deps:** update all non-major dependencies ([db9816e](https://github.com/dxheroes/dx-scanner/commit/db9816e3a4539e4e0d23eef4a55d8ee2207e29fa))
* **docker:** fix entrypoint's "starts with" check ([176cdb4](https://github.com/dxheroes/dx-scanner/commit/176cdb4cfdc152d18280805eaff117d0b40cc26b))

## [3.23.4](https://github.com/dxheroes/dx-scanner/compare/v3.23.3...v3.23.4) (2020-05-18)


### Bug Fixes

* **deps:** update dependency npm-check-updates to v6 ([efae05f](https://github.com/dxheroes/dx-scanner/commit/efae05f6cc009a4102fd154ae0ecf28263d8e634))
* **deps:** update dependency tslib to v2 ([19b76ce](https://github.com/dxheroes/dx-scanner/commit/19b76ce127bafd218f09289c2514293c9287292f))
* data report ([9594d24](https://github.com/dxheroes/dx-scanner/commit/9594d2472da2a75f9bd7410f141fd727a1e1b309))

## [3.23.3](https://github.com/dxheroes/dx-scanner/compare/v3.23.2...v3.23.3) (2020-05-13)


### Bug Fixes

* define types for Octokit, fix type of qs.parse() ([bf2d3e6](https://github.com/dxheroes/dx-scanner/commit/bf2d3e61a521da40802fc062c12e0047db339368))
* **deps:** update all non-major dependencies ([3eec294](https://github.com/dxheroes/dx-scanner/commit/3eec2943f08da0eaa8db2369b7c704679bc9abff))

## [3.23.2](https://github.com/dxheroes/dx-scanner/compare/v3.23.1...v3.23.2) (2020-05-12)


### Bug Fixes

* **docker:** use ash (alpine's sh) syntax for "ends with" check ([97f8f7e](https://github.com/dxheroes/dx-scanner/commit/97f8f7e10d73bcb94858adbab7298ff1cfbc1c5f))

## [3.23.1](https://github.com/dxheroes/dx-scanner/compare/v3.23.0...v3.23.1) (2020-05-12)


### Bug Fixes

* **deps:** update dependency npm-check-updates to v5 ([b6b677d](https://github.com/dxheroes/dx-scanner/commit/b6b677d982e85717235ba52e6bb8743bf7ecf14e))

# [3.23.0](https://github.com/dxheroes/dx-scanner/compare/v3.22.2...v3.23.0) (2020-05-12)


### Bug Fixes

* **deps:** update dependency eslint to v7 ([c55858d](https://github.com/dxheroes/dx-scanner/commit/c55858da3d9e8467aae939b8b0df20ffdac9c6a4))


### Features

* add version and id to enterprise report ([38d9321](https://github.com/dxheroes/dx-scanner/commit/38d9321a2d40541281eac1cbd19886b4fa836aed))

## [3.22.2](https://github.com/dxheroes/dx-scanner/compare/v3.22.1...v3.22.2) (2020-05-11)


### Bug Fixes

* **deps:** update dependency uuid to v8 ([30e9647](https://github.com/dxheroes/dx-scanner/commit/30e9647f8ed828b7de1f2d97aea1755ca3ec40ad))

## [3.22.1](https://github.com/dxheroes/dx-scanner/compare/v3.22.0...v3.22.1) (2020-05-04)


### Bug Fixes

* **deps:** update dependency simple-git to v2 ([53b329c](https://github.com/dxheroes/dx-scanner/commit/53b329c7f16eb93989db11528cd52f03eef301a9))

# [3.22.0](https://github.com/dxheroes/dx-scanner/compare/v3.21.3...v3.22.0) (2020-05-03)


### Features

* **deps:** move types, ts-node, ts and prettier to devdeps ([f5c479d](https://github.com/dxheroes/dx-scanner/commit/f5c479d04bf38cf05a6427359454259332dd783b))
* **deps:** remove @types/yaml dependency ([1861ad5](https://github.com/dxheroes/dx-scanner/commit/1861ad58bcf07620feb7a2d8a927c1c24083a8ad))
* **Dockerfile:** use node dockerfile image ([35682fc](https://github.com/dxheroes/dx-scanner/commit/35682fcc383a51ec91610b3a1c8a0c574ec642f7))

## [3.21.3](https://github.com/dxheroes/dx-scanner/compare/v3.21.2...v3.21.3) (2020-04-30)


### Bug Fixes

* **reporter:** disable enterprise reporter logs for now ([1d51b91](https://github.com/dxheroes/dx-scanner/commit/1d51b91ce71a241c343df7fa86edfdae26dadd8d))

## [3.21.2](https://github.com/dxheroes/dx-scanner/compare/v3.21.1...v3.21.2) (2020-04-27)


### Bug Fixes

* **deps:** pin dependencies ([4f656e1](https://github.com/dxheroes/dx-scanner/commit/4f656e1473f675f875df60a107639269bfe1aa2e))

## [3.21.1](https://github.com/dxheroes/dx-scanner/compare/v3.21.0...v3.21.1) (2020-04-26)


### Bug Fixes

* **e-reporter:** use url for provider ([a42ab50](https://github.com/dxheroes/dx-scanner/commit/a42ab5067a8c268416c6e38ba0fa46197fd5540b))

# [3.21.0](https://github.com/dxheroes/dx-scanner/compare/v3.20.5...v3.21.0) (2020-04-26)


### Features

* **fixer:** add basic gitignore fixer test ([4cabda3](https://github.com/dxheroes/dx-scanner/commit/4cabda3261be4ab339a822406b6816dc9385c8ce))
* **fixer:** add gitignore fixer ([4d07446](https://github.com/dxheroes/dx-scanner/commit/4d07446a85772e413beecf59b59f8089fc9d428d))
* **fixer:** add missing gitignore typedef ([fc97111](https://github.com/dxheroes/dx-scanner/commit/fc97111bdde41b869c41648e50d04cb280854f24))
* **fixer:** add user input option to gitignore practice fixer ([f4d0b26](https://github.com/dxheroes/dx-scanner/commit/f4d0b26d29d866ef5ae90da7759ae85ba1b176d7))
* **fixer:** fix gitignore fixer test ([ba86907](https://github.com/dxheroes/dx-scanner/commit/ba86907f3b8dd32e98fe32a5d73767200d760a2e))
* **fixer:** More generic gitignore guesser ([2d1fac0](https://github.com/dxheroes/dx-scanner/commit/2d1fac04a0edf72f3e3d6ca3c557690c5ceb41d7))

## [3.20.5](https://github.com/dxheroes/dx-scanner/compare/v3.20.4...v3.20.5) (2020-04-26)


### Bug Fixes

* **dep:** add missing dependency ([9c169fd](https://github.com/dxheroes/dx-scanner/commit/9c169fd5a2b6bab15179d8e11e10a77e18378bab))
* **deps:** update all non-major dependencies ([c2d2730](https://github.com/dxheroes/dx-scanner/commit/c2d27300292e0d65926727fdb50034e84cf06c4d))
* **practice:** pass console to yeoman-environment ([6716e50](https://github.com/dxheroes/dx-scanner/commit/6716e50f863ced995b3f6bd7b64c1513b5da243e))

## [3.20.4](https://github.com/dxheroes/dx-scanner/compare/v3.20.3...v3.20.4) (2020-04-14)


### Bug Fixes

* **docker:** use 18.04 LTS and don't let Renovate update Dockerfile ([d52356c](https://github.com/dxheroes/dx-scanner/commit/d52356c2c8226a367692928195338d649d487b5c))

## [3.20.3](https://github.com/dxheroes/dx-scanner/compare/v3.20.2...v3.20.3) (2020-04-13)


### Bug Fixes

* **deps:** update dependency camelcase to v6 ([d1fac22](https://github.com/dxheroes/dx-scanner/commit/d1fac2243033060cf45bd3394eb95faf4401c988))

## [3.20.2](https://github.com/dxheroes/dx-scanner/compare/v3.20.1...v3.20.2) (2020-04-13)


### Bug Fixes

* **deps:** pin dependency tsconfig to 7.0.0 ([05f9a0a](https://github.com/dxheroes/dx-scanner/commit/05f9a0a0f59fac90c9bab5947590d9ca26931825))

## [3.20.1](https://github.com/dxheroes/dx-scanner/compare/v3.20.0...v3.20.1) (2020-04-12)


### Bug Fixes

* **deps:** update dependency prettier to v2 ([9115667](https://github.com/dxheroes/dx-scanner/commit/911566776d35834a59fd93bdcf599ba3ce477780))

# [3.20.0](https://github.com/dxheroes/dx-scanner/compare/v3.19.0...v3.20.0) (2020-04-09)


### Features

* **report:** omit URL credentials from component path ([3123972](https://github.com/dxheroes/dx-scanner/commit/31239727c734db35d119d4600d50be10ed6b5350))
* **reporter:** add test for no active practices percentage ([f6a66b6](https://github.com/dxheroes/dx-scanner/commit/f6a66b62ee9f838660582f258e1a2a1202ed2ca5))
* **reporter:** fix edge case where no practice is active ([8701dc6](https://github.com/dxheroes/dx-scanner/commit/8701dc63fad4119b82fb54f9a5bc30b30f07fdeb))

# [3.19.0](https://github.com/dxheroes/dx-scanner/compare/v3.18.1...v3.19.0) (2020-04-09)


### Features

* **fixer:** add fixer for TS gitignore practice ([9cd1c74](https://github.com/dxheroes/dx-scanner/commit/9cd1c74ba54fa0f65dad7e3bc5a36f968ac7b46c))
* **fixer:** add tests for TS gitignore fixer ([0cd8c66](https://github.com/dxheroes/dx-scanner/commit/0cd8c6665ef0c07e88d3d24a11cf109a6a97d6e9))

## [3.18.1](https://github.com/dxheroes/dx-scanner/compare/v3.18.0...v3.18.1) (2020-04-09)


### Bug Fixes

* **docker:** use LTS version of Ubuntu ([08bf4c2](https://github.com/dxheroes/dx-scanner/commit/08bf4c29e7e35dfa31270aa06771d9f362e28a44))

# [3.18.0](https://github.com/dxheroes/dx-scanner/compare/v3.17.3...v3.18.0) (2020-04-09)


### Features

* **files:** add appendFile to FileInspector ([dd798ce](https://github.com/dxheroes/dx-scanner/commit/dd798cef60d7147bdfe8fecbe25597efa2bab470))
* **fixer:** add fixer for JsGitignore practice ([d31588d](https://github.com/dxheroes/dx-scanner/commit/d31588dac79dd9cace4c871f145333158d5e6200))
* **fixer:** add tests for JsGitignore practice ([6491406](https://github.com/dxheroes/dx-scanner/commit/64914063ef40958542ba08d49d4fd04640b273ca))

## [3.17.3](https://github.com/dxheroes/dx-scanner/compare/v3.17.2...v3.17.3) (2020-04-09)


### Bug Fixes

* **report:** logo path for new web ([819d9be](https://github.com/dxheroes/dx-scanner/commit/819d9be67575d0161bc8d40a2bea69d19e4c4874))

## [3.17.2](https://github.com/dxheroes/dx-scanner/compare/v3.17.1...v3.17.2) (2020-04-07)


### Bug Fixes

* **deps:** update dependency @types/table to v5 ([2086d40](https://github.com/dxheroes/dx-scanner/commit/2086d40149cfc17b1c586f822d27282aea097324))

## [3.17.1](https://github.com/dxheroes/dx-scanner/compare/v3.17.0...v3.17.1) (2020-04-05)


### Bug Fixes

* move prettier dependency to root dependencies ([8c6012a](https://github.com/dxheroes/dx-scanner/commit/8c6012ab1c0504e85d3ebf7f9edb86fa45ddb567))

# [3.17.0](https://github.com/dxheroes/dx-scanner/compare/v3.16.0...v3.17.0) (2020-04-05)


### Features

* check for existing .properties ([c8edd3d](https://github.com/dxheroes/dx-scanner/commit/c8edd3d08183cbc2b0632873bcb0067dd4193aa1))

# [3.16.0](https://github.com/dxheroes/dx-scanner/compare/v3.15.0...v3.16.0) (2020-04-03)


### Bug Fixes

* **gitlab:** enhance Gitlab detection ([76d0c92](https://github.com/dxheroes/dx-scanner/commit/76d0c925b157c68452c91c22cb821d8e9de3ce20))


### Features

* **gitlab:** better GitLab detection with more API endpoints ([e9382e2](https://github.com/dxheroes/dx-scanner/commit/e9382e2add2fed8a0af27e7fc474887b9390c3e4))

# [3.15.0](https://github.com/dxheroes/dx-scanner/compare/v3.14.0...v3.15.0) (2020-04-03)


### Bug Fixes

* unfreezing lockfile ([ea7797c](https://github.com/dxheroes/dx-scanner/commit/ea7797c26f90ddcda629220711cd4ec2c74d2b29))
* **inspector:** rename fileInspector method ([676ea1e](https://github.com/dxheroes/dx-scanner/commit/676ea1e6ba91cd70ce66c1e50ac840b66471797a))


### Features

* **fixer:** add fixer for JavaScript.PrettierUsed ([3768c46](https://github.com/dxheroes/dx-scanner/commit/3768c4658b5b7b3bee7412ef8b676da0d6dcc173))
* **fixer:** add tests for prettier fixer ([ef49f75](https://github.com/dxheroes/dx-scanner/commit/ef49f75e09b0ba3e663e7fa4b3b802668468f760))
* **fixer:** change format script command ([07a06ea](https://github.com/dxheroes/dx-scanner/commit/07a06ea135219884fb400e598d3de85201b2b4fd))
* **utils:** add package install method ([0bbfd50](https://github.com/dxheroes/dx-scanner/commit/0bbfd5016bf1dd10ff5dfb2719b16a2f81486a36))

# [3.14.0](https://github.com/dxheroes/dx-scanner/compare/v3.13.2...v3.14.0) (2020-04-03)


### Features

* **errors:** add handler for errors ([fab557a](https://github.com/dxheroes/dx-scanner/commit/fab557a8b1477bf424a56558f2127dc5e0b86dcf))
* **github:** throw error if rate limit has been exceeded ([d5f5c72](https://github.com/dxheroes/dx-scanner/commit/d5f5c726fc3cde93ecc840433928da97e6d27de1))

## [3.13.2](https://github.com/dxheroes/dx-scanner/compare/v3.13.1...v3.13.2) (2020-04-03)


### Bug Fixes

* resolves error if it's gitlab but user is offline ([379a85e](https://github.com/dxheroes/dx-scanner/commit/379a85e715d237695f5b20f01fb9ceee22f4dc66))
* show right component path in report ([48c956a](https://github.com/dxheroes/dx-scanner/commit/48c956a9fe8621487233a9c16ab883b70ecddecd))

## [3.13.1](https://github.com/dxheroes/dx-scanner/compare/v3.13.0...v3.13.1) (2020-04-03)


### Bug Fixes

* **CIReporter:** invalid equality ([aa85c92](https://github.com/dxheroes/dx-scanner/commit/aa85c92e5e81ca1cc721c2b0c10fd9c3993006de))

# [3.13.0](https://github.com/dxheroes/dx-scanner/compare/v3.12.1...v3.13.0) (2020-04-02)


### Bug Fixes

* insert a blank line to avoid germans ([39db268](https://github.com/dxheroes/dx-scanner/commit/39db268e4113e558b22064dbadb2a85c1eba51b7))
* remove auto delete rule on merge ([821a896](https://github.com/dxheroes/dx-scanner/commit/821a896403d0fe97a057c2d366cac29a7d255808))


### Features

* **fixer:** add fixer for .editorconfig practice ([898e281](https://github.com/dxheroes/dx-scanner/commit/898e2813b47155da36b8bc3c8df056f611fd9b91))
* **fixer:** add test for editorconfig practice ([4d5853d](https://github.com/dxheroes/dx-scanner/commit/4d5853d29b3befd8b593e0b750b1e67ad6bcf396))
* **fixer:** add virtual fs to testing fixer context ([6fa4a30](https://github.com/dxheroes/dx-scanner/commit/6fa4a30f79c25ea349afa2417203b1a06b16a231))
* **fixer:** use absolute path for editorconfig fixer ([e42e70a](https://github.com/dxheroes/dx-scanner/commit/e42e70a0558e39fb5172e025b88526a765418843))
* **fixer:** use fileInspector for editorConfig fixer ([01ac08d](https://github.com/dxheroes/dx-scanner/commit/01ac08db3ee557274fdafb75b7bac7b2137f7985))
* **fixer:** use normalized path in fileinspector createfile ([c702599](https://github.com/dxheroes/dx-scanner/commit/c70259986a27b39c046fd705007fecf79c7ce517))

## [3.12.1](https://github.com/dxheroes/dx-scanner/compare/v3.12.0...v3.12.1) (2020-04-02)


### Bug Fixes

* **gitlab:** name of body parameter ([70ff955](https://github.com/dxheroes/dx-scanner/commit/70ff955e41312c137291b381305452c2edab819a))

# [3.12.0](https://github.com/dxheroes/dx-scanner/compare/v3.11.0...v3.12.0) (2020-03-31)


### Features

* **inspectors:** cache all functions in CollaborationInspector and IssueInspector ([ba43873](https://github.com/dxheroes/dx-scanner/commit/ba4387376d484b0b92fa5a37a0a89a2c66e696fc))

# [3.11.0](https://github.com/dxheroes/dx-scanner/compare/v3.10.0...v3.11.0) (2020-03-31)


### Bug Fixes

* consideration for .yml using case fallthrough ([7b8c660](https://github.com/dxheroes/dx-scanner/commit/7b8c66077079398d6f0f35200614cccb3f2704ca))
* java code styles pre-condition & added mock for loggers ([9b2de65](https://github.com/dxheroes/dx-scanner/commit/9b2de652edbc2e2d550728db5617dcf21715fba5))
* lockfile from merge conflict ([9bd940d](https://github.com/dxheroes/dx-scanner/commit/9bd940d3a0df1d36bc88c095fbe951dfd8b4d783))
* pkg relative versioning to absolute ([9b7e02b](https://github.com/dxheroes/dx-scanner/commit/9b7e02b735e4cd704d19d8f7575fee3eb01ac4ca))
* removing ambiguity from the test for file extension testing ([78c74a2](https://github.com/dxheroes/dx-scanner/commit/78c74a26d57ae27b8be758db918d1d8f47dd196c))


### Features

* adding a new java log4j config checker practice ([a4d045f](https://github.com/dxheroes/dx-scanner/commit/a4d045febe9563af23c3f5e8f5c1987121437e15))
* adding a properties pkg for parsing & re-typing ([6d440b8](https://github.com/dxheroes/dx-scanner/commit/6d440b84c0e39526c83b7ee67a392564e190e8d4))

# [3.10.0](https://github.com/dxheroes/dx-scanner/compare/v3.9.0...v3.10.0) (2020-03-31)


### Bug Fixes

* **deps:** update dependency @octokit/rest to v17 ([cb7cf1d](https://github.com/dxheroes/dx-scanner/commit/cb7cf1dbf22ff6db5d4c5d742f62671aa56163d4))
* **deps:** update dependency @octokit/rest to v17 ([1468824](https://github.com/dxheroes/dx-scanner/commit/1468824e05984945888a8e7054309fa353f31a98))
* **deps:** update dependency @octokit/rest to v17 ([b293915](https://github.com/dxheroes/dx-scanner/commit/b2939152e89a4490974f8f0f69965c5b39a9d0c4))
* **deps:** update dependency commander to v5 ([2f6a454](https://github.com/dxheroes/dx-scanner/commit/2f6a454cfa72e5f29f6f58663d6b09eaa19b255b))
* **deps:** update dependency commander to v5 ([017bf43](https://github.com/dxheroes/dx-scanner/commit/017bf439bc6db67aba4d5463323249b3e5117378))


### Features

* Added HTMLReporter ([8a136bf](https://github.com/dxheroes/dx-scanner/commit/8a136bfc36881be05c440595eb049bf8fa5eeea0))
* implement ReportCollectData with tests ([5c5c479](https://github.com/dxheroes/dx-scanner/commit/5c5c4794048ace9b8bb89875dc9d131162344d78))

# [3.9.0](https://github.com/dxheroes/dx-scanner/compare/v3.8.2...v3.9.0) (2020-03-28)


### Features

* **fixer:** add fixer for JS patch and minor deps ([4355d69](https://github.com/dxheroes/dx-scanner/commit/4355d69ae43563242ea770c37d45a22657260db5))
* **fixer:** add test for deps fixer ([9a73424](https://github.com/dxheroes/dx-scanner/commit/9a73424fe56d69470d93f79acc581d12ca3c2170))

## [3.8.2](https://github.com/dxheroes/dx-scanner/compare/v3.8.1...v3.8.2) (2020-03-28)


### Bug Fixes

* add return type ([fd23c74](https://github.com/dxheroes/dx-scanner/commit/fd23c7421f5592bb0b278e49faef9261301798aa))
* getting authorAssociation value ([503ef82](https://github.com/dxheroes/dx-scanner/commit/503ef825cd3c40302ac8c0256b33fbf38ddd2620))
* name of method in tests ([65bd9b3](https://github.com/dxheroes/dx-scanner/commit/65bd9b3cc172e3e45398581fffb2e95c7ee0b4c0))
* revert ncu version  github.com/tjunnone/npm-check-updates/pull/642 ([5498512](https://github.com/dxheroes/dx-scanner/commit/54985125269d9ea64103cf6b4a1fccb52d8eb270))
* update lockfile ([0b1ce53](https://github.com/dxheroes/dx-scanner/commit/0b1ce536e1ad027251c381be14648b41347dbf0d))
* update packages ([03880b6](https://github.com/dxheroes/dx-scanner/commit/03880b6eab69111c7d9b10c808b7c9f06a4bd4cf))
* update packages and remove ^ ([e616d1d](https://github.com/dxheroes/dx-scanner/commit/e616d1dff31021625cf187fc6cf81372def959f4))
* upgrade minor and patch version of packages ([db00696](https://github.com/dxheroes/dx-scanner/commit/db0069642a336097273faba105de68476fabe320))

## [3.8.1](https://github.com/dxheroes/dx-scanner/compare/v3.8.0...v3.8.1) (2020-03-27)


### Bug Fixes

* scanning local repos without git hotfix ([80cc492](https://github.com/dxheroes/dx-scanner/commit/80cc492fcc769faecd98f86683076c55bdc7ccc9))

# [3.8.0](https://github.com/dxheroes/dx-scanner/compare/v3.7.0...v3.8.0) (2020-03-26)


### Features

* added code style recognition using dependencies ([8e8d860](https://github.com/dxheroes/dx-scanner/commit/8e8d860d79b737137ba1013f6f14bb993ae89f0f))
* java code styles practice ([478f4e7](https://github.com/dxheroes/dx-scanner/commit/478f4e7452833a4b6b20071e079a464c435e86b1))

# [3.7.0](https://github.com/dxheroes/dx-scanner/compare/v3.6.2...v3.7.0) (2020-03-26)


### Features

* **fixer:** add fixer for lockfile practice ([0990c4a](https://github.com/dxheroes/dx-scanner/commit/0990c4a8ab9297ee7bb19541bf811531bb48e516))
* **fixer:** add fixer tests for lockfile practice ([5f78b71](https://github.com/dxheroes/dx-scanner/commit/5f78b71708018cbbead8d2ba7ff138b4e40c7f34))
* **fixer:** remove redundant checks in Lockfile practice ([c997a3b](https://github.com/dxheroes/dx-scanner/commit/c997a3b84c6f004f3af29ddbd139dc20b47d647c))

## [3.6.2](https://github.com/dxheroes/dx-scanner/compare/v3.6.1...v3.6.2) (2020-03-25)


### Bug Fixes

* set isOnline variable to true if the API request is ok ([f5c763a](https://github.com/dxheroes/dx-scanner/commit/f5c763a17f050cf4de04ca48d8c9f343f449734a))

## [3.6.1](https://github.com/dxheroes/dx-scanner/compare/v3.6.0...v3.6.1) (2020-03-25)


### Bug Fixes

* **gitlab:** update comment with PR ID ([fe5f357](https://github.com/dxheroes/dx-scanner/commit/fe5f357aef4cfc98ab3bdb73b10e2f57171eae15))

# [3.6.0](https://github.com/dxheroes/dx-scanner/compare/v3.5.3...v3.6.0) (2020-03-23)


### Bug Fixes

* **gitlab:** do not reject unauthorized certificates ([5338a29](https://github.com/dxheroes/dx-scanner/commit/5338a29fef4b82befb4d413a8f33e7339472b9be))
* getPagination() ([1c5d5c6](https://github.com/dxheroes/dx-scanner/commit/1c5d5c65136cb250fbc211b3c6e8216b19e3cee5))
* rename getContributorsStats() to listContributorsStats() ([6bc3346](https://github.com/dxheroes/dx-scanner/commit/6bc334638b84854c80d9d0fe8cf29dbc602c095c))


### Features

* implement parseGitHubHeaderLink() ([7159da5](https://github.com/dxheroes/dx-scanner/commit/7159da5d4878683ad6b4a480568ed09097c63174))
* implement parseLinkHeader() ([e08a26f](https://github.com/dxheroes/dx-scanner/commit/e08a26fa0bc02905dd43ee2de5eb9cd79030803c))
* save also headers, not only data ([add8f4b](https://github.com/dxheroes/dx-scanner/commit/add8f4bc0ae26f2ce46b3783dc6b41b10f0113bd))
* wip - parseLinkHeader() ([504b628](https://github.com/dxheroes/dx-scanner/commit/504b62877b69e77d562839215fbfc80769a56acc))

## [3.5.3](https://github.com/dxheroes/dx-scanner/compare/v3.5.2...v3.5.3) (2020-03-23)


### Bug Fixes

* **deps:** pin dependency yeoman-gen-run to 1.2.3 ([b7942cf](https://github.com/dxheroes/dx-scanner/commit/b7942cf3fdea7666d0fccccaffb1764b7ee71dec))

## [3.5.2](https://github.com/dxheroes/dx-scanner/compare/v3.5.1...v3.5.2) (2020-03-22)


### Bug Fixes

* **cireporter:** post comment to PR as a body key in data ([797a27b](https://github.com/dxheroes/dx-scanner/commit/797a27b6dcc2399637027756920f23d89b1ab8a6))

## [3.5.1](https://github.com/dxheroes/dx-scanner/compare/v3.5.0...v3.5.1) (2020-03-22)


### Bug Fixes

* **cireporter:** use external ID of PR intstead of internal in GitLab ([3e27383](https://github.com/dxheroes/dx-scanner/commit/3e273830383f44f759a3dc5f463ab65af509e880))

# [3.5.0](https://github.com/dxheroes/dx-scanner/compare/v3.4.0...v3.5.0) (2020-03-22)


### Bug Fixes

* add deleted comment ([df4d4fc](https://github.com/dxheroes/dx-scanner/commit/df4d4fc7a4e6fab325a4744423ea1921e303070d))
* add suggestion text to correctCommitMessagesPractice ([9a96271](https://github.com/dxheroes/dx-scanner/commit/9a96271c0aa411dbe19815958c8ea158b5811e11))
* bind ScanningStrategyDetector and services in testContainer ([ebab4df](https://github.com/dxheroes/dx-scanner/commit/ebab4df2bf6c3e847133bfd890900dbc15cf0be9))
* refactor the code ([b8bb465](https://github.com/dxheroes/dx-scanner/commit/b8bb4654c35fee0667692c33902dd1dc81c7d31c))
* remove comments ([b2f7307](https://github.com/dxheroes/dx-scanner/commit/b2f73076c97ee14e08f6430a7278df26bbdc8675))
* use scanningStatrategy.remoteUrl instead of argumentsProvider.uri ([06440c2](https://github.com/dxheroes/dx-scanner/commit/06440c2e3e86869237bfb5192b3a43c818e7ea5d))


### Features

* implement discovery Container, fix issue [#280](https://github.com/dxheroes/dx-scanner/issues/280) ([b619fcd](https://github.com/dxheroes/dx-scanner/commit/b619fcdfe88b89e2a3ff3de303282486fe972821))
* wip - implement discoveryContainer; repositoryConfig ([a7d191e](https://github.com/dxheroes/dx-scanner/commit/a7d191ecba32e6a3c9e47ca97f44677ce323173d))
* wip implement DiscoverContext ([49be8b8](https://github.com/dxheroes/dx-scanner/commit/49be8b8ef755f5d52ca6710658cc7fdbea0b8a57))

# [3.4.0](https://github.com/dxheroes/dx-scanner/compare/v3.3.0...v3.4.0) (2020-03-21)


### Bug Fixes

* undefined error on non-existing versions ([6ab4535](https://github.com/dxheroes/dx-scanner/commit/6ab4535d0c105feae983ef26201856e733fc092d))
* using error factory instead in rethrowing ([1c76496](https://github.com/dxheroes/dx-scanner/commit/1c76496f58c70d647ff8f03595b40e15e765c865))
* **semver-check:** add semver checker tests ([4ada25f](https://github.com/dxheroes/dx-scanner/commit/4ada25f1d4daf15ca3cb4fa05a3f0135120ca5e6))
* **semver-check:** return only updates of the required semver level ([7456f2a](https://github.com/dxheroes/dx-scanner/commit/7456f2a456aa52584b0aab512670d31bc93ce7bf))
* **semver-check:** update Java.DependenciesVersionMinorPatchLevel test so that it does not increase major level ([be4fffd](https://github.com/dxheroes/dx-scanner/commit/be4fffd6a1b8bb26e4f089e60b8eb34c8da8bf87))


### Features

* practice to check for specified versions ([1c9ecef](https://github.com/dxheroes/dx-scanner/commit/1c9ecef41b7925e12a9013b1fba5b5007c9701af))

# [3.3.0](https://github.com/dxheroes/dx-scanner/compare/v3.2.0...v3.3.0) (2020-03-19)


### Features

* **fixer:** add CI version of license fixer ([1723d7d](https://github.com/dxheroes/dx-scanner/commit/1723d7dcd23bea138a2dee0296f1e6a59b79717b))
* **fixer:** add more data to fixer context ([c4ab2ae](https://github.com/dxheroes/dx-scanner/commit/c4ab2ae4db0f292ed3f2f0c9881a02bc40fa545b))

# [3.2.0](https://github.com/dxheroes/dx-scanner/compare/v3.1.2...v3.2.0) (2020-03-18)


### Features

* **fixer:** add info about not-fixed practices to fixer reporter ([08d3db9](https://github.com/dxheroes/dx-scanner/commit/08d3db94452eb78d239041cd630405ca9f76d206))

## [3.1.2](https://github.com/dxheroes/dx-scanner/compare/v3.1.1...v3.1.2) (2020-03-18)


### Bug Fixes

* **cireporter:** use https in host as default ([0ef888c](https://github.com/dxheroes/dx-scanner/commit/0ef888c5ca5853b7109e43a2389d816a7a3f5b91))

## [3.1.1](https://github.com/dxheroes/dx-scanner/compare/v3.1.0...v3.1.1) (2020-03-18)


### Bug Fixes

* **cireporter:** use full URL including protocol from gitlab ENV vars ([05c0991](https://github.com/dxheroes/dx-scanner/commit/05c09913bbc77978953374c26fb018073fa72b26))

# [3.1.0](https://github.com/dxheroes/dx-scanner/compare/v3.0.5...v3.1.0) (2020-03-17)


### Features

* **gitlab:** support CI reporter ([65a2ca2](https://github.com/dxheroes/dx-scanner/commit/65a2ca2e12a2e45bc24cc950d2d3c7f0ce0b2512))

## [3.0.5](https://github.com/dxheroes/dx-scanner/compare/v3.0.4...v3.0.5) (2020-03-17)


### Bug Fixes

* running ci mode w/ invalid credentials ([c72feb1](https://github.com/dxheroes/dx-scanner/commit/c72feb1f8a8cf1ceafa52145e689ad82509be626))

## [3.0.4](https://github.com/dxheroes/dx-scanner/compare/v3.0.3...v3.0.4) (2020-03-17)


### Bug Fixes

* **gitlab:** handle 404 error while scanning locally ([9479044](https://github.com/dxheroes/dx-scanner/commit/9479044ff751993d71745242d6843f8afaf93b25))

## [3.0.3](https://github.com/dxheroes/dx-scanner/compare/v3.0.2...v3.0.3) (2020-03-17)


### Bug Fixes

* **docker:** exec all sh&bash commands with all args ([30f9d05](https://github.com/dxheroes/dx-scanner/commit/30f9d05293c54d27fe61e15fab74c28eb882d7af))

## [3.0.2](https://github.com/dxheroes/dx-scanner/compare/v3.0.1...v3.0.2) (2020-03-17)


### Bug Fixes

* **docker:** remove bash/shell regex ([9ca0796](https://github.com/dxheroes/dx-scanner/commit/9ca0796aa3c5ee8179bb5eb59a4da2f80b3689e6))

## [3.0.1](https://github.com/dxheroes/dx-scanner/compare/v3.0.0...v3.0.1) (2020-03-17)


### Bug Fixes

* upgrade libs ([f9011dd](https://github.com/dxheroes/dx-scanner/commit/f9011dd57160aecb3fc144f8ede75010622dce31))


### Reverts

* **ci:** disable cache ([216b451](https://github.com/dxheroes/dx-scanner/commit/216b45189a5fc2b6a878476dbec1acb5479706aa))

# [3.0.0](https://github.com/dxheroes/dx-scanner/compare/v2.10.1...v3.0.0) (2020-03-16)


### Bug Fixes

* add pagination to listIssueComments() ([b19028a](https://github.com/dxheroes/dx-scanner/commit/b19028a97c163ef65a16a4cb3ca084f28fdfa044))
* add param paramsSerializer() to axios for getting right path ([badf5d9](https://github.com/dxheroes/dx-scanner/commit/badf5d95e151f399cad9da8275d01560a6368ad5))
* add return type in getPullsDiffStat ([601cb35](https://github.com/dxheroes/dx-scanner/commit/601cb35288a26cd02558fef114e3da5258b93439))
* add ServicePagination as return type of getPagination() ([56d0ff1](https://github.com/dxheroes/dx-scanner/commit/56d0ff19edb37177ce0a42320ab117c55e52d2d1))
* add type  to practicesAfterFix and remove unnecessary todo ([10bd49e](https://github.com/dxheroes/dx-scanner/commit/10bd49efa7510ef8bd29c00279601a7d275caa14))
* allow to change page and perPage in tests ([0efe4fa](https://github.com/dxheroes/dx-scanner/commit/0efe4fab4996c9774677947d57d1354318158138))
* choose smaller repositories as examples ([ddac9b8](https://github.com/dxheroes/dx-scanner/commit/ddac9b8943f200dd1eafd3358f4d122a63c0f55d))
* clone gitlab private repo properly; try to call gitlab url ([1733524](https://github.com/dxheroes/dx-scanner/commit/1733524dc07806024876d090b4f05e154f43fbfe))
* debug getRepo() returning response ([835f902](https://github.com/dxheroes/dx-scanner/commit/835f9029022abbf230bdfef6e505325896f97f06))
* decrease default timeout and increase it for getting group info ([f188bc6](https://github.com/dxheroes/dx-scanner/commit/f188bc64d5f16a52833c80b4727b16b937827469))
* don't save undefined if there are no pagination params ([c2bca1c](https://github.com/dxheroes/dx-scanner/commit/c2bca1cc613cfa5830d71fd8397ff782852f6a87))
* don't save undefined to params ([7399ad4](https://github.com/dxheroes/dx-scanner/commit/7399ad4a0baaa9e128137cbd02de6a16b0baa841))
* encode groupName so it's working if it's subgroup ([58c5fbf](https://github.com/dxheroes/dx-scanner/commit/58c5fbface064190143e270afffb850fab10a30e))
* endpoint to get group information ([aa0c36c](https://github.com/dxheroes/dx-scanner/commit/aa0c36cec12bf7b115c395e9f1a36014b6ee8c1f))
* fix getting data after refactoring getRepo() ([04f854e](https://github.com/dxheroes/dx-scanner/commit/04f854ed6bb79d0aaced2126fc30caadd1724847))
* getting host ([9aecbcd](https://github.com/dxheroes/dx-scanner/commit/9aecbcd6ebf88b7e89df2b486933771feab11515))
* interfaces and names of mocks ([00ee6a0](https://github.com/dxheroes/dx-scanner/commit/00ee6a0de7518c523d7acfb9c0bc5a15f2be07b9))
* move GitLabCustom and rename it to GitLabClient ([a3d699e](https://github.com/dxheroes/dx-scanner/commit/a3d699e1ef2d1591de4127e5713e46dcfafb398e))
* move initializing GitLab Client; allow to set timeout ([7aa0f41](https://github.com/dxheroes/dx-scanner/commit/7aa0f411d46e79d3c8bbeb1e7571db89c1f495a0))
* name = 'opened' instead 'active' ([c5d0abe](https://github.com/dxheroes/dx-scanner/commit/c5d0abebdb833420066e75405c414e924335e8ca))
* pagination param ([2aa0a66](https://github.com/dxheroes/dx-scanner/commit/2aa0a66e4326bedce059e07541d04685ad4ebb08))
* params of listPullCommits() and type of param in getPagination() ([6c99b25](https://github.com/dxheroes/dx-scanner/commit/6c99b2521373457e6d022310d64f89c82d112e99))
* protect creating Axios Instance ([2160b29](https://github.com/dxheroes/dx-scanner/commit/2160b297c1e94d7026739cc26ca7f256a7ab65c3))
* remove duplicate file ([73798e8](https://github.com/dxheroes/dx-scanner/commit/73798e8da0422eb7b5e9a7bfba423708d4ef0df3))
* remove unneccessary params ([a2abac0](https://github.com/dxheroes/dx-scanner/commit/a2abac0999d1c2792c753fed97e36de44ecc2a34))
* remove unnecessary comments ([28af4f6](https://github.com/dxheroes/dx-scanner/commit/28af4f681a49bf5e0c09a13391a9cb6954014116))
* remove unnecessary condition and fix path for host ([95fac97](https://github.com/dxheroes/dx-scanner/commit/95fac976fdd7cd69b06cce6edd71e61ac016161c))
* remove unnecessary timeouts ([0eef498](https://github.com/dxheroes/dx-scanner/commit/0eef498c7ed4199b23a5950111dcb155eac24585))
* remove unused package ([e48df0d](https://github.com/dxheroes/dx-scanner/commit/e48df0d0141bde8c6363192215b6abbb27c53807))
* remove unused param ([3d6d106](https://github.com/dxheroes/dx-scanner/commit/3d6d106829b23849609b092436521c22c3f29eb4))
* remove unused parameter ([3ab958c](https://github.com/dxheroes/dx-scanner/commit/3ab958cf4560b7f060db48846a2094d53806c161))
* remove unused sha from methods ([942e8e5](https://github.com/dxheroes/dx-scanner/commit/942e8e510534f028ef75c2205f7219adc3a2f284))
* rename MergeCommit to Commit and type responses for Commits ([8aa4b95](https://github.com/dxheroes/dx-scanner/commit/8aa4b95c0d9c96f64c3bf03ac8e2c2e297e0201e))
* rename methods ([b702451](https://github.com/dxheroes/dx-scanner/commit/b702451434473705205497cbbceb3d6a8e72eaab))
* return just one Merge Commit ([272e432](https://github.com/dxheroes/dx-scanner/commit/272e432778ab1732081e326e845fbe189aca5e0d))
* run fix() only if fix is true in argumentsProvider ([baf2475](https://github.com/dxheroes/dx-scanner/commit/baf2475cc6e964b2ada1749357e7ce088e47ca22))
* set bash and exec commands instead of raw commands ([3ba2d64](https://github.com/dxheroes/dx-scanner/commit/3ba2d64c9e09b77f67da6e2dbc19e324b92dc6b8))
* show full url including subdomains ([e9507f1](https://github.com/dxheroes/dx-scanner/commit/e9507f14c1422483bb7eff9957e3b47e9dc6bea2))
* split getting user and group add interfaces ([29dcad8](https://github.com/dxheroes/dx-scanner/commit/29dcad838b0a7191ad48c9fa27f3ab23636aa009))
* test for getCommit() ([eb5ccff](https://github.com/dxheroes/dx-scanner/commit/eb5ccffd79dbbddb344624f685a97eace6c46e21))
* typos and remove unnecessary code ([75be10b](https://github.com/dxheroes/dx-scanner/commit/75be10b404d52d74b13343477067f577de8bb419))
* update yeoman-environment ([5acfb8b](https://github.com/dxheroes/dx-scanner/commit/5acfb8b70ff1653578629f3337200719b7206f2a))
* **deps:** pin dependencies ([2a6d43a](https://github.com/dxheroes/dx-scanner/commit/2a6d43a620f63fe90c51dd9f6d2b513cc00b8328))
* unwrap responses from bitbucket client for debugging ([2af956c](https://github.com/dxheroes/dx-scanner/commit/2af956c35c4d97597f089f5adfa8fcd0c7585829))
* unwrap responses from client for debugging ([39b4841](https://github.com/dxheroes/dx-scanner/commit/39b4841fa0e181eb9215868b0d04f5c7e4d1762c))
* use host with protocol to have absolute path; use own client ([ef0d316](https://github.com/dxheroes/dx-scanner/commit/ef0d3168f3ce20e57e6925ab0ce6f5b5c21e77a4))
* use specific method for getting owner and repo name ([0bdbd30](https://github.com/dxheroes/dx-scanner/commit/0bdbd3022d4e30feb153fc31d3c8d4da35f15f00))
* wrong named method and add pagination options ([fcfbdde](https://github.com/dxheroes/dx-scanner/commit/fcfbdde9c5817271f440f6f5eeb2e62f2a50750b))
* y add bitbucket ([8d731a9](https://github.com/dxheroes/dx-scanner/commit/8d731a96ec8f3b9ae77afa6d985d8dce0ab3a1bb))


### Features

* **cli:** rename ENV variable to be prefixed with DXSCANNER ([728ffbe](https://github.com/dxheroes/dx-scanner/commit/728ffbec4e1ba18e81cc0504ed72dd2a27c5131f))
* **Gitlab:** determine gitlab service on version endpoint ([bb6fb7c](https://github.com/dxheroes/dx-scanner/commit/bb6fb7c2063b6414f33f458c4c45b75db26374ec))
* **practice:** automatic fixer for license practice ([ea47417](https://github.com/dxheroes/dx-scanner/commit/ea47417485721d4c6e7f9eadd577c0c78834fae0))
* add case when it is gitlab ([5126888](https://github.com/dxheroes/dx-scanner/commit/5126888f2717a2cabc5202875b97f51ea7df7350))
* add gitlab in models ([8085cbd](https://github.com/dxheroes/dx-scanner/commit/8085cbdc31d845f74f4076a5a334815a7d8999cb))
* add GitLabPullRequestState enum ([64fc133](https://github.com/dxheroes/dx-scanner/commit/64fc1339c7b8a78ba7fde2712b7162bfbf7b67bb))
* add interface CustomAxiosResponse ([7105abb](https://github.com/dxheroes/dx-scanner/commit/7105abb24c85a0624f8f5e738a6a517a6eeba090))
* add interface for GitLabIssueState ([e01776b](https://github.com/dxheroes/dx-scanner/commit/e01776b6f32dcb26512f97fcc1db8c2092e2cdc9))
* add interfaces and type responses ([4b795ec](https://github.com/dxheroes/dx-scanner/commit/4b795ecd9b7a8f5e8fa3070c19e8980c76215053))
* add interfaces and type responses ([74ff964](https://github.com/dxheroes/dx-scanner/commit/74ff9640610ce1dd798c2cda7aea8f306ce029de))
* add ListFilterOptions interface ([1a0301e](https://github.com/dxheroes/dx-scanner/commit/1a0301eec60087cd22edee2b06479f2c2da4a528))
* add TODOs ([6d87b91](https://github.com/dxheroes/dx-scanner/commit/6d87b910af7d61a9be3e39e665c86e4b749b9f40))
* bind gitlab when needed ([0120bad](https://github.com/dxheroes/dx-scanner/commit/0120bad165d60f976c77aa8b8e3b40d6fda9aa92))
* bundle classes to GitlabClient ([4dd21ec](https://github.com/dxheroes/dx-scanner/commit/4dd21ec579726a5f16b3acf3d1eab9cc0f7691ed))
* determine access type for gitlab ([49b8903](https://github.com/dxheroes/dx-scanner/commit/49b89035e259958e69e629bcabd547ddba334e68))
* get gitlab serviceType if it's gitlab ([b6ebd4f](https://github.com/dxheroes/dx-scanner/commit/b6ebd4fa9bdbbdd005502d75666818242f38066a))
* implement all function in GitLab Service ([2a63c5b](https://github.com/dxheroes/dx-scanner/commit/2a63c5b9ef0d11ec282f53bc9f743d5be8810d49))
* implement comments(), createComment(), updateComment() ([04515dc](https://github.com/dxheroes/dx-scanner/commit/04515dc818926f399a581d8abfff728a1523e9d4))
* implement commits() to get all commits of specific Merge Request ([8d5d028](https://github.com/dxheroes/dx-scanner/commit/8d5d028a51afc88f99adb1a0ecc2728931abcaea))
* implement get() - mergeRequests ([3cbe59e](https://github.com/dxheroes/dx-scanner/commit/3cbe59eabb332d9b72dccac254201e9bb1669fe2))
* implement get() for Projects ([2093722](https://github.com/dxheroes/dx-scanner/commit/2093722b98c2c180b52e97edabc53fcbfdb87ec9))
* implement get(), private getUser(), private getGroup() for Users ([26ffdfe](https://github.com/dxheroes/dx-scanner/commit/26ffdfefa4a7c88c2b4801251c1a2795cc101233))
* implement getGitLabIssueState() ([e96e51a](https://github.com/dxheroes/dx-scanner/commit/e96e51a0b392a6592c7fa61e4701ff647a3e0afe))
* implement getGitLabPRState() ([e4e3bdb](https://github.com/dxheroes/dx-scanner/commit/e4e3bdbbb969c65cbd6eb502d970d8ca66c2a1e0))
* implement getPagination(); return customized interface of PRs ([8122415](https://github.com/dxheroes/dx-scanner/commit/8122415d32256e345a97072cd788c6604e3f9a31))
* implement getPullRequest() ([aa5b0fa](https://github.com/dxheroes/dx-scanner/commit/aa5b0fa3a5b429e73112c3e8b451217aee0b5936))
* implement getRepo() in GitlabService ([0553a5f](https://github.com/dxheroes/dx-scanner/commit/0553a5f55a68038c999db995ead971b964cec4be))
* implement GitLabClient ([332e537](https://github.com/dxheroes/dx-scanner/commit/332e537be516fda9cd7334abb7cc89e512aa201b))
* implement isGitLabPath() ([17e9bc4](https://github.com/dxheroes/dx-scanner/commit/17e9bc4be29a9d46263c1fc31782c8d7939dfb78))
* implement list(), get() for Commits ([a77d847](https://github.com/dxheroes/dx-scanner/commit/a77d847008acdcebb5e9ff0ef42d0b745772359a))
* implement list(), get(), comments() for Issues ([9acfd30](https://github.com/dxheroes/dx-scanner/commit/9acfd30ca811840191b8fcd5d03a54747b1f8df6))
* implement listPullCommits() ([43e3e34](https://github.com/dxheroes/dx-scanner/commit/43e3e34891537677c4dfa055f4ef6fe1e35f4481))
* implement listPullrequests() ([8aef68e](https://github.com/dxheroes/dx-scanner/commit/8aef68eac6995b8f37bac12a70770c6e0ba2d4ae))
* implement mapper and bundler ([7fba9ed](https://github.com/dxheroes/dx-scanner/commit/7fba9eded78bf2efa9e2fe7c9ec8549c3a670e7f))
* implement MergeRequests class with list() ([8551811](https://github.com/dxheroes/dx-scanner/commit/855181109e3c87bb379a1f1dac1d3339041a92ea))
* implement parseGitlabUrl() ([06cd9e3](https://github.com/dxheroes/dx-scanner/commit/06cd9e3db0325098dab4fd1af67865292c4cf743))
* implement parseResponse() for parsing resp from Gitlab API call ([83c2341](https://github.com/dxheroes/dx-scanner/commit/83c2341c07ab12f726addd1a25a9a4267463f20f))
* prompt user to insert token if it's necessary ([8a5da7a](https://github.com/dxheroes/dx-scanner/commit/8a5da7a52a0309328beaa3ce243db19594bdd31b))
* y add gitlab client ([d167f97](https://github.com/dxheroes/dx-scanner/commit/d167f972372bc0e6d99fa46ad7713a3d0fd31f31))


### BREAKING CHANGES

* **cli:** rename ENV variable DX_GIT_SERVICE_TOKEN to DXSCANNER_GIT_SERVICE_TOKEN

## [2.10.1](https://github.com/dxheroes/dx-scanner/compare/v2.10.0...v2.10.1) (2020-03-05)


### Bug Fixes

* **errors:** use specific imports in ErrorFactory ([a52eaec](https://github.com/dxheroes/dx-scanner/commit/a52eaecf8316a46bdf591e11b838bb4fe58686d2))

# [2.10.0](https://github.com/dxheroes/dx-scanner/compare/v2.9.0...v2.10.0) (2020-03-05)


### Bug Fixes

* **practice:** SecurityVulnerabilitiesPractice won't crash on npm audit error ([39b1523](https://github.com/dxheroes/dx-scanner/commit/39b1523096463c928d59a7d1bc1074af69f809a0))


### Features

* **fixer:** add custom reporter for fixer run ([4fb9868](https://github.com/dxheroes/dx-scanner/commit/4fb98682e5c2613b24e07e7e2c0ad4eca7e9692d))
* **fixer:** add info about fixable practices to CI reporter ([cf361bc](https://github.com/dxheroes/dx-scanner/commit/cf361bc208d0f9a0482e1e46f1eb4c00e48ffa0f))
* **fixer:** add info about fixable practices to CLI reporter ([d0e7c1a](https://github.com/dxheroes/dx-scanner/commit/d0e7c1ad8ffc8e7ade9e891b363fbff48ab1c058))
* **tests:** add SecurityVulnerabilites test ([033a339](https://github.com/dxheroes/dx-scanner/commit/033a3399e5ebba3cef7dc87a982fbdce537e71c8))

# [2.9.0](https://github.com/dxheroes/dx-scanner/compare/v2.8.1...v2.9.0) (2020-03-04)


### Bug Fixes

* german fix ([67630d2](https://github.com/dxheroes/dx-scanner/commit/67630d2d641a732f71a6b78847378b920699395d))
* relocated interfaces of individual practices in the current architecture ([ed48f7b](https://github.com/dxheroes/dx-scanner/commit/ed48f7b5cb8d84d487a508a848e9ac28a3c5424f))
* removed console.logs & provided tests for the changes ([e44d952](https://github.com/dxheroes/dx-scanner/commit/e44d9527e4c68b13e213b299b1cbc8150fb37422))
* removed the override from yml config ([0edc1c0](https://github.com/dxheroes/dx-scanner/commit/0edc1c056743b952f6f5e12881eda01c990e6faa))


### Features

* dynamic max threshold customization ([e9714f1](https://github.com/dxheroes/dx-scanner/commit/e9714f1458965edab38f631897a5e3865ddc8738))
* dynamic max threshold customization ([#256](https://github.com/dxheroes/dx-scanner/issues/256)) ([7a6cb01](https://github.com/dxheroes/dx-scanner/commit/7a6cb018316658aeba8daf437650539b1f122625))

## [2.8.1](https://github.com/dxheroes/dx-scanner/compare/v2.8.0...v2.8.1) (2020-03-03)


### Bug Fixes

* add back missing octokit lib ([2835480](https://github.com/dxheroes/dx-scanner/commit/2835480466962f5f1a91cde0eca37516fe8aa811))
* add back missing octokit lib ([#257](https://github.com/dxheroes/dx-scanner/issues/257)) ([5731aae](https://github.com/dxheroes/dx-scanner/commit/5731aae6f14578f285c0ba1b09e3f589b892df6a))
* revert Octokit to version to ^16.0.0 ([88f2cca](https://github.com/dxheroes/dx-scanner/commit/88f2cca3d358fcbd649d40373e87f56d47adff05))

# [2.8.0](https://github.com/dxheroes/dx-scanner/compare/v2.7.0...v2.8.0) (2020-03-03)


### Bug Fixes

* registering java linter practice to index ([33b40ec](https://github.com/dxheroes/dx-scanner/commit/33b40ec553d3b51354aa195ad255169fb0ef89ef))
* test descriptions ([3500597](https://github.com/dxheroes/dx-scanner/commit/350059749eaf6c6542d20e52ff3d2f787b37faea))


### Features

* java linter practice for maven & gradle scripts ([cd1efaf](https://github.com/dxheroes/dx-scanner/commit/cd1efafd55294784eb7af5721497fbb47eccb361))

# [2.7.0](https://github.com/dxheroes/dx-scanner/compare/v2.6.0...v2.7.0) (2020-03-02)


### Bug Fixes

* merged master into feat branch & solved merge conflicts ([3b720bb](https://github.com/dxheroes/dx-scanner/commit/3b720bbc8a3117cf6d75aacbb986ef07df242f30))
* small typos in Java tests ([8b0f87e](https://github.com/dxheroes/dx-scanner/commit/8b0f87ee91dff6ad444682788f85bec1b835096d))
* small typos in test descriptions ([d3ccafe](https://github.com/dxheroes/dx-scanner/commit/d3ccafe08a351d19d80c15db8bad0957878b41ad))


### Features

* python package inspector ([388eef3](https://github.com/dxheroes/dx-scanner/commit/388eef306ad78153ee9f7ea6ae6c96eaa6d258cf))
* test for python package inspector ([02da5fc](https://github.com/dxheroes/dx-scanner/commit/02da5fcb5e075729619b0367e7efaee1c00c62c6))
* **python:** init python component detector and base for inspector ([ec6a7a9](https://github.com/dxheroes/dx-scanner/commit/ec6a7a90a0d3e47979f722b36365db78ff01f631))

# [2.6.0](https://github.com/dxheroes/dx-scanner/compare/v2.5.0...v2.6.0) (2020-02-27)


### Bug Fixes

* adding new tests for offline mode ([0ed69e9](https://github.com/dxheroes/dx-scanner/commit/0ed69e900befc59d93002a6bdd07cce1aeb8edbd))
* considering offline mode of dxs ([aaef314](https://github.com/dxheroes/dx-scanner/commit/aaef3145c2071c45ba579ab0a7ac33c12c1bf070))
* context test for isOnline ([2924ee7](https://github.com/dxheroes/dx-scanner/commit/2924ee79e76f1638e673877703bc5af0bf34b6e5))
* merged master to feat branch & solved merge conflicts ([9f084be](https://github.com/dxheroes/dx-scanner/commit/9f084be7c02a9887044ab636862bcf4bf9de3c76))
* re-enabling net connect after tests ([c8d1d04](https://github.com/dxheroes/dx-scanner/commit/c8d1d0408780f5b58ef3777e5e33109632d56a6a))
* tests & isOnline logic to pass all tests ([a8f8783](https://github.com/dxheroes/dx-scanner/commit/a8f8783c4466707d53190fff0a5987d252fa4c25))


### Features

* **reporters:** show error message from failed practice in CLI log ([e0d46dc](https://github.com/dxheroes/dx-scanner/commit/e0d46dc5ea9acaf34c4ac6f4a301f1d0a5d659d7))

# [2.5.0](https://github.com/dxheroes/dx-scanner/compare/v2.4.0...v2.5.0) (2020-02-27)


### Bug Fixes

* **tests:** restore nock after each test suite using nock ([2ce7313](https://github.com/dxheroes/dx-scanner/commit/2ce731314707678ce1d83ae06cf63d19401d9461))


### Features

* **fixer:** add fix config tests ([26b81dc](https://github.com/dxheroes/dx-scanner/commit/26b81dcd8b0a33b857d5f1e106e605eaae03802d))
* **fixer:** add fixPattern tests ([b85154f](https://github.com/dxheroes/dx-scanner/commit/b85154fda73a3ffa4fa9c08a7c1f74fdcc63312d))
* **fixer:** add jest-mock-extended dependency ([bf20ae2](https://github.com/dxheroes/dx-scanner/commit/bf20ae237c03be587d9bd5668b3fff8efc8a491a))
* **fixer:** clean nock before scanner tests ([f172f81](https://github.com/dxheroes/dx-scanner/commit/f172f81489a859d15a4e109adc7b5e1965fbb3f7))
* **fixer:** fix fixer logic ([61a1cba](https://github.com/dxheroes/dx-scanner/commit/61a1cba312065cc1bc4e3388a6266f2ad4709018))
* **fixer:** refactor scanner's fix ([b4dd956](https://github.com/dxheroes/dx-scanner/commit/b4dd9565e7a38bdf665743f1d94c17744f4cce27))
* **fixer:** use mocks in fixer tests ([d17c443](https://github.com/dxheroes/dx-scanner/commit/d17c4435d2a8b06518aa39018ebfa3fabd3fbbc2))

# [2.4.0](https://github.com/dxheroes/dx-scanner/compare/v2.3.3...v2.4.0) (2020-02-25)


### Features

* upgrade TS dependencies ([cfa32ee](https://github.com/dxheroes/dx-scanner/commit/cfa32eeb770d9aea062b2789602ffd97d603bcc7))

## [2.3.3](https://github.com/dxheroes/dx-scanner/compare/v2.3.2...v2.3.3) (2020-02-25)


### Bug Fixes

* adjusting practices & inspector for gradle/kotlin variation ([f57c097](https://github.com/dxheroes/dx-scanner/commit/f57c09796eafc5b7174bec4e66d51b055d4fb46b))
* test suites readjusted for build.gradle.kts ([00acff1](https://github.com/dxheroes/dx-scanner/commit/00acff12549593c3a988abea227e74c062a481c6))

## [2.3.2](https://github.com/dxheroes/dx-scanner/compare/v2.3.1...v2.3.2) (2020-02-24)


### Bug Fixes

* **deps:** remove octokit ([#248](https://github.com/dxheroes/dx-scanner/issues/248)) ([15f6bb9](https://github.com/dxheroes/dx-scanner/commit/15f6bb9e2ff5b2d65b637b80a782e4b64f3670b4))
* remove octokit as it is no longer used ([d5772e4](https://github.com/dxheroes/dx-scanner/commit/d5772e4e4c025cad452a6232784a3b85f70e2ea0))
* **deps:** update dependency @octokit/rest to v17 ([458402d](https://github.com/dxheroes/dx-scanner/commit/458402d870b74777185ff969cb3adecde301bfd6))

## [2.3.1](https://github.com/dxheroes/dx-scanner/compare/v2.3.0...v2.3.1) (2020-02-24)


### Bug Fixes

* **deps:** update dependency node-filter-async to v2 ([e56a1dc](https://github.com/dxheroes/dx-scanner/commit/e56a1dc44bd1521430a0e089a71b3b6d7c52e6e0))
* **deps:** update dependency node-filter-async to v2 ([#249](https://github.com/dxheroes/dx-scanner/issues/249)) ([1b64097](https://github.com/dxheroes/dx-scanner/commit/1b64097f025e847b4ad9c5ed4405fc60fcb03b73))

# [2.3.0](https://github.com/dxheroes/dx-scanner/compare/v2.2.0...v2.3.0) (2020-02-18)


### Features

* set practices url to dxkb.io + add urls to the list of practices ([0f7dec7](https://github.com/dxheroes/dx-scanner/commit/0f7dec7dad029b4826bbb702db9677103db8e476))

# [2.2.0](https://github.com/dxheroes/dx-scanner/compare/v2.1.2...v2.2.0) (2020-02-11)


### Bug Fixes

* **deps:** update dependency bitbucket to v2 ([cd59447](https://github.com/dxheroes/dx-scanner/commit/cd5944735ff3309a40757dfa573d4fe913e80ec3))
* **deps:** update dependency bitbucket to v2 ([fc863b7](https://github.com/dxheroes/dx-scanner/commit/fc863b7c5405b753ed485e703a931c203450dc8a))
* **deps:** update dependency bitbucket to v2 ([ce7be48](https://github.com/dxheroes/dx-scanner/commit/ce7be486038fb69a22e10ca6d017e50bee52051a))


### Features

* **bitbucket:** update to v2 ([8d30e90](https://github.com/dxheroes/dx-scanner/commit/8d30e900a39d2ac54caf7518d1d2c5eda2bc6466))

## [2.1.2](https://github.com/dxheroes/dx-scanner/compare/v2.1.1...v2.1.2) (2020-02-11)


### Bug Fixes

* **deps:** pin dependency camelcase to 5.3.1 ([c1f804a](https://github.com/dxheroes/dx-scanner/commit/c1f804aa32af7bac243f1f0e2294a03820a62457))

## [2.1.1](https://github.com/dxheroes/dx-scanner/compare/v2.1.0...v2.1.1) (2020-02-10)


### Bug Fixes

* **deps:** update all non-major dependencies ([5274c8b](https://github.com/dxheroes/dx-scanner/commit/5274c8bd7b458ea555007908607cc14070cff967))

# [2.1.0](https://github.com/dxheroes/dx-scanner/compare/v2.0.5...v2.1.0) (2020-02-05)


### Bug Fixes

* impact level to small ([0d0c5fb](https://github.com/dxheroes/dx-scanner/commit/0d0c5fb233cf30a88167b84c0c13459a9944a00c))
* merge conflicts & naming conventions test cases ([a1f2ef7](https://github.com/dxheroes/dx-scanner/commit/a1f2ef747dc4ebeedeb39dcad0ab5fca087b7ff2))
* renamed tests & practice desciptions correctly to Kotlin ([ca70cbc](https://github.com/dxheroes/dx-scanner/commit/ca70cbcb18bd53456cca132d8fce4d09345219cd))
* solved merge conflict ([287e5ba](https://github.com/dxheroes/dx-scanner/commit/287e5ba43446957b73cf3ad56ae76631e6b64bd4))
* updated the practice for Kotlin & considered more edge cases ([c2cb6be](https://github.com/dxheroes/dx-scanner/commit/c2cb6beb6d2dc95a480370e9d2613e0c84124cbe))


### Features

* java practice for naming conventions ([b63c767](https://github.com/dxheroes/dx-scanner/commit/b63c76742c1337f4dbb8906049a9df756e4b9141))

## [2.0.5](https://github.com/dxheroes/dx-scanner/compare/v2.0.4...v2.0.5) (2020-02-04)


### Bug Fixes

* **init:** Win architecture & tests ([2d1aea6](https://github.com/dxheroes/dx-scanner/commit/2d1aea61ba5f98e350f9152fc5627eaa5b5535a5))
* **init:** Win architecture & tests ([#238](https://github.com/dxheroes/dx-scanner/issues/238)) ([0d3fbe1](https://github.com/dxheroes/dx-scanner/commit/0d3fbe18f02308b4fdbc8cf8d2ff556be0e1007f))
* **services:** deprecation notice removed ([b494c01](https://github.com/dxheroes/dx-scanner/commit/b494c01965df8073f16816e48bc9cb52dfa16f9f))
* **services:** deprecation notice removed ([#239](https://github.com/dxheroes/dx-scanner/issues/239)) ([d759beb](https://github.com/dxheroes/dx-scanner/commit/d759bebcdbcc8fa37c2cd999db86a2f0f3fdf175))

## [2.0.4](https://github.com/dxheroes/dx-scanner/compare/v2.0.3...v2.0.4) (2020-02-03)


### Bug Fixes

* customize help ([1520daf](https://github.com/dxheroes/dx-scanner/commit/1520daf83d9f384a646da32a117e03f45b1c45c9))
* increase timeout limit ([0ec88ec](https://github.com/dxheroes/dx-scanner/commit/0ec88ec46fcdab4ede00ad4e5b50905300dc595f))
* **core:** load default Command from oclif ([afc3e4c](https://github.com/dxheroes/dx-scanner/commit/afc3e4c5bb9a898f826141ef8478535278053d69))


### Reverts

* add update-notifier back ([cec2fde](https://github.com/dxheroes/dx-scanner/commit/cec2fdedbee54b36512e3a34005c2c71516d8e45))
* **changelog:** back to v2 ([d1b1f37](https://github.com/dxheroes/dx-scanner/commit/d1b1f370764158c7cf1515c6a7d953214eef40d3))
* add changes for list of practices ([3993010](https://github.com/dxheroes/dx-scanner/commit/3993010a0e6e5a397c920ef0489a6fc43b37b486))
* back the DXS config file ([726df9b](https://github.com/dxheroes/dx-scanner/commit/726df9b07b9b153417a93ecb7fc743e55322480e))

## [2.0.4-beta.1](https://github.com/dxheroes/dx-scanner/compare/v2.0.3...v2.0.4-beta.1) (2020-02-03)


### Bug Fixes

* customize help ([1520daf](https://github.com/dxheroes/dx-scanner/commit/1520daf83d9f384a646da32a117e03f45b1c45c9))
* increase timeout limit ([0ec88ec](https://github.com/dxheroes/dx-scanner/commit/0ec88ec46fcdab4ede00ad4e5b50905300dc595f))
* **core:** load default Command from oclif ([afc3e4c](https://github.com/dxheroes/dx-scanner/commit/afc3e4c5bb9a898f826141ef8478535278053d69))


### Reverts

* add update-notifier back ([cec2fde](https://github.com/dxheroes/dx-scanner/commit/cec2fdedbee54b36512e3a34005c2c71516d8e45))
* **changelog:** back to v2 ([d1b1f37](https://github.com/dxheroes/dx-scanner/commit/d1b1f370764158c7cf1515c6a7d953214eef40d3))
* add changes for list of practices ([3993010](https://github.com/dxheroes/dx-scanner/commit/3993010a0e6e5a397c920ef0489a6fc43b37b486))
* back the DXS config file ([726df9b](https://github.com/dxheroes/dx-scanner/commit/726df9b07b9b153417a93ecb7fc743e55322480e))

## [2.0.3](https://github.com/dxheroes/dx-scanner/compare/v2.0.2...v2.0.3) (2020-02-03)

### Bug Fixes

* **deps:** update all non-major dependencies ([046576a](https://github.com/dxheroes/dx-scanner/commit/046576a4e9bc0d5540570de4d1ac432837940047))

## [2.0.3-beta.1](https://github.com/dxheroes/dx-scanner/compare/v2.0.2...v2.0.3-beta.1) (2020-02-02)

### Bug Fixes

* customize help ([1520daf](https://github.com/dxheroes/dx-scanner/commit/1520daf83d9f384a646da32a117e03f45b1c45c9))
* increase timeout limit ([0ec88ec](https://github.com/dxheroes/dx-scanner/commit/0ec88ec46fcdab4ede00ad4e5b50905300dc595f))
* **core:** load default Command from oclif ([afc3e4c](https://github.com/dxheroes/dx-scanner/commit/afc3e4c5bb9a898f826141ef8478535278053d69))


### Reverts

* add update-notifier back ([cec2fde](https://github.com/dxheroes/dx-scanner/commit/cec2fdedbee54b36512e3a34005c2c71516d8e45))
* **changelog:** back to v2 ([d1b1f37](https://github.com/dxheroes/dx-scanner/commit/d1b1f370764158c7cf1515c6a7d953214eef40d3))
* add changes for list of practices ([3993010](https://github.com/dxheroes/dx-scanner/commit/3993010a0e6e5a397c920ef0489a6fc43b37b486))
* back the DXS config file ([726df9b](https://github.com/dxheroes/dx-scanner/commit/726df9b07b9b153417a93ecb7fc743e55322480e))

## [2.0.2](https://github.com/dxheroes/dx-scanner/compare/v2.0.1...v2.0.2) (2020-02-02)


### Bug Fixes

* binding Kotlin to context ([5472b0c](https://github.com/dxheroes/dx-scanner/commit/5472b0c144d3b0e2b57a0c09d35eeb11aa12d00c))
* improved JavaLanguageDetector tests for Kotlin support ([695716c](https://github.com/dxheroes/dx-scanner/commit/695716c87948039868828852cdd31400e3f89cd4))
* Kotlin reintegration to Java practices & test fixes ([1efac9d](https://github.com/dxheroes/dx-scanner/commit/1efac9d80a9cfb079d1dce8055d030a872befbbb))

## [2.0.1](https://github.com/dxheroes/dx-scanner/compare/v2.0.0...v2.0.1) (2020-01-28)


### Bug Fixes

* back to single-command CLI ([21c539b](https://github.com/dxheroes/dx-scanner/commit/21c539bff06922315a28ca2ac5185d2306d0bdfc))

# [2.0.0](https://github.com/dxheroes/dx-scanner/compare/v1.38.0...v2.0.0) (2020-01-28)


### Bug Fixes

* allow fail and recursive to be optional ([457eb72](https://github.com/dxheroes/dx-scanner/commit/457eb72426d4f4ccca135f43e599ea577c4f0077))
* inform user if the config file already exists ([569725a](https://github.com/dxheroes/dx-scanner/commit/569725a0e30acb8d03523b70da9db981188d5023))
* parse flags with init subcommand ([3ede8e0](https://github.com/dxheroes/dx-scanner/commit/3ede8e0fd3f02078d91ca85e58d2068bd0d9cf11))
* remove comments a comment ideas ([e604238](https://github.com/dxheroes/dx-scanner/commit/e6042385ab862fac7ea888d155ed23189b5e61eb))
* remove unnecessary code ([bb88dd4](https://github.com/dxheroes/dx-scanner/commit/bb88dd4bd3ab615cd5a9989f63f18c4dc69977ad))
* remove unused commented code and import reflect-metadata ([5ad591a](https://github.com/dxheroes/dx-scanner/commit/5ad591a5d7ffafbc527643d202077c06085a7b6b))
* remove unused flag, aliases and set new examples ([cccdf57](https://github.com/dxheroes/dx-scanner/commit/cccdf574f080db6039cd91f302774f6d6c4159ae))
* rename method ([d8a88cf](https://github.com/dxheroes/dx-scanner/commit/d8a88cfbcabaffb0a8dd48e102e0e91d6c4c24f2))
* rename subcommand ([e939b9e](https://github.com/dxheroes/dx-scanner/commit/e939b9e1f26b7bd14f6bc79ac34a9e67292a21bd))
* revert change ([b4b6497](https://github.com/dxheroes/dx-scanner/commit/b4b6497f2909aa1bbfd45129883af5e4afadb8da))
* set arguments back to be required ([dc8edd6](https://github.com/dxheroes/dx-scanner/commit/dc8edd602f81da53bb14d3891a4c1f73824338ac))
* typo ([19e8bd1](https://github.com/dxheroes/dx-scanner/commit/19e8bd1ecbe785d1c6e47b2e91160742654e101c))


### Features

* **core:** CLI changed to multi-command ([cbf03b0](https://github.com/dxheroes/dx-scanner/commit/cbf03b016d6569c10638c9177a96cfaa962dcc77))
* add two subcommands ([9661d6b](https://github.com/dxheroes/dx-scanner/commit/9661d6b40f348cc66cef7b64fa033e65e851c935))
* convert init flag to subcommand ([9594d3a](https://github.com/dxheroes/dx-scanner/commit/9594d3ae7183d95eca7de2a68784bde27d4084bd))
* implement method to get practices ([871f7f2](https://github.com/dxheroes/dx-scanner/commit/871f7f2bb3ca950c6313afc8b04baed3f2aa3301))
* list practices in a table ([9d8a8f6](https://github.com/dxheroes/dx-scanner/commit/9d8a8f69b0f88f41052e46bd485a6d3c9abd97a1))
* wip - add subcommand ([6c33fc4](https://github.com/dxheroes/dx-scanner/commit/6c33fc4f7fa4761cbbdd00a4a1f668f7aaabb572))


### BREAKING CHANGES

* **core:** now exists commands such as init, practices and run

# [1.38.0](https://github.com/dxheroes/dx-scanner/compare/v1.37.1...v1.38.0) (2020-01-27)


### Bug Fixes

* added java testing practice to index ([cf4e762](https://github.com/dxheroes/dx-scanner/commit/cf4e762235d76e53e94efdf3ad19edcff0fd9d2c))
* resolved merge conflicts ([94b7aeb](https://github.com/dxheroes/dx-scanner/commit/94b7aeb5173e01d32af338034b19ce200f87f5d7))


### Features

* add CLI fix flag ([7673350](https://github.com/dxheroes/dx-scanner/commit/7673350b56702fa47fb57ea85cba7eb414ae2a49))
* add fix interface to Practice ([7340d8e](https://github.com/dxheroes/dx-scanner/commit/7340d8ede3850676de9bd7ced9dfad674254ad0d))
* implement fix for EsLintWithoutErrors ([6b0d5c8](https://github.com/dxheroes/dx-scanner/commit/6b0d5c87ec87adacc71728f96c2c3d1ea4ac164f))
* java logger used practice ([26a4754](https://github.com/dxheroes/dx-scanner/commit/26a47540031db72dbe0f970842544bb7eedb1fa7))
* java practice for detecting test mock frameworks ([0453a03](https://github.com/dxheroes/dx-scanner/commit/0453a0394c8e45cc41828512ee059191256dfce1))
* java practices that check testing frameworks ([0913ca1](https://github.com/dxheroes/dx-scanner/commit/0913ca1245eb013048bf1363a342c430435bbb9d))
* run fix only when flag provided ([5fee2ae](https://github.com/dxheroes/dx-scanner/commit/5fee2ae5ee31bd13db1cf8bfb59289aa8c6c8017))
* run fixes for all failed practices ([6c8d7a9](https://github.com/dxheroes/dx-scanner/commit/6c8d7a9d4181b921234b1fe5e5630b431ed017a7))
* test for mocking frameworks practice ([ea6b972](https://github.com/dxheroes/dx-scanner/commit/ea6b972819ed5a7f618038bd8ccdb38826377c65))

## [1.37.1](https://github.com/dxheroes/dx-scanner/compare/v1.37.0...v1.37.1) (2020-01-27)


### Bug Fixes

* **deps:** update dependency cross-env to v7 ([5698c32](https://github.com/dxheroes/dx-scanner/commit/5698c324e0224e1d2c3287e6fc48f82b985cfdc2))
* **deps:** update dependency cross-env to v7 ([#223](https://github.com/dxheroes/dx-scanner/issues/223)) ([449613c](https://github.com/dxheroes/dx-scanner/commit/449613c67275c43c316a53af4fb3b05868d512e7))

# [1.37.0](https://github.com/dxheroes/dx-scanner/compare/v1.36.0...v1.37.0) (2020-01-23)


### Bug Fixes

* isApplicable tests for different languages ([6147ef5](https://github.com/dxheroes/dx-scanner/commit/6147ef52257b96ebc06670a8f4ce408a9b32e385))
* return statement to apply only for JS & TS ([bf15e8d](https://github.com/dxheroes/dx-scanner/commit/bf15e8d33a2659b3ad5466e73e89522c0f00a2cf))
* **java:** fixed logic package management used practice ([2255485](https://github.com/dxheroes/dx-scanner/commit/2255485bfa1c124c87a4ec3763f034297e0e5cb8))
* **java:** restrict practice application to only Java & updated tests ([85b36b0](https://github.com/dxheroes/dx-scanner/commit/85b36b0204123b84c590c0863ab7a6e253d38a39))


### Features

* **java:** package management used practice ([e7063dc](https://github.com/dxheroes/dx-scanner/commit/e7063dcd9ca94fe675145c0e83c7b0865cca6e69))
* **java:** package management used practice ([#213](https://github.com/dxheroes/dx-scanner/issues/213)) ([401d706](https://github.com/dxheroes/dx-scanner/commit/401d7065a756a1e2a5b0c8f7897d1aaa75ac5011))

# [1.36.0](https://github.com/dxheroes/dx-scanner/compare/v1.35.3...v1.36.0) (2020-01-21)


### Bug Fixes

* add filtering and pagination in getIssues() ([e4b1cf5](https://github.com/dxheroes/dx-scanner/commit/e4b1cf57b11cd53bf674d68dd2cda09fe8bf7508))
* add state to params and delete commented code ([f9e1877](https://github.com/dxheroes/dx-scanner/commit/f9e1877e68ce3d8da9e9dd6bf045ef67ec3987c8))
* allow user to pass more than one issue state ([5c06622](https://github.com/dxheroes/dx-scanner/commit/5c0662288ae543be40bb394e8258888671d574e5))
* failing ESLintWithoutErrosPractie by gettting right path ([088fe62](https://github.com/dxheroes/dx-scanner/commit/088fe622505ad58cc0740d165f82414ce998bc4b))
* import from right files ([295f196](https://github.com/dxheroes/dx-scanner/commit/295f19620892afda40d871e9978047c9b7b79c84))
* return undefined if state is not defined ([dd321de](https://github.com/dxheroes/dx-scanner/commit/dd321de5fd0ff0246dcafde858fa34e2d8eb96bf))
* split getIssueState to two methods according to used service ([fa61acc](https://github.com/dxheroes/dx-scanner/commit/fa61acc3da6c1d38e2a2fc40ff1bf360aef735d8))
* use BitbucketIssueState instead of BitbucketPullRequestState; use q as queryParams according to Bitbucket API filtering ([d2a413f](https://github.com/dxheroes/dx-scanner/commit/d2a413f98a33e71e516f627cba542435326eea2f))
* use new method for getting state ([a08d0e0](https://github.com/dxheroes/dx-scanner/commit/a08d0e0af64570c1c6d3ac19b42d265a9d453b4d))
* wip get issue state without quotes, fix passing array of states ([165bb8c](https://github.com/dxheroes/dx-scanner/commit/165bb8cba9976d881da8c7779dcf94e36d4168dd))


### Features

* add BitbucketIssueState enum ([f46cfc1](https://github.com/dxheroes/dx-scanner/commit/f46cfc17cd5a246f2c28fee323353f861e171fbe))
* implement getIssueState() ([98a677b](https://github.com/dxheroes/dx-scanner/commit/98a677b414c8a774e7a4dd039bdbc2839777b539))

## [1.35.3](https://github.com/dxheroes/dx-scanner/compare/v1.35.2...v1.35.3) (2020-01-21)


### Bug Fixes

* change id to number ([5fccdf9](https://github.com/dxheroes/dx-scanner/commit/5fccdf9deab6f5816f6fc26535a2d1115b55337a))
* increase default allowed number of changes ([c3e4ef4](https://github.com/dxheroes/dx-scanner/commit/c3e4ef45b0247c97fccb67db30635e0562fb248e))
* save the right value to the id (prNumber) ([3533026](https://github.com/dxheroes/dx-scanner/commit/35330268664d395c50d3af57e6c44d1d21bc8167))
* suggestion text ([8ad09e0](https://github.com/dxheroes/dx-scanner/commit/8ad09e03f289582a96eea8a38ef5c4e4cba3aed7))
* tests according to change id value ([739354f](https://github.com/dxheroes/dx-scanner/commit/739354ffe4988ddcafdd8c680ac164f71046ae31))

## [1.35.2](https://github.com/dxheroes/dx-scanner/compare/v1.35.1...v1.35.2) (2020-01-20)


### Bug Fixes

* **deps:** update all non-major dependencies ([8cf77f4](https://github.com/dxheroes/dx-scanner/commit/8cf77f4299b0c78e7d229758438aead98fcdd5f9))

## [1.35.1](https://github.com/dxheroes/dx-scanner/compare/v1.35.0...v1.35.1) (2020-01-16)


### Bug Fixes

* name of test ([70dd87e](https://github.com/dxheroes/dx-scanner/commit/70dd87e6a25a327db85517960d1e481a43c8b877))
* pass the no PR right into getPullRequests() ([1122795](https://github.com/dxheroes/dx-scanner/commit/1122795736657271da02c47126765a4df8b0e022))
* passing number in getPullsDiffStat() instead of string ([785dfe8](https://github.com/dxheroes/dx-scanner/commit/785dfe82a15c98b070d8a4c10cd7d1efe60b5223))
* remove comments ([b0402b4](https://github.com/dxheroes/dx-scanner/commit/b0402b43732c93d6d90f41881304540102982600))
* remove non existing file path ([9720107](https://github.com/dxheroes/dx-scanner/commit/9720107fb561305c2d70f54b8c2f0bd4cb25c95b))
* remove tests for InvalidPractice as it causes CI fail ([98d59e2](https://github.com/dxheroes/dx-scanner/commit/98d59e2d44fbb1da0302783f1c6409221d72d897))
* remove tests for mocking practices as it causes CI fail ([3facd70](https://github.com/dxheroes/dx-scanner/commit/3facd70f0dc42748ac0a3e27ae9a10e3fd7a4cf7))
* remove unused code ([1e957ab](https://github.com/dxheroes/dx-scanner/commit/1e957ab4fefc5fc88dfcaf28aad55def9ddedf3a))
* remove unused method ([8a0b493](https://github.com/dxheroes/dx-scanner/commit/8a0b493c9f8073c6b26b5e24d151ae19850707e4))
* use ErrorFactory for customized error ([74f9db4](https://github.com/dxheroes/dx-scanner/commit/74f9db46fbb3a9180551cd87e8700347021a2089))

# [1.35.0](https://github.com/dxheroes/dx-scanner/compare/v1.34.0...v1.35.0) (2020-01-15)


### Features

* **ghaction:** configuration added ([1a4f0e3](https://github.com/dxheroes/dx-scanner/commit/1a4f0e39a84014b45a2aecb363ac975107fd559b))

# [1.34.0](https://github.com/dxheroes/dx-scanner/compare/v1.33.1...v1.34.0) (2020-01-15)


### Bug Fixes

* **dependnecies:** lock versions & recreate lockfile ([236a7d2](https://github.com/dxheroes/dx-scanner/commit/236a7d27efc7945a53e78b6f5d5e7f9810265c7e))
* --init command with specific file path ([eaacb8b](https://github.com/dxheroes/dx-scanner/commit/eaacb8b244c022f26424fbd82ea6052109eb5960))
* fixing a test and writeFile ([f19827a](https://github.com/dxheroes/dx-scanner/commit/f19827a5edb97033e13eff36b17aabd3c52539d4))
* Kotlin recognition fixed & improved detector ([c5aaa4c](https://github.com/dxheroes/dx-scanner/commit/c5aaa4c66349752f0ea21e568925a0dd2dfb29f6))
* replacing a string templator with query stringify ([b3145c1](https://github.com/dxheroes/dx-scanner/commit/b3145c1c85464b9002d16394d0ee10d7c820907a))
* streamlined practice business logic & introduced new utils ([b278dae](https://github.com/dxheroes/dx-scanner/commit/b278dae9ba92daec39bb72b83e1d5612bd6a9c71))
* **java:** improved PackageInspector for Maven to include groupId ([3cb77c6](https://github.com/dxheroes/dx-scanner/commit/3cb77c68133ce797977341e825894fa37e00e4db))


### Features

* **java:** Added Major Version Dependency check practice for Java ([258c44e](https://github.com/dxheroes/dx-scanner/commit/258c44e40262d3169a4cd379377d293ead1fccc4))
* **Kotlin:** added Kotlin recognition to Language Detector ([d62e6a8](https://github.com/dxheroes/dx-scanner/commit/d62e6a81b49dbf87506b9b8bbaed17c87fccf8e2))

## [1.33.1](https://github.com/dxheroes/dx-scanner/compare/v1.33.0...v1.33.1) (2020-01-14)


### Bug Fixes

* **practices:** correct commit msg use only X relevant commits ([343619a](https://github.com/dxheroes/dx-scanner/commit/343619a))
* **practices:** correct commit msg use only X relevant commits ([e8c1d60](https://github.com/dxheroes/dx-scanner/commit/e8c1d60))
* **practices:** display properly correct commit messages practice detailed data ([8b4e489](https://github.com/dxheroes/dx-scanner/commit/8b4e489))

# [1.33.0](https://github.com/dxheroes/dx-scanner/compare/v1.32.1...v1.33.0) (2020-01-14)


### Bug Fixes

* rename vulnerabilities practice ([dad49cf](https://github.com/dxheroes/dx-scanner/commit/dad49cf))


### Features

* add audit fallback to npm ([39e8998](https://github.com/dxheroes/dx-scanner/commit/39e8998))
* add table detail to vulnerabilities practice ([b1fc789](https://github.com/dxheroes/dx-scanner/commit/b1fc789))
* add yarn audit vulnerabilities report, increase yarn fail level ([cfd79cc](https://github.com/dxheroes/dx-scanner/commit/cfd79cc))

## [1.32.1](https://github.com/dxheroes/dx-scanner/compare/v1.32.0...v1.32.1) (2020-01-13)


### Bug Fixes

* **deps:** pin dependencies ([caedb1e](https://github.com/dxheroes/dx-scanner/commit/caedb1e))

# [1.32.0](https://github.com/dxheroes/dx-scanner/compare/v1.31.0...v1.32.0) (2020-01-10)


### Bug Fixes

* add url and remove commented code ([c4a8dc6](https://github.com/dxheroes/dx-scanner/commit/c4a8dc6))
* delete deprecated code ([a24de11](https://github.com/dxheroes/dx-scanner/commit/a24de11))
* eslint settings ([e66f88b](https://github.com/dxheroes/dx-scanner/commit/e66f88b))
* fix problems caused by the bitbucketNock refactoring ([8bdb8a9](https://github.com/dxheroes/dx-scanner/commit/8bdb8a9))
* getting issue id ([dc36f7d](https://github.com/dxheroes/dx-scanner/commit/dc36f7d))
* name of practice in binding ([5d196f5](https://github.com/dxheroes/dx-scanner/commit/5d196f5))
* refactor code using moment library ([174e887](https://github.com/dxheroes/dx-scanner/commit/174e887))
* remove unnecessary code ([bf939e8](https://github.com/dxheroes/dx-scanner/commit/bf939e8))
* test ([4babc20](https://github.com/dxheroes/dx-scanner/commit/4babc20))
* typo ([5404cf1](https://github.com/dxheroes/dx-scanner/commit/5404cf1))
* typo ([1ca2571](https://github.com/dxheroes/dx-scanner/commit/1ca2571))
* typo ([06b53ce](https://github.com/dxheroes/dx-scanner/commit/06b53ce))
* typo ([adaab7f](https://github.com/dxheroes/dx-scanner/commit/adaab7f))
* typos ([3733e6a](https://github.com/dxheroes/dx-scanner/commit/3733e6a))
* use mocking pull request fn also for issues ([cfea49b](https://github.com/dxheroes/dx-scanner/commit/cfea49b))
* value of perPage ([b0942af](https://github.com/dxheroes/dx-scanner/commit/b0942af))
* value of totalCount ([766393f](https://github.com/dxheroes/dx-scanner/commit/766393f))


### Features

* implement TimeToSolveIssues practice ([bea4853](https://github.com/dxheroes/dx-scanner/commit/bea4853))

# [1.31.0](https://github.com/dxheroes/dx-scanner/compare/v1.30.0...v1.31.0) (2020-01-10)


### Bug Fixes

* 2nd run of unauthenticated scan ([b0ef8fd](https://github.com/dxheroes/dx-scanner/commit/b0ef8fd))
* don't prompt auth on travis ([60ba483](https://github.com/dxheroes/dx-scanner/commit/60ba483))
* scanner imports ([a6b3c52](https://github.com/dxheroes/dx-scanner/commit/a6b3c52))
* scanningDetector tests ([d3cd41b](https://github.com/dxheroes/dx-scanner/commit/d3cd41b))


### Features

* add auth check to CIReporter ([47cb520](https://github.com/dxheroes/dx-scanner/commit/47cb520))
* add local path's repo detect test ([11e22ab](https://github.com/dxheroes/dx-scanner/commit/11e22ab))
* require auth token when scanning local path's repo ([7d26e3c](https://github.com/dxheroes/dx-scanner/commit/7d26e3c))
* use ci flag instead of is-travis ([c1ef2ec](https://github.com/dxheroes/dx-scanner/commit/c1ef2ec))
* use flag for authentication prompt ([8b93653](https://github.com/dxheroes/dx-scanner/commit/8b93653))

# [1.30.0](https://github.com/dxheroes/dx-scanner/compare/v1.29.2...v1.30.0) (2020-01-10)


### Features

* add gitignore practice lockfile tests ([1571047](https://github.com/dxheroes/dx-scanner/commit/1571047))
* change gitignore practices to allow only one lockfile ([1661f47](https://github.com/dxheroes/dx-scanner/commit/1661f47))
* update lockfile rule to allow only exactly one lockfile ([68f0c21](https://github.com/dxheroes/dx-scanner/commit/68f0c21))
* **js:** remove lock check from gitignore practice ([996b8e7](https://github.com/dxheroes/dx-scanner/commit/996b8e7))
* **ts:** remove lock check from gitignore practice ([ddb6506](https://github.com/dxheroes/dx-scanner/commit/ddb6506))

## [1.29.2](https://github.com/dxheroes/dx-scanner/compare/v1.29.1...v1.29.2) (2020-01-08)


### Bug Fixes

* **conventionalcommmits practice:** change used library ([8b71fce](https://github.com/dxheroes/dx-scanner/commit/8b71fce))

## [1.29.1](https://github.com/dxheroes/dx-scanner/compare/v1.29.0...v1.29.1) (2020-01-08)


### Bug Fixes

* do not require engines strictly ([dff5212](https://github.com/dxheroes/dx-scanner/commit/dff5212))

# [1.29.0](https://github.com/dxheroes/dx-scanner/compare/v1.28.2...v1.29.0) (2020-01-08)


### Features

* **CIReportBuilder:** add PR msg builder and change a structure ([3c332b3](https://github.com/dxheroes/dx-scanner/commit/3c332b3))
* **GHActions:** publish GH Marketplace Docker image with DX Scanner ([71db6c0](https://github.com/dxheroes/dx-scanner/commit/71db6c0))

## [1.28.2](https://github.com/dxheroes/dx-scanner/compare/v1.28.1...v1.28.2) (2020-01-08)


### Bug Fixes

* **deps:** update dependency npm-check-updates to v4 ([cd93413](https://github.com/dxheroes/dx-scanner/commit/cd93413))

## [1.28.1](https://github.com/dxheroes/dx-scanner/compare/v1.28.0...v1.28.1) (2020-01-08)


### Bug Fixes

* **deps:** update all non-major dependencies ([9c28781](https://github.com/dxheroes/dx-scanner/commit/9c28781))

# [1.28.0](https://github.com/dxheroes/dx-scanner/compare/v1.27.0...v1.28.0) (2020-01-08)


### Bug Fixes

* **CIReporter:** load all comments instead of just a first page ([42ef331](https://github.com/dxheroes/dx-scanner/commit/42ef331))
* add suggestion, name and url ([ac0a1d7](https://github.com/dxheroes/dx-scanner/commit/ac0a1d7))
* allow to customize addition and deletions ([eeda833](https://github.com/dxheroes/dx-scanner/commit/eeda833))
* allow to insert just page or just perPage value ([35b0103](https://github.com/dxheroes/dx-scanner/commit/35b0103))
* bad letter case ([17ef395](https://github.com/dxheroes/dx-scanner/commit/17ef395))
* condition ([770ad50](https://github.com/dxheroes/dx-scanner/commit/770ad50))
* merge params state and pagination if both are provided ([2844629](https://github.com/dxheroes/dx-scanner/commit/2844629))
* pass state and pagination as params to axios ([a4b5e19](https://github.com/dxheroes/dx-scanner/commit/a4b5e19))
* rename practice ([3938c12](https://github.com/dxheroes/dx-scanner/commit/3938c12))
* **CIReporter:** await all reporters ([2fbe97b](https://github.com/dxheroes/dx-scanner/commit/2fbe97b))
* use customized diffStat ([405dfae](https://github.com/dxheroes/dx-scanner/commit/405dfae))
* **core:** enable reporters ([7d02505](https://github.com/dxheroes/dx-scanner/commit/7d02505))


### Features

* add Fat PullRequests Practice ([88e7c9e](https://github.com/dxheroes/dx-scanner/commit/88e7c9e))
* implement getMacNumberOfPullRequests() ([fa21f3f](https://github.com/dxheroes/dx-scanner/commit/fa21f3f))
* maxNumberOfPrs ([b5c1958](https://github.com/dxheroes/dx-scanner/commit/b5c1958))
* move list all PRs to a practice ([6d374cf](https://github.com/dxheroes/dx-scanner/commit/6d374cf))
* **CIReportBuilder:** add PR msg builder and change a structure ([116f925](https://github.com/dxheroes/dx-scanner/commit/116f925))
* **CIReporter:** add CI reporter ([cb15cd3](https://github.com/dxheroes/dx-scanner/commit/cb15cd3))

# [1.27.0](https://github.com/dxheroes/dx-scanner/compare/v1.26.4...v1.27.0) (2019-12-17)


### Bug Fixes

* Add comments ([2c33c17](https://github.com/dxheroes/dx-scanner/commit/2c33c17))
* add linesAdded and linesRemoved to own interface of Commit. Implement it in BitbucketService and rewrite tests. ([0648ce9](https://github.com/dxheroes/dx-scanner/commit/0648ce9))
* add pagination to getPullrequests() in Bitbucket ([47e57ad](https://github.com/dxheroes/dx-scanner/commit/47e57ad))
* adding values ([35f27d5](https://github.com/dxheroes/dx-scanner/commit/35f27d5))
* concating url ([b0eaaf0](https://github.com/dxheroes/dx-scanner/commit/b0eaaf0))
* remove unnecessary code ([5dcf879](https://github.com/dxheroes/dx-scanner/commit/5dcf879))
* remove unnecessary Promise.all(); remove request for getting diffStat ([07e88e5](https://github.com/dxheroes/dx-scanner/commit/07e88e5))
* rename value ([adcec08](https://github.com/dxheroes/dx-scanner/commit/adcec08))
* tests after refactoring ([a6f465c](https://github.com/dxheroes/dx-scanner/commit/a6f465c))
* use method to get an email and fix test after that ([f11ac89](https://github.com/dxheroes/dx-scanner/commit/f11ac89))
* use pagination if it's provided ([fad8e78](https://github.com/dxheroes/dx-scanner/commit/fad8e78))
* use withDiffStat value separately, not within ListGetterOptions ([281ab83](https://github.com/dxheroes/dx-scanner/commit/281ab83))
* value name ([eacdd7b](https://github.com/dxheroes/dx-scanner/commit/eacdd7b))


### Features

*  allow to get one specific pull request with diffStat in GithubService and BitbucketService ([837e8a0](https://github.com/dxheroes/dx-scanner/commit/837e8a0))
* add getPullsDiffStat() in CollaborationInspector; allow to get one specific pull request with diffStat ([81cb265](https://github.com/dxheroes/dx-scanner/commit/81cb265))
* add Lines interface ([d1232ed](https://github.com/dxheroes/dx-scanner/commit/d1232ed))
* get pullrequests with diffStat if `withDiffStat` value is true ([dcba226](https://github.com/dxheroes/dx-scanner/commit/dcba226))
* implement getPullsDiffStat() in BitbucketService and add test for that ([3c78fe3](https://github.com/dxheroes/dx-scanner/commit/3c78fe3))

## [1.26.4](https://github.com/dxheroes/dx-scanner/compare/v1.26.3...v1.26.4) (2019-12-16)


### Bug Fixes

* **deps:** update dependency semver to v7 ([76de07d](https://github.com/dxheroes/dx-scanner/commit/76de07d))

## [1.26.3](https://github.com/dxheroes/dx-scanner/compare/v1.26.2...v1.26.3) (2019-12-16)


### Bug Fixes

* **deps:** update dependency update-notifier to v4 ([373ce00](https://github.com/dxheroes/dx-scanner/commit/373ce00))

## [1.26.2](https://github.com/dxheroes/dx-scanner/compare/v1.26.1...v1.26.2) (2019-12-16)


### Bug Fixes

* **deps:** update all non-major dependencies ([96f59c9](https://github.com/dxheroes/dx-scanner/commit/96f59c9))

## [1.26.1](https://github.com/dxheroes/dx-scanner/compare/v1.26.0...v1.26.1) (2019-12-16)


### Bug Fixes

* **deps:** pin dependencies ([57d767a](https://github.com/dxheroes/dx-scanner/commit/57d767a))

# [1.26.0](https://github.com/dxheroes/dx-scanner/compare/v1.25.0...v1.26.0) (2019-12-11)


### Features

* **CLIReporter:** add rich suggestion text to the report ([2db8559](https://github.com/dxheroes/dx-scanner/commit/2db8559))
* **CLIReporter:** show detailed info (collected data) from practices ([30458ce](https://github.com/dxheroes/dx-scanner/commit/30458ce))
* collect data from practices ([4fa1b85](https://github.com/dxheroes/dx-scanner/commit/4fa1b85))

# [1.25.0](https://github.com/dxheroes/dx-scanner/compare/v1.24.0...v1.25.0) (2019-12-10)


### Bug Fixes

* add a comment ([26ea99f](https://github.com/dxheroes/dx-scanner/commit/26ea99f))
* add a comment about logic to try catch ([9c8bba4](https://github.com/dxheroes/dx-scanner/commit/9c8bba4))
* add possibility return no pullrequests by not passing state ([633caea](https://github.com/dxheroes/dx-scanner/commit/633caea))
* as the bitbucket fails if the account is a team account add possibility to ownerId be a null ([37bc6f2](https://github.com/dxheroes/dx-scanner/commit/37bc6f2))
* change updatedAt only if it's provided ([ec2f240](https://github.com/dxheroes/dx-scanner/commit/ec2f240))
* get the ownerId via repo info with one request ([2b83d63](https://github.com/dxheroes/dx-scanner/commit/2b83d63))
* getting ownerId if it's team account ([bd86a78](https://github.com/dxheroes/dx-scanner/commit/bd86a78))
* implement getOwnerId() in bitbucketNock ([81daee8](https://github.com/dxheroes/dx-scanner/commit/81daee8))
* invalid letter case ([c1aa97d](https://github.com/dxheroes/dx-scanner/commit/c1aa97d))
* path ([af50b8d](https://github.com/dxheroes/dx-scanner/commit/af50b8d))
* rebind IContentRepositoryBrowser in practice instead of binding in inversify.config.ts ([1141cad](https://github.com/dxheroes/dx-scanner/commit/1141cad))
* reflect used service ([48b3429](https://github.com/dxheroes/dx-scanner/commit/48b3429))
* remove unnecessary code ([4118637](https://github.com/dxheroes/dx-scanner/commit/4118637))
* remove unnecessary condition ([0fe3e8b](https://github.com/dxheroes/dx-scanner/commit/0fe3e8b))
* remove unnecessary line of code ([269f384](https://github.com/dxheroes/dx-scanner/commit/269f384))
* remove unnecessary test ([cd746f4](https://github.com/dxheroes/dx-scanner/commit/cd746f4))
* rename practice and files. Add name and suggestion text. ([9e18b76](https://github.com/dxheroes/dx-scanner/commit/9e18b76))
* tests ([e9f9943](https://github.com/dxheroes/dx-scanner/commit/e9f9943))
* tests as it is possible to get team account id ([c9f7d91](https://github.com/dxheroes/dx-scanner/commit/c9f7d91))
* use arguments provider uri to detect if bind GithubService or BitbucketService ([ba705b4](https://github.com/dxheroes/dx-scanner/commit/ba705b4))
* value of owner id ([c56e67f](https://github.com/dxheroes/dx-scanner/commit/c56e67f))
* wrong letter case ([f8bd6a5](https://github.com/dxheroes/dx-scanner/commit/f8bd6a5))


### Features

* add TimeToSolvePractice ([a667a78](https://github.com/dxheroes/dx-scanner/commit/a667a78))

# [1.24.0](https://github.com/dxheroes/dx-scanner/compare/v1.23.2...v1.24.0) (2019-12-06)


### Bug Fixes

* add BitbucketService to the type ([7a71226](https://github.com/dxheroes/dx-scanner/commit/7a71226))
* add condition so it doesn't fail if there are no PRs ([4839367](https://github.com/dxheroes/dx-scanner/commit/4839367))
* add getRepoCommits() into interface, ([8b544ef](https://github.com/dxheroes/dx-scanner/commit/8b544ef))
* add getRepoCommits() into interface, ([648f066](https://github.com/dxheroes/dx-scanner/commit/648f066))
* add moment to package.json ([20fec03](https://github.com/dxheroes/dx-scanner/commit/20fec03))
* Add parse-commit-message ([d5c6a08](https://github.com/dxheroes/dx-scanner/commit/d5c6a08))
* add queryState to new GitHubNock() ([46a7a31](https://github.com/dxheroes/dx-scanner/commit/46a7a31))
* add yarnrc to ignore engines ([71421c1](https://github.com/dxheroes/dx-scanner/commit/71421c1))
* bind CollaborationInspector and IssueTrackingInspector, ([b23c983](https://github.com/dxheroes/dx-scanner/commit/b23c983))
* change date of PR so it can for testing practicing Does PR practice ([69932c3](https://github.com/dxheroes/dx-scanner/commit/69932c3))
* change dates ([8f9d5c1](https://github.com/dxheroes/dx-scanner/commit/8f9d5c1))
* condition, ([4213929](https://github.com/dxheroes/dx-scanner/commit/4213929))
* disable camel case in whole file instead of each line ([caef75b](https://github.com/dxheroes/dx-scanner/commit/caef75b))
* get all pullRequests ([7bbca3b](https://github.com/dxheroes/dx-scanner/commit/7bbca3b))
* getRepoCommits() test ([7ff57d6](https://github.com/dxheroes/dx-scanner/commit/7ff57d6))
* if the PR is updated, count with that date, not with the createdAt date ([bb374f0](https://github.com/dxheroes/dx-scanner/commit/bb374f0))
* increase coverage by adding some tests ([3801a6d](https://github.com/dxheroes/dx-scanner/commit/3801a6d))
* move getPathOrRepoUrl from ReporterUtils to GitServiceUtils ([2198384](https://github.com/dxheroes/dx-scanner/commit/2198384))
* move inspectors to language component context instead of overall container ([a19410f](https://github.com/dxheroes/dx-scanner/commit/a19410f))
* name of tests ([9f025d2](https://github.com/dxheroes/dx-scanner/commit/9f025d2))
* name of value ([a42909e](https://github.com/dxheroes/dx-scanner/commit/a42909e))
* optional created_at and updated_at ([a7773a5](https://github.com/dxheroes/dx-scanner/commit/a7773a5))
* refactor code ([2bd8bd9](https://github.com/dxheroes/dx-scanner/commit/2bd8bd9))
* remove ambiguous binding ([005b88b](https://github.com/dxheroes/dx-scanner/commit/005b88b))
* remove comma ([cf555bf](https://github.com/dxheroes/dx-scanner/commit/cf555bf))
* remove console.log() ([ae095e3](https://github.com/dxheroes/dx-scanner/commit/ae095e3))
* remove merge conflict ([dd8216d](https://github.com/dxheroes/dx-scanner/commit/dd8216d))
* remove unnecessary condition ([e0a43f5](https://github.com/dxheroes/dx-scanner/commit/e0a43f5))
* remove unnecessary name of branch ([9473353](https://github.com/dxheroes/dx-scanner/commit/9473353))
* remove unused imports ([535e1c7](https://github.com/dxheroes/dx-scanner/commit/535e1c7))
* rename files ([3769e64](https://github.com/dxheroes/dx-scanner/commit/3769e64))
* rename practice ([c96061d](https://github.com/dxheroes/dx-scanner/commit/c96061d))
* return CollaborationInspector and IssueTrackingInspector (not undefined), ([d461ad7](https://github.com/dxheroes/dx-scanner/commit/d461ad7))
* return repoCommits in own interface ([dca5707](https://github.com/dxheroes/dx-scanner/commit/dca5707))
* return repoCommits in own interface ([63fe746](https://github.com/dxheroes/dx-scanner/commit/63fe746))
* revert change ([741e491](https://github.com/dxheroes/dx-scanner/commit/741e491))
* revert change ([e8ae9ac](https://github.com/dxheroes/dx-scanner/commit/e8ae9ac))
* revert changes ([89765c2](https://github.com/dxheroes/dx-scanner/commit/89765c2))
* revert changes ([43d3f16](https://github.com/dxheroes/dx-scanner/commit/43d3f16))
* revert changes ([43c8eaf](https://github.com/dxheroes/dx-scanner/commit/43c8eaf))
* revert changes and fix tests ([98b444c](https://github.com/dxheroes/dx-scanner/commit/98b444c))
* revert changes and fix tets ([0437471](https://github.com/dxheroes/dx-scanner/commit/0437471))
* tests ([1c660ef](https://github.com/dxheroes/dx-scanner/commit/1c660ef))
* unify name ([c5bde88](https://github.com/dxheroes/dx-scanner/commit/c5bde88))
* url ([6710a7f](https://github.com/dxheroes/dx-scanner/commit/6710a7f))
* use different date as default ([a589a04](https://github.com/dxheroes/dx-scanner/commit/a589a04))
* use method to change the message of the repo commits ([bbf2136](https://github.com/dxheroes/dx-scanner/commit/bbf2136))
* use moment.js to convert days to milliseconds ([99585fe](https://github.com/dxheroes/dx-scanner/commit/99585fe))
* use parser-commit-message instead of manual parsing ([cf4b5cb](https://github.com/dxheroes/dx-scanner/commit/cf4b5cb))
* use qs ([e324c1f](https://github.com/dxheroes/dx-scanner/commit/e324c1f))
* version of parse-commit-message ([b804092](https://github.com/dxheroes/dx-scanner/commit/b804092))


### Features

* add getRepoCommits into CollaborationInspector ([fba7af9](https://github.com/dxheroes/dx-scanner/commit/fba7af9))
* add getRepoCommits into CollaborationInspector ([dccf3eb](https://github.com/dxheroes/dx-scanner/commit/dccf3eb))
* add new practice ([70e796a](https://github.com/dxheroes/dx-scanner/commit/70e796a))
* Detect parcticing/notPracticing based on date of commit and date of PR minus 30 days ([1948193](https://github.com/dxheroes/dx-scanner/commit/1948193))
* install parse-commit-message and add typings for that library ([2e04ac9](https://github.com/dxheroes/dx-scanner/commit/2e04ac9))

## [1.23.2](https://github.com/dxheroes/dx-scanner/compare/v1.23.1...v1.23.2) (2019-12-06)


### Bug Fixes

* type ([71733fd](https://github.com/dxheroes/dx-scanner/commit/71733fd))

## [1.23.1](https://github.com/dxheroes/dx-scanner/compare/v1.23.0...v1.23.1) (2019-12-06)


### Bug Fixes

*  add BitbucketIssueState enum ([563a7eb](https://github.com/dxheroes/dx-scanner/commit/563a7eb))
* add BitbucketPRState ([e05ca58](https://github.com/dxheroes/dx-scanner/commit/e05ca58))
* add value closedAt and mergedAt dynamically ([cf4bf51](https://github.com/dxheroes/dx-scanner/commit/cf4bf51))
* define tests better ([422f962](https://github.com/dxheroes/dx-scanner/commit/422f962))
* mergedAt and closedAt values, also fix tests for that ([e2e6dc6](https://github.com/dxheroes/dx-scanner/commit/e2e6dc6))

# [1.23.0](https://github.com/dxheroes/dx-scanner/compare/v1.22.1...v1.23.0) (2019-12-06)


### Bug Fixes

* add BitbucketPullRequestState because of CollaborationInspector to the options ([74fe662](https://github.com/dxheroes/dx-scanner/commit/74fe662))
* add filtering to the getPullRequests() ([90b995b](https://github.com/dxheroes/dx-scanner/commit/90b995b))
* add qs ([6022e9e](https://github.com/dxheroes/dx-scanner/commit/6022e9e))
* auth is possibly undefined ([1f35259](https://github.com/dxheroes/dx-scanner/commit/1f35259))
* data of owner ([fa0d129](https://github.com/dxheroes/dx-scanner/commit/fa0d129))
* delete unnecessary mock file ([952bb79](https://github.com/dxheroes/dx-scanner/commit/952bb79))
* fix tests and use mockBitbucketPullRequestResponse() ([1b6be4a](https://github.com/dxheroes/dx-scanner/commit/1b6be4a))
* get the info about user only once as it is always the same ([f54425d](https://github.com/dxheroes/dx-scanner/commit/f54425d))
* rename CVS to VCS ([c8c2f09](https://github.com/dxheroes/dx-scanner/commit/c8c2f09))
* rename files ([4a2d83d](https://github.com/dxheroes/dx-scanner/commit/4a2d83d))
* rename interfaces - add mock to the end of the name ([0ff0093](https://github.com/dxheroes/dx-scanner/commit/0ff0093))
* return array of states ([7f19213](https://github.com/dxheroes/dx-scanner/commit/7f19213))
* retype return type from getPRState() ([1769b52](https://github.com/dxheroes/dx-scanner/commit/1769b52))
* stringify undefined value ([2ddd585](https://github.com/dxheroes/dx-scanner/commit/2ddd585))
* typo ([0815844](https://github.com/dxheroes/dx-scanner/commit/0815844))
* use axios because bitbucket client can't allow to get all pullrequests. Write tests for that. ([03eafcf](https://github.com/dxheroes/dx-scanner/commit/03eafcf))
* use different interfaces for GitHub PR and Bitbucket PR ([7d2ecb5](https://github.com/dxheroes/dx-scanner/commit/7d2ecb5))
* use own definition of PR -> implement getPRState() to get the state specific for services ([2b67091](https://github.com/dxheroes/dx-scanner/commit/2b67091))
* use qs library ([42a10e5](https://github.com/dxheroes/dx-scanner/commit/42a10e5))
* values of owner ([c3c5ab2](https://github.com/dxheroes/dx-scanner/commit/c3c5ab2))


### Features

* add mockBitbucketPullRequestResponse() ([905fd11](https://github.com/dxheroes/dx-scanner/commit/905fd11))
* add options for filtering in CollaborationInspector ([572371b](https://github.com/dxheroes/dx-scanner/commit/572371b))

## [1.22.1](https://github.com/dxheroes/dx-scanner/compare/v1.22.0...v1.22.1) (2019-12-06)


### Bug Fixes

* **deps:** update dependency memfs to v3 ([6c8c259](https://github.com/dxheroes/dx-scanner/commit/6c8c259))

# [1.22.0](https://github.com/dxheroes/dx-scanner/compare/v1.21.1...v1.22.0) (2019-12-02)


### Bug Fixes

* **cli:** added an action start and stop to --init ([88edb72](https://github.com/dxheroes/dx-scanner/commit/88edb72))
* **cli:** added more conditions to check for existing files for --init ([5e98e0f](https://github.com/dxheroes/dx-scanner/commit/5e98e0f))
* **cli:** using sync method to write files & practices are sorted alphabetically ([fb46b95](https://github.com/dxheroes/dx-scanner/commit/fb46b95))


### Features

* **cli:** --init command creates a yaml config file ([29f0cbc](https://github.com/dxheroes/dx-scanner/commit/29f0cbc))

## [1.21.1](https://github.com/dxheroes/dx-scanner/compare/v1.21.0...v1.21.1) (2019-11-28)


### Bug Fixes

* **practices:** unify impact and defaultImpact to impact and ove… ([#170](https://github.com/dxheroes/dx-scanner/issues/170)) ([65adccb](https://github.com/dxheroes/dx-scanner/commit/65adccb))
* case of id in a practice ([cf00f5a](https://github.com/dxheroes/dx-scanner/commit/cf00f5a))
* change ID of practices for dependencies ([1bbcfe8](https://github.com/dxheroes/dx-scanner/commit/1bbcfe8))
* **practices:** unify impact and defaultImpact to impact and overridenImpact ([55ae3f8](https://github.com/dxheroes/dx-scanner/commit/55ae3f8))

# [1.21.0](https://github.com/dxheroes/dx-scanner/compare/v1.20.0...v1.21.0) (2019-11-28)


### Bug Fixes

* add email of an author ([ec651b5](https://github.com/dxheroes/dx-scanner/commit/ec651b5))
* add the return type ([dfe3320](https://github.com/dxheroes/dx-scanner/commit/dfe3320))
* add type of mocked response and fix the response ([869c21a](https://github.com/dxheroes/dx-scanner/commit/869c21a))
* add type to repoCommits ([e3953ea](https://github.com/dxheroes/dx-scanner/commit/e3953ea))
* auth is possibly undefined ([dc1f0f4](https://github.com/dxheroes/dx-scanner/commit/dc1f0f4))
* mocked response ([6c5a7cb](https://github.com/dxheroes/dx-scanner/commit/6c5a7cb))
* return repo commit in own interface ([c1cd1e4](https://github.com/dxheroes/dx-scanner/commit/c1cd1e4))
* tests and interfaces ([c746286](https://github.com/dxheroes/dx-scanner/commit/c746286))
* use one interface for both PullCommits and RepoCommits ([e936108](https://github.com/dxheroes/dx-scanner/commit/e936108))
* via https://github.com/DXHeroes/dx-scanner/pull/165#discussion_r348598072 ([9052e1f](https://github.com/dxheroes/dx-scanner/commit/9052e1f)), closes [/github.com/DXHeroes/dx-scanner/pull/165#discussion_r348598072](https://github.com//github.com/DXHeroes/dx-scanner/pull/165/issues/discussion_r348598072)


### Features

* add RepoCommit and RepoCommits class; ([9ccfead](https://github.com/dxheroes/dx-scanner/commit/9ccfead))
* implement getRepoCommits() ([8cd4fec](https://github.com/dxheroes/dx-scanner/commit/8cd4fec))

# [1.20.0](https://github.com/dxheroes/dx-scanner/compare/v1.19.0...v1.20.0) (2019-11-25)


### Features

* **fileInspector:** file inspector with root base path to scan files in whole root folder ([d0d66c3](https://github.com/dxheroes/dx-scanner/commit/d0d66c3))
* **practices:** use root FileInspector ([caa6a72](https://github.com/dxheroes/dx-scanner/commit/caa6a72))

# [1.19.0](https://github.com/dxheroes/dx-scanner/compare/v1.18.2...v1.19.0) (2019-11-21)


### Bug Fixes

* add condition ([46ce6d6](https://github.com/dxheroes/dx-scanner/commit/46ce6d6))
* https://github.com/DXHeroes/dx-scanner/pull/162/files#r347909025 ([849f794](https://github.com/dxheroes/dx-scanner/commit/849f794)), closes [/github.com/DXHeroes/dx-scanner/pull/162/files#r347909025](https://github.com//github.com/DXHeroes/dx-scanner/pull/162/files/issues/r347909025)
* impact of practice ([dab0aa2](https://github.com/dxheroes/dx-scanner/commit/dab0aa2))
* name of practice ([db00219](https://github.com/dxheroes/dx-scanner/commit/db00219))
* name of practice ([8dd07f1](https://github.com/dxheroes/dx-scanner/commit/8dd07f1))
* name of practice ([f2d5ee4](https://github.com/dxheroes/dx-scanner/commit/f2d5ee4))
* refactor code ([04fcb84](https://github.com/dxheroes/dx-scanner/commit/04fcb84))
* refactor code (extend the other practice with the first one) ([e7467fa](https://github.com/dxheroes/dx-scanner/commit/e7467fa))
* remove unnecessary code ([6a9f403](https://github.com/dxheroes/dx-scanner/commit/6a9f403))
* rename files and class ([dbd4cb0](https://github.com/dxheroes/dx-scanner/commit/dbd4cb0))
* rename property to packageName, ([ea1b3d0](https://github.com/dxheroes/dx-scanner/commit/ea1b3d0))
* rename SemverVersion to SemverLevel ([ec67b85](https://github.com/dxheroes/dx-scanner/commit/ec67b85))
* rename SemverVersion to SemverLevel and move it ([a7c4fc4](https://github.com/dxheroes/dx-scanner/commit/a7c4fc4))
* return PracticeEvaluationResult.unknown if there are no packages ([56adcf2](https://github.com/dxheroes/dx-scanner/commit/56adcf2))
* tests as the practice has changed ([f5aa230](https://github.com/dxheroes/dx-scanner/commit/f5aa230))
* wording ([51b7460](https://github.com/dxheroes/dx-scanner/commit/51b7460))


### Features

* add semverToPackageVersion() method, ([27ee181](https://github.com/dxheroes/dx-scanner/commit/27ee181))
* add Update Dependencies With Minor or Patch Level practice and tests for that ([1569601](https://github.com/dxheroes/dx-scanner/commit/1569601))
* change practice 'Update Dependencies' to 'Update Dependencies with Major Level' ([3daf397](https://github.com/dxheroes/dx-scanner/commit/3daf397))

## [1.18.2](https://github.com/dxheroes/dx-scanner/compare/v1.18.1...v1.18.2) (2019-11-19)


### Bug Fixes

* **configuration:** customized practices are not coumputed to the final DX Score now ([7c854d3](https://github.com/dxheroes/dx-scanner/commit/7c854d3))
* **configuration:** customized practices are not coumputed to the final DX Score now ([b5873ee](https://github.com/dxheroes/dx-scanner/commit/b5873ee))

## [1.18.1](https://github.com/dxheroes/dx-scanner/compare/v1.18.0...v1.18.1) (2019-11-18)


### Bug Fixes

* **bitbucket:** do not require bitbucket credentials twice ([381ca6f](https://github.com/dxheroes/dx-scanner/commit/381ca6f))

# [1.18.0](https://github.com/dxheroes/dx-scanner/compare/v1.17.10...v1.18.0) (2019-11-18)


### Features

* **cli:** do not require -a argument, accept env variable DX_GIT_SERVICE_TOKEN ([c10fdf9](https://github.com/dxheroes/dx-scanner/commit/c10fdf9))

## [1.17.10](https://github.com/dxheroes/dx-scanner/compare/v1.17.9...v1.17.10) (2019-11-18)


### Bug Fixes

* **cli:** remove sh because windows doesn't have it installed ([51402a0](https://github.com/dxheroes/dx-scanner/commit/51402a0))

## [1.17.9](https://github.com/dxheroes/dx-scanner/compare/v1.17.8...v1.17.9) (2019-11-16)


### Bug Fixes

* **bitbucket:** attempt to fix bitbucket URL parsing ([ef1a4d8](https://github.com/dxheroes/dx-scanner/commit/ef1a4d8))
* **bitbucket:** catch private/public repository attribute ([0aa04e6](https://github.com/dxheroes/dx-scanner/commit/0aa04e6))

## [1.17.8](https://github.com/dxheroes/dx-scanner/compare/v1.17.7...v1.17.8) (2019-11-15)


### Bug Fixes

* **deps:** update dependency ts-node to v8.5.2 ([93dcdd3](https://github.com/dxheroes/dx-scanner/commit/93dcdd3))

## [1.17.7](https://github.com/dxheroes/dx-scanner/compare/v1.17.6...v1.17.7) (2019-11-14)


### Bug Fixes

* **deps:** update dependency bitbucket to v1.15.2 ([bc24600](https://github.com/dxheroes/dx-scanner/commit/bc24600))

## [1.17.6](https://github.com/dxheroes/dx-scanner/compare/v1.17.5...v1.17.6) (2019-11-12)


### Bug Fixes

* use Regex for finding tslint package ([8010dd4](https://github.com/dxheroes/dx-scanner/commit/8010dd4))

## [1.17.5](https://github.com/dxheroes/dx-scanner/compare/v1.17.4...v1.17.5) (2019-11-12)


### Bug Fixes

* Log msg about number of components under report. ([532c786](https://github.com/dxheroes/dx-scanner/commit/532c786))
* refactor logging msg about number of components, ([e62a490](https://github.com/dxheroes/dx-scanner/commit/e62a490))
* remove comment ([b2c5cd6](https://github.com/dxheroes/dx-scanner/commit/b2c5cd6))
* remove unnecessary returning ([0d33fd3](https://github.com/dxheroes/dx-scanner/commit/0d33fd3))
* rename totalComponents, ([9acb9ad](https://github.com/dxheroes/dx-scanner/commit/9acb9ad))

## [1.17.4](https://github.com/dxheroes/dx-scanner/compare/v1.17.3...v1.17.4) (2019-11-11)


### Bug Fixes

* **deps:** update dependency ts-node to v8.5.0 ([b554ce8](https://github.com/dxheroes/dx-scanner/commit/b554ce8))

## [1.17.3](https://github.com/dxheroes/dx-scanner/compare/v1.17.2...v1.17.3) (2019-11-11)


### Bug Fixes

* **deps:** update dependency @octokit/rest to v16.35.0 ([8444d64](https://github.com/dxheroes/dx-scanner/commit/8444d64))

## [1.17.2](https://github.com/dxheroes/dx-scanner/compare/v1.17.1...v1.17.2) (2019-11-07)


### Bug Fixes

* **deps:** update dependency npm-check-updates to v3.2.1 ([28412af](https://github.com/dxheroes/dx-scanner/commit/28412af))

## [1.17.1](https://github.com/dxheroes/dx-scanner/compare/v1.17.0...v1.17.1) (2019-11-07)


### Bug Fixes

* Name of practice. ([83875f6](https://github.com/dxheroes/dx-scanner/commit/83875f6))

# [1.17.0](https://github.com/dxheroes/dx-scanner/compare/v1.16.0...v1.17.0) (2019-11-07)


### Bug Fixes

* **deps:** update dependency glob to v7.1.6 ([09fd91f](https://github.com/dxheroes/dx-scanner/commit/09fd91f))
* **java:** added Java into context for GitignoreIsPresent ([d777527](https://github.com/dxheroes/dx-scanner/commit/d777527))
* better AUTH error handling in index.ts ([203d3c2](https://github.com/dxheroes/dx-scanner/commit/203d3c2))


### Features

* **java:** re-defined Java practice for .gitignore ([73451ac](https://github.com/dxheroes/dx-scanner/commit/73451ac))

# [1.16.0](https://github.com/dxheroes/dx-scanner/compare/v1.15.2...v1.16.0) (2019-11-05)


### Bug Fixes

* **CLI auth:** prompt Bitbucket credentials only if a path is bbucket url ([999dd25](https://github.com/dxheroes/dx-scanner/commit/999dd25))
* **CLIReporter:** remove brackets after links ([7472643](https://github.com/dxheroes/dx-scanner/commit/7472643))
* scan recursively if found 0 components in a root path ([3801970](https://github.com/dxheroes/dx-scanner/commit/3801970))


### Features

* **scanner:** run on a root component only if not specified ([7a3d413](https://github.com/dxheroes/dx-scanner/commit/7a3d413))
* **scanner:** run on a root component only if not specified ([609e450](https://github.com/dxheroes/dx-scanner/commit/609e450))

## [1.15.2](https://github.com/dxheroes/dx-scanner/compare/v1.15.1...v1.15.2) (2019-11-03)


### Bug Fixes

* **deps:** update dependency npm-check-updates to v3.2.0 ([573f299](https://github.com/dxheroes/dx-scanner/commit/573f299))

## [1.15.1](https://github.com/dxheroes/dx-scanner/compare/v1.15.0...v1.15.1) (2019-10-31)


### Bug Fixes

* **CIUsedPractice:** respect config filed for Azure and Circle CI ([4efa8cb](https://github.com/dxheroes/dx-scanner/commit/4efa8cb))
* **FileInspector:** do not throw error if scanning for a files in subfolders ([7f2f5d9](https://github.com/dxheroes/dx-scanner/commit/7f2f5d9))
* **JS Practices:** mark as notPracticing if not exists `scripts` in package.json ([e2893e7](https://github.com/dxheroes/dx-scanner/commit/e2893e7))

# [1.15.0](https://github.com/dxheroes/dx-scanner/compare/v1.14.3...v1.15.0) (2019-10-31)


### Features

* **practices:** split gitignore correctly set to separated JS & TS ([bb69702](https://github.com/dxheroes/dx-scanner/commit/bb69702))

## [1.14.3](https://github.com/dxheroes/dx-scanner/compare/v1.14.2...v1.14.3) (2019-10-31)


### Bug Fixes

* **deps:** update dependency @octokit/rest to v16.34.1 ([047eaa8](https://github.com/dxheroes/dx-scanner/commit/047eaa8))
* **deps:** update dependency memfs to v2.16.1 ([391dcd8](https://github.com/dxheroes/dx-scanner/commit/391dcd8))

## [1.14.2](https://github.com/dxheroes/dx-scanner/compare/v1.14.1...v1.14.2) (2019-10-30)


### Bug Fixes

* **detectors:** unbind PythonLanguageDetector until fully supported ([c521abf](https://github.com/dxheroes/dx-scanner/commit/c521abf))

## [1.14.1](https://github.com/dxheroes/dx-scanner/compare/v1.14.0...v1.14.1) (2019-10-30)


### Bug Fixes

* **core:** exit after the printing the debug ([8623d57](https://github.com/dxheroes/dx-scanner/commit/8623d57))

# [1.14.0](https://github.com/dxheroes/dx-scanner/compare/v1.13.5...v1.14.0) (2019-10-30)


### Bug Fixes

* add filtering method to ScannerUtils and remove it from Scanner, ([03bf0e8](https://github.com/dxheroes/dx-scanner/commit/03bf0e8))
* arguments of getImpactFailureLevels(), ([53a15d6](https://github.com/dxheroes/dx-scanner/commit/53a15d6))
* lint code ([4bba638](https://github.com/dxheroes/dx-scanner/commit/4bba638))
* lint code ([121bbd2](https://github.com/dxheroes/dx-scanner/commit/121bbd2))
* Refactor code using .filter() method. ([f114c6e](https://github.com/dxheroes/dx-scanner/commit/f114c6e))
* remove constant and use practiceWitchContextFactory instead ([181d79a](https://github.com/dxheroes/dx-scanner/commit/181d79a))
* remove unnecessary code ([397e44e](https://github.com/dxheroes/dx-scanner/commit/397e44e))
* set default fail argument to high; ([7e27427](https://github.com/dxheroes/dx-scanner/commit/7e27427))


### Features

* **CI failure:** fail on recursive impacts ([31f6558](https://github.com/dxheroes/dx-scanner/commit/31f6558))
* **CLI:** add default value of fail ([7198ca7](https://github.com/dxheroes/dx-scanner/commit/7198ca7))

## [1.13.5](https://github.com/dxheroes/dx-scanner/compare/v1.13.4...v1.13.5) (2019-10-30)


### Bug Fixes

* **deps:** update dependency @oclif/config to v1.13.3 ([43d6a81](https://github.com/dxheroes/dx-scanner/commit/43d6a81))
* **deps:** update dependency @oclif/plugin-help to v2.2.1 ([a8567b0](https://github.com/dxheroes/dx-scanner/commit/a8567b0))
* **deps:** update dependency oclif to v1.14.2 ([0a7eabf](https://github.com/dxheroes/dx-scanner/commit/0a7eabf))
* **deps:** update dependency ts-node to v8.4.1 ([47aec18](https://github.com/dxheroes/dx-scanner/commit/47aec18))

## [1.13.4](https://github.com/dxheroes/dx-scanner/compare/v1.13.3...v1.13.4) (2019-10-30)


### Bug Fixes

* **deps:** update dependency eslint to v6.6.0 ([ae11775](https://github.com/dxheroes/dx-scanner/commit/ae11775))

## [1.13.3](https://github.com/dxheroes/dx-scanner/compare/v1.13.2...v1.13.3) (2019-10-30)


### Bug Fixes

* **deps:** update dependency @oclif/command to v1.5.19 ([75bcef3](https://github.com/dxheroes/dx-scanner/commit/75bcef3))

## [1.13.2](https://github.com/dxheroes/dx-scanner/compare/v1.13.1...v1.13.2) (2019-10-29)


### Bug Fixes

* **deps:** pin dependencies ([f9612f5](https://github.com/dxheroes/dx-scanner/commit/f9612f5))
* **practice:** upgrade ncu to new version with fixed process.on in for loop ([d19ae2f](https://github.com/dxheroes/dx-scanner/commit/d19ae2f))

## [1.13.1](https://github.com/dxheroes/dx-scanner/compare/v1.13.0...v1.13.1) (2019-10-25)


### Bug Fixes

* Add PracticeImpact types ([28ac483](https://github.com/dxheroes/dx-scanner/commit/28ac483))
* Loading yaml .eslintrc file ([938e178](https://github.com/dxheroes/dx-scanner/commit/938e178))
* name and id of practice ([fcfa1c7](https://github.com/dxheroes/dx-scanner/commit/fcfa1c7))
* Remove unnecessary comments. ([4e352eb](https://github.com/dxheroes/dx-scanner/commit/4e352eb))
* return impact in object ([1d1935d](https://github.com/dxheroes/dx-scanner/commit/1d1935d))
* Showing error message in debug mode. ([d7c3d2b](https://github.com/dxheroes/dx-scanner/commit/d7c3d2b))

# [1.13.0](https://github.com/dxheroes/dx-scanner/compare/v1.12.0...v1.13.0) (2019-10-24)


### Bug Fixes

* **CIUsedPractice:** detect Appveyor CI ([68456fa](https://github.com/dxheroes/dx-scanner/commit/68456fa))
* **CLI:** remove experimental warnings with Unix compatibility ([545a528](https://github.com/dxheroes/dx-scanner/commit/545a528))
* **CLIReport:** off and failed practices read from component instead of all ([b705f9e](https://github.com/dxheroes/dx-scanner/commit/b705f9e))


### Features

* **CLI:** remove experimental warnings ([b173afe](https://github.com/dxheroes/dx-scanner/commit/b173afe))

# [1.12.0](https://github.com/dxheroes/dx-scanner/compare/v1.11.0...v1.12.0) (2019-10-24)


### Bug Fixes

* **dockerization:** correctly detect library component instead of application ([b7aab05](https://github.com/dxheroes/dx-scanner/commit/b7aab05))


### Features

* **reports:** add DX Score ([20434da](https://github.com/dxheroes/dx-scanner/commit/20434da))

# [1.11.0](https://github.com/dxheroes/dx-scanner/compare/v1.10.0...v1.11.0) (2019-10-23)


### Bug Fixes

* upgraded TS interfaces according to TS 3.6 update ([a5934a7](https://github.com/dxheroes/dx-scanner/commit/a5934a7))
* **cache:** purge cache after each test suite ([557207a](https://github.com/dxheroes/dx-scanner/commit/557207a))
* **practices:** detect library correctly ([7f896ca](https://github.com/dxheroes/dx-scanner/commit/7f896ca))


### Features

* **CLI:** add scan duration time ([8c92bc1](https://github.com/dxheroes/dx-scanner/commit/8c92bc1))
* **FileInspector:** add cache to all methods ([0f137a3](https://github.com/dxheroes/dx-scanner/commit/0f137a3))

# [1.10.0](https://github.com/dxheroes/dx-scanner/compare/v1.9.0...v1.10.0) (2019-10-21)


### Bug Fixes

* add file GitHubService ([1f196a2](https://github.com/dxheroes/dx-scanner/commit/1f196a2))
* add interface and fix it ([19d29d6](https://github.com/dxheroes/dx-scanner/commit/19d29d6))
* add relevant type of bitbucketNock and return type ([d9dc3b3](https://github.com/dxheroes/dx-scanner/commit/d9dc3b3))
* add return type to mock responses ([005b592](https://github.com/dxheroes/dx-scanner/commit/005b592))
* allow only type string of userId. Fix returning UserInfo. ([d949be9](https://github.com/dxheroes/dx-scanner/commit/d949be9))
* auth with apppassword ([1e3c80c](https://github.com/dxheroes/dx-scanner/commit/1e3c80c))
* Bitbucket doesn't return time of closing, so the value will be undefined ([dc339b0](https://github.com/dxheroes/dx-scanner/commit/dc339b0))
* change error.status to error.code ([ec2b094](https://github.com/dxheroes/dx-scanner/commit/ec2b094))
* clone repo if it's not local ([ec3ae32](https://github.com/dxheroes/dx-scanner/commit/ec3ae32))
* Facelift of the tests ([c888dd0](https://github.com/dxheroes/dx-scanner/commit/c888dd0))
* fullname; counting totalCount if there is no item ([ef938b0](https://github.com/dxheroes/dx-scanner/commit/ef938b0))
* make base required ([c35f271](https://github.com/dxheroes/dx-scanner/commit/c35f271))
* Name of issueNumber ([542e28b](https://github.com/dxheroes/dx-scanner/commit/542e28b))
* name of PullRequestState and IssueState, which is used just by GitHub for now ([468c037](https://github.com/dxheroes/dx-scanner/commit/468c037))
* Not passing build https://travis-ci.org/DXHeroes/dx-scanner/jobs/600727699 ([81fc734](https://github.com/dxheroes/dx-scanner/commit/81fc734))
* remove unused imports ([68276a8](https://github.com/dxheroes/dx-scanner/commit/68276a8))
* rename IGitHubService to ICSVService, ([aa77885](https://github.com/dxheroes/dx-scanner/commit/aa77885))
* return id as a string ([2abf5f8](https://github.com/dxheroes/dx-scanner/commit/2abf5f8))
* return issue is as a string, ([3b84e02](https://github.com/dxheroes/dx-scanner/commit/3b84e02))
* return responses in own interfaces ([10e1ab6](https://github.com/dxheroes/dx-scanner/commit/10e1ab6))
* returning interfaces ([4ba6887](https://github.com/dxheroes/dx-scanner/commit/4ba6887))
* returning object ([bf255d3](https://github.com/dxheroes/dx-scanner/commit/bf255d3))
* Show the right message to the user accordingt to used CVS. ([188eef6](https://github.com/dxheroes/dx-scanner/commit/188eef6))
* Split mock response into files ([13d79f0](https://github.com/dxheroes/dx-scanner/commit/13d79f0))
* testing path of bitbucket ([0fcf989](https://github.com/dxheroes/dx-scanner/commit/0fcf989))
* tests ([c229212](https://github.com/dxheroes/dx-scanner/commit/c229212))
* tests for BitbucketService ([f7537bf](https://github.com/dxheroes/dx-scanner/commit/f7537bf))
* typo in name of file ([5150580](https://github.com/dxheroes/dx-scanner/commit/5150580))
* use git-url-parser package to get username ([6f4c8f0](https://github.com/dxheroes/dx-scanner/commit/6f4c8f0))
* user url ([444cdbf](https://github.com/dxheroes/dx-scanner/commit/444cdbf))


### Features

* add isBitbucketPath() to check if the path is from Bitbucket. ([a958164](https://github.com/dxheroes/dx-scanner/commit/a958164))
* bind BitbucketService ([c511023](https://github.com/dxheroes/dx-scanner/commit/c511023))

# [1.9.0](https://github.com/dxheroes/dx-scanner/compare/v1.8.0...v1.9.0) (2019-10-21)


### Bug Fixes

* ruby language detector Gemfile ([672680e](https://github.com/dxheroes/dx-scanner/commit/672680e))


### Features

* add ruby language detector ([59a430f](https://github.com/dxheroes/dx-scanner/commit/59a430f))

# [1.8.0](https://github.com/dxheroes/dx-scanner/compare/v1.7.0...v1.8.0) (2019-10-21)


### Features

* add composer file to the detector ([5ad4c7d](https://github.com/dxheroes/dx-scanner/commit/5ad4c7d))
* add cpp language detector ([871c47d](https://github.com/dxheroes/dx-scanner/commit/871c47d))
* add php language detector ([54e0ac6](https://github.com/dxheroes/dx-scanner/commit/54e0ac6))

# [1.7.0](https://github.com/dxheroes/dx-scanner/compare/v1.6.1...v1.7.0) (2019-10-17)


### Features

* add golang language detector ([b063c3d](https://github.com/dxheroes/dx-scanner/commit/b063c3d)), closes [#82](https://github.com/dxheroes/dx-scanner/issues/82)

## [1.6.1](https://github.com/dxheroes/dx-scanner/compare/v1.6.0...v1.6.1) (2019-10-03)


### Bug Fixes

* add tests for EslintCorrectlyUsedPractice ([187f697](https://github.com/dxheroes/dx-scanner/commit/187f697))
* Allow user to add impact in object in dx config file ([22e1577](https://github.com/dxheroes/dx-scanner/commit/22e1577))
* allow user to customize configuration of DX scanner so it could be string or object ([a58f571](https://github.com/dxheroes/dx-scanner/commit/a58f571))
* Catch the error and if it's SyntaxError return PracticeEvaluationResult.unknown ([be7d1b9](https://github.com/dxheroes/dx-scanner/commit/be7d1b9))
* compare RegExp name with the package.name ([3e4a3f4](https://github.com/dxheroes/dx-scanner/commit/3e4a3f4))
* eslint practice ([6acf75f](https://github.com/dxheroes/dx-scanner/commit/6acf75f))
* Fix the condition for eslintIgnore ([54ca010](https://github.com/dxheroes/dx-scanner/commit/54ca010))
* Interface of Config; add  interface for EslintConfig and use it in PracticeContext ([70f4c9c](https://github.com/dxheroes/dx-scanner/commit/70f4c9c))
* Path for scanFor() ([c29708a](https://github.com/dxheroes/dx-scanner/commit/c29708a))
* Remove console.logs, ([08a78cf](https://github.com/dxheroes/dx-scanner/commit/08a78cf))
* Remove unnecessary logs. ([85baa4e](https://github.com/dxheroes/dx-scanner/commit/85baa4e))
* remove unnecessary type definition ([3e6fd36](https://github.com/dxheroes/dx-scanner/commit/3e6fd36))
* rename EslintConfig to PracticeConfig; return always PracticeConfig in getOverridenPractice() ([81e00cd](https://github.com/dxheroes/dx-scanner/commit/81e00cd))
* rename practice ([05c09f7](https://github.com/dxheroes/dx-scanner/commit/05c09f7))
* run on eslint/espree repo ([faa838e](https://github.com/dxheroes/dx-scanner/commit/faa838e))
* throw error if it's not a SyntaxError ([3644149](https://github.com/dxheroes/dx-scanner/commit/3644149))
* typo ([2dcb4c4](https://github.com/dxheroes/dx-scanner/commit/2dcb4c4))
* typo ([898dcc6](https://github.com/dxheroes/dx-scanner/commit/898dcc6))

# [1.6.0](https://github.com/dxheroes/dx-scanner/compare/v1.5.0...v1.6.0) (2019-10-02)


### Features

* **cli:** add update-notifier ([6733185](https://github.com/dxheroes/dx-scanner/commit/6733185)), closes [#70](https://github.com/dxheroes/dx-scanner/issues/70)

# [1.5.0](https://github.com/dxheroes/dx-scanner/compare/v1.4.2...v1.5.0) (2019-10-02)


### Features

* **cli:** add postinstall message with hint to create .dxscannerrc config file ([b652ee2](https://github.com/dxheroes/dx-scanner/commit/b652ee2))

## [1.4.2](https://github.com/dxheroes/dx-scanner/compare/v1.4.1...v1.4.2) (2019-10-02)


### Bug Fixes

* **GitService:** change join for resolve ([#74](https://github.com/dxheroes/dx-scanner/issues/74)) ([e5e4827](https://github.com/dxheroes/dx-scanner/commit/e5e4827))

## [1.4.1](https://github.com/dxheroes/dx-scanner/compare/v1.4.0...v1.4.1) (2019-09-12)


### Bug Fixes

* add new practicesWitchContext for every component in for loop. ([#46](https://github.com/dxheroes/dx-scanner/issues/46)) ([d5d50db](https://github.com/dxheroes/dx-scanner/commit/d5d50db))

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
