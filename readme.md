# Tyba challenge

## Setup

- Run `cd api`
- Run `cp .env.example .env` Here you need to set the Google maps api key: `MAPS_API_KEY`
- Go back to the root project folder an run: `docker-compose up --build`

### Try it

You can test the endpoints using vscode extension: `REST client` and usign the `api/request.rest` file (also look at the endpoints documentation in this file)

Have in mind that after login, you need to use the `accessToken` given in the authorization header

## Tests

Run:

- `npm run test` or
- `npm run test:coverage`
