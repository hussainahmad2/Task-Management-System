import Layout from "@/components/Layout";
import { usePermissions } from "@/contexts/PermissionsContext";

// Import Role Dashboards
import { ExecutiveDashboard } from "@/components/dashboards/ExecutiveDashboard";
import { CTODashboard } from "@/components/dashboards/CTODashboard";
import { CPODashboard } from "@/components/dashboards/CPODashboard";
import { CIODashboard } from "@/components/dashboards/CIODashboard";
import { GMDashboard } from "@/components/dashboards/GMDashboard";
import { HRDashboard } from "@/components/dashboards/HRDashboard";
import { FinanceDashboard } from "@/components/dashboards/FinanceDashboard";
import { AssistantManagerDashboard } from "@/components/dashboards/AssistantManagerDashboard";
import { SeniorDashboard } from "@/components/dashboards/SeniorDashboard";
import { EmployeeDashboard } from "@/components/dashboards/EmployeeDashboard";
import { InternDashboard } from "@/components/dashboards/InternDashboard";

export default function Dashboard() {
  const { hasRole, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
          <div className="grid md:grid-cols-3 gap-6 h-96">
            <div className="md:col-span-2 bg-muted rounded-xl"></div>
            <div className="bg-muted rounded-xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render appropriate dashboard based on role
  // Wrapping each in Layout here to allow them to be used as standalone pages if needed without refactoring

  if (hasRole("CEO")) {
    return <Layout><ExecutiveDashboard /></Layout>;
  }

  if (hasRole("CTO")) {
    return <Layout><CTODashboard /></Layout>;
  }

  if (hasRole("CPO")) {
    return <Layout><CPODashboard /></Layout>;
  }

  if (hasRole("CIO")) {
    return <Layout><CIODashboard /></Layout>;
  }

  if (hasRole("General Manager")) {
    return <Layout><GMDashboard /></Layout>;
  }

  if (hasRole("HR Manager")) {
    return <Layout><HRDashboard /></Layout>;
  }

  if (hasRole("Finance Manager")) {
    return <Layout><FinanceDashboard /></Layout>;
  }

  if (hasRole("Assistant Manager")) {
    return <Layout><AssistantManagerDashboard /></Layout>;
  }

  if (hasRole("Senior Employee")) {
    return <Layout><SeniorDashboard /></Layout>;
  }

  if (hasRole("Intern")) {
    return <Layout><InternDashboard /></Layout>;
  }

  // Default fallback (Junior Employee / Others)
  return (
    <Layout>
      <EmployeeDashboard />
    </Layout>
  );
}

