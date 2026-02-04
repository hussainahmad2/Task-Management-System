import { useOrganizations } from "@/hooks/use-organizations";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    CheckSquare, Clock, Calendar, TrendingUp,
    Target, FileText, Bell, ArrowRight, Plus
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { startOfWeek, addDays, format, isSameDay, parseISO } from "date-fns";

export function EmployeeDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: myTasks } = useTasks(activeOrg?.id);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const todoTasks = myTasks?.filter(t => t.status === 'todo').length || 0;
    const inProgressTasks = myTasks?.filter(t => t.status === 'in_progress').length || 0;
    const completedTasks = myTasks?.filter(t => t.status === 'completed').length || 0;
    const totalTasks = myTasks?.length || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const upcomingDeadlines = myTasks?.filter(t => t.dueDate && new Date(t.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5) || [];

    // Calculate weekly progress
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weeklyTaskData = Array.from({ length: 5 }).map((_, index) => {
        const day = addDays(startOfCurrentWeek, index);
        const dayTasks = myTasks || [];

        const assigned = dayTasks.filter(t =>
            t.createdAt && isSameDay(new Date(t.createdAt), day)
        ).length;

        const completed = dayTasks.filter(t =>
            t.status === 'completed' && t.updatedAt && isSameDay(new Date(t.updatedAt), day)
        ).length;

        return {
            day: format(day, 'EEE'),
            assigned,
            completed
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">My Workspace</h2>
                    <p className="text-muted-foreground">Manage your daily tasks, track progress, and stay organized.</p>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" /> New Task
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Create New Task</SheetTitle>
                            <SheetDescription>Fill in the details for the new project task.</SheetDescription>
                        </SheetHeader>
                        <CreateTaskForm onSuccess={() => setIsSheetOpen(false)} onCancel={() => setIsSheetOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                                <h3 className="text-2xl font-bold mt-1">{todoTasks}</h3>
                                <p className="text-xs text-muted-foreground mt-1">To do</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{inProgressTasks}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <h3 className="text-2xl font-bold mt-1">{completedTasks}</h3>
                                <p className="text-xs text-green-500 mt-1">This month</p>
                            </div>
                            <Target className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                                <h3 className="text-2xl font-bold mt-1">{completionRate}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Overall</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Progress & Upcoming Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Task Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Task Progress</CardTitle>
                        <CardDescription>Tasks completed vs. assigned this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyTaskData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="assigned" name="Assigned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                        <CardDescription>Tasks with approaching due dates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingDeadlines.length > 0 ? (
                                upcomingDeadlines.map((task) => {
                                    const daysUntilDue = Math.ceil(
                                        (new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                    );
                                    return (
                                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{task.title}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(task.dueDate!).toLocaleDateString()}</span>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Badge className={daysUntilDue <= 1 ? "bg-red-100 text-red-700" :
                                                daysUntilDue <= 3 ? "bg-orange-100 text-orange-700" :
                                                    "bg-blue-100 text-blue-700"}>
                                                {daysUntilDue <= 0 ? "Today" : daysUntilDue === 1 ? "Tomorrow" : `${daysUntilDue} days`}
                                            </Badge>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <Calendar className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm">No upcoming deadlines</p>
                                </div>
                            )}
                        </div>
                        <Link href="/tasks">
                            <Button variant="outline" className="w-full mt-4 gap-2">
                                <ArrowRight className="w-4 h-4" /> View All Tasks
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Summary</CardTitle>
                        <CardDescription>Overview of your task status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">To Do</span>
                                <span className="text-muted-foreground">{todoTasks} tasks</span>
                            </div>
                            <Progress value={totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">In Progress</span>
                                <span className="text-muted-foreground">{inProgressTasks} tasks</span>
                            </div>
                            <Progress value={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Completed</span>
                                <span className="text-muted-foreground">{completedTasks} tasks</span>
                            </div>
                            <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/employee/timesheet">
                            <Button variant="outline" className="w-full justify-start gap-2 mb-3">
                                <FileText className="w-4 h-4" /> Submit Timesheet
                            </Button>
                        </Link>
                        <Link href="/employee/leaves">
                            <Button variant="outline" className="w-full justify-start gap-2 mb-3">
                                <Calendar className="w-4 h-4" /> Request Leave
                            </Button>
                        </Link>
                        <Link href="/messaging">
                            <Button variant="outline" className="w-full justify-start gap-2 mb-3">
                                <Bell className="w-4 h-4" /> View Notifications
                            </Button>
                        </Link>
                        <Link href="/tasks">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Target className="w-4 h-4" /> Set Goals
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
