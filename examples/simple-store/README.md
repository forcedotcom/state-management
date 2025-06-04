# LWC State Manager demo

This is a very simple storefront application that illustrates some of
the functions of LWC state managers.
The application consists of a handful of components
that display and alter information in a single shared state manager.
None of the components communicate using properties or events -
all information is shared through the state manager.

The interesting source for the application can be found in `src/modules/x`:

- `app` is the top-level application component
- `header` is the site's header
- `cart` is the shopping cart icon & associated text
- `details` is the product picker & display
- `footer` is the site's footer
- `shopState` is the state manager that stores all the state for the application

This application is available in a [StackBlitz playground](https://stackblitz.com/github/mburr-salesforce/tdx-state-manager-demo) if you'd like to explore how it works without cloning & setting up the repo.

## Local setup

After cloning the repo:

```sh
$ npm run dev       # Get app server running
$ npm run build     # Build app in production mode
$ npx serve         # Serve the app (after running `npm run build`).
```
