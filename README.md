# Northcoders News API
Link: https://be-news-api-h65m.onrender.com

An API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.
### Requirements:
- [Node.js](https://nodejs.org/en/) v21.6.1
- [Postgres](https://www.postgresql.org/download/) v14.11

## Installation 

- Clone this repo.
(For instructions on how to clone, click [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).)

- Run `npm i` to install dependencies.
- Run `npm setup-dbs` to set up local database.
- Run `npm run seed` to seed local database.
- Run `npm run test` to run tests.
- Create `.env.test` and `.env.development` in the root of the folder. Into each, add `PGDATABASE=` `nc_news_test` and `nc_news` respectively.
