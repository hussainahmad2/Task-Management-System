import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, Download, 
    Plus, Search, Filter, Calendar, AlertCircle, CheckCircle, Clock,
    Building2, Receipt, PieChart, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";

const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
    { month: 'Feb', revenue: 52000, expenses: 30000, profit: 22000 },
    { month: 'Mar', revenue: 48000, expenses: 32000, profit: 16000 },
    { month: 'Apr', revenue: 55000, expenses: 29000, profit: 26000 },
    { month: 'May', revenue: 60000, expenses: 35000, profit: 25000 },
    { month: 'Jun', revenue: 58000, expenses: 33000, profit: 25000 },
];

const expenseBreakdown = [
    { category: 'Salaries', amount: 125000, percentage: 45, color: '#3b82f6' },
    { category: 'Infrastructure', amount: 35000, percentage: 12, color: '#10b981' },
    { category: 'Marketing', amount: 28000, percentage: 10, color: '#f59e0b' },
    { category: 'Software Licenses', amount: 15000, percentage: 5, color: '#ef4444' },
    { category: 'Office Rent', amount: 42000, percentage: 15, color: '#8b5cf6' },
    { category: 'Other', amount: 35000, percentage: 13, color: '#94a3b8' },
];

const invoices = [
    { id: 1, client: "Acme Corp", amount: 15000, dueDate: "2024-02-15", status: "Pending", invoiceNumber: "INV-2024-001" },
    { id: 2, client: "Tech Solutions", amount: 8500, dueDate: "2024-02-10", status: "Paid", invoiceNumber: "INV-2024-002" },
    { id: 3, client: "Global Industries", amount: 22000, dueDate: "2024-02-20", status: "Pending", invoiceNumber: "INV-2024-003" },
    { id: 4, client: "StartupXYZ", amount: 5000, dueDate: "2024-02-05", status: "Overdue", invoiceNumber: "INV-2024-004" },
];

const budgetVsActual = [
    { category: 'Salaries', budget: 130000, actual: 125000, variance: -5000 },
    { category: 'Marketing', budget: 30000, actual: 28000, variance: -2000 },
    { category: 'Infrastructure', budget: 40000, actual: 35000, variance: -5000 },
    { category: 'Software', budget: 18000, actual: 15000, variance: -3000 },
];

export function FinanceDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: employees } = useEmployees(activeOrg?.id);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalExpenses = revenueData.reduce((sum, d) => sum + d.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
    const pendingInvoices = invoices.filter(i => i.status === "Pending" || i.status === "Overdue");
    const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);

    const COLORS = expenseBreakdown.map(e => e.color);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Financial Overview</h2>
                    <p className="text-muted-foreground">Revenue tracking, expense management, and financial analytics.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> New Invoice
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <h3 className="text-2xl font-bold mt-1">${(totalRevenue / 1000).toFixed(0)}K</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +12.5% from last quarter
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                                <h3 className="text-2xl font-bold mt-1">${(totalExpenses / 1000).toFixed(0)}K</h3>
                                <p className="text-xs text-muted-foreground mt-1">This quarter</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                                <h3 className="text-2xl font-bold mt-1">${(netProfit / 1000).toFixed(0)}K</h3>
                                <p className="text-xs text-green-500 mt-1">Margin: {profitMargin}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                                <h3 className="text-2xl font-bold mt-1">{pendingInvoices.length}</h3>
                                <p className="text-xs text-orange-500 mt-1">${totalPending.toLocaleString()} unpaid</p>
                            </div>
                            <FileText className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue vs Expenses */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue vs Expenses</CardTitle>
                        <CardDescription>Monthly financial performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>By category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={expenseBreakdown}
                                        dataKey="amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {expenseBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {expenseBreakdown.map((item) => (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span>{item.category}</span>
                                    </div>
                                    <span className="font-medium">${(item.amount / 1000).toFixed(0)}K</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Budget vs Actual & Invoices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget vs Actual */}
                <Card>
                    <CardHeader>
                        <CardTitle>Budget vs Actual</CardTitle>
                        <CardDescription>Quarterly budget performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetVsActual}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="category" />
                                    <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                    <Bar dataKey="budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Invoices */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Recent Invoices</CardTitle>
                                <CardDescription>Track invoice status</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-initial">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search..." 
                                        className="pl-9 w-full md:w-48" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full md:w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                                        <TableCell className="font-medium">{invoice.client}</TableCell>
                                        <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                invoice.status === "Paid" ? "bg-green-100 text-green-700" :
                                                invoice.status === "Overdue" ? "bg-red-100 text-red-700" :
                                                "bg-orange-100 text-orange-700"
                                            }>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+${(netProfit / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground mt-1">Positive cash flow this quarter</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Accounts Receivable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">{pendingInvoices.length} outstanding invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Expense Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{((totalExpenses / totalRevenue) * 100).toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Of total revenue</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
