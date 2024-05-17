import React, { useState, Fragment, useEffect } from 'react';
import { Button, Chip, Card, CardContent, CardActions, Typography, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; 
import Project from '../type/Project';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>('title');
  const [sortDirection, setSortDirection] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/projects')
      .then(response => {
        setProjects(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching projects', error);
        setError('Failed to fetch projects. The backend may be unreachable.');
      });
  }, []);

  const handleDelete = (_id: string) => {
    axios.delete(`/projects/${_id}`)
      .then(() => {
        setProjects(prevProjects => prevProjects.filter(project => project._id !== _id));
        setTotalPages(() => Math.ceil((projects.length - 1) / itemsPerPage));
      })
      .catch(error => console.error('Error deleting project', error));
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';

    const highDate = '9999-12-31';

    if (sortCriteria === 'title') {
      valA = a.Title.toLowerCase();
      valB = b.Title.toLowerCase();
    } else if (sortCriteria === 'startDate') {
      valA = a.StartDate;
      valB = b.StartDate;
    } else if (sortCriteria === 'endDate') {
      valA = a.EndDate === 'TBD' ? highDate : a.EndDate;
      valB = b.EndDate === 'TBD' ? highDate : b.EndDate;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Fragment>
      <Box sx={{ padding: "2rem" }}>
        {error && (
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {!error && (
          <Fragment>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setSortCriteria('title')}>Sort by Title</Button>
              <Button onClick={() => setSortCriteria('startDate')}>Sort by Start Date</Button>
              <Button onClick={() => setSortCriteria('endDate')}>Sort by End Date</Button>
              <Button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </Box>
            <Grid container spacing={4}>
              {currentProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.Title}
                      </Typography>
                      <Typography>
                        {project.Description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {project.Status}
                      </Typography>
                      {project.Technologies.map((tech, index) => (
                        <Chip key={index} label={tech} sx={{ margin: "0.1rem" }} />
                      ))}
                      <Typography variant="body2" color="textSecondary">
                        Start Date: {project.StartDate}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        End Date: {project.EndDate}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        <Link to={`/tasks/${project._id}`} style={{ textDecoration: 'none' }}>
                          Tasks
                        </Link>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleDelete(project._id)}>Delete</Button>
                      <Button size="small" onClick={() => navigate(`/edit/${project._id}`)}>Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fragment>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Link to="/add-project" style={{ textDecoration: 'none' }}>
          <Button sx={{ mx: 0.5 }} variant="contained" color="primary">
            Add Project
          </Button>
        </Link>
        <Link to="/analytics" style={{ textDecoration: 'none' }}>
          <Button sx={{ mx: 0.5 }} variant="contained" color="primary">
            Analytics
          </Button>
        </Link>
      </Box>
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          color="primary">
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="body1" sx={{ mx: 1 }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <IconButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          color="primary">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Fragment>
  );

}

export default Home;
