import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    Users, TrendingUp, TrendingDown, Calendar, BarChart3, 
    CheckCircle, Clock, AlertCircle, FileText, ArrowUpRight, ArrowDownRight,
    UserPlus, UserMinus, GraduationCap, Award, Building, UserCheck, UserX
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { LeaveApprovalWorkflow } from "@/components/LeaveApprovalWorkflow";
import type { Employee } from "@shared/schema";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

// Helper function to format dates as strings
const formatDate = (date: Date | string) => {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
};

export function HRDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);
    
    // Fetch all leave requests for the organization
    const { data: allLeaveRequests } = useQuery({
        queryKey: ['allLeaveRequests'],
        queryFn: async () => {
            if (!activeOrg?.id) return [];
            // For now, we'll fetch all employees' leave requests
            // In a real implementation, we'd have a specific endpoint for org-level leave requests
            // This is a workaround to get all leave requests
            const response = await fetch('/api/employees');
            if (!response.ok) return [];
            const employeesData = await response.json();
            
            // Get leave requests for all employees in the org
            const allRequests = [];
            for (const emp of employeesData) {
                const leaveResponse = await fetch(`/api/employees/${emp.id}/leave-requests`);
                if (leaveResponse.ok) {
                    const requests = await leaveResponse.json();
                    allRequests.push(...requests);
                }
            }
            return allRequests;
        },
        enabled: !!activeOrg?.id
    });
    
    // Calculate HR metrics
    const totalEmployees = employees?.length || 0;
    const activeEmployees = employees?.filter((e: Employee) => e.isActive !== false).length || 0;
    const inactiveEmployees = totalEmployees - activeEmployees;
    
    // Calculate employee growth (new hires vs departures in the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const employeeGrowth = employees?.reduce((acc: { month: string; hired: number; left: number }[], employee: Employee) => {
        if (employee.createdAt && new Date(employee.createdAt) > sixMonthsAgo) {
            const month = new Date(employee.createdAt).toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.month === month);
            if (existing) {
                existing.hired += 1;
            } else {
                acc.push({ month, hired: 1, left: 0 }); // We'd need termination data for actual "left" count
            }
        }
        return acc;
    }, []) || [];
    
    // Department distribution
    const departmentCounts = employees?.reduce((acc: { department: string; count: number }[], employee: Employee) => {
        const deptName = employee.department?.name || 'Unknown';
        const existing = acc.find(item => item.department === deptName);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ department: deptName, count: 1 });
        }
        return acc;
    }, []) || [];
    
    // Calculate turnover rate (this is a simplified calculation)
    const turnoverRate = totalEmployees > 0 ? ((inactiveEmployees / totalEmployees) * 100).toFixed(1) : '0.0';
    
    // Placeholder satisfaction score - in a real app, this would come from surveys
    const satisfactionScore = 87;
    
    // Calculate average tenure
    const avgTenure = employees && employees.length > 0 ? 
        (employees.reduce((sum, emp) => {
            if (emp.joiningDate) {
                const joinDate = new Date(emp.joiningDate);
                const diffYears = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                return sum + diffYears;
            }
            return sum;
        }, 0) / employees.length).toFixed(1) : '0.0';
    
    const openPositions = 12; // This would come from recruitment data
    
    // Filter pending leave requests
    const pendingLeaveRequests = allLeaveRequests?.filter(
        (lr: any) => lr.status === 'pending'
    ) || [];
    
    const pendingLeaves = pendingLeaveRequests.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Human Resources Dashboard</h2>
                    <p className="text-muted-foreground">Employee metrics, recruitment, performance, and workforce management.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Hire
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <GraduationCap className="w-4 h-4" /> Training
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Award className="w-4 h-4" /> Reviews
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                                <h3 className="text-2xl font-bold mt-1">{totalEmployees}</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +{Math.max(0, employeeGrowth.reduce((sum, item) => sum + item.hired, 0) - employeeGrowth.reduce((sum, item) => sum + item.left, 0))} this month
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                                <h3 className="text-2xl font-bold mt-1">{activeEmployees}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{totalEmployees - activeEmployees} inactive</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Leaves</p>
                                <h3 className="text-2xl font-bold mt-1">{pendingLeaves}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                                <h3 className="text-2xl font-bold mt-1">{openPositions}</h3>
                                <p className="text-xs text-muted-foreground mt-1">In recruitment pipeline</p>
                            </div>
                            <Building className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee Growth */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Employee Growth</CardTitle>
                        <CardDescription>Hires vs departures over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={employeeGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} name="Hired" />
                                    <Bar dataKey="left" fill="#ef4444" radius={[4, 4, 0, 0]} name="Departed" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Satisfaction Score */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">{satisfactionScore}%</div>
                            <div className="text-sm text-muted-foreground mb-6">Employee satisfaction score</div>
                            <Progress value={satisfactionScore} className="w-full h-3 mb-2" />
                            <div className="text-xs text-muted-foreground">Based on quarterly survey</div>
                            
                            <div className="mt-8 w-full">
                                <h4 className="font-medium mb-3">Key Factors</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Compensation</span>
                                        <span className="font-medium">85%</span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                    
                                    <div className="flex justify-between text-sm mt-3">
                                        <span>Work-Life Balance</span>
                                        <span className="font-medium">89%</span>
                                    </div>
                                    <Progress value={89} className="h-2" />
                                    
                                    <div className="flex justify-between text-sm mt-3">
                                        <span>Career Growth</span>
                                        <span className="font-medium">78%</span>
                                    </div>
                                    <Progress value={78} className="h-2" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Department Distribution & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                        <CardDescription>Headcount by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={departmentCounts}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {departmentCounts.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} employees`, '']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Distribution</CardTitle>
                        <CardDescription>Employee performance ratings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Performance distribution would come from performance reviews - placeholder for now */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Outstanding</span>
                                    <span>{Math.floor(totalEmployees * 0.1)} employees</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Progress value={10} className="h-2 flex-grow" />
                                    <span>10%</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Exceeds Expectations</span>
                                    <span>{Math.floor(totalEmployees * 0.3)} employees</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Progress value={30} className="h-2 flex-grow" />
                                    <span>30%</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Meets Expectations</span>
                                    <span>{Math.floor(totalEmployees * 0.5)} employees</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Progress value={50} className="h-2 flex-grow" />
                                    <span>50%</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Needs Improvement</span>
                                    <span>{Math.floor(totalEmployees * 0.1)} employees</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Progress value={10} className="h-2 flex-grow" />
                                    <span>10%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Leave Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Leave Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Leave Requests</CardTitle>
                        <CardDescription>Leave requests awaiting approval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingLeaveRequests.map((request: any) => (
                                <div key={request.id} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium">{request.employee.firstName} {request.employee.lastName}</h4>
                                            <p className="text-sm text-muted-foreground">{request.leaveType} • {request.totalDays} days</p>
                                        </div>
                                        <Badge variant="secondary">{request.status}</Badge>
                                    </div>
                                    <p className="text-sm mb-2">{request.reason}</p>
                                    <p className="text-xs text-muted-foreground">{request.startDate} to {request.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Approval Workflow Example */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Approval Workflow</CardTitle>
                        <CardDescription>Visual representation of approval process</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LeaveApprovalWorkflow 
                            leaveRequest={{
                                id: 1,
                                employeeId: 1,
                                leaveType: 'Vacation',
                                startDate: new Date('2024-02-15'),
                                endDate: new Date('2024-02-20'),
                                totalDays: 5,
                                reason: 'Family vacation',
                                status: 'pending',
                                managerApprovalStatus: 'pending',
                                hrApprovalStatus: 'pending',
                                approvedById: null,
                                rejectedById: null,
                                managerApprovedById: null,
                                managerRejectedById: null,
                                hrApprovedById: null,
                                hrRejectedById: null,
                                approvalDate: null,
                                rejectionDate: null,
                                managerApprovalDate: null,
                                managerRejectionDate: null,
                                hrApprovalDate: null,
                                hrRejectionDate: null,
                                managerApprovalNotes: null,
                                managerRejectionNotes: null,
                                hrApprovalNotes: null,
                                hrRejectionNotes: null,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                employee: { firstName: 'John', lastName: 'Doe' }
                            }} 
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Employee Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Workforce Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Avg. Tenure</span>
                                <span className="font-medium">{avgTenure} years</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Gender Diversity</span>
                                <span className="font-medium">48% female</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Remote Workers</span>
                                <span className="font-medium">62%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Internal Promotions</span>
                                <span className="font-medium">23% annually</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Training & Development
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Courses Completed</span>
                                <span className="font-medium">142</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Avg. Training Hours</span>
                                <span className="font-medium">28/hr emp</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Certifications</span>
                                <span className="font-medium">34</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Skill Gap Score</span>
                                <span className="font-medium">78%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Recognition
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Employee Awards</span>
                                <span className="font-medium">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Peer Nominations</span>
                                <span className="font-medium">87</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Team Wins</span>
                                <span className="font-medium">4</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Feedback Score</span>
                                <span className="font-medium">4.8/5</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}