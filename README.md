[![Version](https://img.shields.io/npm/v/dx-scanner.svg)](https://npmjs.org/package/dx-scanner)
[![Travis (.org)](https://img.shields.io/travis/DXHeroes/dx-scanner)](https://travis-ci.org/DXHeroes/dx-scanner)
![Codecov](https://img.shields.io/codecov/c/github/DXHeroes/dx-scanner)
![last commit](https://img.shields.io/github/last-commit/DXHeroes/dx-scanner)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/DXHeroes/dx-scanner)
[![Downloads/week](https://img.shields.io/npm/dw/dx-scanner.svg)](https://npmjs.org/package/dx-scanner)
![GitHub contributors](https://img.shields.io/github/contributors/DXHeroes/dx-scanner)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg)](#contributors-)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
![TypeScript](https://img.shields.io/badge/%3C%2F%3E-Typescript-blue)
[![Twitter Follow](https://img.shields.io/twitter/follow/DX_Heroes?style=social)](https://twitter.com/DX_Heroes)

# DX Scanner

DX Scanner is an open-source library that allows you to “measure” Developer Experience directly based on your source code and recommend practices to adopt that will help you to improve your product development.

### Which languages are supported?
Language | Supported
------------ | -------------
JavaScript/TypeScript | ✅
Ruby | 🚧
C# | 🚧
Java | 🚧
Python | 🚧
C++ | 🚧

## Getting Started 🏁

### Installation

- with NPM
  
  ```npm install -g dx-scanner``` 
- with Yarn 
  
  ```yarn global add dx-scanner```

### Usage

**Scan repository**
```
dx-scanner https://github.com/DXHeroes/dx-scanner
```
**Scan local path**
```
dx-scanner ~/my-project
```

**All options**

```
dx-scanner [path]
```

**Aliases**
```
dx-scanner [path]

dxscanner [path]

dxs [path]
```

## Configuration ⚙️
Add ```dxscannerrc.*``` config file to change default configuration. It can be a ```.json```, ```.yml``` even dotfile!

**Practices**  
You can switch off practices you don't want to scan or change its impact. Use the id of the practice.

Possible impact:
```
high

medium

small

hint

off
```

Example :
```
{
    "practices": {
        "JavaScript.GitignoreCorrectlySet": "medium",
        "JavaScript.LoggerUsed": "off"
    }
}
```

## Contributing 👩‍💻 👨‍💻
Feel free to contribute to the DX Scanner. If you want to contribute, please follow our [Contribution Guide](CONTRIBUTING.md).

## License 📝

The DX Scanner open source project is licensed under the [Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/prokopsimek"><img src="https://avatars2.githubusercontent.com/u/5487217?v=4" width="100px;" alt="Prokop Simek"/><br /><sub><b>Prokop Simek</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=prokopsimek" title="Code">💻</a> <a href="#maintenance-prokopsimek" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/adelkahomolova"><img src="https://avatars2.githubusercontent.com/u/53510747?v=4" width="100px;" alt="adelkah"/><br /><sub><b>adelkah</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=adelkahomolova" title="Code">💻</a> <a href="#maintenance-adelkahomolova" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/radektheloner"><img src="https://avatars3.githubusercontent.com/u/7268060?v=4" width="100px;" alt="Radek Holý"/><br /><sub><b>Radek Holý</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=radektheloner" title="Code">💻</a></td>
    <td align="center"><a href="http://www.applifting.cz"><img src="https://avatars2.githubusercontent.com/u/346066?v=4" width="100px;" alt="Vratislav Kalenda"/><br /><sub><b>Vratislav Kalenda</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=Vratislav" title="Code">💻</a> <a href="#ideas-Vratislav" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://www.petrvnenk.com"><img src="https://avatars2.githubusercontent.com/u/1933654?v=4" width="100px;" alt="Petr Vnenk"/><br /><sub><b>Petr Vnenk</b></sub></a><br /><a href="https://github.com/DXHeroes/dx-scanner/commits?author=vnenkpet" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
