# Visual Qontract Dynamic Plugin

This is a development mono-repo for the Visual Qontract Interface plugin. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin code in `plugins/visual-qontract`

## Components
This plugin provides multiple info card components that can be mounted on a catalog entry page.

* `EntityQontractDependenciesContent`: Shows CI and code dependencies along with links to status pages and SLOs
* `EntityQontractNamespacesContent`: Shows namespaces and clusters, with links, where an app is running
* `EntityQontractCodeComponentsContent`: Shows code repositories and build jobs
* `EntityQontractPipelinesComponent`: Shows deploy pipelines with links out to the deploy privders
* `EntityQontractSLOComponent`: Shows cards with gauges for SLIs
* `EntityQontractEscalationPolicyComponent`: Show's escalation policies for an app

## Configuration
In `app-config.yaml` first add the proxy:

```yaml
proxy:
  endpoints:
    '/visual-qontract': 'https://my.qontract.company.com/graphql'
```
if you want to use the SLO gauge you need to add an additional proxy to prometheus:

```yaml
    '/prometheus':
      target: "https://prometheus.crcs02ue1.devshift.net/api/v1/"
      allowedMethods: ['POST', 'GET']
      headers:
        Authorization: "Bearer ${PROMETHEUS_TOKEN}"
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
Run `./build` - the packed tarball for the release along with its integrity sha will be generated.