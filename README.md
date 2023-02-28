![Skeet Framework Logo](https://user-images.githubusercontent.com/20677823/221215449-93a7b5a8-5f33-4da8-9dd4-d0713db0a280.png)

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=ELSOUL_LABO2">
    <img src="https://img.shields.io/twitter/follow/ELSOUL_LABO2.svg?label=Follow%20@ELSOUL_LABO2" alt="Follow @ELSOUL_LABO2" />
  </a>
  <br/>

  <a aria-label="npm version" href="https://www.npmjs.com/package/skeet">
    <img alt="" src="https://badgen.net/npm/v/skeet">
  </a>
  <a aria-label="Downloads Number" href="https://www.npmjs.com/package/skeet">
    <img alt="" src="https://badgen.net/npm/dt/skeet">
  </a>
  <a aria-label="License" href="https://github.com/elsoul/skeet/blob/master/LICENSE.txt">
    <img alt="" src="https://badgen.net/badge/license/Apache/blue">
  </a>
    <a aria-label="Code of Conduct" href="https://github.com/elsoul/skeet/blob/master/CODE_OF_CONDUCT.md">
    <img alt="" src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg">
  </a>
</p>

## Skeet TypeScript Serverless Framework

Nexus Prisma, GraphQL, Relay Connection, ApolloServer with Express, TypeScript, PostgreSQL, Jest Test, Google Cloud Run

## What's Skeet?

TypeScript Serverless Framework 'Skeet'.

The Skeet project was launched with the goal of reducing software development, operation, and maintenance costs.

Build Serverless Apps faster.
Powered by TypeScript GraphQL, Prisma, Jest, Prettier, and Google Cloud.

## Dependency

- [TypeScript](https://www.typescriptlang.org/)
- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Google SDK](https://cloud.google.com/sdk/docs)
- [Docker](https://www.docker.com/)
- [GitHub CLI](https://cli.github.com/)
- [Git Crypt](https://github.com/AGWA/git-crypt)

## Usage

## Install skeet

```bash
$ npm i -g skeet
```

## Create Skeet API

```bash
$ skeet create ${appName}
```

![Skeet Create](https://storage.googleapis.com/skeet-assets/animation/skeet-create-compressed.gif)

## Run local

```bash
$ skeet s
```

Now you can access;

`http://localhost:4000/graphql`

## Zero to Deploy

### Git Init

```bash
$ skeet init
```

### Document

- [Skeet Document](https://skeet.dev)

### Deploy All Services to Google Cloud Run

```bash
$ skeet deploy
```

![Skeet Deploy](https://storage.googleapis.com/skeet-assets/animation/skeet-deploy-compressed.gif)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/elsoul/skeet This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Code of Conduct

Everyone interacting in the SKEET project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/elsoul/skeet/blob/master/CODE_OF_CONDUCT.md).
