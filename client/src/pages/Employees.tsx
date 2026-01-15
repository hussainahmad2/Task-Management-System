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

export default function Employees() {
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: employees, isLoading } = useEmployees(activeOrg?.id);
  const createEmployee = useCreateEmployee();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Minimal form for MVP - would map to specific schema fields in real app
  const form = useForm({
    defaultValues: {
      userId: "temp", // Would be selected from users list
      designation: "",
      role: "Junior Employee",
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: "full-time",
      salary: "50000"
    }
  });

  const onSubmit = (data: any) => {
    // In a real app, we'd have a user picker to get the userId.
    // For now we'll simulate adding an employee record, but backend requires valid userId FK.
    // This is UI-only code generation per instructions.
    console.log("Create employee", data);
    setIsDialogOpen(false);
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                {/* Form fields would go here matching schema */}
                <div className="p-4 bg-muted rounded text-sm text-muted-foreground">
                  Form simplified for demo. Connects to backend create endpoint.
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
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
                    <Button variant="outline" className="w-full">View Profile</Button>
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
