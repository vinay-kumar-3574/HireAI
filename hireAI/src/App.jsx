import { Routes, Route } from 'react-router-dom';
import LandingPage from './landing-page';
import Login from './login/Login';
import Signup from './login/Signup';
import DashboardLayout from './dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
