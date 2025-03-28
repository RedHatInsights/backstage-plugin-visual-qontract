# Visual Qontract Dynamic Plugin

This is a development mono-repo for multiple Red Hat Hybrid Cloud Management RHDH plugins. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

Included Plugins: 
* Visual Qontract: `plugins/visual-qontract` Presents data from App Interface
* WebRCA Frontend: `plugins/webrca-frontend` A frontend plugin for Web RCA
* WebRCA Backend: `plugins/webrca-backend` A backend plugin for Web RCA 

## Components

### Visual Qontract Entity Page Cards
This plugin provides multiple info card components that can be mounted on a catalog entry page.
* `EntityQontractDependenciesContent`: Shows CI and code dependencies along with links to status pages and SLOs
* `EntityQontractNamespacesContent`: Shows namespaces and clusters, with links, where an app is running
* `EntityQontractCodeComponentsContent`: Shows code repositories and build jobs
* `EntityQontractPipelinesComponent`: Shows deploy pipelines with links out to the deploy privders
* `EntityQontractSLOComponent`: Shows cards with gauges for SLIs
* `EntityQontractEscalationPolicyComponent`: Show's escalation policies for an app

### Page Plugins
We also provide 3 pages that can extend the functionality of Janus IDP / RHDH.

* `EntityQontractHomePageComponent`: A more feature and information rich homepage than ships with Janus / RHDH by default
* `EntityQontractNewsComponent`: A news page with searching, filters, etc
* `WebRCAFetchComponent`: A page to show WebRCA Incidents
* `ChangelogPageComponent`: A page to show App SRE Changelog

## Dependencies 
You'll need to have the `inscope-resources` pod running. This pod contains the resources like new stories used on the front page.

Running the following script will download the images from the Quay repository and run the `inscope-resources` pod locally.

> NOTE: You may need to log in to the Quay resource prior to pulling the image.
`podman login quay`

```bash
if ! podman container exists resources &> /dev/null; then
    echo "Starting resources container..."
    podman pull quay.io/app-sre/inscope-resources:latest
    podman run -d --name resources \
        --hostname resources \
        -p 8000:8000 \
        quay.io/app-sre/inscope-resources:latest
fi
```

