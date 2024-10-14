import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GarbageCollectorDashboard from './pages/GarbageCollectorDashboard';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import WasteRequestForm from './pages/WasteRequestForm'; // Import the request form component

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Protected Routes */}
          <Route 
            path="/user-dashboard" 
            element={
              <PrivateRoute roles={['user', 'admin']}>
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/create-request"  // New route for users to create waste collection requests
            element={
              <PrivateRoute roles={['user']}>
                <WasteRequestForm />
              </PrivateRoute>
            }
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/garbage-collector-dashboard" 
            element={
              <PrivateRoute roles={['garbageCollector', 'admin']}>
                <GarbageCollectorDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
