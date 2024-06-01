# Modified Remix Movies Example

This repository is meant to provide a platform to play and learn loading strategies, caching, and other patterns within remix.

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Setup

There is an `.env.example` within this repository that must be changed to include the prisma relative path for the SQLite DB included.

## Development

With all of the commands replace `bun` with the project manger of choice.

Run the Vite dev server:

```sh
bun run dev
```

## Deployment

First, build your app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `bun run build`

- `build/server`
- `build/client`
