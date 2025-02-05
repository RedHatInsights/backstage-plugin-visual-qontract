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
import { configApiRef, useApi, fetchApiRef } from '@backstage/core-plugin-api';
import AnnouncementIcon from '@material-ui/icons/Announcement';

export const FeaturedNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/inscope-resources`;
  const fetchApi = useApi(fetchApiRef);

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
    setLoading(true);
    fetchApi.fetch(`${proxyUrl}/resources/json/hotnews.json`)
      .then(response => response.json())
      .then(json => { 
        setNews(json)
        setLoading(false)
      })
      .catch(_error => {
        setError(true)
        setLoading(false) 
      })
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

  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  }

  const FeaturedNewsList = () => {
    return (
      <React.Fragment>
        {featuredNews.map((story, index) => (
          <Card raised key={index} className={classes.newsCard} onClick={() => {handleCardClick(story.link.url)}}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={`${proxyUrl}${story.image}`}
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

  let MainFragment = FeaturedNewsList;

  if (loading) {
    MainFragment = () => (
      <Typography variant="body2">Loading...</Typography>
    );
  }

  if (error) {
    MainFragment = () => (
      <Typography variant="body2">Error fetching news...</Typography>
    );
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
        <MainFragment />
      </CardContent>
    </Card>
  );
};
