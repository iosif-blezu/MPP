const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const faker = require('faker');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://iosif:parola@test.ootr9ct.mongodb.net/?retryWrites=true&w=majority&appName=Test";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCollection = client.db('mpp2').collection('users');

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userCollection.insertOne({ username, password: hashedPassword });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userCollection.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const projectCollection = client.db('mpp2').collection('projects');
const taskCollection = client.db('mpp2').collection('tasks');


app.get('/api/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await projectCollection.find({}).toArray();
        res.json(projects);
    } catch (err) {
        console.error("Failed to fetch projects", err);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const result = await projectCollection.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
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

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
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

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        await taskCollection.deleteMany({ _id: new  ObjectId(req.params.id) });
        const result = await projectCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(204).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});


app.get('/api/tasks',  authenticateToken, async (req, res) => {
    try {
        const tasks = await taskCollection.find().toArray();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});
app.post('/api/tasks', authenticateToken, async (req, res) => {
    try {
      const task = {
        ...req.body,
        projectId: new ObjectId(req.body.projectId), 
      };
      const result = await taskCollection.insertOne(task);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
  

app.get('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const task = await taskCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
      const taskId = new ObjectId(req.params.id);
      const updatedTask = {
        ...req.body,
        projectId: new ObjectId(req.body.projectId),
      };
  
      const result = await taskCollection.updateOne({ _id: taskId }, { $set: updatedTask });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
  

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const result = await taskCollection.deleteOne({ _id: new ObjectId(req.params.id) });
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
        await createInitialData();  
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
});

module.exports = app;
