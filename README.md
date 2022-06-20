# @draught/db

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Draught DB

## Install

```bash
npm install @draught-db
```

## Usage

Create a database client:

```ts
// lib/db.ts
import initializeDatabase, { DbConfig } from '@draught/db';
import Schema from './schema';

export default initializeDatabase({
  appName: 'my-app',
  databaseName: 'my_app_development',
});
```

Use the helper base schemas:

```ts
import * as z from 'zod';
import { BaseSchema } from '@draught/db';

export const UserSchema = BaseSchema.extend({
  email: z.string(),
  password: z.string(),
});
```

[build-img]: https://github.com/davewasmer/draught-db/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/davewasmer/draught-db/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/@draught/db
[downloads-url]: https://www.npmtrends.com/@draught/db
[npm-img]: https://img.shields.io/npm/v/@draught/db
[npm-url]: https://www.npmjs.com/package/@draught/db
[issues-img]: https://img.shields.io/github/issues/davewasmer/draught-db
[issues-url]: https://github.com/davewasmer/draught-db/issues
[codecov-img]: https://codecov.io/gh/davewasmer/draught-db/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/davewasmer/draught-db
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
