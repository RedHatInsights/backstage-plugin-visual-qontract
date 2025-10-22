import React, { useEffect, useState, useMemo } from 'react';
import {
  Page,
  Header,
  Content,
  Table,
  TableColumn,
  Progress,
  Link,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
  Grid,
  Chip,
  Paper,
  FormControl,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Divider,
  Box,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  filterSidebar: {
    padding: theme.spacing(2),
    position: 'sticky',
    top: theme.spacing(2),
  },
  filterSection: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  tagChip: {
    margin: theme.spacing(0.5),
  },
  nameCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  linksSidebar: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  linkButton: {
    width: '100%',
    marginBottom: theme.spacing(1),
    justifyContent: 'space-between',
    textAlign: 'left',
    textTransform: 'none',
    padding: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  linkButtonText: {
    flex: 1,
    textAlign: 'left',
  },
  searchBox: {
    marginBottom: theme.spacing(2),
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  addProjectButton: {
    textTransform: 'none',
  },
}));

interface Filters {
  category: string;
  usecase: string;
  status: string;
  domain: string;
}

const getAnnotation = (entity: Entity, key: string): string => {
  const annotationKey = `ai.redhat.com/${key}`;
  const value = entity.metadata.annotations?.[annotationKey];
  return value || '-';
};

// Custom search function that searches across all entity fields
const searchFunction = (entity: Entity, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Helper function to recursively search through an object
  const searchInObject = (obj: any): boolean => {
    if (obj === null || obj === undefined) return false;
    
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(lowerSearchTerm);
    }
    
    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item));
    }
    
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => searchInObject(value));
    }
    
    return false;
  };
  
  return searchInObject(entity);
};

const usefulLinks = [
  {
    title: 'Artificial Intelligence Skills Academy',
    url: 'https://source.redhat.com/career/start_learning/skills/artificial_intelligence',
  },
  {
    title: 'Approved AI Tools',
    url: 'https://source.redhat.com/projects_and_programs/ai/ai_tools_and_use_cases',
  },
  {
    title: 'Internal AI News Room',
    url: 'https://source.redhat.com/projects_and_programs/ai/newsroom',
  },
  {
    title: 'Sharing AI Community Blog',
    url: 'https://source.redhat.com/projects_and_programs/ai/share_ai',
  },
  {
    title: 'OpenShift AI',
    url: 'https://www.redhat.com/en/products/ai/openshift-ai',
  },
  {
    title: 'RHEL AI',
    url: 'https://www.redhat.com/en/products/ai/enterprise-linux-ai',
  },
  {
    title: 'Ansible Lightspeed',
    url: 'https://www.redhat.com/en/technologies/management/ansible/ansible-lightspeed',
  },
];

