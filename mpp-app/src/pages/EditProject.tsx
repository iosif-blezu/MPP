import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box} from '@mui/material';
import Project from '../type/Project'; // Adjust the import path as necessary
import initialProjects from '../components/Projects'; // Adjust the import path as necessary

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
    const proj = initialProjects.find(p => p.id === parseInt(projectId || '0'));
    if (proj) {
      setProject(proj);
      setTitle(proj.Title);
      setDescription(proj.Description);
      setStatus(proj.Status);
      setTechnologies(proj.Technologies.join(', '));
      setStartDate(proj.StartDate);
      setEndDate(proj.EndDate);
    }
  }, [projectId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedProject: Project = {
      id: project?.id || 0,
      Title: title,
      Description: description,
      Status: status,
      Technologies: technologies.split(',').map(tech => tech.trim()),
      StartDate: startDate,
      EndDate: status === 'In Progress' ? 'Unknown' : endDate,
    };
    const projectIndex = initialProjects.findIndex(p => p.id === parseInt(projectId || '0'));
    if (projectIndex !== -1) {
      initialProjects[projectIndex] = updatedProject;
    }
    navigate('/');
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
        />
        <TextField
            margin="normal"
            required
            fullWidth
            name="technologies"
            label="Project Technologies"
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
            autoComplete="current-startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
        />
        
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProject;
