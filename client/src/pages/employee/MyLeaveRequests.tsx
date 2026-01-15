import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
    Calendar, Plus, Clock, CheckCircle, XCircle, 
    AlertCircle, TrendingUp, FileText
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const leaveBalances = [
    { type: "Vacation", total: 20, used: 5, remaining: 15 },
    { type: "Sick Leave", total: 10, used: 2, remaining: 8 },
    { type: "Personal", total: 5, used: 1, remaining: 4 },
];

const myLeaveRequests = [
    { id: 1, type: "Vacation", startDate: "2024-02-01", endDate: "2024-02-05", days: 5, status: "Pending", reason: "Family vacation" },
    { id: 2, type: "Sick Leave", startDate: "2024-01-15", endDate: "2024-01-15", days: 1, status: "Approved", reason: "Medical appointment" },
    { id: 3, type: "Personal", startDate: "2024-01-20", endDate: "2024-01-20", days: 1, status: "Rejected", reason: "Personal matters" },
];

export default function MyLeaveRequests() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const submitLeaveRequest = () => {
        // In real app, would submit to backend
        setIsDialogOpen(false);
        // Reset form
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700";
            case "Rejected": return "bg-red-100 text-red-700";
            case "Pending": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">My Leave Requests</h2>
                    <p className="text-muted-foreground">Request time off and track your leave balances.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" /> Request Leave
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Leave Request</DialogTitle>
                            <DialogDescription>Submit a request for time off</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select value={leaveType} onValueChange={setLeaveType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vacation">Vacation</SelectItem>
                                        <SelectItem value="sick">Sick Leave</SelectItem>
                                        <SelectItem value="personal">Personal</SelectItem>
                                        <SelectItem value="maternity">Maternity/Paternity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input 
                                        type="date" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input 
                                        type="date" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Days: {calculateDays()}</Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Textarea 
                                    value={reason} 
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Please provide a reason for your leave request"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={submitLeaveRequest}>
                                    Submit Request
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Leave Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaveBalances.map((balance) => (
                    <Card key={balance.type} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">{balance.type}</h3>
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-medium">{balance.total} days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Used</span>
                                    <span className="font-medium">{balance.used} days</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Remaining</span>
                                    <span className="text-green-600">{balance.remaining} days</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${(balance.used / balance.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Leave Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>My Leave Requests</CardTitle>
                    <CardDescription>Track the status of your leave requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myLeaveRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.type}</TableCell>
                                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{request.days}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(request.status)}>
                                            {request.status === "Approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {request.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                            {request.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost">
                                            <FileText className="w-4 h-4" />
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
