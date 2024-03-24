import Project from "../type/Project";

const Projects = [
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
        Status: "In Progress",
        Technologies: ["Angular", "Node", "MongoDB"],
        StartDate: "2021-03-01",
        EndDate: "2022-01-31",
    }
]

export default Projects as Project[]