// TaskPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Task from '../type/Task'; // Adjust the import path as necessary
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Box,
} from '@mui/material';

const TaskPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      axios.get(`http://localhost:5000/api/projects/${projectId}`)
        .then(response => {
          const { tasks } = response.data; // Extract project and tasks from the response
          setTasks(tasks);
        })
        .catch(error => {
          console.error('Error fetching tasks', error);
        });
    }
  }, [projectId]);
  
  const handleDelete = (taskId: string) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      })
      .catch(error => {
        console.error('Error deleting task', error);
      });
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Project Tasks
      </Typography>
      {tasks.length === 0 ? (
        <Typography variant="subtitle1">No tasks found for this project.</Typography>
      ) : (
        <Grid container spacing={3}>
          {tasks.map(task => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card>
                <CardContent sx={{ height: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Typography variant="h5">{task.name}</Typography>
                  <Typography color="textSecondary">{task.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/edit-task/${task._id}`)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(task._id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Button variant="contained" onClick={() => navigate(`/add-task/${projectId}`)}>
        Add New Task
      </Button>
    </Box>
  );
};  
export default TaskPage;
