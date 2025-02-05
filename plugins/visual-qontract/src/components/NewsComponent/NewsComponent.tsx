import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CardActions,
  TextField,
} from '@material-ui/core';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi, configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import levenshtein from 'js-levenshtein'; // Import the Levenshtein distance library
import { NewsStoryCard } from './NewsStoryCard';

export const NewsComponent = () => {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get Backstage objects
  const config = useApi(configApiRef);
  // Constants
  const backendUrl = config.getString('backend.baseUrl');
  const proxyUrl = `${backendUrl}/api/proxy/inscope-resources`;
  const fetchApi = useApi(fetchApiRef);

  //On mount fetch the news data
  useEffect(() => {
    setLoading(true);
    fetchApi.fetch(`${proxyUrl}/resources/json/hotnews.json`)
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
  }, [selectedTags, searchQuery]);

  useEffect(() => {
    filterStories();
  }, [selectedSection]);

  const tokenize = (text: string) => {
    return text.toLowerCase().split(/\s+/);
  };

  const searchStories = (query: string, stories: any[]) => {
    if (!query) return stories;
    const tokens = tokenize(query);
    return stories.filter(story => {
      const titleTokens = tokenize(story.title);
      const bodyTokens = tokenize(story.body);
      const tagTokens = story.tags.map((tag: string) => tag.toLowerCase());
      const allTokens = [...titleTokens, ...bodyTokens, ...tagTokens];
      return tokens.some(token =>
        allTokens.some(storyToken => {
          return (
            storyToken.includes(token) || levenshtein(storyToken, token) < 3
          );
        }),
      );
    });
  };

  const filterStories = () => {
    let stories: any[] = [];
    news.forEach(section => {
      // First filter by section
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
    stories = searchStories(searchQuery, stories);
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
        selectedTags.every(tag => story.tags.includes(tag)),
      );
      const hasStoryWithSearchQuery = section.stories.some(
        (story: any) => searchStories(searchQuery, [story]).length > 0,
      );
      if (
        hasStoryWithSelectedTags ||
        selectedTags.length === 0 ||
        hasStoryWithSearchQuery
      ) {
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
    setSearchQuery('');
  };

  const showClearAll = () => {
    return (
      selectedSection !== '' || selectedTags.length > 0 || searchQuery !== ''
    );
  };

  const FilterCardActions = () => {
    if (showClearAll()) {
      return (
        <CardActions>
          <Button onClick={clearAllFilters}>Clear All Filters</Button>
        </CardActions>
      );
    }
    return null;
  };

  const FilterMenu = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Filters</Typography>
        </CardContent>
        <CardContent>
          <Grid container direction="column" xs={12}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Search"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">News Streams</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="column" spacing={1}>
                {sections.map(section => (
                  <Grid item key={section}>
                    {Section(section)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6">Tags</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                {tags.map(tag => (
                  <Grid item key={tag}>
                    {Tag(tag)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <FilterCardActions />
      </Card>
    );
  };

  const NewsStoryCardGridItem = (story: any) => {
    return (
      <Grid item key={story.id} xs={4}>
        <NewsStoryCard story={story} />
      </Grid>
    );
  };

  const LargeCenteredText = ({ text }: { text: string }) => {
    return (
      <Grid container direction="row" justify="center">
        <Grid item>
          <Typography variant="h3">{text}</Typography>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return <LargeCenteredText text="Loading..." />;
  }

  if (error) {
    return <LargeCenteredText text="Error fetching news..." />;
  }

  const FilteredNewsCards = () => {
    if (filteredNews.length === 0 && searchQuery !== '') {
      return <LargeCenteredText text="No stories found" />;
    }
    if (filteredNews.length === 0) {
      return (
        <LargeCenteredText text="No stories found with selected filters" />
      );
    }
    return (
      <Grid container direction="row">
        {filteredNews.map((story, _index) => {
          return (
            <Grid item key={story.id} xs={4}>
              <NewsStoryCard story={story} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Page themeId="home">
      <Header title="News" />
      <Content>
        <Grid container direction="row" spacing={4}>
          <Grid item xs={3}>
            <FilterMenu />
          </Grid>
          <Grid item xs={9}>
            <Grid container direction="row" xs={12}>
              <FilteredNewsCards />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
