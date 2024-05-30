import './App.css';
import Home from './pages/Home';
import AddProject from './pages/AddProject';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EditProject from './pages/EditProject';
import AnalyticsPage from './pages/AnalyticsPage';
import TaskPage from './pages/TaskPage';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}> {/* Wrap protected routes inside the ProtectedRoute */}
            <Route path="/tasks/:projectId" element={<TaskPage />} />
            <Route path="/add-task/:projectId" element={<AddTask />} />
            <Route path="/edit-task/:taskId" element={<EditTask />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/edit/:projectId" element={<EditProject />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
