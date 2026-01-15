import Layout from "@/components/Layout";
import { useOrganizations } from "@/hooks/use-organizations";
import { useDepartments, useCreateDepartment } from "@/hooks/use-departments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDepartmentSchema, type CreateDepartmentRequest } from "@shared/schema";

export default function Departments() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: departments, isLoading } = useDepartments(activeOrg?.id);
    const createDepartment = useCreateDepartment();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<Omit<CreateDepartmentRequest, 'orgId'>>({
        resolver: zodResolver(insertDepartmentSchema.omit({ orgId: true })),
        defaultValues: {
            name: "",
            managerId: null
        }
    });

    const onSubmit = (data: any) => {
        if (!activeOrg) return;
        createDepartment.mutate({
            orgId: activeOrg.id,
            data
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                form.reset();
            }
        });
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-display font-bold tracking-tight">Departments</h2>
                        <p className="text-muted-foreground">Manage organizational structure.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" /> Add Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Department</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input {...form.register("name")} placeholder="Department Name" />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                {/* Manager selection would go here in a full implementation */}

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={createDepartment.isPending}>
                                        {createDepartment.isPending ? "Creating..." : "Create Department"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments?.map((dept) => (
                            <Card key={dept.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{dept.name}</h3>
                                            <p className="text-sm text-muted-foreground">ID: {dept.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/50">
                                        <Users className="w-4 h-4" />
                                        <span>0 Employees</span> {/* Would need count from backend */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {(!departments || departments.length === 0) && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-border">
                                No departments found. Start by adding one.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
