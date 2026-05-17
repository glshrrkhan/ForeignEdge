import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Universities from './pages/universities/Universities';
import UniversityDetail from './pages/universities/UniversityDetail';
import Scholarships from './pages/scholarships/Scholarships';
import ScholarshipDetail from './pages/scholarships/ScholarshipDetail';
import Accommodation from './pages/accommodation/Accommodation';
import Restaurants from './pages/restaurants/Restaurants';
import Airlines from './pages/airlines/Airlines';
import Transport from './pages/transport/Transport';
import Profile from './pages/profile/Profile';
import ProfileEvaluation from './pages/profile/ProfileEvaluation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Calculators from './pages/calculators/Calculators';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUniversities from './pages/admin/AdminUniversities';
import AdminScholarships from './pages/admin/AdminScholarships';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDatabase from './pages/admin/AdminDatabase';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#00D26A] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
      <p className="text-gray-500 font-medium">Loading ForeignEdge...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user?.is_admin ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="universities" element={<AdminUniversities />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="database" element={<AdminDatabase />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:id" element={<UniversityDetail />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="scholarships/:id" element={<ScholarshipDetail />} />
        <Route path="accommodation" element={<Accommodation />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="airlines" element={<Airlines />} />
        <Route path="transport" element={<Transport />} />
        <Route path="calculators" element={<Calculators />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="profile/evaluation" element={<ProtectedRoute><ProfileEvaluation /></ProtectedRoute>} />
        <Route path="profile/evaluate" element={<ProtectedRoute><ProfileEvaluation /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '12px', fontFamily: 'Outfit, sans-serif' },
          success: { style: { background: '#00D26A', color: '#fff' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
