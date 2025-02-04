import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { EscalationPolicyQuery, NextEscalationPolicyQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';
import { request } from 'graphql-request';
import { NextEscalationPolicyRow } from './NextEscalationPolicyRow';
import {
  configApiRef,
  useApi,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const EscalationPolicyComponent = () => {
  const {
    result: result,
    loaded: loaded,
    error: error,
  } = QueryQontract(EscalationPolicyQuery);
  const title = 'Escalation Policy';

  const [escalationPolicies, setEscalationPolicies] = useState<any[]>([]);
  const [nextPath, setNextPath] = useState('');
  const [requestError, setRequestError] = useState<boolean>(false);

  // Get Backstage objects
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);

  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/visual-qontract/graphql`;

  const GetEscalationPolicy = async (path: string) => {
    const variables = { path: path };
    const { token } = await identityApi.getCredentials();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    request(proxyUrl, NextEscalationPolicyQuery, variables, headers)
      .then((data: any) => {
        if (data.escalation_policies_v1.length !== 0) {
          if (
            data.escalation_policies_v1[0].channels?.nextEscalationPolicy?.path
          ) {
            // catch any circularly connected policies to avoid infinite recursion
            if (
              escalationPolicies.some(
                e =>
                  e.path ===
                  data.escalation_policies_v1[0].channels.nextEscalationPolicy
                    .path,
              )
            ) {
              return;
            }
            setNextPath(
              data.escalation_policies_v1[0].channels.nextEscalationPolicy.path,
            );
          }
          if (
            escalationPolicies.some(
              e => e.path === data.escalation_policies_v1[0].path,
            )
          ) {
            return;
          }
          setEscalationPolicies([
            ...escalationPolicies,
            data.escalation_policies_v1[0],
          ]);
        }
      })
      .catch(_error => {
        debugger;
        setRequestError(true);
      });
  }

  useEffect(() => {
    if (!result.apps_v1 || result.apps_v1.length === 0) {
      return;
    }
    if (
      result.apps_v1[0].escalationPolicy?.channels?.nextEscalationPolicy?.path
    ) {
      GetEscalationPolicy(
        result.apps_v1[0].escalationPolicy.channels.nextEscalationPolicy.path,
      );
    }
  }, [result]);

  useEffect(() => {
    GetEscalationPolicy(nextPath);
  }, [escalationPolicies]);

  if (error || requestError) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Error loading the Escalation Policy information.
        </Typography>
      </InfoCard>
    );
  }

  if (!loaded) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Loading...
        </Typography>
      </InfoCard>
    );
  }

  if (result.apps_v1.length === 0) {
    return null;
  }

  return (
    <InfoCard title={title} noPadding>
      <NextEscalationPolicyRow ep={result.apps_v1[0].escalationPolicy} />
      {escalationPolicies.map((component: any, key: any) => (
        <NextEscalationPolicyRow key={key} ep={component} />
      ))}
    </InfoCard>
  );
};
