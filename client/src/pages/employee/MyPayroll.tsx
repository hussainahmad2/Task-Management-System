import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DollarSign, Download, FileText, Calendar,
    TrendingUp, Receipt, CreditCard
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";

const payrollHistory = [
    { period: "January 2024", grossPay: 8500, deductions: 1200, netPay: 7300, status: "Paid", payDate: "2024-01-31" },
    { period: "December 2023", grossPay: 8500, deductions: 1200, netPay: 7300, status: "Paid", payDate: "2023-12-31" },
    { period: "November 2023", grossPay: 8500, deductions: 1200, netPay: 7300, status: "Paid", payDate: "2023-11-30" },
];

const salaryTrend = [
    { month: "Aug", amount: 7300 },
    { month: "Sep", amount: 7300 },
    { month: "Oct", amount: 7300 },
    { month: "Nov", amount: 7300 },
    { month: "Dec", amount: 7300 },
    { month: "Jan", amount: 7300 },
];

const currentPayroll = {
    period: "January 2024",
    baseSalary: 8500,
    overtime: 500,
    bonus: 0,
    allowances: 200,
    grossPay: 9200,
    taxDeduction: 800,
    socialSecurity: 250,
    healthInsurance: 150,
    totalDeductions: 1200,
    netPay: 8000,
    status: "Processing",
};

export default function MyPayroll() {
    const { toast } = useToast();
    const [selectedPeriod, setSelectedPeriod] = useState("January 2024");

    const handleDownload = (period: string) => {
        toast({
            title: "Downloading Payslip",
            description: `Generating payslip for ${period}...`,
        });
        // In real app, trigger file download
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">My Payroll</h2>
                    <p className="text-muted-foreground">View your salary details and payroll history.</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => handleDownload(selectedPeriod)}>
                    <Download className="w-4 h-4" /> Download Payslip
                </Button>
            </div>

            {/* Current Payroll Summary */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <CardTitle>Current Pay Period: {currentPayroll.period}</CardTitle>
                    <CardDescription>Details for the current pay period</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase">Earnings</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Base Salary</span>
                                    <span className="font-medium">${currentPayroll.baseSalary.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Overtime</span>
                                    <span className="font-medium text-green-600">+${currentPayroll.overtime.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bonus</span>
                                    <span className="font-medium text-green-600">+${currentPayroll.bonus.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Allowances</span>
                                    <span className="font-medium text-green-600">+${currentPayroll.allowances.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold">
                                    <span>Gross Pay</span>
                                    <span>${currentPayroll.grossPay.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase">Deductions</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span className="font-medium text-red-600">-${currentPayroll.taxDeduction.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Social Security</span>
                                    <span className="font-medium text-red-600">-${currentPayroll.socialSecurity.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Health Insurance</span>
                                    <span className="font-medium text-red-600">-${currentPayroll.healthInsurance.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold">
                                    <span>Total Deductions</span>
                                    <span className="text-red-600">-${currentPayroll.totalDeductions.toLocaleString()}</span>
                                </div>
                                <div className="border-t-2 pt-2 flex justify-between font-bold text-lg">
                                    <span>Net Pay</span>
                                    <span className="text-primary">${currentPayroll.netPay.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                        <Badge className={currentPayroll.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                            {currentPayroll.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Salary Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Salary Trend</CardTitle>
                    <CardDescription>Net pay over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salaryTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Payroll History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payroll History</CardTitle>
                    <CardDescription>Past pay periods and payslips</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Gross Pay</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Pay</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Pay Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrollHistory.map((payroll, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{payroll.period}</TableCell>
                                    <TableCell>${payroll.grossPay.toLocaleString()}</TableCell>
                                    <TableCell className="text-red-600">-${payroll.deductions.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">${payroll.netPay.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-100 text-green-700">
                                            {payroll.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(payroll.payDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" onClick={() => handleDownload(payroll.period)}>
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
    );
}
