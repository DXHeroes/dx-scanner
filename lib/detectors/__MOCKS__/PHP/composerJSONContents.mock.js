"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composerJSONContents = void 0;
exports.composerJSONContents = `
{
  "name": "ergebnis/composer-normalize",
  "type": "composer-plugin",
  "description": "Provides a composer plugin for normalizing composer.json.",
  "keywords": [
    "composer",
    "normalizer",
    "normalize",
    "plugin"
  ],
  "homepage": "https://github.com/ergebnis/composer-normalize",
  "license": "MIT",
  "authors": [
    {
      "name": "Andreas Möller",
      "email": "am@localheinz.com"
    }
  ],
  "require": {
    "php": "^7.2 || ^8.0",
    "composer-plugin-api": "^1.1.0 || ^2.0.0",
    "ergebnis/json-normalizer": "~0.13.1",
    "ergebnis/json-printer": "^3.1.1",
    "justinrainbow/json-schema": "^5.2.10",
    "localheinz/diff": "^1.1.1"
  },
  "require-dev": {
    "composer/composer": "^1.10.13 || ^2.0.0",
    "composer/package-versions-deprecated": "^1.11.99",
    "ergebnis/phpstan-rules": "~0.15.2",
    "ergebnis/test-util": "^1.3.0",
    "jangregor/phpstan-prophecy": "~0.8.0",
    "phpstan/extension-installer": "^1.0.5",
    "phpstan/phpstan": "~0.12.48",
    "phpstan/phpstan-deprecation-rules": "~0.12.5",
    "phpstan/phpstan-phpunit": "~0.12.16",
    "phpstan/phpstan-strict-rules": "~0.12.5",
    "phpunit/phpunit": "^8.5.8",
    "symfony/filesystem": "^5.1.7"
  },
  "config": {
    "platform": {
      "php": "7.2.33"
    },
    "preferred-install": "dist",
    "sort-packages": true
  },
  "extra": {
    "class": "Ergebnis\\Composer\\Normalize\\NormalizePlugin"
  },
  "autoload": {
    "psr-4": {
      "Ergebnis\\Composer\\Normalize\\": "src/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "Ergebnis\\Composer\\Normalize\\Test\\": "test/"
    }
  },
  "minimum-stability": "dev",
  "prefer-stable": true,
  "support": {
    "issues": "https://github.com/ergebnis/composer-normalize/issues",
    "source": "https://github.com/ergebnis/composer-normalize"
  }
}
`;
//# sourceMappingURL=composerJSONContents.mock.js.map