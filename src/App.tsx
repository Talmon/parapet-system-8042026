import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
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
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/employees" element={<Layout><Employees /></Layout>} />
          <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
          <Route path="/payroll" element={<Layout><Payroll /></Layout>} />
          <Route path="/leave" element={<Layout><LeaveManagement /></Layout>} />
          <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
          <Route path="/performance" element={<Layout><Performance /></Layout>} />
          <Route path="/kpis" element={<Layout><KPIManagement /></Layout>} />
          <Route path="/recruitment" element={<Layout><Recruitment /></Layout>} />
          <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
          <Route path="/statutory" element={<Layout><StatutoryReports /></Layout>} />
          <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
          <Route path="/upload" element={<Layout><BulkUpload /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
