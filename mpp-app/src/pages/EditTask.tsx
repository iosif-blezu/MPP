import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import axios from 'axios';

interface Task {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  status: string;
}

const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [projectId, setProjectId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`);
        setTask(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setStatus(response.data.status);
        setProjectId(response.data.projectId);
      } catch (error) {
        console.error('Error fetching task', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task) return;

    const updatedTask = {
      name,
      description,
      projectId,
      status,
    };

    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask);
      console.log('Task updated:', updatedTask);
      navigate('/');
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

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
        Update Task
      </Button>
    </Box>
  );
};

export default EditTask;
