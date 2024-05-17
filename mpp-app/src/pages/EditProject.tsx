import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import axios from '../axiosConfig'; 
import Project from '../type/Project'; 

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | undefined>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (projectId) {
      axios.get(`/projects/${projectId}`)
        .then(response => {
          const proj = response.data;
          setProject(proj);
          setTitle(proj.Title);
          setDescription(proj.Description);
          setStatus(proj.Status);
          setTechnologies(proj.Technologies.join(', '));
          setStartDate(proj.StartDate);
          setEndDate(proj.EndDate === 'TBD' ? '' : proj.EndDate);
        })
        .catch(error => console.log('Error fetching project', error));
    }
  }, [projectId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedProject = {
      Title: title,
      Description: description,
      Status: status,
      Technologies: technologies.split(',').map(tech => tech.trim()),
      StartDate: startDate,
      EndDate: status === 'In Progress' ? 'TBD' : endDate,
    };

    if (project && projectId) {
      axios.put(`/projects/${projectId}`, updatedProject)
        .then(() => navigate('/'))
        .catch(error => console.error('Error updating project', error));
    }
  };

  if (!project) {
    return <div>Project not found</div>;
  }

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
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
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
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="status"
        label="Project Status"
        type="text"
        id="status"
        autoComplete="current-status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
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
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="startDate"
        label="Start Date"
        type="date"
        id="startDate"
        autoComplete="current-startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="endDate"
        label="End Date"
        type="date"
        id="endDate"
        autoComplete="current-endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        InputProps={{
          style: { color: 'white' },
        }}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProject;
