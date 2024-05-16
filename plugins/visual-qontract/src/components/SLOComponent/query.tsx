import { gql } from 'graphql-request';


export const SLOQuery = gql`
query {
    slo_document_v1 {
      app {
        name
      }
      slos {
        name
        SLISpecification
        dashboard
        expr
      }
    }
  } 
  
`;

