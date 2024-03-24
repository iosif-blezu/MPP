
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EditProject from '../pages/EditProject';
import initialProjects from '../components/Projects'; 

jest.mock('../components/Projects', () => ({
    __esModule: true,
    default: [
      { id: 1, Title: 'Test Project', Description: 'Test Description', Status: 'Completed', Technologies: ['React', 'JavaScript'], StartDate: '2023-01-01', EndDate: '2023-12-31' },
    ],
  }));
  

const mockedNavigate = jest.fn();
const mockedUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: () => mockedUseParams(),
}));
describe('EditProject Component', () => {
    beforeEach(() => {
        jest.mock('../components/Projects', () => ({
          __esModule: true,
          initialProjects: [
            { id: 1, Title: 'Test Project', Description: 'Test Description', Status: 'Completed', Technologies: 'React,JavaScript', StartDate: '2023-01-01', EndDate: '2023-12-31' },
          ],
        }));
      
        mockedUseParams.mockReturnValue({ projectId: '1' });
      });
      
  
    test('loads project data and allows editing', async () => {
      const user = userEvent.setup();
      render(
        <BrowserRouter>
          <EditProject />
        </BrowserRouter>
      );
  
      expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  
      await user.clear(screen.getByLabelText(/Project Title/i));
      await user.type(screen.getByLabelText(/Project Title/i), 'Updated Project Title');
  
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
  
      const updatedProject = initialProjects.find(p => p.id === 1);
      expect(updatedProject?.Title).toBe('Updated Project Title');
  
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  
    afterEach(() => {
      mockedNavigate.mockClear();
      mockedUseParams.mockClear();
    });
  });
  