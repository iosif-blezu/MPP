const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let projects = [
    { id: 1, Title: "Project 1", Description: "This is a project 1 description", Status: "Completed", Technologies: ["React", "Node", "MongoDB"], StartDate: "2020-01-01", EndDate: "2020-01-31" },
    { id: 2, Title: "Project 2", Description: "This is a project 2 description", Status: "Completed", Technologies: ["Java", "JavaFx", "MySQL"], StartDate: "2020-02-01", EndDate: "2020-02-28" },
    { id: 3, Title: "Project 3", Description: "This is a project 3 description", Status: "Completed", Technologies: ["Angular", "Node", "MongoDB"], StartDate: "2021-03-01", EndDate: "2022-01-31" },
    { id: 4, Title: "Project 4", Description: "This is a project 4 description", Status: "Completed", Technologies: ["Angular", "Firebase"], StartDate: "2022-03-01", EndDate: "2023-01-15" }
];

app.get('/api/projects', (req, res) => {
    res.status(200).send(projects);
});

app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) res.status(404).send('Project not found');
    else res.status(200).send(project);
});

app.post('/api/projects', (req, res) => {
    const project = { id: projects.length + 1, ...req.body };
    projects.push(project);
    res.status(201).send(project);
});

app.put('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        res.status(404).send('Project not found');
    } else {
        const index = projects.findIndex(p => p.id === project.id);
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

describe('API server', () => {
    let api;

    beforeAll(() => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'));
    });

    afterAll((done) => {
        console.log('Gracefully stopping test server');
        api.close(done);
    });

    it('responds to get /api/projects with status 200', async () => {
        const response = await request(api).get('/api/projects');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
    });

    it('responds to get /api/projects/:id with status 200', async () => {
        const response = await request(api).get('/api/projects/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.Title).toEqual('Project 1');
    });

    it('responds to post /api/projects with status 201', async () => {
        const newProject = {
            Title: "New Test Project",
            Description: "Test Description",
            Status: "In Progress",
            Technologies: ["Node", "Express"],
            StartDate: "2024-01-01",
            EndDate: "2024-12-31"
        };
        const response = await request(api).post('/api/projects').send(newProject);
        expect(response.statusCode).toBe(201);
        expect(response.body.id).toBe(5); // Assumes this is the next ID
    });

    it('responds to put /api/projects/:id with status 200', async () => {
        const updateData = { Title: "Updated Project Title" };
        const response = await request(api).put('/api/projects/1').send(updateData);
        expect(response.statusCode).toBe(200);
        expect(response.body.Title).toEqual('Updated Project Title');
    });

    it('responds to delete /api/projects/:id with status 204', async () => {
        const response = await request(api).delete('/api/projects/4');
        expect(response.statusCode).toBe(204);
    });
});
