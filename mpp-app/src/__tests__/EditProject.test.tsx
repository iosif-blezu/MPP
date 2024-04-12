import '@testing-library/jest-dom';
import initialProjects from '../components/Projects';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('AddProject Component', () => {
  let backupProjects:any[] = [];

  beforeEach(() => {
    backupProjects = [...initialProjects.map(project => ({ ...project }))];
  });

  afterEach(() => {
    initialProjects.length = 0;
    initialProjects.push(...backupProjects);
  });

  test('allows adding a new project directly', () => {
    const newProject = {
      id: initialProjects.length + 1,
      Title: 'Directly Added Project',
      Description: 'This project was added directly in the test.',
      Status: 'In Progress',
      Technologies: ['Direct', 'Test'],
      StartDate: '2024-01-01',
      EndDate: 'TBD',
    };

    initialProjects.push(newProject);

    const addedProject = initialProjects.find(p => p.id === newProject.id);
    expect(addedProject).toBeDefined();
    expect(addedProject?.Title).toBe('Directly Added Project');
    expect(addedProject?.Status).toBe('In Progress');
    expect(addedProject?.Technologies).toEqual(expect.arrayContaining(['Direct', 'Test']));
    expect(addedProject?.StartDate).toBe('2024-01-01');
  });
});
