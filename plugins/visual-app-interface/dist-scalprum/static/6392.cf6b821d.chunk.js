(self.webpackChunkinternal_backstage_plugin_visual_app_interface=self.webpackChunkinternal_backstage_plugin_visual_app_interface||[]).push([[6392],{44495:(e,n,a)=>{"use strict";a.r(n),a.d(n,{ExampleComponent:()=>g});var i=a(31085),r=a(95478),s=a(42899),t=a(72501),c=a(10985),l=a(4321),o=a(61009),d=a(47625),h=a(9719),p=a(54801),x=a(13677),j=a(49203),m=a(67720),A=a(71980),u=a(6734),v=a(2069);const b=u.J1`
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
`;var y=a(9490);const g=()=>{const e=(0,y.useApi)(y.configApiRef),{entity:n}=(0,v.u)(),a=`${e.getString("backend.baseUrl")}/api/proxy/visual-app-interface/graphql`,g="https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/",[f,P]=(0,r.useState)({}),[_,k]=(0,r.useState)(!1),[S,$]=(0,r.useState)(!1);(0,r.useEffect)((()=>{const e={path:U()};(0,u.Em)(a,b,e).then((e=>{k(!0),P(e.apps_v1[0]),console.log(e.apps_v1[0])})).catch((e=>{$(!0)}))}),[]);const U=()=>{var e,a,i,r;return`/services/${null==n||null===(a=n.metadata)||void 0===a||null===(e=a.labels)||void 0===e?void 0:e.platform}/${null==n||null===(r=n.metadata)||void 0===r||null===(i=r.labels)||void 0===i?void 0:i.service}/app.yml`},E=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Dependencies"}),(0,i.jsx)(c.A,{component:l.A,children:(0,i.jsxs)(o.A,{children:[(0,i.jsx)(d.A,{children:(0,i.jsxs)(h.A,{children:[(0,i.jsx)(p.A,{children:"Name"}),(0,i.jsx)(p.A,{children:"Status Page"}),(0,i.jsx)(p.A,{children:"SLO"})]})}),(0,i.jsx)(x.A,{children:f.dependencies.map((e=>(0,i.jsxs)(h.A,{children:[(0,i.jsx)(p.A,{children:e.name}),(0,i.jsx)(p.A,{children:(0,i.jsx)(j.A,{target:"_blank",href:e.statusPage,children:e.statusPage})}),(0,i.jsx)(p.A,{children:e.SLA})]},e.path)))})]})})]}),w=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"column",children:[(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"button",children:"Escalation Policy"})}),(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:f.escalationPolicy.description})})]}),(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"row",children:[(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:"Name"})}),(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:f.escalationPolicy.name})})]}),(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"row",children:[(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:"Path"})}),(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(j.A,{target:"_blank",href:`${g}${f.escalationPolicy.path}`,children:f.escalationPolicy.path})})})]}),(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"row",children:[(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:"Email"})}),(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(j.A,{target:"_blank",href:`mailto:${f.escalationPolicy.channels.email}`,children:f.escalationPolicy.channels.email})})})]}),(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"row",children:[(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:"Jira Board"})}),(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(j.A,{target:"_blank",href:`${g}${f.escalationPolicy.channels.jiraBoard[0].path}`,children:f.escalationPolicy.channels.jiraBoard[0].name})})})]})]}),C=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Description"}),(0,i.jsx)(t.A,{variant:"body1",children:f.description})]}),O=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Grafana URLs"}),(0,i.jsx)(t.A,{variant:"body1",children:f.grafanaUrls.map((e=>(0,i.jsx)(j.A,{href:e.url,target:"_blank",rel:"noopener noreferrer",children:e.title})))})]}),D=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Onboarding Status"}),(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(m.A,{color:"primary",label:f.onboardingStatus,style:{backgroundColor:"#00AF11"}})})]}),G=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Service Owners"}),(0,i.jsx)(t.A,{variant:"body1",children:f.serviceOwners.map((e=>(0,i.jsx)(j.A,{href:`mailto:${e.email}`,children:e.name})))})]}),I=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Slack User Group"}),(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(j.A,{target:"_blank",href:`${g}${f.escalationPolicy.channels.slackUserGroup[0].path}`,children:f.escalationPolicy.channels.slackUserGroup[0].name})})]}),L=()=>(0,i.jsxs)(s.A,{item:!0,children:[(0,i.jsx)(t.A,{variant:"button",children:"Next Escalation Policy"}),(0,i.jsx)(t.A,{variant:"body1",children:(0,i.jsx)(j.A,{target:"_blank",href:`${g}${f.escalationPolicy.channels.nextEscalationPolicy.path}`,children:f.escalationPolicy.channels.nextEscalationPolicy.name})})]});return S?(0,i.jsx)(A.YW,{themeId:"tool",children:(0,i.jsx)(A.UC,{children:(0,i.jsx)(s.A,{container:!0,spacing:3,direction:"column",children:(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(A.nO,{title:"App Interface",children:(0,i.jsx)(t.A,{variant:"body1",children:"Error loading app interface data."})})})})})}):_?(0,i.jsx)(A.YW,{themeId:"tool",children:(0,i.jsx)(A.UC,{children:(0,i.jsx)(A.nO,{title:f.name.charAt(0).toUpperCase()+f.name.slice(1),children:(0,i.jsxs)(s.A,{container:!0,spacing:3,direction:"column",children:[(0,i.jsx)(C,{}),(0,i.jsx)(O,{}),(0,i.jsx)(D,{}),(0,i.jsx)(G,{}),(0,i.jsx)(w,{}),(0,i.jsx)(I,{}),(0,i.jsx)(L,{}),(0,i.jsx)(E,{})]})})})}):(0,i.jsx)(A.YW,{themeId:"tool",children:(0,i.jsx)(A.UC,{children:(0,i.jsx)(s.A,{container:!0,spacing:3,direction:"column",children:(0,i.jsx)(s.A,{item:!0,children:(0,i.jsx)(A.nO,{title:"App Interface",children:(0,i.jsx)(t.A,{variant:"body1",children:"Loading..."})})})})})})}},86973:()=>{}}]);
//# sourceMappingURL=6392.cf6b821d.chunk.js.map