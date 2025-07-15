import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Coordinator Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/study-plans" element={<StudyPlans />} />
          
          {/* Dean Routes */}
          <Route path="/dean" element={<DeanDashboard />} />
          <Route path="/dean/academic-decisions" element={<DeanAcademicDecisions />} />
          <Route path="/dean/plan-approval" element={<DeanPlanApproval />} />
          <Route path="/dean/meetings" element={<DeanMeetings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