### Changelog Development
In order to populate the changelog locally, [download the updated changelog from Openshift](https://console-openshift-console.apps.rosa.appsres09ue1.24ep.p3.openshiftapps.com/k8s/ns/backstage-stage/configmaps/change-log/yaml).

Copy the contents from the `config-map.json` field into a separate JSON file named `config-map.json` in the root of the plugin directory.

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
...
data:
  config-map.json: '<--- COPY THIS INTO CONFIG-MAP.JSON FILE --->'
```

Run the pod locally using the following script - this mounts the local `config-map.json` into the local pod to be served by the proxy.

```bash
if ! podman container exists resources &> /dev/null; then
    echo "Starting resources container"
    podman pull quay.io/app-sre/inscope-resources:latest
    podman run -d --name resources \
        --hostname resources \
        -p 8000:8000 \
        -v $(pwd)/config-map.json:/opt/app-root/src/resources/configmap/change-log.json:Z \
        quay.io/app-sre/inscope-resources:latest
fi
```

## Configuration
In `app-config.yaml` first add the proxies:

```yaml
proxy:
  endpoints:
    '/visual-qontract': 
      target: 'https://app-interface.apps.rosa.appsrep09ue1.03r5.p3.openshiftapps.com/'
    '/prometheus':
      target: "https://prometheus.crcs02ue1.devshift.net/api/v1/"
      allowedMethods: ['POST', 'GET']
      headers:
        Authorization: "Bearer ${PROMETHEUS_TOKEN}"
    '/developer-hub':
      target: 'http://localhost:8000'
      pathRewrite:
        '^/api/proxy/developer-hub': '/resources/json/homepage.json'
      changeOrigin: true
    '/inscope-resources':
      target: '${INSCOPE_RESOURCES_URL}'
      changeOrigin: true
      secure: false
    '/inscope-resources/resources/images':
      target: '${INSCOPE_RESOURCES_URL}'
      changeOrigin: true
      secure: false
      credentials: dangerously-allow-unauthenticated
    '/status':
      target: 'https://status.redhat.com/api/v2/summary.json'
      changeOrigin: true
    '/status-board':
      target: '${STATUS_BOARD_API}'
      allowedHeaders: ['Authorization']
    '/sso-redhat':
      target: '${SSO_URL}'
      allowedHeaders: ['Content-Type']
    '/mergeq':
      target: 'https://gitlab.cee.redhat.com/service/app-interface-output/-/raw/master/'
      changeOrigin: true
      secure: false
```

## RHDH Dynamic Plugin Config
Here's an example of how to configure all of the various plugins in your dynmaic plugins config for RHDH.

```yaml
  - package: "https://github.com/RedHatInsights/backstage-plugin-visual-qontract/releases/download/DEVELOPMENT-0.2/redhatinsights-backstage-plugin-webrca-backend-1.1.1.tgz"
    disabled: false
    integrity: "sha256-pqQaI2i1pNs5tfW8Sj1vG5Fx4KGqQfguxr0CPU6Fcvo="

  - package: "https://github.com/RedHatInsights/backstage-plugin-visual-qontract/releases/download/DEVELOPMENT-0.2/redhatinsights-backstage-plugin-webrca-frontend-1.1.2.tgz"
    integrity: "sha256-s1YJRO8AknX7fIg68zhHDTKW97HwIbY2CYBKTu/Zl68="
    disabled: false
    pluginConfig:
      dynamicPlugins:
        frontend:
          redhatinsights.backstage-plugin-webrca-frontend:
            entityTabs:
              - path: /incidents
                title: Incidents
                mountPoint: entity.page.incidents
            mountPoints:
              - mountPoint: 'entity.page.incidents/cards'
                importName: WebRcaPage
                config:
                  layout:
                    gridColumn: "1 / span 12"
                  if:
                    allOf:
                      - isKind: component
                      - isType: service

  - package: "https://github.com/RedHatInsights/backstage-plugin-visual-qontract/releases/download/DEVELOPMENT-0.1/redhatinsights-backstage-plugin-visual-qontract-1.3.6.tgz"
    disabled: false
    integrity: "sha256-AYIZ6vnhwAmtT/l6TARNtGJPeQUOfM4rY5zdtceffog="
    pluginConfig:
      dynamicPlugins:
        frontend:
          redhatinsights.backstage-plugin-visual-qontract:
            dynamicRoutes:
              - path: /
                importName: EntityQontractHomePageComponent
              - path: /changelog
                importName: ChangelogPageComponent
                menuItem:
                  icon: system
                  text: Changelog
              - path: /news
                importName: EntityQontractNewsComponent
                menuItem:
                  icon: techdocs
                  text: News
            mountPoints:
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractNamespacesContent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 4"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractPipelinesComponent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 4"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractCodeComponentsContent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 4"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractEscalationPolicyComponent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 4"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractDependenciesContent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 4"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
              - mountPoint: entity.page.overview/cards
                importName: EntityQontractSLOComponent
                config:
                  layout:
                    gridColumnEnd:
                      lg: "span 6"
                      md: "span 6"
                      xs: "span 12"
                  if:
                    allOf:
                      - isType: application
```
## Development
To start the app, run:

```sh
yarn install
yarn dev
```

Before you do, you'll likely want to have catalog entries to see the plugin working on. Check out AppStage for that. 

## Updating Backstage Deps and Node Version
Over time you'll need to upgrade deps, and those may require node version bumps too. To update backstage deps simply run:

```
yarn backstage-cli versions:bump <Backstage Version>
```

That will update the frontend and backend backstage code, as well as all of the deps for the frontend, backend, and plugins. 

Part of the upgrade process will install deps. If any fail you may need to change node versions. First install the version of node you need. I recommend using [NVM](https://github.com/nvm-sh/nvm) for that. Then edit the `engines.node` value in the monorepo `package.json`.

After updating backstage I recommend you attempt building all plugins with `make build-all` and adjust the build script if anything changed like command output, paths, etc. You should also run all tests with `yarn test` to make sure all tests are still passing. Finally, don't forget to bump your node version in the `.github/workflows/test.yml` file!

### Build the Dynamic Plugin
Run `make build-all` - the plugin tarballs will appear under `builds/`. There will be a directory for each plugin, and 2 files for each: the plugin tarball and a text file with the integrity SHA.

### News Story Format
The news stories are just a single JSON file. It is mostly just supposed to be a collection of links, but the idea is to surface them on the front page, and to easily add more without code changes or a complex database or CMS.

For format is as follows:

```json
[
  {
    "title": "Some Section",
    "id": "some-section",
    "stories": [
      {
        "title": "My Great Story",
        "id": "great-strory",
        "date": "2024-05-31",
        "image": "/resources/images/news/story.webp",
        "featured": true,
        "tags": ["great", "story"],
        "link": {
          "text": "Read More",
          "url": "https://greatstorybro.com"
        },
        "body": "This is a great story!"
      }
    ]
  }
]
```

You can add as many sections or stories as you want. There's a simple full text search on the client as well as filters for sections and tags.
