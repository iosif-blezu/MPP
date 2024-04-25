const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const faker = require('faker');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const uri = "mongodb+srv://iosif:parola@test.ootr9ct.mongodb.net/?retryWrites=true&w=majority&appName=Test";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const projectCollection = client.db('mpp2').collection('projects');
const taskCollection = client.db('mpp2').collection('tasks');


app.get('/api/projects', async (req, res) => {
    try {
        const projects = await projectCollection.find({}).toArray();
        res.json(projects);
    } catch (err) {
        console.error("Failed to fetch projects", err);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const result = await projectCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await projectCollection.findOne({ _id: new ObjectId(req.params.id)});
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const tasks = await taskCollection.find({ projectId: project._id }).toArray();
        res.status(200).json({ project, tasks });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const result = await projectCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await taskCollection.deleteMany({ _id: new  ObjectId(req.params.id) });
        const result = await projectCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(204).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

// Task CRUD operations similarly as done for projects

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await taskCollection.find().toArray();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// POST a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const result = await taskCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

// GET a specific task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await taskCollection.findOne({ _id: new ObjectID(req.params.id) });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// PUT to update a task by ID
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const result = await taskCollection.updateOne(
            { _id: new ObjectID(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'No task found with that ID or no changes provided' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

// DELETE a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const result = await taskCollection.deleteOne({ _id: new ObjectID(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No task found with that ID' });
        }
        res.status(204).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

async function createInitialData() {
    if ((await projectCollection.countDocuments()) === 0) {
        for (let i = 0; i < 10; i++) {
            const newProject = {
                Title: faker.commerce.productName(),
                Description: faker.lorem.sentences(),
                Status: faker.random.arrayElement(['Completed', 'In Progress', 'On Hold']),
                Technologies: [faker.random.arrayElement(['Node', 'React', 'Angular', 'Vue', 'Express'], faker.random.arrayElement(['Node', 'React', 'Angular', 'Vue', 'Express']))],
                StartDate: faker.date.past(),
                EndDate: faker.date.future(),

            };
            const result = await projectCollection.insertOne(newProject);
            for (let j = 0; j < 5; j++) {
                const newTask = {
                    name: faker.hacker.phrase(),
                    description: faker.lorem.sentences(),
                    projectId: result.insertedId,
                    status: faker.random.arrayElement(['Pending', 'Completed', 'In Progress'])
                };
                await taskCollection.insertOne(newTask);
            }
        }
    }
}


app.listen(PORT, async () => {
    try {
        await client.connect();
        console.log("MongoDB connected and server running on http://localhost:" + PORT);
        await createInitialData();  // Initialize sample data
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
});
