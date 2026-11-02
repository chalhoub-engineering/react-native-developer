# Catalog

Expo product screen for the developer assessment. The layout is [layout/task.png](layout/task.png). Shoppers can browse the shirt, choose a size and color, add it to the bag, and open an account that is already signed in.

## Run

```bash
npm install
npm start
```

Then open the project in Expo Go, an iOS simulator, or an Android emulator. `npm run web` starts the browser build.

The catalog URL is `EXPO_PUBLIC_CATALOG_URL` in `.env`. Restart Expo after changing it. The committed value reads `data/catalog.json` from GitHub:

`https://raw.githubusercontent.com/amit-tutu22/react-native-developer/step-3-remote-catalog/data/catalog.json`

That raw URL stands in for an AWS or GCP bucket. Point the variable at a bucket URL that serves the same JSON if you host the file there. The app fetches it at runtime and does not bundle the file.

## Tests

```bash
npm test
```

Jest and React Native Testing Library cover the domain rules, the Redux slice, the catalog and account mappers, and the screen flows. The network is replaced with a fake RTK Query base query, so the suite does not call GitHub or the Rick and Morty API. `--forceExit` is part of the script because a React Native animation-frame timer can outlive the assertions after the suite has passed.

### Unit tests

- `formatPrice` renders `AED 250`.
- The default size is M, and the default color is black.
- The fixture catalog has a title, price, four sizes, four colors, a description, and four related image URLs.
- The product slice updates size, color, category, a trimmed search query, bag quantity, the lightbox, and the logo reset.
- `selectFilteredRelated` matches titles without case sensitivity.
- `selectProductVisible` is true for MEN and false for KIDS when the product is in MEN.
- `mapCatalog` accepts a full payload, rejects a payload missing title, image URL, price, sizes, colors, or description, and accepts a related item that only has an image URL.
- `getCatalog` stores the mapped catalog on success and exposes an error with no screen data on failure. Retry issues the request again.
- `mapCharacter` maps name, image, status, species, gender, origin, and location, and rejects a character missing name or image.

### Functional flows in the suite

These run in Jest. They do not drive a phone.

- The product screen shows Tiger Medium Red, AED 250, sizes S M L XL, four colors, the description, and four related images.
- XL and the forest swatch can be added to the bag, and the count becomes 1.
- Searching for "blue" leaves the matching thumbnail and hides the others.
- KIDS shows the empty category state.
- Expand opens the lightbox and close dismisses it.
- The account screen shows Rick Sanchez. A failed profile request shows retry and no name.

### On a device

Maestro or Detox can run the same journeys against a dev client. They are not required for `npm test`. Scenarios to run on a phone:

- A cold start against the raw GitHub URL shows the live product.
- A catalog HTTP error shows retry, and a later success replaces the error.
- Adding the same size and color twice makes the count 2.
- Opening Account and coming back keeps the size, color, and bag count.
- When the Rick and Morty API is unreachable, account retry appears and the product screen still loads.

## Architecture

The UI never calls `fetch`.

- `src/domain` holds product, cart, price, and account types, plus pure rules.
- `src/infrastructure` maps remote JSON and owns the RTK Query endpoints. Tests replace `baseQuery` through `configureServices` before creating a store.
- `src/presentation` is one component per region of the layout. Screens compose those components and call the RTK Query hooks.
- `src/store` keeps category, search, size, color, the bag, and the lightbox in `productUiSlice`. Server data stays in RTK Query.

### SOLID

- Each component does one job. `SizeSelector` reports a size. `formatPrice` formats money. `mapCatalog` turns JSON into domain objects.
- Sizes, colors, and related products render from arrays. A new color is data, not a new component.
- The HTTP catalog and the test fake both satisfy the same RTK Query base query, so screens behave the same with either.
- Catalog and account are separate endpoints. A selector component receives only the props it renders.
- Screens depend on those hooks. The GitHub URL sits behind `EXPO_PUBLIC_CATALOG_URL`.

## What the screen does

- Logo returns to MEN, clears search, and closes the lightbox.
- MEN, WOMEN, KIDS, FTW, and ACCESSORIES filter the catalog. The sample shirt is in MEN. Another category shows an empty state.
- Search filters the related products by title.
- The expand control and a related thumbnail open the image lightbox.
- Black and M start selected. Add to bag records the product, size, and color, and shows the count.
- Account opens My Account. There is no login screen. The profile is Rick Sanchez from `https://rickandmortyapi.com/api/character/1`.

## Branches

Each assessment step is its own branch, cut from the previous step.

- `step-1-product-screen` builds the layout from an in-memory catalog.
- `step-2-redux-toolkit` moves interaction state into Redux Toolkit.
- `step-3-remote-catalog` loads `data/catalog.json` over HTTP.
- `step-4-account` adds My Account.
- `step-5-tests` adds this suite and this runbook.
- `step-6-eas` adds the EAS Build and EAS Update configuration.

## EAS Build and updates

`eas.json` has `development`, `preview`, and `production` profiles. Each profile has a matching `channel` and receives `EXPO_PUBLIC_CATALOG_URL`, so a cloud build still loads the catalog. `development` is an internal distribution profile. It is not a development client: `expo-dev-client` is not installed and `developmentClient` is not set.

`runtimeVersion` follows the app version in `app.json`. An OTA update must use that same runtime, so the version has to be bumped when native code changes. `autoIncrement` on the production profile only raises the store build number. It does not change the runtime. `eas update` has to target the channel of the installed binary, for example `--channel preview` for a preview build. Publishing to a branch named preview does not by itself attach the update to that binary.

No Expo project id, updates URL, installable binary, or published update exists yet. No tokens are committed. These commands need an Expo account and were not run here:

```bash
npx eas-cli login
npx eas-cli init
npx eas-cli update:configure
npx eas-cli build -p ios --profile preview
npx eas-cli build -p android --profile preview
npx eas-cli update --channel preview --message "Catalog update"
```

`eas init` writes `extra.eas.projectId`. `eas update:configure` writes `updates.url`. After a binary is installed, publish to its channel and confirm the device downloads that update. Record the build and update ids, and the rollback, once those commands succeed.

After login, print the resolved preview profile with:

```bash
npx eas-cli config -p ios -e preview --non-interactive
```

## Challenges

- The repository already contained the brief, so the Expo app was scaffolded beside it and moved to the root.
- GitHub's raw CDN cached a 404 for a few minutes after the catalog file was first requested. The file is the one on `step-3-remote-catalog`.
- The brief supplies one layout image, so the shirt photos are Unsplash URLs. The red and navy shots are crops of a single product photo.
- A private repository's raw URL is not reachable from the app. This repository is public, which is what makes the stand-in URL work.

## Delivery

Share a private fork with @daniel-rosiak and @white-space-dev.
