import React, { useEffect, useState } from 'react';
import { CardHeader, Link, Typography } from '@material-ui/core';
import {
  useStarredEntities,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from 'tss-react/mui';
import StarIcon from '@material-ui/icons/Star';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Explore from '@material-ui/icons/Explore';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import LinkIcon from '@material-ui/icons/Link';
import { useApi, configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { FeaturedNews } from './FeaturedNews';
import { StatusMiniComponent } from '../StatusMiniComponent';
import { InfoCard } from './InfoCard';
import { IncidentResponseCard } from './IncidentResponseCard';

export const HomeComponent = () => {
  const { starredEntities } = useStarredEntities();

  const [links, setLinks] = useState([]);
  const [linkError, setLinkError] = useState(false);

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/developer-hub`;
  const fetchApi = useApi(fetchApiRef);

  useEffect(() => {
    setLinkError(false);
    const fetchLinks = async () => {
      try {
        const response = await fetchApi.fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }

        const json = await response.json();
        setLinks(json);
      } catch (error) {
        console.error('Error fetching links:', error);
        setLinkError(true); // Set error state
      }
    };

    fetchLinks();
  }, [proxyUrl]);

  const useStyles = makeStyles()(theme => ({
    topcard: {
      minHeight: '16em',
      flex: '0 0 auto',
    },
    infocard: {
      minHeight: '7em',
      flex: '0 0 auto',
      height: '100%',
    },
    img: {
      height: '40px',
      width: 'auto',
    },
    searchBar: {
      display: 'flex',
      maxWidth: '60vw',
      boxShadow: theme.shadows.at(1),
      backgroundColor: theme.palette.background.paper,
      margin: 'auto',
    },
    title: {
      'div > div > div > div > p': {
        textTransform: 'uppercase',
      },
    },
    notchedOutline: {
      borderStyle: 'none!important',
    },
    linkCard: {
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      boxShadow: '0px 0px 0px 0px',
      minWidth: '14em',
      minHeight: '7em',
    },
    linkCardImage: {
      height: 48,
      width: 48,
      marginRight: theme.spacing(2),
    },
    truncatedText: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '8em', // Adjust as needed
    },
  }));

  const { classes } = useStyles();

  const LinksCard = () => {
    if (linkError) {
      return (
        <Card classes={{ root: classes.infocard }}>
          <CardHeader
            title="Links"
            titleTypographyProps={{
              variant: 'h6',
            }}
            avatar={<LinkIcon />}
          />
          <CardContent>
            <Typography variant="body1">
              An error occurred while fetching links. You can try reloading or
              contact Engineering Productivity.
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card classes={{ root: classes.infocard }}>
        <CardHeader
          title="Links"
          titleTypographyProps={{
            variant: 'h6',
          }}
          avatar={<LinkIcon />}
        />
        <CardContent>
          <Grid container direction="row">
            <Grid item>
              <LinksGrid links={links} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const LinksGrid = ({ links }: { links: any }) => {
    if (links.length === 0) {
      return <Typography variant="body1">Loading...</Typography>;
    }
    return (
      <Grid container direction="row">
        {links.map(
          (
            group: { title: string; links: any[] },
            index: React.Key | null | undefined,
          ) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <Typography variant="overline">{group.title}</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1} direction="column">
                  {group.links.map((link, idx) => (
                    <Grid item>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Link href={link.url} key={idx}>
                        {link.label}
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </React.Fragment>
          ),
        )}
      </Grid>
    );
  };

  const FavoritesCard = () => {
    let Output = <Typography variant="body1">Loading...</Typography>;
    const StarredEntities = [...starredEntities].map(entity => (
      <StarredEntity entityRef={entity} key={entity.toString()} />
    ));
    if (StarredEntities.length === 0) {
      Output = (
        <React.Fragment>
          <Grid item xs={3}></Grid>
          <Grid xs={6} item>
            <Typography variant="body1">
              You have no favorites set. Visit the catalog and hit the star icon
              to add a favorite..
            </Typography>
          </Grid>
          <Grid item xs={3}></Grid>
        </React.Fragment>
      );
    } else {
      Output = (
        <Grid container direction="row">
          {StarredEntities}
        </Grid>
      );
    }
    return (
      <Card classes={{ root: classes.infocard }}>
        <CardHeader
          title="Your Favorites"
          titleTypographyProps={{
            variant: 'h6',
          }}
          avatar={<StarIcon />}
        />
        <CardContent>
          <Grid container direction="row">
            {Output}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const StarredEntity = ({ entityRef }: { entityRef: string }) => {
    return (
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <EntityRefLink entityRef={entityRef} hideIcon />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const TopCards = () => {
    return (
      <Grid container direction="row">
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Get Started"
            avatar={<DirectionsRunIcon />}
            body="Read the inScope User Guide and hit the ground running."
            link="/catalog/default/component/backstage-app/docs/"
            linkText="User Guide"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Explore"
            avatar={<Explore />}
            body="Everything you need to know about your apps and services."
            link="/catalog"
            linkText="Catalog"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Learn"
            avatar={<LibraryBooks />}
            body="Search and read documentation for all apps and services in a single, unified view."
            link="/docs"
            linkText="Docs"
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Page themeId="home">
      <Header title="inScope" />
      <Content>
        <Grid container direction="column">
          <Grid item>
            <TopCards />
          </Grid>
          <Grid item>
            <FeaturedNews />
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item xs={12} md={6}>
                <Grid container direction="column">
                  <Grid item xs={12}>
                    <IncidentResponseCard />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <StatusMiniComponent />
                  </Grid>
                  <Grid item xs={6}>
                    <FavoritesCard />
                  </Grid>
                  <Grid item xs={6}>
                    <LinksCard />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
