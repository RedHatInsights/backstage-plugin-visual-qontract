import { gql } from 'graphql-request';


export const PipelinesQuery = gql`
query App($path: String) {
  apps_v1(path: $path) {
    path
    name
    description
    onboardingStatus
    grafanaUrls {
      title
      url
    }
    serviceDocs
    serviceOwners {
      name
      email
    }
    escalationPolicy {
      name
      path
      description
      channels {
        jiraBoard {
          name
          path
        }
        email
        pagerduty {
          name
          path
        }
        nextEscalationPolicy {
          name
          path
        }
        slackUserGroup {
          name
          path
        }
      }
    }
    dependencies {
      path
      name
      statusPage
      SLA
    }
    quayRepos {
      org {
        name
      }
      items {
        name
        description
        public
      }
    }
    serviceDocs
    endPoints {
      name
      description
      url
    }
    codeComponents {
      name
      resource
      url
    }
    namespaces {
      path
      name
      description
      cluster {
        name
        path
        jumpHost {
          hostname
        }
      }
    }
    childrenApps {
      path
      name
      description
      onboardingStatus
    }
  }
  reports_v1 {
    path
    app {
      name
    }
    name
    date
  }
  saas_files_v2 {
    path
    name
    app {
      name
    }
    pipelinesProvider {
      provider
      ... on PipelinesProviderTekton_v1 {
        namespace {
          name
          cluster {
            consoleUrl
          }
        }
        defaults {
          pipelineTemplates {
            openshiftSaasDeploy {
              name
            }
          }
        }
        pipelineTemplates {
          openshiftSaasDeploy {
            name
          }
        }
      }
    }
    resourceTemplates {
      targets {
        namespace {
          name
          environment {
            name
          }
        }
      }
    }
  }
  scorecards_v2 {
    path
    app {
      path
      name
    }
  }
}
`;

