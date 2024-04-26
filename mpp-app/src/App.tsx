import './App.css'
import Home from './pages/Home'
import AddProject from './pages/AddProject'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import EditProject from './pages/EditProject'
import AnalyticsPage from './pages/AnalyticsPage'
import TaskPage from './pages/TaskPage'
import AddTask from './pages/AddTask'
import EditTask from './pages/EditTask'


const App:React.FC = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks/:projectId" element={<TaskPage />} />
          <Route path="/add-task/:projectId" element={<AddTask />} />
          <Route path="/edit-task/:taskId" element={<EditTask />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/edit/:projectId" element={<EditProject />} />
          <Route path="/analytics" element={<AnalyticsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
