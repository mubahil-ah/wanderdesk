import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import SearchSpaces from './pages/SearchSpaces.jsx';
import SpaceDetail from './pages/SpaceDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import BecomeOperator from './pages/BecomeOperator.jsx';
import OperatorDashboard from './pages/OperatorDashboard.jsx';
import AddSpace from './pages/AddSpace.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

console.log("APP LOADED");

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchSpaces />} />
          <Route path="/space/:id" element={<SpaceDetail />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user', 'operator', 'admin']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute allowedRoles={['user', 'operator', 'admin']}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/become-operator" 
            element={
              <ProtectedRoute allowedRoles={['user', 'operator', 'admin']}>
                <BecomeOperator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/operator/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['operator', 'admin']}>
                <OperatorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/operator/spaces/new" 
            element={
              <ProtectedRoute allowedRoles={['operator', 'admin']}>
                <AddSpace />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
