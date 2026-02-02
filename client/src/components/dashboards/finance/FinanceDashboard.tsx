import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
    DollarSign, TrendingUp, TrendingDown, Users, BarChart3, Calendar, 
    CheckCircle, Clock, AlertCircle, FileText, ArrowUpRight, ArrowDownRight,
    Receipt, CreditCard, PiggyBank, Wallet
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { useEmployees } from "@/hooks/use-employees";
import { useQuery } from "@tanstack/react-query";

// Mock data - will be replaced with actual API calls
const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, expenses: 28000 },
    { month: 'Feb', revenue: 52000, expenses: 30000 },
    { month: 'Mar', revenue: 48000, expenses: 29000 },
    { month: 'Apr', revenue: 61000, expenses: 32000 },
    { month: 'May', revenue: 55000, expenses: 31000 },
    { month: 'Jun', revenue: 67000, expenses: 34000 },
];

const expenseCategories = [
    { category: 'Salaries', amount: 45000, percentage: 45 },
    { category: 'Infrastructure', amount: 18000, percentage: 18 },
    { category: 'Marketing', amount: 12000, percentage: 12 },
    { category: 'R&D', amount: 15000, percentage: 15 },
    { category: 'Operations', amount: 10000, percentage: 10 },
];

const cashFlow = [
    { week: 'Week 1', inflow: 12000, outflow: 8000 },
    { week: 'Week 2', inflow: 15000, outflow: 9500 },
    { week: 'Week 3', inflow: 18000, outflow: 11000 },
    { week: 'Week 4', inflow: 14000, outflow: 10500 },
];

const invoices = [
    { id: 1, client: "Acme Corp", amount: 15000, dueDate: "2024-02-15", status: "Pending", invoiceNumber: "INV-2024-001" },
    { id: 2, client: "Tech Solutions", amount: 8500, dueDate: "2024-02-10", status: "Paid", invoiceNumber: "INV-2024-002" },
    { id: 3, client: "Global Industries", amount: 22000, dueDate: "2024-02-20", status: "Pending", invoiceNumber: "INV-2024-003" },
    { id: 4, client: "StartupXYZ", amount: 5000, dueDate: "2024-02-05", status: "Overdue", invoiceNumber: "INV-2024-004" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function FinanceDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);
    const { data: employees } = useEmployees(activeOrg?.id);

    // Calculate financial metrics
    const totalRevenue = 67000;
    const totalExpenses = 34000;
    const netProfit = totalRevenue - totalExpenses;
    const cashBalance = 125000;
    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
    const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Finance Dashboard</h2>
                    <p className="text-muted-foreground">Revenue, expenses, cash flow, and invoice management.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Receipt className="w-4 h-4" /> Invoices
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <CreditCard className="w-4 h-4" /> Expenses
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Wallet className="w-4 h-4" /> Reports
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
                                <h3 className="text-2xl font-bold mt-1">${(totalRevenue / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +12% this month
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
                                <h3 className="text-2xl font-bold mt-1">${(totalExpenses / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-muted-foreground mt-1">Controlled spending</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                                <h3 className="text-2xl font-bold mt-1 text-green-600">${(netProfit / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +8% margin
                                </p>
                            </div>
                            <PiggyBank className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                                <h3 className="text-2xl font-bold mt-1">${(cashBalance / 1000).toFixed(1)}K</h3>
                                <p className="text-xs text-muted-foreground mt-1">Liquid assets</p>
                            </div>
                            <Wallet className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue vs Expenses Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Financials</CardTitle>
                        <CardDescription>Revenue vs Expenses over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Categories</CardTitle>
                        <CardDescription>Breakdown of spending by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="percentage"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {expenseCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`$${props.payload.amount}`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cash Flow & Invoices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cash Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cash Flow</CardTitle>
                        <CardDescription>Weekly cash inflow vs outflow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlow}>
                                    <defs>
                                        <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                                    <Area type="monotone" dataKey="inflow" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorInflow)" name="Inflow" />
                                    <Area type="monotone" dataKey="outflow" stroke="hsl(var(--destructive))" fillOpacity={0.3} fill="url(#colorOutflow)" name="Outflow" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Outstanding Invoices */}
                <Card>
                    <CardHeader>
                        <CardTitle>Outstanding Invoices</CardTitle>
                        <CardDescription>Invoices pending payment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{invoice.client}</h4>
                                        <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${invoice.amount}</p>
                                        <p className="text-sm text-muted-foreground">{invoice.dueDate}</p>
                                    </div>
                                    <Badge className={
                                        invoice.status === "Paid" 
                                            ? "bg-green-100 text-green-700" 
                                            : invoice.status === "Overdue"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }>
                                        {invoice.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
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

            {/* Budget vs Actual */}
            <Card>
                <CardHeader>
                    <CardTitle>Budget vs Actual</CardTitle>
                    <CardDescription>Comparison of budgeted vs actual expenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expenseCategories}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`$${value}`, '']} />
                                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}