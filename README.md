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

## Usage

## Install skeet

```bash
$ npm i -g skeet
```

## Create Skeet API

```bash
$ skeet create ${appName}
```

## Start PostgreSQL with docker

```bash
$ yarn docker:network
$ yarn docker:psql
```

## Copy .env file from .env.sample

```bash
$ cp .env.sample .env
```

## Migrate your prisma.schema

First, you need to edit `prisma/schema.prisma` file

Then

```bash
$ yarn db:migrate
```

### Run local

```bash
$ yarn dev
```

Now you can access;

`http://localhost:4200/graphql`

### Test

```bash
$ yarn test
```

### Build & Run

```bash
$ yarn build
$ yarn start
```

## Deploy to Google Cloud Run

## Enable Google Cloud API

```bash
$ gcloud config set project PROJECT_ID
$ gcloud services enable run.googleapis.com
$ gcloud services enable containerregistry.googleapis.com
```

## Edit package.json config

This is an example config.
Please replace values with your setting.

`package.json`

```json
"config": {
  "project_id": "skeet-framework",
  "app_name": "skeet-api",
  "docker_image": "skeet-api:latest",
  "image_url": "eu.gcr.io/skeet-framework/skeet-api:latest",
  "region": "europe-west4",
  "cpu": "1",
  "memory": "1Gi"
}
```

```bash
$ yarn deploy
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/elsoul/skeet-api This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Code of Conduct

Everyone interacting in the SKEET project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/elsoul/skeet-api/blob/master/CODE_OF_CONDUCT.md).
