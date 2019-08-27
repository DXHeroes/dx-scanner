# Contributing to DX Scanner

It seems you want to participate on DX Scanner - that's great! We welcome contributions to our [open source project on GitHub](http://github.com/DXHeroes/dx-scanner).

## Introduction
We're glad you're interested in DX Scanner in the way of contributing. We value the pro-community developers as you are.

## Help the community
1) Repport an Error or Bug 🐛
2) Request a Feature 🆕
3) Contribute Code 👨‍💻👩‍💻
4) Contribute Documentation 📝
5) Provide Support on Issues ℹ️

## Need a help?

If you have any question about this project, how to use it, or just need clarification about anything open an Issue at https://github.com/DXHeroes/dx-scanner/issues .

## Contributing

1. **Fork & Clone** the repository
2. **Setup** the DX Scanner
    - Install Yarn with `npm i -g yarn` if not yet installed
    - Install packages with `yarn install`
    - Run with `yarn start`
    - Build with `yarn build`
    - Run tests with `yarn test`
    - Lint code with `yarn lint` or `yarn lint:fix` with autofixer
3.  **Commit** changes to your own branch
4.  **Push** your work back up to your fork
5.  Submit a **Pull Request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request.

## Contribute Code
### Practices
Practices check your repository for using tooling, which improves product development.

#### JavaScript/TypeScript
We have more than 10 JS/TS practices for now! If you want to add more, you're more than welcome. Check [JavaScript Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices/JavaScript) to see, what's the pattern of implementation of your own practice.

#### Other Languages
Other languages are not supported yet. If you want to contribute, check [Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices). Get inspired by [Javascript Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices/JavaScript) implementation.

### Inspectors
Inspectors indirectly works with Git code hosting providers APIs. They use common interfaces provided by services so you don't have to which API to use.

### Services
There is a [File System Service](https://github.com/DXHeroes/dx-scanner/tree/master/src/services) working with files.

#### Git
Services directly use Git code hosting providers APIs while checking the rate limits. They convert API responses to the own interface, so Inspectors can use them. Only the GitHub Service is implemented for now. If you need e.g. GitLab Service, you can contribute! Get inspired by [GitHub Service](https://github.com/DXHeroes/dx-scanner/blob/master/src/services/git/GitHubService.ts)

## Copyright and Licensing

The DX Scanner open source project is licensed under the [Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## [FAQ](https://github.com/DXHeroes/dx-scanner/issues?q=label%3Afaq+sort%3Aupdated-desc+is%3Aclosed)
