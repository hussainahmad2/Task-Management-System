import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Clock, Calendar, CheckCircle, Send, 
    Plus, Trash2, FileText, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";

interface TimesheetEntry {
    id: number;
    date: string;
    taskId?: number;
    taskName?: string;
    hours: number;
    description: string;
    isOvertime: boolean;
}

export default function Timesheet() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);

    const [currentWeek, setCurrentWeek] = useState(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        return monday.toISOString().split('T')[0];
    });

    const [entries, setEntries] = useState<TimesheetEntry[]>([
        { id: 1, date: currentWeek, hours: 8, description: "Development work", isOvertime: false },
    ]);

    const [status, setStatus] = useState<"draft" | "submitted" | "approved">("draft");

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentWeek);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const regularHours = entries.filter(e => !e.isOvertime).reduce((sum, e) => sum + e.hours, 0);
    const overtimeHours = entries.filter(e => e.isOvertime).reduce((sum, e) => sum + e.hours, 0);

    const addEntry = () => {
        const newEntry: TimesheetEntry = {
            id: Date.now(),
            date: currentWeek,
            hours: 0,
            description: "",
            isOvertime: false,
        };
        setEntries([...entries, newEntry]);
    };

    const removeEntry = (id: number) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const updateEntry = (id: number, field: keyof TimesheetEntry, value: any) => {
        setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const submitTimesheet = () => {
        setStatus("submitted");
        // In real app, would submit to backend
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Timesheet</h2>
                    <p className="text-muted-foreground">Track your work hours and submit weekly timesheets.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" /> Select Week
                    </Button>
                    {status === "draft" && (
                        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={submitTimesheet}>
                            <Send className="w-4 h-4" /> Submit Timesheet
                        </Button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                                <h3 className="text-2xl font-bold mt-1">{totalHours.toFixed(1)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">This week</p>
                            </div>
                            <Clock className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Regular Hours</p>
                                <h3 className="text-2xl font-bold mt-1">{regularHours.toFixed(1)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Standard time</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overtime Hours</p>
                                <h3 className="text-2xl font-bold mt-1">{overtimeHours.toFixed(1)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Extra time</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timesheet Form */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Week of {new Date(currentWeek).toLocaleDateString()}</CardTitle>
                            <CardDescription>Enter your work hours for each day</CardDescription>
                        </div>
                        <Badge className={status === "approved" ? "bg-green-100 text-green-700" : 
                                         status === "submitted" ? "bg-blue-100 text-blue-700" : 
                                         "bg-gray-100 text-gray-700"}>
                            {status === "approved" ? "Approved" : status === "submitted" ? "Submitted" : "Draft"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div key={entry.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                                <div>
                                    <Label>Date</Label>
                                    <Input 
                                        type="date" 
                                        value={entry.date} 
                                        onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
                                        disabled={status !== "draft"}
                                    />
                                </div>
                                <div>
                                    <Label>Task</Label>
                                    <Select 
                                        value={entry.taskId?.toString() || ""} 
                                        onValueChange={(value) => {
                                            const task = tasks?.find(t => t.id === parseInt(value));
                                            updateEntry(entry.id, "taskId", task?.id);
                                            updateEntry(entry.id, "taskName", task?.title);
                                        }}
                                        disabled={status !== "draft"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select task" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tasks?.map(task => (
                                                <SelectItem key={task.id} value={task.id.toString()}>
                                                    {task.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Hours</Label>
                                    <Input 
                                        type="number" 
                                        step="0.25" 
                                        min="0" 
                                        max="24"
                                        value={entry.hours} 
                                        onChange={(e) => updateEntry(entry.id, "hours", parseFloat(e.target.value) || 0)}
                                        disabled={status !== "draft"}
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={entry.description} 
                                        onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                                        placeholder="What did you work on?"
                                        disabled={status !== "draft"}
                                        className="min-h-[40px]"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={entry.isOvertime}
                                                onChange={(e) => updateEntry(entry.id, "isOvertime", e.target.checked)}
                                                disabled={status !== "draft"}
                                                className="w-4 h-4"
                                            />
                                            Overtime
                                        </Label>
                                    </div>
                                    {status === "draft" && (
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => removeEntry(entry.id)}
                                            className="text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {status === "draft" && (
                            <Button variant="outline" className="w-full gap-2" onClick={addEntry}>
                                <Plus className="w-4 h-4" /> Add Entry
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                    <CardDescription>Your timesheet history</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Week</TableHead>
                                <TableHead>Total Hours</TableHead>
                                <TableHead>Overtime</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Week of Jan 8, 2024</TableCell>
                                <TableCell>40.0</TableCell>
                                <TableCell>2.5</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Approved
                                    </Badge>
                                </TableCell>
                                <TableCell>Jan 12, 2024</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
