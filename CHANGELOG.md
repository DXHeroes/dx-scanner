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
