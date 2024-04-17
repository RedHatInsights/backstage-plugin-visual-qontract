# Visual App Interface Catalog Plugin

This is a development monorepo for the Visual App Interface plugin. This monorepo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin in `plugins/visual-app-interface`

To start the app, run:

```sh
yarn install
yarn dev
```

Before you do, you'll likely want to have catalog entries to see the plugin working on. Check out AppStage for that.

## Build the Dynmaic Plugin

```sh
yarn workspace @internal/backstage-plugin-visual-app-interface export-dynamic
cd plugins/visual-app-interface/
npm pack
```

this will create `internal-backstage-plugin-visual-app-interface-X.Y.Z.tgz` in the `plugins/visual-app-interface/` directory.