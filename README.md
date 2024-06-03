# Visual Qontract Dynamic Plugin

This is a development mono-repo for the Visual Qontract Interface plugin. This mono-repo was created using @backstage/create-app to provide a backend and frontend for the plugin to integrate with.

You can find the plugin code in `plugins/visual-qontract`

## Components

### Entity Page Cards
This plugin provides multiple info card components that can be mounted on a catalog entry page.
* `EntityQontractDependenciesContent`: Shows CI and code dependencies along with links to status pages and SLOs
* `EntityQontractNamespacesContent`: Shows namespaces and clusters, with links, where an app is running
* `EntityQontractCodeComponentsContent`: Shows code repositories and build jobs
* `EntityQontractPipelinesComponent`: Shows deploy pipelines with links out to the deploy privders
* `EntityQontractSLOComponent`: Shows cards with gauges for SLIs
* `EntityQontractEscalationPolicyComponent`: Show's escalation policies for an app

### Pages
We also provide 2 pages that can extend the functionality of Janus IDP / RHDH.

* `EntityQontractHomePageComponent`: A more feature and information rich homepage than ships with Janus / RHDH by default
* `EntityQontractNewsComponent`: A news page with searching, filters, etc

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

If you are using the Home and News pages you'll need to have a proxy to a server that serves out the news JSON file. For example:

```yaml
    '/inscope-resources':
      target: 'http://localhost:8000'
      changeOrigin: true
      secure: false
```

And if you want to use the status page integration you'll need a proxy for that too:

```yaml
    '/status':
      target: 'https://status.redhat.com/api/v2/summary.json'
      changeOrigin: true
      secure: false
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


### New Story Format
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