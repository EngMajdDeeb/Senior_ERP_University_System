import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Meetings from "./pages/Meetings";
import StudyPlans from "./pages/StudyPlans";
import DeanDashboard from "./pages/DeanDashboard";
import DeanAcademicDecisions from "./pages/DeanAcademicDecisions";
import DeanPlanApproval from "./pages/DeanPlanApproval";
import DeanMeetings from "./pages/DeanMeetings";
import NotFound from "./pages/NotFound";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            
            {/* Coordinator Routes */}
            <Route path="/" element={
              <ProtectedRoute requiredRole="coordinator">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute requiredRole="coordinator">
                <Schedule />
              </ProtectedRoute>
            } />
            <Route path="/meetings" element={
              <ProtectedRoute requiredRole="coordinator">
                <Meetings />
              </ProtectedRoute>
            } />
            <Route path="/study-plans" element={
              <ProtectedRoute requiredRole="coordinator">
                <StudyPlans />
              </ProtectedRoute>
            } />
            
            {/* Dean Routes */}
            <Route path="/dean" element={
              <ProtectedRoute requiredRole="dean">
                <DeanDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dean/academic-decisions" element={
              <ProtectedRoute requiredRole="dean">
                <DeanAcademicDecisions />
              </ProtectedRoute>
            } />
            <Route path="/dean/plan-approval" element={
              <ProtectedRoute requiredRole="dean">
                <DeanPlanApproval />
              </ProtectedRoute>
            } />
            <Route path="/dean/meetings" element={
              <ProtectedRoute requiredRole="dean">
                <DeanMeetings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
