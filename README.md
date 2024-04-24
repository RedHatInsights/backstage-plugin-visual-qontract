# Visual App Interface Dynamic Plugin

This is a development mono-repo for the Visual App Interface plugin. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin code in `plugins/visual-app-interface`

## Components
This plugin provides multiple info card components that can be mounted on a catalog entry page.

* `EntityAppInterfacePipelinesComponent`
* `EntityAppInterfaceCodeComponentsContent`
* `EntityAppInterfaceNamespacesContent`
* `EntityAppInterfaceDependenciesContent`

## Configuration
In `app-config.yaml` first add the proxy:

```yaml
proxy:
  endpoints:
    '/visual-app-interface': 'https://app-interface.apps.appsrep05ue1.zqxk.p1.openshiftapps.com/'
```

Also in `app-config.yaml` add `internal.backstage-plugin-visual-app-interface` and the card component configs into the dynamic plugins section.


```yaml
dynamicPlugins:
  frontend:
    internal.backstage-plugin-visual-app-interface:
      mountPoints:
        - mountPoint: entity.page.overview/cards
          importName: EntityAppInterfaceDependenciesContent
          config:
            layout:
              gridColumnEnd:
                lg: "span 4"
                md: "span 4"
                xs: "span 4"
        - mountPoint: entity.page.overview/cards
          importName: EntityAppInterfaceNamespacesContent
          config:
            layout:
              gridColumnEnd:
                lg: "span 4"
                md: "span 4"
                xs: "span 4"
```
## Development
To start the app, run:

```sh
yarn install
yarn dev
```

Before you do, you'll likely want to have catalog entries to see the plugin working on. Check out AppStage for that. 

### Build the Dynamic Plugin

```sh
yarn workspace @internal/backstage-plugin-visual-app-interface export-dynamic
cd plugins/visual-app-interface/
npm pack
```

this will create `internal-backstage-plugin-visual-app-interface-X.Y.Z.tgz` in the `plugins/visual-app-interface/` directory.