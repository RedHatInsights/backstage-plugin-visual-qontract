import React, { useEffect } from 'react';
import {
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { SLOQuery } from './query';
import QueryQontract from '../../common/QueryAppInterface';
import { useEntity } from '@backstage/plugin-catalog-react';
import { SLOGauge } from './SLOGauge';

export const SLOComponent = () => {
  const { result, loaded, error } = QueryQontract(SLOQuery);

  const { entity } = useEntity();

  const [filteredResult, setFilteredResult] = React.useState<any>({});

  useEffect(() => {
    if (Object.keys(entity).length === 0) {
      return;
    }
    if (Object.keys(result).length === 0) {
      return;
    }
    if (!result.slo_document_v1) {
      return;
    }
    if (result.slo_document_v1.length === 0) {
      return;
    }
    result.slo_document_v1.forEach((slo: any) => {
      if (slo.app.name === entity.spec?.system) {
        setFilteredResult(slo);
        console.log(slo);
      }
    });
  }, [result, entity]);

  const title = 'SLIs [28 day rolling window]';

  if (error) {
    return (
      <InfoCard title={title}>
        <Typography align="center" variant="body1">
          Error loading the SLO information.
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

  if (
    Object.keys(filteredResult).length === 0 ||
    Object.keys(result).length === 0
  ) {
    return null
  }

  const splitName = (name: string) => {
    // Insert space before each capital letter not preceded by another capital letter or a digit
    // and not followed by another capital letter.
    return name.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4').trim();
  };


  return (

      <Box display="flex" flexWrap="wrap" justifyContent="left">
        {filteredResult.slos.map((slo: any, key: number) => (
            <Card key={key} style={{ maxWidth: '18em', maxHeight: '30em', marginRight: '1em', flexGrow: 1 }}>
              <CardContent>
                <SLOGauge query={slo.expr} />
                <Typography variant="button">{splitName(slo.name)}</Typography>
                <Typography variant="body2">{slo.SLISpecification}</Typography>
              </CardContent>
              <CardActions>
                <Link target="_blank" href={slo.dashboard}>
                  View Dashboard
                </Link>
              </CardActions>
            </Card>
        ))}
      </Box>

  );
};
