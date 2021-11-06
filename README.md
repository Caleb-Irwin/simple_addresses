# Simple Addresses

Demo: [simpleaddress.calebirwin.ca](https://simpleaddress.calebirwin.ca/)

## Config

.env file needs a key in from:
  
```text
KEY=TF3*-****-****-***5
```

This key must be a [Canada Post Address Complete](https://www.canadapost-postescanada.ca/ac/) key.
They have a free trail, with no credit card (or you could borrow the api key they use for their demo, at your own risk).

## Deploying

Ready to deploy to [Netlify](https://www.netlify.com/). Make sure to add api key environment variable in netlify.

## Svelte Docs

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