export function AIShowcasePage() {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    usecase: '',
    status: '',
    domain: '',
  });

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: {
            'metadata.namespace': 'ai',
            'kind': 'Component',
          },
        });
        setEntities(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching entities');
        console.error('Error fetching entities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [catalogApi]);

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const usecases = new Set<string>();
    const statuses = new Set<string>();
    const domains = new Set<string>();

    entities.forEach(entity => {
      const category = getAnnotation(entity, 'category');
      const usecase = getAnnotation(entity, 'usecase');
      const status = getAnnotation(entity, 'status');
      const domain = getAnnotation(entity, 'domain');

      if (category !== '-') categories.add(category);
      if (usecase !== '-') usecases.add(usecase);
      if (status !== '-') statuses.add(status);
      if (domain !== '-') domains.add(domain);
    });

    return {
      categories: Array.from(categories).sort(),
      usecases: Array.from(usecases).sort(),
      statuses: Array.from(statuses).sort(),
      domains: Array.from(domains).sort(),
    };
  }, [entities]);

  // Filter entities based on selected filters and search term
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      // Apply dropdown filters
      if (filters.category) {
        const category = getAnnotation(entity, 'category');
        if (category !== filters.category) return false;
      }
      if (filters.usecase) {
        const usecase = getAnnotation(entity, 'usecase');
        if (usecase !== filters.usecase) return false;
      }
      if (filters.status) {
        const status = getAnnotation(entity, 'status');
        if (status !== filters.status) return false;
      }
      if (filters.domain) {
        const domain = getAnnotation(entity, 'domain');
        if (domain !== filters.domain) return false;
      }
      
      // Apply search filter
      if (searchTerm && !searchFunction(entity, searchTerm)) {
        return false;
      }
      
      return true;
    });
  }, [entities, filters, searchTerm]);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      usecase: '',
      status: '',
      domain: '',
    });
  };

  const hasActiveFilters = filters.category || filters.usecase || filters.status || filters.domain;

  const columns: TableColumn<Entity>[] = [
    {
      title: 'Name',
      field: 'metadata.title',
      render: (entity: Entity) => (
        <div className={classes.nameCell}>
          <Link
            to={`/catalog/${entity.metadata.namespace}/${entity.kind.toLowerCase()}/${
              entity.metadata.name
            }`}
          >
            {entity.metadata.title || entity.metadata.name}
          </Link>
          {entity.metadata.tags && entity.metadata.tags.length > 0 && (
            <div className={classes.chipContainer}>
              {entity.metadata.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  className={classes.tagChip}
                />
              ))}
            </div>
          )}
        </div>
      ),
      customSort: (a: Entity, b: Entity) =>
        (a.metadata.title || a.metadata.name || '').localeCompare(b.metadata.title || b.metadata.name || ''),
    },
    {
      title: 'Category',
      field: 'metadata.annotations.ai.redhat.com/category',
      render: (entity: Entity) => getAnnotation(entity, 'category'),
      customSort: (a: Entity, b: Entity) =>
        getAnnotation(a, 'category').localeCompare(getAnnotation(b, 'category')),
    },
    {
      title: 'Usecase',
      field: 'metadata.annotations.ai.redhat.com/usecase',
      render: (entity: Entity) => getAnnotation(entity, 'usecase'),
      customSort: (a: Entity, b: Entity) =>
        getAnnotation(a, 'usecase').localeCompare(getAnnotation(b, 'usecase')),
    },
    {
      title: 'Status',
      field: 'metadata.annotations.ai.redhat.com/status',
      render: (entity: Entity) => {
        const status = getAnnotation(entity, 'status');
        return (
          <Chip
            label={status}
            size="small"
            color={status === 'active' ? 'primary' : 'default'}
          />
        );
      },
      customSort: (a: Entity, b: Entity) =>
        getAnnotation(a, 'status').localeCompare(getAnnotation(b, 'status')),
    },
    {
      title: 'Owner',
      field: 'metadata.annotations.ai.redhat.com/owner',
      render: (entity: Entity) => {
        const owner = getAnnotation(entity, 'owner');
        const domain = getAnnotation(entity, 'domain');
        return (
          <div className={classes.chipContainer}>
            <span>{owner}</span>
            {domain !== '-' && (
              <Chip label={domain} size="small" variant="outlined" />
            )}
          </div>
        );
      },
      customSort: (a: Entity, b: Entity) =>
        getAnnotation(a, 'owner').localeCompare(getAnnotation(b, 'owner')),
    },
  ];

  const FilterSection = ({
    label,
    options,
    filterType,
  }: {
    label: string;
    options: string[];
    filterType: keyof Filters;
  }) => (
    <FormControl className={classes.filterSection} variant="outlined" size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={filters[filterType]}
        onChange={(e) => handleFilterChange(filterType, e.target.value as string)}
        label={label}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const UsefulLinks = () => (
    <Paper className={classes.linksSidebar}>
      <Typography variant="h6" gutterBottom>
        AI @ Red Hat
      </Typography>
      <Divider style={{ marginBottom: 16 }} />
      {usefulLinks.map((link) => (
        <Button
          key={link.url}
          className={classes.linkButton}
          variant="outlined"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon fontSize="small" />}
        >
          <span className={classes.linkButtonText}>{link.title}</span>
        </Button>
      ))}
    </Paper>
  );

  return (
    <Page themeId="tool">
      <Header title="AI Projects" subtitle="Red Hat AI Projects" />
      <Content>
        {loading && <Progress />}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper className={classes.filterSidebar}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <FilterSection
                  label="Category"
                  options={filterOptions.categories}
                  filterType="category"
                />
                <FilterSection
                  label="Usecase"
                  options={filterOptions.usecases}
                  filterType="usecase"
                />
                <FilterSection
                  label="Status"
                  options={filterOptions.statuses}
                  filterType="status"
                />
                <FilterSection
                  label="Domain"
                  options={filterOptions.domains}
                  filterType="domain"
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Paper>
              <UsefulLinks />
            </Grid>
            <Grid item xs={12} md={9}>
              <Box className={classes.headerActions}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addProjectButton}
                  startIcon={<AddIcon />}
                  href="/create/templates/ai/add-new-ai-project"
                >
                  Add New Project
                </Button>
              </Box>
              <TextField
                className={classes.searchBox}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Table
                title={`AI Projects (${filteredEntities.length})`}
                options={{
                  search: false,
                  paging: true,
                  pageSize: 20,
                  sorting: true,
                }}
                columns={columns}
                data={filteredEntities}
              />
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
}

