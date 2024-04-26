interface Task {
    _id: string; // Adjust this from 'id: number' to '_id: string'
    name: string;
    description: string;
    projectId: string;
    status: string;
    
}
export default Task;
