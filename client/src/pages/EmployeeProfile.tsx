import Layout from "@/components/Layout";
import { useEmployee } from "@/hooks/use-employees";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Briefcase, Calendar, MapPin, Building, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function EmployeeProfile() {
    const [, params] = useRoute("/employees/:id");
    const employeeId = params?.id ? parseInt(params.id) : undefined;
    const { data: employee, isLoading } = useEmployee(employeeId);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            </Layout>
        );
    }

    if (!employee) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <h2 className="text-2xl font-bold">Employee not found</h2>
                    <Link href="/employees">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Employees
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/employees">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Employee Profile</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                                    {employee.designation?.[0] ?? 'U'}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h3 className="text-2xl font-bold">Employee #{employee.id}</h3>
                                <p className="text-muted-foreground">{employee.designation ?? 'N/A'}</p>
                            </div>

                            <Badge variant={employee.isActive ? "default" : "secondary"} className="px-4 py-1">
                                {employee.isActive ? "Active" : "Inactive"}
                            </Badge>

                            <div className="w-full pt-4 space-y-2 text-left">
                                <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">user@{employee.orgId}.com</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{employee.role}</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                    <Building className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Department ID: {employee.departmentId || "N/A"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details & Stats */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Employment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Joining Date
                                    </span>
                                    <p className="font-medium">{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Employment Type
                                    </span>
                                    <p className="font-medium capitalize">{employee.employmentType}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Work Type
                                    </span>
                                    <p className="font-medium capitalize">{employee.workType}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Building className="w-4 h-4" /> Salary
                                    </span>
                                    <p className="font-medium">${employee.salary}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance & Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    Performance metrics visualization would go here
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
