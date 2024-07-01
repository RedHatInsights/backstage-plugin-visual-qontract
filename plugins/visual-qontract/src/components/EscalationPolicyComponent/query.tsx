import { gql } from 'graphql-request';

export const EscalationPolicyQuery = gql`
query App($path: String) {
  apps_v1(path: $path) {
    path
    name
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
          server {
            serverUrl
          }
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
          handle
        }
      }
    }
  }
}
`;

export const NextEscalationPolicyQuery = gql`
query EP($path: String) {
  escalation_policies_v1(path: $path) {
    ... on AppEscalationPolicy_v1 {
      name
      path
      description
      channels {
        jiraBoard {
          name
          path
          server {
            serverUrl
          }
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
  }
}
`;
