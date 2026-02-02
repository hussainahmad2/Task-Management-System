import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  LogOut,
  Briefcase,
  Menu,
  X,
  Building2,
  Shield,
  Activity,
  Server,
  UserPlus,
  Calendar,
  DollarSign,
  FileText,
  Star,
  ClipboardList,
  Target,
  GitBranch,
  Clock,
  BookOpen,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTheme } from "@/hooks/use-theme";
import { usePermissions } from "@/contexts/PermissionsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme, density } = useTheme();
  const { data: orgs } = useOrganizations();
  const { hasPermission } = usePermissions();

  // Simple check - in a real app we'd have a context for current org
  const activeOrg = orgs?.[0];

  // Check user role for role-specific navigation
  const userRole = user?.role || "";
  const isHRManager = userRole === "HR Manager" || userRole === "hr_manager";
  const isCPO = userRole === "CPO";
  const isCTO = userRole === "CTO";
  const isEmployee = userRole === "Senior Employee" || userRole === "Junior Employee";
  const isIntern = userRole === "Intern";
  
  // HR-specific navigation items
  const hrNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/recruitment", label: "Recruitment", icon: UserPlus },
    { href: "/hr/leaves", label: "Leave Management", icon: Calendar },
    { href: "/hr/payroll", label: "Payroll", icon: DollarSign },
    { href: "/hr/performance", label: "Performance Reviews", icon: Star },
    { href: "/hr/policies", label: "Policies", icon: FileText },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // CPO-specific navigation items
  const cpoNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/cpo/roadmap", label: "Product Roadmap", icon: Target },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // CTO-specific navigation items
  const ctoNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/cto/reviews", label: "Code Reviews", icon: GitBranch },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Employee-specific navigation items
  const employeeNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employee/timesheet", label: "Timesheet", icon: Clock },
    { href: "/employee/leaves", label: "My Leaves", icon: Calendar },
    { href: "/employee/payroll", label: "My Payroll", icon: DollarSign },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Intern-specific navigation items
  const internNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/intern/learning", label: "Learning Modules", icon: BookOpen },
    { href: "/employee/timesheet", label: "Timesheet", icon: Clock },
    { href: "/employee/leaves", label: "My Leaves", icon: Calendar },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Default navigation items for other roles
  const defaultNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Determine which nav items to use based on role
  let navItems = defaultNavItems;
  if (isHRManager) navItems = hrNavItems;
  else if (isCPO) navItems = cpoNavItems;
  else if (isCTO) navItems = ctoNavItems;
  else if (isEmployee) navItems = employeeNavItems;
  else if (isIntern) navItems = internNavItems;

  if (hasPermission("permissions.manage")) {
    navItems.push({ href: "/permissions", label: "Permissions", icon: Shield });
  }

  // Expanded Role Dashboards access for CEO/Superadmin
  // This allows the CEO to quickly inspect other department dashboards
  if (hasPermission("permissions.manage") || user?.role === "CEO") { // Using existing permission or CEO role
    // We can use a divider or just add them
    // Ideally we'd have a collapsible section, but for now flat list with specific prefixes
  }

  // Actually, let's just make them available if you are CEO, maybe separate section? 
  // For simplicity given the design, I'll add them to the main nav but only for CEO.

  const specializedDashboards = [
    { href: "/dashboard/hr", label: "HR Dashboard", icon: Users },
    { href: "/dashboard/finance", label: "Finance", icon: Building2 }, // Reusing Building2 or need DollarSign
    { href: "/dashboard/engineering", label: "Engineering", icon: Briefcase },
    { href: "/dashboard/operations", label: "Operations", icon: Activity },
    { href: "/dashboard/it", label: "IT Systems", icon: Server },
  ];

  const showSpecialized = user?.role === "CEO" || user?.role === "Superadmin"; // Fallback role name logic


  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 h-screen w-64 bg-card border-r border-border z-50 transition-transform duration-200 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 sidebar-header transition-all">
            <div className="w-10 h-10 sidebar-header-icon rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 transition-all">
              {activeOrg?.name.substring(0, 1) || "E"}
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sidebar-header-text leading-tight transition-all">
                {activeOrg?.name || "Enterprise"}
              </h1>
              <p className="text-xs text-muted-foreground">{activeOrg?.plan || "Free Plan"}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group sidebar-item",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {item.label}
                  </div>
                </Link>
              );
            })}

            {/* Department Views for CEO */}
            {showSpecialized && (
              <div className="mt-6 mb-2">
                <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Department Views
                </h4>
                {specializedDashboards.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group sidebar-item",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}>
                        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        {item.label}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </nav>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4 px-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.firstName?.[0] || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const newTheme = theme === "dark" ? "light" : "dark";
                  setTheme(newTheme);
                }}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
                      
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-card border-b border-border flex items-center px-4 justify-between sticky top-0 z-30">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-display font-bold text-lg">Enterprise</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
            }}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
