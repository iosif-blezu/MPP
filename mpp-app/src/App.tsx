import './App.css'
import Home from './pages/Home'
import AddProject from './pages/AddProject'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import EditProject from './pages/EditProject'
import AnalyticsPage from './pages/AnalyticsPage'


const App:React.FC = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/edit/:projectId" element={<EditProject />} />  
          <Route path="/analytics" element={<AnalyticsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
