import React, { useEffect, ReactNode, useState } from 'react';
import {
  CardActions,
  CardHeader,
  Container,
  Link,
  Typography,
} from '@material-ui/core';
import {
  useStarredEntities,
  EntityRefLink,
} from '@backstage/plugin-catalog-react';
import { Content, Header, Page, Avatar } from '@backstage/core-components';
import { Box, Grid } from '@material-ui/core';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from 'tss-react/mui';
import StarIcon from '@material-ui/icons/Star';
import CreateIcon from '@material-ui/icons/Create';
import Explore from '@material-ui/icons/Explore';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import OpenInNew from '@material-ui/icons/OpenInNew';
import LinkIcon from '@material-ui/icons/Link';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { FeaturedNews } from './FeaturedNews';

export const HomeComponent = () => {
  const { starredEntities } = useStarredEntities();

  const [links, setLinks] = useState([]);

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/developer-hub`;

  useEffect(() => {
    console.log(starredEntities);
  }, [starredEntities]);

  useEffect(() => {
    fetch(proxyUrl)
      .then(response => response.json())
      .then(json => setLinks(json));
  }, []);

  const useStyles = makeStyles()(theme => ({
    topcard: {
      minHeight: '16em',
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
              <Grid item xs="12">
                <Typography variant="overline">{group.title}</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1} direction="column">
                  {group.links.map((link, idx) => (
                    <Grid item >
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
            {[...starredEntities].map(entity => (
              <StarredEntity entityRef={entity} key={entity.toString()} />
            ))}
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

  const TopCard = ({
    title,
    avatar,
    body,
    link,
    linkText,
  }: {
    title: string;
    avatar: ReactNode;
    body: string;
    link: string;
    linkText?: string;
  }) => {
    return (
      <Card classes={{ root: classes.topcard }}>
        <CardHeader
          title={title}
          avatar={avatar}
          titleTypographyProps={{
            variant: 'h6',
          }}
        />
        <CardContent>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
        <CardActions>
          <OpenInNew />
          <Link href={link}>
            <Typography variant="button">{linkText}</Typography>
          </Link>
        </CardActions>
      </Card>
    );
  };

  const TopCards = () => {
    return (
      <Grid container direction="row">
        <Grid item xs={12} md={4}>
          <TopCard
            title="Create"
            avatar={<CreateIcon />}
            body="Guided templates automate complex tasks and help you get started quickly. Boot strap a new app, onboard with Konflux, or generate App Interface YAML."
            link="/create"
            linkText="Templates"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopCard
            title="Explore"
            avatar={<Explore />}
            body="Everything you need to know about your apps and services: pipelines, tests, vulnerabilities, deployments, code, and more."
            link="/catalog"
            linkText="Catalog"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopCard
            title="Learn"
            avatar={<LibraryBooks />}
            body="Search and read documentation for all apps and services."
            link="/docs"
            linkText="Docs"
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Page themeId="home">
      <Header title="inScope">
        <Grid container direction="row">
          <Grid item>
            <HomePageSearchBar
              placeholder="Search"
              classes={{
                root: classes.searchBar,
              }}
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
              }}
            />
          </Grid>
        </Grid>
      </Header>
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
                <LinksCard />
              </Grid>
              <Grid item xs={12} md={6}>
                <FavoritesCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
