import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './landing-page';
import Login from './login/Login';
import Signup from './login/Signup';
import DashboardLayout from './dashboard';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#f5f5f5',
            padding: '14px 20px',
            borderRadius: '14px',
            fontSize: '14.5px',
            fontWeight: '500',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
            maxWidth: '420px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f5f5f5',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f5f5f5',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </>
  );
}

export default App;
