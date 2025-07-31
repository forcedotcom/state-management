# Simple Store: An LWC State Manager Example

This is a simple online store application that illustrates some of
the functions of LWC state managers. None of the components connect to 
or depend on Salesforce services or APIs. You can run this example entirely 
stand-alone.

The application consists of a handful of components that display and 
alter information in a single shared state manager.

None of the components communicate using properties or events --
all information is managed through the state manager.

The interesting source for the application is in `src/modules/x`:

## Logic Components

These components have no user interface. 

- `app` is the top-level application component; its purpose is to define and launch the example
- `shopState` is the state manager that holds and changes all state for the application

## User Interface Components
- `header` is the site's header
- `cart` is the shopping cart icon and associated text
- `details` is the product picker and display
- `footer` is the site's footer

## Running Simple Store
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/forcedotcom/state-management/tree/main/examples/simple-store)
if you'd like to explore how this application works without cloning the repo and setting it up yourself.
This application is available in a 

### Local Setup

After cloning the repo:

```sh
$ npm run dev       # Get app server running
$ npm run build     # Build app in production mode
$ npx serve         # Serve the app (after running `npm run build`).
```
