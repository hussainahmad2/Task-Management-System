import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees, useCreateEmployee } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List as ListIcon, Kanban, Plus, Mail, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEmployeeSchema, userRoles, employmentType, CreateEmployeeRequest } from "@shared/schema";

// Custom type handling string dates for the form
type EmployeeFormValues = Omit<CreateEmployeeRequest, "joiningDate"> & {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  joiningDate: string;
};

export default function Employees() {
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: employees, isLoading } = useEmployees(activeOrg?.id);
  const createEmployee = useCreateEmployee();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "board">("grid");

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(insertEmployeeSchema.extend({
      joiningDate: z.string().transform(str => new Date(str)), // Validate string date
      username: z.string().min(1, "Username is required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      email: z.string().email("Invalid email"),
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
    }).omit({ userId: true })), // User ID is handled on backend
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      role: "Junior Employee",
      designation: "Software Engineer",
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: "full-time",
      salary: "50000",
      isActive: true,
      orgId: activeOrg?.id || 1,
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    createEmployee.mutate({
      orgId: activeOrg?.id || 1,
      data: {
        ...data,
        // Ensure salary is handled as string/decimal from form
      }
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
        toast({
          title: "Employee Created",
          description: `${data.firstName} ${data.lastName} has been added successfully.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  // Group employees by role for Board view
  const employeesByRole = employees?.reduce((acc, emp) => {
    const role = emp.role || "Unassigned";
    if (!acc[role]) acc[role] = [];
    acc[role].push(emp);
    return acc;
  }, {} as Record<string, typeof employees>) || {};

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Employees</h2>
            <p className="text-muted-foreground">Directory and role management.</p>
          </div>

          <div className="flex items-center gap-4">
            <Tabs defaultValue="grid" className="w-[200px]" onValueChange={(v) => setViewMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="grid"><LayoutGrid className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="list"><ListIcon className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="board"><Kanban className="w-4 h-4" /></TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input {...form.register("firstName")} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input {...form.register("lastName")} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...form.register("email")} type="email" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input {...form.register("username")} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input {...form.register("password")} type="password" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select onValueChange={(val) => form.setValue("role", val as any)} defaultValue={form.getValues("role")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Input {...form.register("designation")} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Joining Date</Label>
                      <Input {...form.register("joiningDate")} type="date" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select onValueChange={(val) => form.setValue("employmentType", val as any)} defaultValue={form.getValues("employmentType")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentType.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Salary</Label>
                      <Input {...form.register("salary")} type="number" required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={createEmployee.isPending}>
                    {createEmployee.isPending ? "Creating..." : "Create Employee"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees?.map((emp) => (
                  <Card key={emp.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {emp.designation[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                              {emp.user?.firstName || "Employee"} {emp.user?.lastName || `#${emp.id}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">{emp.designation}</p>
                          </div>
                        </div>
                        <Badge variant={emp.isActive ? "default" : "secondary"}>
                          {emp.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          {emp.role}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          user@{emp.orgId}.com
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees?.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{emp.designation[0]}</AvatarFallback>
                            </Avatar>
                            <span>{emp.user?.firstName || "Employee"} {emp.user?.lastName || `#${emp.id}`}</span>
                          </div>
                        </TableCell>
                        <TableCell>{emp.role}</TableCell>
                        <TableCell>{emp.designation}</TableCell>
                        <TableCell>
                          <Badge variant={emp.isActive ? "outline" : "secondary"}>
                            {emp.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(emp.joiningDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Board View */}
            {viewMode === "board" && (
              <div className="flex gap-6 overflow-x-auto pb-6">
                {Object.entries(employeesByRole).map(([role, roleEmployees]) => (
                  <div key={role} className="min-w-[300px] w-[350px] bg-muted/30 rounded-lg p-4 h-fit">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{role}</h3>
                      <Badge variant="secondary">{roleEmployees.length}</Badge>
                    </div>
                    <div className="space-y-4">
                      {roleEmployees.map(emp => (
                        <Card key={emp.id} className="cursor-move hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{emp.designation[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{emp.user?.firstName || "Employee"} {emp.user?.lastName}</p>
                                <p className="text-xs text-muted-foreground">{emp.designation}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs h-7">View Profile</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!employees || employees.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-border">
                No employees found. Start by adding one.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
