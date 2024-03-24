import React, { useState, Fragment } from 'react';
import { Button, Chip, Card, CardContent, CardActions, Typography, Grid, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import initialProjects from '../components/Projects';
import Project from '../type/Project';

const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const navigate = useNavigate();

    const handleDelete = (id: number) => {
        setProjects(projects.filter(project => project.id !== id));
        // Assuming you're already at home, no need to navigate.
    };

    return (
        <Fragment>
            <Box sx={{ padding: "2rem" }}>
                <Grid container spacing={4}>
                    {projects.map((project) => (
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
                    <Button variant="contained" color="primary" >
                        Add Project
                    </Button>
                </Link>
            </Box>
        </Fragment>
    );
}

export default Home;
