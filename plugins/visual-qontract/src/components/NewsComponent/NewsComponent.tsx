//Create a basic hello world component

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
  makeStyles,
  Button,
  CardActions,
} from '@material-ui/core';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const NewsComponent = () => {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/inscope-resources`;

  const useStyles = makeStyles({
    root: {},
    media: {
      height: '10em',
    },
    horizontalOverflow: {},
    newsCard: {
      maxWidth: '24em',
    },
    outerCard: {},
    cardBody: {},
  });
  const classes = useStyles();

  //On mount fetch the news data
  useEffect(() => {
    setLoading(true);
    fetch(`${proxyUrl}/resources/json/hotnews.json`)
      .then(response => response.json())
      .then(json => {
        setNews(json);
        setLoading(false);
      })
      .catch(error => {
        setError(true);
        console.error('Error fetching News:', error);
        setLoading(false);
      });
  }, []);

  // If the news data changes, filter the stories
  useEffect(() => {
    filterStories();
    generateSections();
  }, [news]);

  // If the filtered news changes, generate the tags
  useEffect(() => {
    generateTags();
  }, [filteredNews]);

  useEffect(() => {
    filterStories();
    generateSections();
  }, [selectedTags]);

  useEffect(() => {
    filterStories();
  }, [selectedSection]);

  const filterStories = () => {
    const stories: React.SetStateAction<any[]> = [];
    news.forEach(section => {
      //First filter by section
      if (selectedSection !== '' && section.title !== selectedSection) {
        return;
      }
      // If selectedTags is empty, show all stories
      if (selectedTags.length === 0) {
        section.stories.forEach((story: any) => {
          stories.push(story);
        });
      } else {
        section.stories.forEach((story: any) => {
          // If the story has all the selected tags, add it to the list
          if (selectedTags.every(tag => story.tags.includes(tag))) {
            stories.push(story);
          }
        });
      }
    });
    setFilteredNews(stories);
  };

  const generateTags = () => {
    const tags = new Set<string>();
    filteredNews.forEach(story => {
      story.tags.forEach((tag: string) => tags.add(tag));
    });
    setTags(Array.from(tags));
  };

  const generateSections = () => {
    const sections = new Set<string>();
    news.forEach(section => {
      const hasStoryWithSelectedTags = section.stories.some((story: any) =>
        selectedTags.every(tag => story.tags.includes(tag))
      );
      if (hasStoryWithSelectedTags || selectedTags.length === 0) {
        sections.add(section.title);
      }
    });
    setSections(Array.from(sections));
  };

  const Tag = (tag: string) => {
    const handleClick = (
      evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const eventTag = evt.currentTarget.textContent || '';
      if (selectedTags.includes(eventTag)) {
        setSelectedTags(selectedTags.filter(t => t !== eventTag));
      } else {
        setSelectedTags([...selectedTags, eventTag]);
      }
    };
    const isSelected = selectedTags.includes(tag) ? 'primary' : 'default';
    return (
      <Button color={isSelected} size="small" onClick={e => handleClick(e)}>
        {tag}
      </Button>
    );
  };

  const Section = (section: string) => {
    const handleClick = (
      evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const eventSection = evt.currentTarget.textContent || '';
      if (selectedSection === eventSection) {
        setSelectedSection('');
      } else {
        setSelectedSection(eventSection);
      }
    };
    const isSelected = selectedSection === section ? 'primary' : 'default';
    return (
      <Button color={isSelected} size="small" onClick={e => handleClick(e)}>
        {section}
      </Button>
    );
  };

  const clearAllFilters = () => {
    setSelectedSection('');
    setSelectedTags([]);
  };

  const showClearAll = () => { 
    return selectedSection !== '' || selectedTags.length > 0;
  }

  const FilterCardActions = () => {
    if (showClearAll()) {
      return (
        <CardActions>
          <Button onClick={clearAllFilters}>Clear All Filters</Button>
        </CardActions>
      );
    }
    return null;
  }

  const FilterMenu = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Filters</Typography>
        </CardContent>
        <CardContent>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h6">News Streams</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="column" spacing={1}>
                {sections.map(section => (
                  <Grid item>{Section(section)}</Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6">Tags</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                {tags.map(tag => (
                  <Grid item>{Tag(tag)}</Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <FilterCardActions />
      </Card>
    );
  };

  const NewsStoryCard = (story: any) => {
    return (
      <Grid item>
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
      </Grid>
    );
  };

  if (news.length === 0 || filteredNews.length === 0) {
    return <Typography variant="body2">Loading...</Typography>;
  }

  let NewsPage = () => {
    return (
      <Grid container direction="row">
        <Grid item xs={3}>
          <FilterMenu />
        </Grid>
        <Grid item xs={9}>
          <Grid container direction="row" xs={12}>
            {filteredNews.map((story, _index) => NewsStoryCard(story))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    NewsPage = () => <Typography variant="body2">Loading...</Typography>;
  }

  if (error) {
    NewsPage = () => (
      <Typography variant="body2">Error fetching News</Typography>
    );
  }

  return (
    <Page themeId="home">
      <Header title="inScope News"></Header>
      <Content>
        <NewsPage />
      </Content>
    </Page>
  );
};
