# CMG sensors

This project contains a `node / javascript` solution to obtain precision of inexpensive home sensors given
their readings in a logging file.

## Stack

Follwing are web technologies used in the solution.

- Node.js / Javascript
- Typescript
- Prettier
- Eslint
- Jest
- yarn

## Steps to run

Recommended Node.js version is v16.17.0.

- Clone the repository
- Go to the project folder & install packages by running: `yarn`
- After packages are installed successfully, run `yarn run dev:watch`
- You will be able to see a result similar:

```
{
  'temp-1': 'precise',
  'temp-2': 'ultra precise',
  'hum-1': 'keep',
  'hum-2': 'discard',
  'mon-1': 'keep',
  'mon-2': 'keep'
}

```
