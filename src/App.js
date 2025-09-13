import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LayoutWithSidebar from "./components/Layout/LayoutWithSidebar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import PostGig from './pages/PostGig';
import Profile from './pages/Profile';
import BrowseGigs from './pages/BrowseGigs';
import Messages from './pages/Messages';
import GigDetails from './pages/GigDetails';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          {/* REMOVED THE GLOBAL HEADER FROM HERE */}
          <main>
            <Routes>
              {/* Public Routes without sidebar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              
              {/* Protected Routes with sidebar layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Dashboard />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              
              <Route path="/post-gig" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <PostGig />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Profile />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              
              <Route path="/browse-gigs" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <BrowseGigs />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <Messages />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
              
              <Route path="/gig/:id" element={
                <ProtectedRoute>
                  <LayoutWithSidebar>
                    <GigDetails />
                  </LayoutWithSidebar>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;