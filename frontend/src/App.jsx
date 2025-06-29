import React from "react"
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { user, loading } = useAuth();

  // console.log("user",user)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>;
  }

  return (
    <div className="bg-custom-gradient">
      <Routes>
        {/* Public Routes */}
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        
        {/* Root Route: If user, go to dashboard, else Home */}
        <Route path="/*" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />

        {/* Protected Dashboard and nested routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirects to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App;