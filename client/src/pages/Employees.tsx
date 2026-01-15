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
import { Plus, Mail, Briefcase, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { userRoles, employmentType, type CreateEmployeeRequest } from "@shared/schema";
import { Link } from "wouter";

export default function Employees() {
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: employees, isLoading } = useEmployees(activeOrg?.id);
  const createEmployee = useCreateEmployee();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Extended type for the form
  // Extended type for the form
  type EmployeeFormValues = Omit<CreateEmployeeRequest, "joiningDate"> & {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    joiningDate: string;
  };

  // Minimal form for MVP - would map to specific schema fields in real app
  const form = useForm<EmployeeFormValues>({
    defaultValues: {
      userId: "temp",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      designation: "",
      role: "",
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: "full-time",
      salary: "50000"
    }
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    if (!activeOrg) return;

    try {
      await createEmployee.mutateAsync({
        orgId: activeOrg.id,
        data: {
          ...data,
          joiningDate: new Date(data.joiningDate),
          userId: "temp" // Will be ignored/replaced by backend logic
        }
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create employee", error);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Employees</h2>
            <p className="text-muted-foreground">Directory and role management.</p>
          </div>
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

              <Button type="submit" className="w-full">Create Employee</Button>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : (
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
                          {/* User name would be joined here */}
                          Employee #{emp.id}
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

                  <div className="mt-6">
                    <Link href={`/employees/${emp.id}`}>
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!employees || employees.length === 0) && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-border">
                No employees found. Start by adding one.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
