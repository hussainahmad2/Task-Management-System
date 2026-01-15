import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    BookOpen, CheckCircle, Clock, Target, 
    Award, Users, FileText, Calendar, 
    TrendingUp, Star, Zap, ArrowRight
} from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useOrganizations } from "@/hooks/use-organizations";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const learningPath = [
    { module: "Company Overview", completed: true, progress: 100 },
    { module: "Development Setup", completed: true, progress: 100 },
    { module: "Code Standards", completed: true, progress: 100 },
    { module: "Git Workflow", completed: false, progress: 65 },
    { module: "Testing Basics", completed: false, progress: 30 },
    { module: "Deployment Process", completed: false, progress: 0 },
];

const weeklyProgress = [
    { week: 'W1', tasks: 8, completed: 6 },
    { week: 'W2', tasks: 10, completed: 9 },
    { week: 'W3', tasks: 12, completed: 10 },
    { week: 'W4', tasks: 8, completed: 5 },
];

const achievements = [
    { id: 1, title: "First PR Merged", date: "2024-01-15", icon: CheckCircle, color: "text-green-500" },
    { id: 2, title: "Code Review Passed", date: "2024-01-18", icon: Star, color: "text-yellow-500" },
    { id: 3, title: "Team Collaboration", date: "2024-01-20", icon: Users, color: "text-blue-500" },
];

const upcomingTasks = [
    { id: 1, title: "Fix Typo in Footer", priority: "Low", dueDate: "2024-02-01", status: "Todo" },
    { id: 2, title: "Write Unit Tests", priority: "Medium", dueDate: "2024-02-05", status: "In Progress" },
    { id: 3, title: "Update Documentation", priority: "Low", dueDate: "2024-02-10", status: "Todo" },
];

export function InternDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: tasks } = useTasks(activeOrg?.id);

    const myTasks = tasks?.filter(t => t.status === "todo" || t.status === "in_progress") || [];
    const completedTasks = tasks?.filter(t => t.status === "completed") || [];
    const totalProgress = learningPath.reduce((sum, module) => sum + module.progress, 0) / learningPath.length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Intern Dashboard</h2>
                    <p className="text-muted-foreground">Learning path, assigned tasks, and progress tracking.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" /> Schedule
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Learning Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{Math.round(totalProgress)}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Onboarding</p>
                            </div>
                            <BookOpen className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                                <h3 className="text-2xl font-bold mt-1">{completedTasks.length}</h3>
                                <p className="text-xs text-green-500 mt-1">This month</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                                <h3 className="text-2xl font-bold mt-1">{myTasks.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">In progress</p>
                            </div>
                            <Target className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                                <h3 className="text-2xl font-bold mt-1">{achievements.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
                            </div>
                            <Award className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Learning Path & Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Learning Path */}
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Path Progress</CardTitle>
                        <CardDescription>Onboarding modules and completion status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {learningPath.map((module, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {module.completed ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-orange-500" />
                                            )}
                                            <span className="font-medium">{module.module}</span>
                                        </div>
                                        <span className="text-muted-foreground">{module.progress}%</span>
                                    </div>
                                    <Progress value={module.progress} className="h-2" />
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 gap-2">
                            <BookOpen className="w-4 h-4" /> Continue Learning
                        </Button>
                    </CardContent>
                </Card>

                {/* Weekly Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Task Progress</CardTitle>
                        <CardDescription>Tasks assigned vs. completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyProgress}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="tasks" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Achievements</CardTitle>
                        <CardDescription>Milestones and accomplishments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {achievements.map((achievement) => {
                                const Icon = achievement.icon;
                                return (
                                    <div key={achievement.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${achievement.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{achievement.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(achievement.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant="outline">Unlocked</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Tasks</CardTitle>
                        <CardDescription>Assigned tasks and deadlines</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{task.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge className={task.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                                        {task.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 gap-2">
                            <ArrowRight className="w-4 h-4" /> View All Tasks
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
