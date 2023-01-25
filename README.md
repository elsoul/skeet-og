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
   _____ __ __ __________________
  / ___// //_// ____/ ____/_  __/
  \__ \/ ,<  / __/ / __/   / /
 ___/ / /| |/ /___/ /___  / /
/____/_/ |_/_____/_____/ /_/    🛠️🛠️

⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
$ cd skeet-app
$ skeet s
Go To : http://localhost:4200/graphql

--- ✡ Try Your first Query ✡ ---
mutation {
  createUser(
    name: "EpicsDAO"
  ) {
    id
    rawId
    name
  }
}
--------------------------------
```

## Run local

```bash
$ skeet s
```

Now you can access;

`http://localhost:4200/graphql`

## Test

```bash
$ skeet test
```

## Build & Run

```bash
$ skeet build
$ skeet start
```

## Zero to Deploy

### Git Init

```bash
$ skeet git:init
```

### Make a first commit

```bash
$ git add .
$ git commit -m "first commit"
```

### Create/Push GitHub Repo

```bash
$ skeet git:create elsoul/skeet
```

If you want to go with OpenSource;

```bash
$ skeet git:create elsoul/skeet --public
```

### Setup Google Cloud IAM

```bash
$ skeet setup
```

### Create Google CloudSQL

```bash
$ skeet sql:create
```

### Add Secret ENV to GitHub Secrets

```bash
$ skeet git:env
```

### Add your global IP to DB whiteList

Get your global IP

```bash
$ curl inet-ip.info
xx.xx.x.x
```

Add it to `./skeet-cloud.config.json`

```json
{
  "api": {
    "appName": "skeet-framework",
    "projectId": "skeet-framework",
    "region": "europe-west4",
    "cpu": "1",
    "memory": "1Gi",
    "db": {
      "databaseVersion": "POSTGRES_14",
      "cpu": "1",
      "memory": "4096MB",
      "whiteList": "xx.xx.x.x" or "xx.xx.x.x,yy.yy.y.y"
    }
  }
}
```

- csv string for multiple IPs

Patch CloudSQL settings

```bash
$ skeet sql:ip
```

### DB migrate

```bash
$ skeet db:init -e production
```

### Deploy to Google Cloud Run

```bash
$ skeet api:deploy
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/elsoul/skeet This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Code of Conduct

Everyone interacting in the SKEET project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/elsoul/skeet-api/blob/master/CODE_OF_CONDUCT.md).
