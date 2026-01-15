import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    DollarSign, Search, Filter, Calendar, Download, 
    TrendingUp, Users, CheckCircle, Clock, AlertCircle,
    FileText, CreditCard, Building2, Percent
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

// Mock data
const payrollData = [
    { id: 1, employee: "John Smith", department: "Engineering", baseSalary: 8500, bonus: 500, deductions: 1200, netPay: 7800, status: "Processed", avatar: "JS" },
    { id: 2, employee: "Sarah Johnson", department: "Sales", baseSalary: 7200, bonus: 1200, deductions: 1100, netPay: 7300, status: "Processed", avatar: "SJ" },
    { id: 3, employee: "Mike Chen", department: "Marketing", baseSalary: 6800, bonus: 300, deductions: 1000, netPay: 6100, status: "Pending", avatar: "MC" },
    { id: 4, employee: "Emily Davis", department: "HR", baseSalary: 7500, bonus: 400, deductions: 1150, netPay: 6750, status: "Processed", avatar: "ED" },
    { id: 5, employee: "David Wilson", department: "Finance", baseSalary: 8000, bonus: 600, deductions: 1250, netPay: 7350, status: "Processed", avatar: "DW" },
];

const payrollHistory = [
    { month: 'Oct', total: 142500, processed: 142500 },
    { month: 'Nov', total: 145200, processed: 145200 },
    { month: 'Dec', total: 148000, processed: 148000 },
    { month: 'Jan', total: 150500, processed: 120400 },
];

const departmentPayroll = [
    { department: "Engineering", total: 45000, employees: 12 },
    { department: "Sales", total: 32000, employees: 8 },
    { department: "Marketing", total: 28000, employees: 7 },
    { department: "HR", total: 15000, employees: 4 },
    { department: "Finance", total: 25000, employees: 5 },
];

export default function Payroll() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netPay, 0);
    const processedCount = payrollData.filter(emp => emp.status === "Processed").length;
    const pendingCount = payrollData.filter(emp => emp.status === "Pending").length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Payroll Management</h2>
                    <p className="text-muted-foreground">Process employee salaries, bonuses, and deductions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                <Button 
                    className="gap-2 shadow-lg shadow-primary/20"
                    onClick={() => {
                        // In real app, would open payroll generation dialog
                        if (confirm("Generate payroll for all employees for January 2024?")) {
                            // Calculate payroll for each employee
                            alert("Payroll generation started. Processing payroll for all active employees...");
                        }
                    }}
                >
                    <DollarSign className="w-4 h-4" /> Process Payroll
                </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                                <h3 className="text-2xl font-bold mt-1">${totalPayroll.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">This month</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Processed</p>
                                <h3 className="text-2xl font-bold mt-1">{processedCount}</h3>
                                <p className="text-xs text-green-500 mt-1">Employees</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                <h3 className="text-2xl font-bold mt-1">{pendingCount}</h3>
                                <p className="text-xs text-orange-500 mt-1">Action Required</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Salary</p>
                                <h3 className="text-2xl font-bold mt-1">${Math.round(totalPayroll / payrollData.length).toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Per employee</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payroll Trends */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Payroll Trends</CardTitle>
                        <CardDescription>Monthly payroll processing history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={payrollHistory}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                    <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTotal)" />
                                    <Area type="monotone" dataKey="processed" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Department Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {departmentPayroll.map((dept) => (
                            <div key={dept.department} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{dept.department}</span>
                                    <span className="text-muted-foreground">${dept.total.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="w-3 h-3" />
                                    {dept.employees} employees
                                </div>
                                <Progress value={(dept.total / totalPayroll) * 100} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Payroll Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Employee Payroll</CardTitle>
                            <CardDescription>January 2024 payroll details</CardDescription>
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
                                    <SelectItem value="Processed">Processed</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Base Salary</TableHead>
                                <TableHead>Bonus</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrollData.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{emp.avatar}</AvatarFallback>
                                            </Avatar>
                                            {emp.employee}
                                        </div>
                                    </TableCell>
                                    <TableCell>{emp.department}</TableCell>
                                    <TableCell>${emp.baseSalary.toLocaleString()}</TableCell>
                                    <TableCell className="text-green-600">+${emp.bonus.toLocaleString()}</TableCell>
                                    <TableCell className="text-red-600">-${emp.deductions.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">${emp.netPay.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={emp.status === "Processed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                                            {emp.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
