import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import EmployeeDetail from "@/pages/EmployeeDetail";
import Payroll from "@/pages/Payroll";
import LeaveManagement from "@/pages/LeaveManagement";
import Attendance from "@/pages/Attendance";
import Performance from "@/pages/Performance";
import KPIManagement from "@/pages/KPIManagement";
import Recruitment from "@/pages/Recruitment";
import Expenses from "@/pages/Expenses";
import StatutoryReports from "@/pages/StatutoryReports";
import Announcements from "@/pages/Announcements";
import BulkUpload from "@/pages/BulkUpload";
import FleetManagement from "@/pages/FleetManagement";
import DocumentHub from "@/pages/DocumentHub";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, path }: { children: React.ReactNode; path: string }) {
  const { isAuthenticated, canAccess } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!canAccess(path)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute path="/"><Dashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute path="/employees"><Employees /></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute path="/employees"><EmployeeDetail /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute path="/payroll"><Payroll /></ProtectedRoute>} />
      <Route path="/leave" element={<ProtectedRoute path="/leave"><LeaveManagement /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute path="/attendance"><Attendance /></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute path="/performance"><Performance /></ProtectedRoute>} />
      <Route path="/kpis" element={<ProtectedRoute path="/kpis"><KPIManagement /></ProtectedRoute>} />
      <Route path="/recruitment" element={<ProtectedRoute path="/recruitment"><Recruitment /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute path="/expenses"><Expenses /></ProtectedRoute>} />
      <Route path="/statutory" element={<ProtectedRoute path="/statutory"><StatutoryReports /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute path="/announcements"><Announcements /></ProtectedRoute>} />
      <Route path="/fleet" element={<ProtectedRoute path="/fleet"><FleetManagement /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute path="/documents"><DocumentHub /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute path="/upload"><BulkUpload /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute path="/settings"><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
