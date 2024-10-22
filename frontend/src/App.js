// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import WasteCollectionLayout from './components/WasteCollectionLayout'; // Assuming you have a dedicated layout
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GarbageCollectorDashboard from './pages/GarbageCollectorDashboard';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import WasteRequestForm from './pages/WasteRequestForm';
import PaymentPage from './components/PaymentPage';

// Importing new components
import AdminUserManagement from './components/AdminUserManagement';
import CollectorAssignedUsers from './components/CollectorAssignedUsers';
import UserInvoices from './components/UserInvoices';
import AdminCharts from './pages/AdminCharts'; // New charts page import

// Import ViewWasteRequests component (created above)
import ViewWasteRequests from './pages/ViewWasteRequests';

function App() {
  return (
    <Router>
      <Header />
      {/* Sidebar is now conditionally rendered only on certain routes as per previous instructions */}
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute roles={['user', 'admin', 'garbageCollector']}><Profile /></PrivateRoute>} />

          {/* Protected Routes */}
          {/* User Routes */}
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute roles={['user', 'admin']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-request"
            element={
              <PrivateRoute roles={['user']}>
                <WasteCollectionLayout>
                  <WasteRequestForm />
                </WasteCollectionLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/view-requests"
            element={
              <PrivateRoute roles={['user']}>
                <WasteCollectionLayout>
                  <ViewWasteRequests />
                </WasteCollectionLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/invoices"
            element={
              <PrivateRoute roles={['user']}>
                <UserInvoices />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminUserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/charts" // New route for charts
            element={
              <PrivateRoute roles={['admin']}>
                <AdminCharts />
              </PrivateRoute>
            }
          />

          {/* Garbage Collector Routes */}
          <Route
            path="/garbage-collector-dashboard"
            element={
              <PrivateRoute roles={['garbageCollector', 'admin']}>
                <GarbageCollectorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/collector/assigned-users"
            element={
              <PrivateRoute roles={['garbageCollector']}>
                <CollectorAssignedUsers />
              </PrivateRoute>
            }
          />

          {/* Payment and Request Form Routes */}
          <Route
            path="/request-form"
            element={
              <PrivateRoute roles={['user']}>
                <WasteRequestForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute roles={['user']}>
                <PaymentPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
