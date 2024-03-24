import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import Project from '../type/Project';
import initialProjects from '../components/Projects';

const AddProject: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProject: Project = {
      id: initialProjects.length + 1, 
      Title: title,
      Description: description,
      Status: status,
      Technologies: technologies.split(',').map(tech => tech.trim()),
      StartDate: startDate,
      EndDate: status === 'In Progress' ? 'TBD' : endDate,
    };
    initialProjects.push(newProject);
    navigate('/');
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    if (newStatus === 'In Progress') {
      setEndDate(''); 
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Project Title"
        name="title"
        autoComplete="title"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="description"
        label="Project Description"
        type="text"
        id="description"
        autoComplete="current-description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        select
        label="Project Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
      </TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        name="technologies"
        label="Project Technologies (comma separated)"
        type="text"
        id="technologies"
        autoComplete="current-technologies"
        value={technologies}
        onChange={(e) => setTechnologies(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="startDate"
        label="Start Date"
        type="date"
        id="startDate"
        InputLabelProps={{
          shrink: true,
        }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <TextField
        select
        label="Project Status"
        value={status}
        onChange={handleStatusChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
      </TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        name="endDate"
        label="End Date"
        type="date"
        id="endDate"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        disabled={status === 'In Progress'} 
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Project
      </Button>
    </Box>
  );
};

export default AddProject;