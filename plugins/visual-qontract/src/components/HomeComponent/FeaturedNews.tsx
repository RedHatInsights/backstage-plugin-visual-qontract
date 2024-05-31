// create a basic card component

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Link,
  CardMedia,
  CardActionArea,
  makeStyles,
} from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import AnnouncementIcon from '@material-ui/icons/Announcement';

export const FeaturedNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/inscope-resources`;

  const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: '8em',
    },
    horizontalOverflow: {
      overflowX: 'auto',
      display: 'flex',
      width: 'auto',
      maxWidth: '100%',
    },
    newsCard: {
      flex: '0 0 auto',
      width: 'auto',
      margin: '0.5em',
    },
    outerCard: {},
    cardBody: {
      maxWidth: '22em',
    },
  });
  const classes = useStyles();
  useEffect(() => {
    fetch(`${proxyUrl}/resources/json/hotnews.json`)
      .then(response => response.json())
      .then(json => setNews(json));
  }, []);

  useEffect(() => {
    setFeaturedNews(findFeaturedStories());
  }, [news]);

  const findFeaturedStories = () => {
    const featured: any[] = [];

    news.forEach(section => {
      section.stories.forEach((story: { featured: boolean }) => {
        if (story.featured) {
          featured.push(story);
        }
      });
    });

    return featured;
  };

  const FeaturedNewsList = () => {
    return (
      <React.Fragment>
        {featuredNews.map((story, _index) => (
          <Card raised className={classes.newsCard}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={`${proxyUrl}/${story.image}`}
                title={story.title}
              />
              <CardContent className={classes.cardBody}>
                <Link
                  href={story.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="button">{story.title}</Typography>
                </Link>
                <Typography variant="body2">{story.body}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </React.Fragment>
    );
  };

  if (featuredNews.length === 0 || news.length === 0) {
    return <Typography variant="body2">Loading...</Typography>;
  }

  return (
    <Card className={classes.outerCard}>
      <CardHeader
        title="Featured News"
        titleTypographyProps={{
          variant: 'h6',
        }}
        children={
          <Link href="/news" target="_blank">
            <Typography variant="button">View All News</Typography>
          </Link>
        }
        avatar={<AnnouncementIcon />}
      />


      <CardContent className={classes.horizontalOverflow}>
        <FeaturedNewsList />
      </CardContent>
    </Card>
  );
};
