import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    BookOpen, CheckCircle, Clock, Play, 
    Award, Target, TrendingUp, FileText
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const learningModules = [
    { id: 1, title: "Company Overview", type: "Onboarding", duration: 2, progress: 100, status: "Completed", completedDate: "2024-01-10", required: true },
    { id: 2, title: "Development Setup", type: "Onboarding", duration: 4, progress: 100, status: "Completed", completedDate: "2024-01-12", required: true },
    { id: 3, title: "Code Standards", type: "Onboarding", duration: 3, progress: 100, status: "Completed", completedDate: "2024-01-15", required: true },
    { id: 4, title: "Git Workflow", type: "Training", duration: 5, progress: 65, status: "In Progress", completedDate: null, required: true },
    { id: 5, title: "Testing Basics", type: "Training", duration: 6, progress: 30, status: "In Progress", completedDate: null, required: true },
    { id: 6, title: "Deployment Process", type: "Training", duration: 4, progress: 0, status: "Not Started", completedDate: null, required: true },
    { id: 7, title: "Advanced React Patterns", type: "Certification", duration: 8, progress: 0, status: "Not Started", completedDate: null, required: false },
];

const progressData = [
    { week: "W1", completed: 2 },
    { week: "W2", completed: 3 },
    { week: "W3", completed: 1 },
    { week: "W4", completed: 1 },
];

const achievements = [
    { id: 1, title: "First Module Completed", icon: CheckCircle, color: "text-green-500", date: "2024-01-10" },
    { id: 2, title: "Development Environment Ready", icon: Target, color: "text-blue-500", date: "2024-01-12" },
    { id: 3, title: "Code Standards Mastered", icon: Award, color: "text-yellow-500", date: "2024-01-15" },
];

export default function LearningModules() {
    const totalModules = learningModules.length;
    const completedModules = learningModules.filter(m => m.status === "Completed").length;
    const inProgressModules = learningModules.filter(m => m.status === "In Progress").length;
    const overallProgress = Math.round((completedModules / totalModules) * 100);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-700";
            case "In Progress": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Learning Modules</h2>
                    <p className="text-muted-foreground">Complete onboarding and training modules to advance your skills.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Award className="w-4 h-4" /> View Certifications
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{overallProgress}%</h3>
                                <p className="text-xs text-muted-foreground mt-1">{completedModules}/{totalModules} modules</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <h3 className="text-2xl font-bold mt-1">{completedModules}</h3>
                                <p className="text-xs text-green-500 mt-1">Modules finished</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                <h3 className="text-2xl font-bold mt-1">{inProgressModules}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active learning</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500 opacity-50" />
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

            {/* Progress Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Modules completed per week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Available Modules</CardTitle>
                        <CardDescription>Complete modules to advance your learning</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {learningModules.map((module) => (
                                <div key={module.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold">{module.title}</h4>
                                                {module.required && (
                                                    <Badge variant="outline" className="text-xs">Required</Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs">{module.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {module.duration} hours
                                                </span>
                                                {module.completedDate && (
                                                    <span>Completed: {new Date(module.completedDate).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                            <Progress value={module.progress} className="h-2 mb-2" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">{module.progress}% complete</span>
                                                <Badge className={getStatusColor(module.status)}>
                                                    {module.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {module.status === "Completed" ? (
                                                <Button size="sm" variant="outline" disabled>
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Completed
                                                </Button>
                                            ) : module.status === "In Progress" ? (
                                                <Button size="sm" className="gap-2">
                                                    <Play className="w-4 h-4" /> Continue
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" className="gap-2">
                                                    <Play className="w-4 h-4" /> Start
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Achievements</CardTitle>
                        <CardDescription>Your learning milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {achievements.map((achievement) => {
                                const Icon = achievement.icon;
                                return (
                                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${achievement.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{achievement.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(achievement.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
