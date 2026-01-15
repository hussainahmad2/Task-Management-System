import { Switch, Route, useLocation } from "wouter";
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
import { HRDashboard } from "@/components/dashboards/HRDashboard";
import { FinanceDashboard } from "@/components/dashboards/FinanceDashboard";
import { CTODashboard } from "@/components/dashboards/CTODashboard";
import { GMDashboard } from "@/components/dashboards/GMDashboard";
import { CIODashboard } from "@/components/dashboards/CIODashboard";
import Layout from "@/components/Layout";
import Tasks from "@/pages/Tasks";
import Employees from "@/pages/Employees";
import Departments from "@/pages/Departments";
import EmployeeProfile from "@/pages/EmployeeProfile";
import Settings from "@/pages/Settings";
import Permissions from "@/pages/Permissions";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? Dashboard : Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
      </Route>

      {/* Role Specific Dashboard Routes for Admin/Direct Access */}
      <Route path="/dashboard/hr">
        <ProtectedRoute requiredRole={["CEO", "HR Manager"]}>
          <Layout><HRDashboard /></Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/finance">
        <ProtectedRoute requiredRole={["CEO", "Finance Manager"]}>
          <Layout><FinanceDashboard /></Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/engineering">
        <ProtectedRoute requiredRole={["CEO", "CTO", "CIO"]}>
          <Layout><CTODashboard /></Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/operations">
        <ProtectedRoute requiredRole={["CEO", "General Manager"]}>
          <Layout><GMDashboard /></Layout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/it">
        <ProtectedRoute requiredRole={["CEO", "CIO"]}>
          <Layout><CIODashboard /></Layout>
        </ProtectedRoute>
      </Route>

      <Route path="/tasks">
        <PrivateRoute component={Tasks} />
      </Route>
      <Route path="/employees">
        <PrivateRoute component={Employees} />
      </Route>
      <Route path="/employees/:id">
        <PrivateRoute component={EmployeeProfile} />
      </Route>
      <Route path="/departments">
        <PrivateRoute component={Departments} />
      </Route>
      <Route path="/settings">
        <PrivateRoute component={Settings} />
      </Route>
      <Route path="/permissions">
        <ProtectedRoute requiredPermission="permissions.manage">
          <Permissions />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

import { PermissionsProvider } from "@/contexts/PermissionsContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" defaultDensity="default">
        <PermissionsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </PermissionsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
