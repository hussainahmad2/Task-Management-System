import { useRoute, useLocation } from "wouter";
import Login from "@/pages/Login";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import { HRDashboard } from "@/components/dashboards/hr/HRDashboard";
import { FinanceDashboard } from "@/components/dashboards/finance/FinanceDashboard";
import { CTODashboard } from "@/components/dashboards/executive/CTODashboard";
import { GMDashboard } from "@/components/dashboards/executive/GMDashboard";
import { CIODashboard } from "@/components/dashboards/executive/CIODashboard";
import { AssistantManagerDashboard } from "@/components/dashboards/operations/AssistantManagerDashboard";
import Layout from "@/components/Layout";
import Tasks from "@/pages/Tasks";
import Employees from "@/pages/Employees";
import Departments from "@/pages/Departments";
import EmployeeProfile from "@/pages/EmployeeProfile";
import Settings from "@/pages/Settings";
import Permissions from "@/pages/Permissions";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Recruitment from "@/pages/hr/Recruitment";
import LeaveManagement from "@/pages/hr/LeaveManagement";
import Payroll from "@/pages/hr/Payroll";
import PerformanceReviews from "@/pages/hr/PerformanceReviews";
import Policies from "@/pages/hr/Policies";
import ProductRoadmap from "@/pages/cpo/ProductRoadmap";
import CodeReviews from "@/pages/cto/CodeReviews";
import Timesheet from "@/pages/employee/Timesheet";
import MyLeaveRequests from "@/pages/employee/MyLeaveRequests";
import MyPayroll from "@/pages/employee/MyPayroll";
import LearningModules from "@/pages/intern/LearningModules";
import ContactAdmin from "@/pages/ContactAdmin";
import MessagingPage from "@/pages/messaging/Messaging";

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app we might redirect to login
      // The landing page serves as the login entry point
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Component /> : null;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  }

  // Main routes
  if (location === "/" && !isAuthenticated) {
    return <Landing />;
  }
  if (location === "/login") {
    return <Login />;
  }
  if (location === "/contact-admin") {
    return <ContactAdmin />;
  }
  if (location === "/messaging") {
    return <PrivateRoute component={MessagingPage} />;
  }
  if (location === "/dashboard" && isAuthenticated) {
    return <PrivateRoute component={Dashboard} />;
  }

  // Role Specific Dashboard Routes for Admin/Direct Access
  if (location.startsWith("/dashboard/hr")) {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><HRDashboard /></Layout>
      </ProtectedRoute>
    );
  }
  if (location.startsWith("/dashboard/finance")) {
    return (
      <ProtectedRoute requiredRole={["CEO", "Finance Manager"]}>
        <Layout><FinanceDashboard /></Layout>
      </ProtectedRoute>
    );
  }
  if (location.startsWith("/dashboard/engineering")) {
    return (
      <ProtectedRoute requiredRole={["CEO", "CTO", "CIO"]}>
        <Layout><CTODashboard /></Layout>
      </ProtectedRoute>
    );
  }
  if (location.startsWith("/dashboard/operations")) {
    return (
      <ProtectedRoute requiredRole={["CEO", "General Manager"]}>
        <Layout><GMDashboard /></Layout>
      </ProtectedRoute>
    );
  }
  if (location.startsWith("/dashboard/it")) {
    return (
      <ProtectedRoute requiredRole={["CEO", "CIO"]}>
        <Layout><CIODashboard /></Layout>
      </ProtectedRoute>
    );
  }

  if (location === "/tasks") {
    return <PrivateRoute component={Tasks} />;
  }
  if (location === "/employees") {
    return <PrivateRoute component={Employees} />;
  }
  if (location.match(/^\/employees\/.+$/)) {
    return <PrivateRoute component={EmployeeProfile} />;
  }
  if (location === "/departments") {
    return <PrivateRoute component={Departments} />;
  }
  if (location === "/settings") {
    return <PrivateRoute component={Settings} />;
  }
  if (location === "/permissions") {
    return (
      <ProtectedRoute requiredPermission="permissions.manage">
        <Permissions />
      </ProtectedRoute>
    );
  }

  // HR Management Routes
  if (location === "/hr/recruitment") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><Recruitment /></Layout>
      </ProtectedRoute>
    );
  }
  if (location === "/hr/leaves") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><LeaveManagement /></Layout>
      </ProtectedRoute>
    );
  }
  if (location === "/hr/payroll") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><Payroll /></Layout>
      </ProtectedRoute>
    );
  }
  if (location === "/hr/performance") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><PerformanceReviews /></Layout>
      </ProtectedRoute>
    );
  }
  if (location === "/hr/policies") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
        <Layout><Policies /></Layout>
      </ProtectedRoute>
    );
  }

  // CPO Routes
  if (location === "/cpo/roadmap") {
    return (
      <ProtectedRoute requiredRole={["CEO", "CPO"]}>
        <Layout><ProductRoadmap /></Layout>
      </ProtectedRoute>
    );
  }

  // CTO Routes
  if (location === "/cto/reviews") {
    return (
      <ProtectedRoute requiredRole={["CEO", "CTO"]}>
        <Layout><CodeReviews /></Layout>
      </ProtectedRoute>
    );
  }

  // Employee Routes
  if (location === "/employee/timesheet") {
    return <PrivateRoute component={() => <Layout><Timesheet /></Layout>} />;
  }
  if (location === "/employee/leaves") {
    return <PrivateRoute component={() => <Layout><MyLeaveRequests /></Layout>} />;
  }
  if (location === "/employee/payroll") {
    return <PrivateRoute component={() => <Layout><MyPayroll /></Layout>} />;
  }

  // Intern Routes
  if (location === "/intern/learning") {
    return (
      <ProtectedRoute requiredRole={["CEO", "HR Manager", "Intern"]}>
        <Layout><LearningModules /></Layout>
      </ProtectedRoute>
    );
  }

  // Messaging is now integrated into the main layout

  // Default route
  return <NotFound />;
}

import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { MessagingProvider } from "@/contexts/MessagingContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" defaultDensity="default">
        <PermissionsProvider>
          <TooltipProvider>
            <Toaster />
            <MessagingProvider>
              <Router />
            </MessagingProvider>
          </TooltipProvider>
        </PermissionsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;