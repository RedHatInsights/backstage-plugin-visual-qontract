import { gql } from 'graphql-request';


export const DepsQuery = gql`
query App($path: String) {
    apps_v1(path: $path) {
        dependencies {
            path
            name
            statusPage
            SLA
        }
    }
}
`;

