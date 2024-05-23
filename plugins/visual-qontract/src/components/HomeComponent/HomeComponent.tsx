import React, { useEffect } from 'react';
import {
  Typography,
} from '@material-ui/core';
import {
  useStarredEntities,
  EntityRefLink,
  EntityRefLinks,
} from '@backstage/plugin-catalog-react'

export const HomeComponent = () => {
  const { starredEntities } = useStarredEntities();

  useEffect(() => {
    console.log(starredEntities);
  }, [starredEntities]);

  return (
    <Typography variant="h6" color="textPrimary">
      Hello World
      {
        [...starredEntities].map((entity) => (
          <EntityRefLink entityRef={entity} key={entity.toString()} />
        ))
      }
      <EntityRefLinks entityRefs={[...starredEntities]} />
    </Typography>
  )
};
