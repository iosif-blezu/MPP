// src/pages/AddTask.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import axios from '../axiosConfig'; // Use the configured Axios instance

const AddTask: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending'); // default to 'Pending'

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTask = {
      name,
      description,
      projectId, // This will be sent as a string
      status,
    };

    axios.post('/tasks', newTask)
      .then(() => {
        navigate(`/tasks/${projectId}`); // Navigate to the tasks of that project
      })
      .catch(error => console.error('Error adding new task', error));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Task Name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="description"
        label="Task Description"
        id="description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        select
        margin="normal"
        required
        fullWidth
        name="status"
        label="Task Status"
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Task
      </Button>
    </Box>
  );
};

export default AddTask;
