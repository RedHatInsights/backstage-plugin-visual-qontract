import { useApi, configApiRef } from '@backstage/core-plugin-api';
import {
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CardMedia from '@material-ui/core/CardMedia';
import React from 'react';

export const NewsStoryCard = ({story}: {story: any}) => {
  const useStyles = makeStyles({
    root: {},
    media: {
      height: '10em',
    },
    horizontalOverflow: {},
    newsCard: {
        flex: '0 0 auto',
        width: 'auto',
        margin: '0.5em',
        maxWidth: '22em',
      },
    outerCard: {},
    cardBody: {},
  });
  const classes = useStyles();
  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/inscope-resources`;

  const handleClick = () => {
    window.open(story.link.url, '_blank');
  }

  return (
    <Card raised className={classes.newsCard} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`${proxyUrl}${story.image}`}
          title={story.title}
        />
        <CardContent className={classes.cardBody}>
          <Link href={story.link.url} target="_blank" rel="noopener noreferrer">
            <Typography variant="button">{story.title}</Typography>
          </Link>
          <Typography variant="body2">{story.body}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
