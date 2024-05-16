const request = require('supertest');
const app = require('./server.js');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://iosif:parola@test.ootr9ct.mongodb.net/?retryWrites=true&w=majority&appName=Test";


describe('API server', () => {
    let server;
    let client;
    let projectCollection;
    let taskCollection;

    beforeAll(async () => {
        server = app.listen(5000, () => console.log('Test server running on port 5000'));
        // Connect to the database and clear the collections before running tests
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        projectCollection = client.db('mpp2').collection('projects');
        taskCollection = client.db('mpp2').collection('tasks');
        await projectCollection.deleteMany({});
        await taskCollection.deleteMany({});
    });

    afterAll(async (done) => {
        console.log('stopping test server');
        await client.close();
        server.close(done);
    });

    it('responds to get /api/projects with status 200', async () => {
        const response = await request(server).get('/api/projects');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
});
