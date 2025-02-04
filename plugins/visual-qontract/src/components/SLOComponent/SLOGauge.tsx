import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { configApiRef, useApi, fetchApiRef } from '@backstage/core-plugin-api';

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export const SLOGauge = ({ query }: { query: string }) => {
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false);
  
  // Get Backstage objects
  const config = useApi(configApiRef);
  const fetchApi = useApi(fetchApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');

  useEffect(() => {
    setError(false);
    setLoading(true);
    const fetchData = async () => {
      try {
        const adjustedQuery = query.replace(/{{window}}/g, '28d');
        const queryString = new URLSearchParams({
          query: adjustedQuery,
        }).toString();
        const response = await fetchApi.fetch(
          `${backendUrl}/api/proxy/prometheus/query?${queryString}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const result = await response.json();
        if (result.data.result.length > 0) {
          const value = parseFloat(result.data.result[0].value[1]);
          const percentage = value * 100;
          //Clamp at 1 decimal plance
          setPercentage(Math.round(percentage * 10) / 10);
        } else {
          setNoResultsFound(true);
        }
      } catch (error) {
        console.log('Error fetching SLO data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const getColor = (value: number) => {
    if (value >= 90) return 'green';
    if (value >= 70) return 'yellow';
    return 'red';
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error loading the SLO information.
        </Typography>
      </Box>
    );
  }

  if (noResultsFound) {
    return (
      <Gauge
        value={0}
        color={'#343434'}
        startAngle={-110}
        endAngle={110}
        height={200}
        width={200}
        valueField="value"
        text={
          ({value}) => `No Results`
        }
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 25,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: getColor(percentage),
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  const SLIGuage = () => {
    return (
      <Gauge
        value={percentage}
        color={getColor(percentage)}
        startAngle={-110}
        endAngle={110}
        height={200}
        width={200}
        valueField="value"
        text={
          ({value}) => `${value}%`
        }
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
            fill: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: getColor(percentage),
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    );
  }

  return (
    <Box>
      <SLIGuage />
    </Box>
  );
};
