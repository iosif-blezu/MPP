interface Project {
    _id: string; // Adjust this from 'id: number' to '_id: string'
    Title: string;
    Description: string;
    Status: string;
    Technologies: string[];
    StartDate: string;
    EndDate: string;
}
export default Project;
