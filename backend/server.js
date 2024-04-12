const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faker = require('faker');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

function generateProjects(num) {
    let projects = [];
    for (let i = 1; i <= num; i++) {
        projects.push({
            id: i,
            Title: faker.commerce.productName(),
            Description: faker.lorem.sentence(),
            Status: faker.random.arrayElement(['Completed', 'In Progress', 'Not Started']),
            Technologies: [faker.random.word(), faker.random.word(), faker.random.word()],
            StartDate: faker.date.past().toISOString().slice(0, 10),
            EndDate: faker.date.future().toISOString().slice(0, 10)
        });
    }
    return projects;
}

let projects = generateProjects(20);

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
        id: projects.length + 1,
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
