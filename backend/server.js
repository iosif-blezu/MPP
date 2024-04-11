const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let projects = [
    {
        id: 1,
        Title: "Project 1",
        Description: "This is a project 1 description",
        Status: "Completed",
        Technologies: ["React", "Node", "MongoDB"],
        StartDate: "2020-01-01",
        EndDate: "2020-01-31",
    },
    {
        id: 2,
        Title: "Project 2",
        Description: "This is a project 2 description",
        Status: "Completed",
        Technologies: ["Java", "JavaFx", "MySQL"],
        StartDate: "2020-02-01",
        EndDate: "2020-02-28",
    },
    {
        id: 3,
        Title: "Project 3",
        Description: "This is a project 3 description",
        Status: "Completed",
        Technologies: ["Angular", "Node", "MongoDB"],
        StartDate: "2021-03-01",
        EndDate: "2022-01-31",
    },
    {
        id: 4,
        Title: "Project 4",
        Description: "This is a project 4 description",
        Status: "Completed",
        Technologies: ["Angular", "Firebase"],
        StartDate: "2022-03-01",
        EndDate: "2023-01-15",
    }
];

// Function to get the next ID
function getNextId() {
    return projects.length === 0 ? 1 : Math.max(...projects.map(p => p.id)) + 1;
}

app.get('/api/projects', (req, res) => {
    res.status(200).send(projects);
});

app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) res.status(404).send('Project not found');
    else res.status(200).send(project);
});

app.post('/api/projects', (req, res) => {
    const project = {
        id: getNextId(),
        ...req.body
    };
    projects.push(project);
    res.status(201).send(project);
});

app.put('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        res.status(404).send('Project not found');
    } else {
        const index = projects.indexOf(project);
        projects[index] = {...project, ...req.body};
        res.status(200).send(projects[index]);
    }
});

app.delete('/api/projects/:id', (req, res) => {
    const originalLength = projects.length;
    projects = projects.filter(p => p.id !== parseInt(req.params.id));
    if (projects.length < originalLength) {
        res.status(204).send();
    } else {
        res.status(404).send('Project not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
