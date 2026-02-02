import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, Clock, CheckCircle, XCircle, AlertCircle, 
    Search, Filter, UserPlus, TrendingUp, FileText, 
    Users, CalendarDays, Ban
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useApproveLeaveRequest, useRejectLeaveRequest } from "@/hooks/use-leave-requests";
import { useToast } from "@/hooks/use-toast";

// Helper function to format dates as MM DD-DD or single day
const formatDateRange = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const startDay = start.getDate();
    
    if (start.toDateString() === end.toDateString()) {
        return `${startMonth} ${startDay}`;
    } else {
        const endDay = end.getDate();
        return `${startMonth} ${startDay}-${endDay}`;
    }
};

export default function LeaveManagement() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    
    // Get organization and employees
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: employees } = useEmployees(activeOrg?.id);
    
    // Get mutation hooks for approving/rejecting
    const { mutateAsync: approveLeave } = useApproveLeaveRequest();
    const { mutateAsync: rejectLeave } = useRejectLeaveRequest();
    
    // Define types for the query result
    type LeaveRequestData = {
        allRequests: any[];
        pendingLeaves: any[];
        approvedLeaves: any[];
        rejectedLeaves: any[];
        leaveStats: { month: string; approved: number; pending: number; rejected: number }[];
        leaveTypes: { type: string; used: number; total: number; color: string }[];
    };
    
    // Fetch all leave requests for the organization
    const { data: allLeaveRequests, isLoading } = useQuery<LeaveRequestData>({
        queryKey: ['allLeaveRequests'],
        queryFn: async () => {
            if (!activeOrg?.id) return { allRequests: [], pendingLeaves: [], approvedLeaves: [], rejectedLeaves: [], leaveStats: [], leaveTypes: [] };
            
            // Get all employees in the organization
            const employeesRes = await fetch(`/api/organizations/${activeOrg.id}/employees`);
            if (!employeesRes.ok) return { allRequests: [], pendingLeaves: [], approvedLeaves: [], rejectedLeaves: [], leaveStats: [], leaveTypes: [] };
            const employeesData = await employeesRes.json();
            
            // Get leave requests for all employees
            const allRequests = [];
            for (const emp of employeesData) {
                const leaveRes = await fetch(`/api/employees/${emp.id}/leave-requests`);
                if (leaveRes.ok) {
                    const requests = await leaveRes.json();
                    allRequests.push(...requests);
                }
            }
            
            // Process the leave requests
            const pendingLeaves = allRequests.filter((lr: any) => lr.status === 'pending');
            const approvedLeaves = allRequests.filter((lr: any) => lr.status === 'approved');
            const rejectedLeaves = allRequests.filter((lr: any) => lr.status === 'rejected');
            
            // Create leave stats (simplified version)
            const leaveStats = [
                { month: 'Jan', approved: approvedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 0).length, 
                  pending: pendingLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 0).length, 
                  rejected: rejectedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 0).length },
                { month: 'Feb', approved: approvedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 1).length, 
                  pending: pendingLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 1).length, 
                  rejected: rejectedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 1).length },
                { month: 'Mar', approved: approvedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 2).length, 
                  pending: pendingLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 2).length, 
                  rejected: rejectedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 2).length },
                { month: 'Apr', approved: approvedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 3).length, 
                  pending: pendingLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 3).length, 
                  rejected: rejectedLeaves.filter((lr: any) => new Date(lr.createdAt).getMonth() === 3).length },
            ];
            
            // Simplified leave types based on real data
            const leaveTypes = [
                { type: "Sick Leave", used: allRequests.filter((lr: any) => lr.leaveType === 'Sick').length, total: 60, color: "bg-red-500" },
                { type: "Vacation", used: allRequests.filter((lr: any) => lr.leaveType === 'Vacation').length, total: 180, color: "bg-blue-500" },
                { type: "Personal", used: allRequests.filter((lr: any) => lr.leaveType === 'Personal').length, total: 30, color: "bg-purple-500" },
                { type: "Maternity/Paternity", used: allRequests.filter((lr: any) => lr.leaveType === 'Maternity').length, total: 90, color: "bg-pink-500" },
            ];
            
            return { allRequests, pendingLeaves, approvedLeaves, rejectedLeaves, leaveStats, leaveTypes };
        },
        enabled: !!activeOrg?.id
    });
    
    // Extract data from the query result
    const pendingLeaves = allLeaveRequests?.pendingLeaves || [];
    const approvedLeaves = allLeaveRequests?.approvedLeaves || [];
    const rejectedLeaves = allLeaveRequests?.rejectedLeaves || [];
    const leaveStats = allLeaveRequests?.leaveStats || [];
    const leaveTypes = allLeaveRequests?.leaveTypes || [];
    
    // Handler for approving a leave request
    const handleApproveLeave = async (id: number) => {
        try {
            await approveLeave({ id });
            toast({
                title: "Success",
                description: "Leave request approved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve leave request.",
                variant: "destructive",
            });
        }
    };
    
    // Handler for rejecting a leave request
    const handleRejectLeave = async (id: number) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
            try {
                await rejectLeave({ id, rejectionReason: reason });
                toast({
                    title: "Success",
                    description: "Leave request rejected successfully.",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to reject leave request.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Leave Management</h2>
                    <p className="text-muted-foreground">Manage employee leave requests and track leave balances.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Calendar className="w-4 h-4" /> Create Leave Policy
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                                <h3 className="text-2xl font-bold mt-1">{isLoading ? '...' : pendingLeaves.length}</h3>
                                <p className="text-xs text-orange-500 mt-1">Action Required</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Approved This Month</p>
                                <h3 className="text-2xl font-bold mt-1">{isLoading ? '...' : approvedLeaves.length}</h3>
                                <p className="text-xs text-green-500 mt-1">+2 from last month</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Leave Days</p>
                                <h3 className="text-2xl font-bold mt-1">156</h3>
                                <p className="text-xs text-muted-foreground mt-1">This month</p>
                            </div>
                            <CalendarDays className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">On Leave Today</p>
                                <h3 className="text-2xl font-bold mt-1">{isLoading ? '...' : pendingLeaves.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active leaves</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leave Trends Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Leave Trends</CardTitle>
                        <CardDescription>Monthly leave request statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leaveStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Balance Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Balance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {leaveTypes.map((lt: any) => {
                            const percentage = (lt.used / lt.total) * 100;
                            return (
                                <div key={lt.type} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{lt.type}</span>
                                        <span className="text-muted-foreground">{lt.used} / {lt.total} days</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Leave Requests */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Leave Requests</CardTitle>
                            <CardDescription>Review and manage employee leave requests</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search employees..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList>
                            <TabsTrigger value="pending">
                                Pending ({pendingLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                Approved ({approvedLeaves.length})
                            </TabsTrigger>
                            <TabsTrigger value="all">All Requests</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="mt-6">
                            <div className="space-y-4">
                                {pendingLeaves.map((leave: any) => (
                                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {leave.employee?.firstName?.charAt(0) + leave.employee?.lastName?.charAt(0) || 'NA'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{leave.employee?.firstName} {leave.employee?.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{leave.employee?.department?.name || 'N/A'}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">{leave.leaveType}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDateRange(leave.startDate, leave.endDate)} ({leave.totalDays} days)
                                                </p>
                                            </div>
                                        </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => handleApproveLeave(leave.id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRejectLeave(leave.id)}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="approved" className="mt-6">
                            <div className="space-y-4">
                                {approvedLeaves.map((leave: any) => (
                                    <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {leave.employee?.firstName?.charAt(0) + leave.employee?.lastName?.charAt(0) || 'NA'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{leave.employee?.firstName} {leave.employee?.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{leave.employee?.department?.name || 'N/A'}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">{leave.leaveType}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDateRange(leave.startDate, leave.endDate)} ({leave.totalDays} days)
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Approved
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="all" className="mt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...pendingLeaves, ...approvedLeaves].map((leave: any) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{leave.employee?.firstName?.charAt(0) + leave.employee?.lastName?.charAt(0) || 'NA'}</AvatarFallback>
                                                    </Avatar>
                                                    {leave.employee?.firstName} {leave.employee?.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{leave.leaveType}</TableCell>
                                        <TableCell>{formatDateRange(leave.startDate, leave.endDate)}</TableCell>
                                        <TableCell>{leave.totalDays}</TableCell>
                                        <TableCell>{leave.employee?.department?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge className={leave.status === "approved" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
