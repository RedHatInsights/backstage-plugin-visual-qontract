import { gql } from 'graphql-request';


export const CodeComponentsQuery = gql`
query App($path: String) {
  apps_v1(path: $path) {
    codeComponents {
      name
      resource
      url
      imageBuildUrl
    }
  }
}
`;

