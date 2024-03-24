import React, { useState, Fragment } from 'react';
import { Button, Chip, Card, CardContent, CardActions, Typography, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import initialProjects from '../components/Projects';
import Project from '../type/Project';

const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [sortCriteria, setSortCriteria] = useState<string>('title'); // 'title', 'startDate', or 'endDate'
    const [sortDirection, setSortDirection] = useState<string>('asc'); // 'asc' or 'desc'
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
        setProjects(projects.filter(project => project.id !== id));
    };

    const handleClearSorting = () => {
        setProjects([...initialProjects]); // Resets to the initial order
        setSortCriteria(''); // Optionally clear the sort criteria as well
        setSortDirection('asc'); // Reset to default direction if needed
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


    return (
        <Fragment>
            <Box sx={{ padding: "2rem" }}>
                {/* Sorting controls */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setSortCriteria('title')}>Sort by Title</Button>
                    <Button onClick={() => setSortCriteria('startDate')}>Sort by Start Date</Button>
                    <Button onClick={() => setSortCriteria('endDate')}>Sort by End Date</Button>
                    <Button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
                        {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                    </Button>
                    <Button onClick={handleClearSorting} color="primary">Clear Sorting</Button>
                </Box>
                <Grid container spacing={4}>
                    {sortedProjects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor:'#FFFFFF' }}>
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
                                    {project.Technologies.map((tech) => (
                                        <Chip key={tech} label={tech} sx={{ margin: "0.1rem" }} />
                                    ))}
                                    <Typography variant="body2" color="textSecondary">
                                        Start Date: {project.StartDate}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        End Date: {project.EndDate}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleDelete(project.id)}>Delete</Button>
                                    <Button size="small" onClick={() => navigate(`/edit/${project.id}`)}>Edit</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Link to="/add-project" style={{ textDecoration: 'none' }}>
                    <Button sx={{ mx: 0.5 }} variant="contained" color="primary" >
                        Add Project
                    </Button>
                </Link>
                <Link to="/analytics" style={{ textDecoration: 'none' }}>
                    <Button sx={{ mx: 0.5 }} variant="contained" color="primary" >
                        Analytics
                    </Button>
                </Link>
            </Box>
        </Fragment>
    );
}

export default Home;
