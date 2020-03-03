[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=DX%20Scanner%20is%20an%20open%20source%20CLI%20tool%20that%20allows%20you%20to%20“measure”%20Developer%20Experience%20directly%20based%20on%20your%20source%20code.&url=https://github.com/DXHeroes/dx-scanner&via=dx_heroes&hashtags=developer-experience,dxheroes,developers)

<p align="center">
  <a href="https://dxscanner.io" target="_blank"><img src="https://github.com/DXHeroes/dx-scanner/blob/master/docs/logo.svg" /></a>
</p>

[![Version](https://img.shields.io/npm/v/dx-scanner.svg)](https://npmjs.org/package/dx-scanner)
[![Travis (.org)](https://img.shields.io/travis/DXHeroes/dx-scanner/master)](https://travis-ci.org/DXHeroes/dx-scanner)
![Codecov](https://img.shields.io/codecov/c/github/DXHeroes/dx-scanner)
![last commit](https://img.shields.io/github/last-commit/DXHeroes/dx-scanner)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/DXHeroes/dx-scanner)
[![Downloads/week](https://img.shields.io/npm/dw/dx-scanner.svg)](https://npmjs.org/package/dx-scanner)
![GitHub contributors](https://img.shields.io/github/contributors/DXHeroes/dx-scanner)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg)](#contributors-)
[![NPM](https://img.shields.io/npm/l/dx-scanner)](LICENSE)
![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue)

---

## What is DX Scanner?

DX Scanner is an open source CLI tool that allows you to “measure” Developer Experience directly based on your source code. DX Scanner recommends practices that can help you with improving your product development. You can fix some problems automatically with just one command.

### What language is supported?

Language | Supported
------------ | -------------
JavaScript/TypeScript | ✅
Java/Kotlin | ✅
Python | ✅
PHP | 🚧
C++ | 🚧
C# | 🚧
Ruby | 🚧

## Table of Contents

<!-- toc -->
* [Getting Started](#Getting-Started)
  * [Installation](#Installation)
  * [Usage](#Usage)
    * [Commands](#Commands)
    * [Options for dx-scanner run](#options-for-dx-scanner-run)
    * [Auto-fixer](#Auto-fixer)
* [Supported Languages](#What-language-is-supported)
* [Configuration](#Configuration-⚙️)
  * [Practices](#Practices)
  * [GitHub CI Action](#GitHub-Ci-Action)
<!-- tocstop -->

## Getting Started 🏁

### Installation

- with NPM
  
  ```npm install -g dx-scanner``` 
- with Yarn 
  
  ```yarn global add dx-scanner```

### Usage
<!--
Quick start
-->
```
  dx-scanner run [path] [options]
```

Example:
```
  dx-scanner run https://github.com/DXHeroes/dx-scanner
```

<!--
Help for command dxs
-->
#### Commands
```
Usage: dx-scanner [command] [options] 

Options:
  -V, --version         output the version number
  -h, --help            output usage information

Commands:
  run [options] [path]  Scan your project for possible DX recommendations
  init                  Initialize DX Scanner configuration
  practices [options]   List all practices id with name and impact

Aliases:
  dxs
  dxscanner
```

#### Options for `dx-scanner run`

```
Usage: dx-scanner run [path] [options]

Scan your project for possible DX recommendations

Options:
  -a --authorization <authorization>  credentials to the repository (in format "token" or "username:token"; can be set as ENV variable DXSCANNER_GIT_SERVICE_TOKEN)
  --ci                                CI mode (default: false)
  -d --details                        print details in reports
  --fail <impact>                     exits process with code 1 for any non-practicing condition of given level (high|medium|small|hint|off|all) (default: "high")
  --fix                               tries to fix problems automatically (default: false)
  --fixPattern <pattern>              fix only rules with IDs matching the regex
  -j --json                           print report in JSON (default: false)
  -r --recursive                      scan all components recursively in all sub folders (default: false)
  -h, --help                          output usage information

Examples:
  dx-scanner run
  dx-scanner run ./ --fail=high
  dx-scanner run github.com/DXHeroes/dx-scanner
```
</details>

#### Auto-fixer

Fix problems detected by DX Scanner automatically.
```
dx-scanner run [PATH] --fix
```

This will try to fix all *fixable* practices which are not being practices yet.
If you want to omit a practice from automatic fixing, you can do it in the configuration file (see below).

You can also specify `fixPattern` flag to fix only a subset of *fixable* practices.
```
dx-scanner run [PATH] --fix --fixPattern=lint
```

Please note, that `fixPattern` flag overrides `fix` settings from configuration file. Therefore practices ommited from fixing by configuration file, but included through `fixPattern` will be fixed.

## Configuration ⚙️
Add ```dxscannerrc.*``` config file to change default configuration settings. It can be a ```.json```, ```.yml```, or even a dotfile!

You can also run ```dx-scanner init``` to initialize config automatically.

### Practices   
You can switch off practices that you do not want to scan or you can change their impact level. To do so, refer to the id of the practice.

<details>
<summary>List of All Practices 🔍</summary>

Practice | Impact | Language Independent | JavaScript/TypeScript | Java/Kotlin | Python
------------- | ------------- | ------------- | ------------- | ------------- | ------------- 
Create a Readme File | <span style="color:red">high</span> | ✅ | ✅ | ✅ | ✅
Create a License File | <span style="color:yellow">medium</span> | ✅ | ✅ | ✅ | ✅
Create a Lockfile | <span style="color:red">high</span> | ✅ | ✅ | ✅ | ✅
Create a .gitignore | <span style="color:red">high</span> | ✅ | ✅ | ✅ | ✅
Write in Typescript | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Set .gitignore Correctly | <span style="color:red">high</span> | ❌ | ✅ | ✅ | ❌
Use Continuous Integration | <span style="color:red">high</span> | ✅ | ✅ | ✅ | ✅
Use Docker | <span style="color:green">small</span> | ✅ | ✅ | ✅ | ✅
Use .editorconfig | <span style="color:green">small</span> | ✅ | ✅ | ✅ | ✅
Format your code automatically | <span style="color:green">small</span> | ❌ | ✅ | ❌ | ❌
Use ESLint | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
ESLint Without Errors | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Use a different linter | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Use JS Frontend Testing Framework | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Use JS Frontend Build Tools | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Use JS Backend Testing Frameworks | <span style="color:red">high</span> | ❌ | ✅ | ❌ | ❌
Use a JS Logging Library | <span style="color:green">small</span> | ❌ | ✅ | ❌ | ❌
Use Package Management | <span style="color:red">high</span> | ❌ | ✅ | ✅ | ❌
Configure Scripts in package.json | <span style="color:yellow">medium</span> | ❌ | ✅ | ❌ | ❌
Update Dependencies of Major Level | <span style="color:green">small</span> | ❌ | ✅ | ✅ | ❌
Update Dependencies of Minor and Patch Level | <span style="color:red">high</span> | ❌ | ✅ | ✅ | ❌ 
Do PullRequests | <span style="color:yellow">medium</span> | ✅ | ✅ | ✅ | ✅
Break down large pull requests into smaller ones | <span style="color:yellow">medium</span> | ✅ | ✅ | ✅ | ✅
Solve Pull Requests Continuously | <span style="color:yellow">medium</span> | ✅ | ✅ | ✅ | ✅
Solve Issues Continuously | <span style="color:yellow">medium</span> | ✅ | ✅ | ✅ | ✅
Write Commit Messages by Convention | <span style="color:green">small</span> | ✅ | ✅ | ✅ | ✅
Use Mocking Frameworks for Tests  | <span style="color:green">small</span> | ❌ | ✅ | ✅ | ❌
Use Testing Frameworks | <span style="color:red">high</span> | ❌ | ❌ | ✅ | ❌
Use a Java Logging Dependency | <span style="color:green">small</span> | ❌ | ❌ | ✅ | ❌
Use a Java Linter Dependency | <span style="color:green">small</span> | ❌ | ❌ | ✅ | ❌
Use Java Class Naming Convention | <span style="color:green">small</span> | ❌ | ❌ | ✅ | ❌
Security vulnerabilities detected | <span style="color:red">high</span> | ❌ | ✅ | ❌ | ❌
</details>

Possible impact:
```
high

medium

small

hint

off
```

Example `dxscannerrc.json`:

```json

{
    "practices": {
        "JavaScript.GitignoreCorrectlySet": "medium",
        "JavaScript.LoggerUsed": "off",
        "LanguageIndependent.DoesPullRequests": {
          "impact": "small"
        },
        "JavaScript.ESLintWithoutErrorsPractice": {
          "fix": true
        }
    }
}
```

### Github CI Action

**Basic example**: run DX Scanner on each push to the repo

Create `.github/workflows/main.yml`.

```yml
name: DX Scanner
on: push
jobs:
  dx-scanner:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Runs DX Scanner on the code
        uses: DXHeroes/dx-scanner@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

[Generate your Github personal token](https://github.com/settings/tokens/new) and [set it as an encrypted secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) named `GITHUB_TOKEN`.

## Score Computation 💯
The impact of each practice is represented by a specific value. DX Scanner uses these values to calculate the overall DX Score.

```
high = 100 points

medium = 75 points

small = 50 points 

hint = 25 points
```

The practices you have switched off are not included in the calculation (0 points).

## Contributing 👩‍💻 👨‍💻
Feel free to contribute to our DX Scanner. Please follow the [Contribution Guide](CONTRIBUTING.md).

## License 📝

The DX Scanner open source project is licensed under the [MIT](LICENSE).

## Contributors ✨

Many thanks to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/prokopsimek"><img src="https://avatars2.githubusercontent.com/u/5487217?v=4" width="100px;" alt=""/><br /><sub><b>Prokop Simek</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=prokopsimek" title="Code">💻</a> <a href="#maintenance-prokopsimek" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/adelkahomolova"><img src="https://avatars2.githubusercontent.com/u/53510747?v=4" width="100px;" alt=""/><br /><sub><b>adelkah</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=adelkahomolova" title="Code">💻</a> <a href="#maintenance-adelkahomolova" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/radektheloner"><img src="https://avatars3.githubusercontent.com/u/7268060?v=4" width="100px;" alt=""/><br /><sub><b>Radek Holý</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=radektheloner" title="Code">💻</a></td>
    <td align="center"><a href="http://www.applifting.cz"><img src="https://avatars2.githubusercontent.com/u/346066?v=4" width="100px;" alt=""/><br /><sub><b>Vratislav Kalenda</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=Vratislav" title="Code">💻</a> <a href="#ideas-Vratislav" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://www.petrvnenk.com"><img src="https://avatars2.githubusercontent.com/u/1933654?v=4" width="100px;" alt=""/><br /><sub><b>Petr Vnenk</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=vnenkpet" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ryzzaki"><img src="https://avatars1.githubusercontent.com/u/31356058?v=4" width="100px;" alt=""/><br /><sub><b>Cuong Nguyen</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=ryzzaki" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/vlasy"><img src="https://avatars3.githubusercontent.com/u/13099178?v=4" width="100px;" alt=""/><br /><sub><b>vlasy</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=vlasy" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Any kind of contributions are welcome!
