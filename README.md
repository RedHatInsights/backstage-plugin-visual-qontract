# Visual App Interface Dynamic Plugin

This is a development mono-repo for the Visual App Interface plugin. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin code in `plugins/visual-app-interface`

## Components
This plugin provides multiple info card components that can be mounted on a catalog entry page.

* `EntityQontractPipelinesComponent`
* `EntityQontractCodeComponentsContent`
* `EntityQontractNamespacesContent`
* `EntityQontractDependenciesContent`

## Configuration
In `app-config.yaml` first add the proxy:

```yaml
proxy:
  endpoints:
    '/visual-qontract': 'https://my.qontract.company.com/graphql'
```

Also in `app-config.yaml` add `redhatinsights.backstage-plugin-visual-qontract` and the card component configs into the dynamic plugins section.


```yaml
dynamicPlugins:
  frontend:
    redhatinsights.backstage-plugin-visual-qontract:
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
yarn workspace @redhatinsights/backstage-plugin-visual-qontract export-dynamic
cd plugins/visual-app-interface/
npm pack
```

this will create `redhatinsights-backstage-plugin-visual-qontract-X.Y.Z.tgz` in the `plugins/visual-qontract/` directory.

And don't forget to generate the integrity!

```sh
shasum -a 256 redhatinsights-backstage-plugin-visual-qontract-0.1.3.tgz | awk '{print $1}' | xxd -r -p | base64
```