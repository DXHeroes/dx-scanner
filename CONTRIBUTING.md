# Contributing to DX Scanner

It seems like you want to participate on our DX Scanner - that's great! We welcome contributions to our [open source project on GitHub](http://github.com/DXHeroes/dx-scanner).

## Introduction

We are glad that you are interested in DX Scanner in the way of contributing. We value the pro-community developers as you are.

## Help the community

1) Report an Error or a Bug 🐛
2) Request a Feature 🆕
3) Contribute to the Code 👨‍💻👩‍💻
4) Contribute to the Documentation 📝
5) Provide Support on Issues ℹ️

## Need help?

If you have any question about this project (for example, how to use it) or if you just need some clarification about anything, please open an Issue at [Issues](https://github.com/DXHeroes/dx-scanner/issues).

## Contributing

Follow these steps:

1. **Fork & Clone** the repository  
2. **Setup** the DX Scanner  
   - Install Yarn with `npm i -g yarn` if not yet installed  
   - Install packages with `yarn install`  
   - Run with `yarn start`  
   - Build with `yarn build`  
   - Run tests with `yarn test`  
   - Lint code with `yarn lint` or `yarn lint:fix` with autofixer  
3. **Commit** changes to your own branch by convention. See https://www.conventionalcommits.org/en/v1.0.0/
4. **Push** your work back up to your fork  
5. Submit a **Pull Request** so that we can review your changes

**NOTE: Be sure to merge the latest from "upstream" before making a pull request.**

## Contribute Code

### Practices

Check your repository for using the correct tooling which improves product development.

#### JavaScript/TypeScript

We have more than 10 JS/TS practices for now! If you want to add more, you are more than welcome. Check [JavaScript Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices/JavaScript) to see what is the pattern of implementation of your own practice.

#### Other Languages

Other languages are not supported yet. If you want to contribute, see [Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices). Get inspired by [Javascript Practices](https://github.com/DXHeroes/dx-scanner/tree/master/src/practices/JavaScript) implementation.

### Inspectors

Inspectors indirectly work with Git code hosting providers APIs. They use common interfaces provided by services so you do not have to know which API to use.

### Services

There is a [File System Service](https://github.com/DXHeroes/dx-scanner/tree/master/src/services) working with files.

#### Git

Services directly use Git code hosting providers APIs while checking the rate limits. They convert API responses to their own interface so Inspectors can use them. Only the GitHub Service is implemented so far. If you need for example, GitLab Service, you can contribute! Get inspired by [GitHub Service](https://github.com/DXHeroes/dx-scanner/blob/master/src/services/git/GitHubService.ts)

## Contributing DevOps

To build a Docker image with DX Scanner run
```bash
docker build . -t dxs
```
and to run
```
docker run -it -v `pwd`:/usr/app dxs
# or
docker run -it -v `pwd`:/usr/app dxs dx-scanner run .
```

## Copyright and Licensing

The DX Scanner open source project is licensed under the [MIT License](LICENSE).

## [FAQ](https://github.com/DXHeroes/dx-scanner/issues?q=label%3Afaq+sort%3Aupdated-desc+is%3Aclosed)
