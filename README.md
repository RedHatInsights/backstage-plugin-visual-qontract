# Visual Qontract Backstage Plugins

A monorepo of [Red Hat Developer Hub][rhdh] (RHDH) dynamic plugins for surfacing [App Interface][app-interface] data, [WebRCA][webrca] incidents, and operational tooling inside [Backstage][backstage]. Created with `@backstage/create-app` to provide a full backend and frontend development environment.

For internal architecture details, see [ARCHITECTURE.md][architecture].

## Included Plugins

| Plugin | Package | Version | Description |
|--------|---------|---------|-------------|
| Visual Qontract | `@redhatinsights/backstage-plugin-visual-qontract` | 1.6.8 | Frontend entity page cards and standalone pages for App Interface data |
| WebRCA Frontend | `@redhatinsights/backstage-plugin-webrca-frontend` | 1.2.2 | Frontend WebRCA incident viewer |
| WebRCA Backend | `@redhatinsights/backstage-plugin-webrca-backend` | 1.2.2 | Backend WebRCA API integration |

### Visual Qontract Entity Page Cards

This plugin provides multiple info card components that can be mounted on a catalog entry page.

- `EntityQontractDependenciesContent` -- Shows CI and code dependencies along with links to status pages and SLOs
- `EntityQontractNamespacesContent` -- Shows namespaces and clusters, with links, where an app is running
- `EntityQontractCodeComponentsContent` -- Shows code repositories and build jobs
- `EntityQontractPipelinesComponent` -- Shows deploy pipelines with links out to the deploy providers
- `EntityQontractSLOComponent` -- Shows cards with gauges for SLIs
- `EntityQontractEscalationPolicyComponent` -- Shows escalation policies for an app

### Page Plugins

Three standalone pages extend the functionality of Janus IDP / RHDH:

- `EntityQontractHomePageComponent` -- A more feature and information rich homepage than ships with Janus / RHDH by default
- `EntityQontractNewsComponent` -- A news page with searching, filters, etc.
- `ChangelogPageComponent` -- A page to show App SRE Changelog
- `WebRcaPage` -- A page to show WebRCA Incidents

## Prerequisites

- [Node.js][nodejs] 22 or 24
- [Yarn][yarn] 4.15.0 (declared via `packageManager` in `package.json`)
- [Podman][podman] or Docker (for the `inscope-resources` container)
- Optionally, [NVM][nvm] for managing Node.js versions

## Development

### Quick Start

```sh
yarn install
yarn dev
```

Before running, you will want to have catalog entries to see the plugin working on. Check out AppStage for that.

### inscope-resources Container

The homepage components require the `inscope-resources` pod running locally. This container provides resources like news stories used on the front page.

> **Note:** You may need to log in to the Quay registry first: `podman login quay`

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

To populate the changelog locally, [download the updated changelog from OpenShift][changelog-configmap].

Copy the contents from the `config-map.json` field into a separate JSON file named `config-map.json` in the root of the plugin directory:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
...
data:
  config-map.json: '<--- COPY THIS INTO CONFIG-MAP.JSON FILE --->'
```

Run the pod locally using the following script -- this mounts the local `config-map.json` into the container to be served by the proxy:

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

### News Story Format

The news stories are a single JSON file -- a collection of links surfaced on the front page, easily extendable without code changes or a CMS.

```json
[
  {
    "title": "Some Section",
    "id": "some-section",
    "stories": [
      {
        "title": "My Great Story",
        "id": "great-story",
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

You can add as many sections or stories as you want. There is a simple full text search on the client as well as filters for sections and tags.

## Build and Testing

### Building Dynamic Plugins

Run `make build-all` to build all three plugins as dynamic plugin tarballs. Output appears under `build/`, with a directory for each plugin containing the tarball and an integrity SHA text file.

Individual plugins can be built separately:

```sh
make build-visual-qontract
make build-webrca-frontend
make build-webrca-backend
```

### Running Tests

```sh
yarn test          # Run tests for changed packages
yarn test:all      # Run all tests with coverage
yarn test:e2e      # Run Playwright E2E tests
```

### Linting and Formatting

```sh
yarn lint          # Lint changed packages (since origin/main)
yarn lint:all      # Lint all packages
yarn prettier:check  # Check formatting
```

## Configuration

### Proxy Configuration

In `app-config.yaml`, add the following proxy endpoints:

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

### RHDH Dynamic Plugin Config

Here is an example of how to configure all of the plugins in your dynamic plugins config for RHDH:

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

## Updating Backstage Dependencies

To update Backstage dependencies:

```sh
yarn backstage-cli versions:bump <Backstage Version>
```

This updates the frontend and backend Backstage code, as well as all dependencies for the frontend, backend, and plugins.

If dependency installation fails, you may need to change Node versions. Install the required version using [NVM][nvm], then edit the `engines.node` value in the root `package.json`.

After updating Backstage, verify with `make build-all` and adjust the build script if anything changed (command output, paths, etc.). Run all tests with `yarn test` to confirm they still pass. Update the Node version matrix in `.github/workflows/test.yml` as needed.

## CI/CD

- **[Jest Unit Tests][ci-test]** -- Runs on every pull request against Node.js 22 and 24.
- **[Release][ci-release]** -- Triggered by `v*` tags. Builds dynamic plugin tarballs, computes integrity checksums, and creates a draft GitHub release with all artifacts attached.

## License

This project is licensed under [Apache-2.0][apache-license]. All three plugin packages declare the same license.

<!-- Reference-style link definitions -->

[rhdh]: https://developers.redhat.com/rhdh
[app-interface]: https://app-interface.apps.rosa.appsrep09ue1.03r5.p3.openshiftapps.com/
[webrca]: https://webrca.devshift.net/
[backstage]: https://backstage.io/
[architecture]: ./ARCHITECTURE.md
[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[podman]: https://podman.io/
[nvm]: https://github.com/nvm-sh/nvm
[changelog-configmap]: https://console-openshift-console.apps.rosa.appsres09ue1.24ep.p3.openshiftapps.com/k8s/ns/backstage-stage/configmaps/change-log/yaml
[ci-test]: ./.github/workflows/test.yml
[ci-release]: ./.github/workflows/release.yml
[apache-license]: https://www.apache.org/licenses/LICENSE-2.0
