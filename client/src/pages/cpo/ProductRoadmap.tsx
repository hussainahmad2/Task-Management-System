import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
    Rocket, Plus, Calendar, Target, TrendingUp, 
    Filter, Search, Edit, Trash2, CheckCircle, Clock
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, GanttChart, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const roadmapItems = [
    { id: 1, feature: "Advanced Analytics", quarter: "Q1", status: "In Development", progress: 65, priority: "High", team: "Engineering", releaseDate: "2024-03-15" },
    { id: 2, feature: "Mobile App v2.0", quarter: "Q1", status: "Design", progress: 30, priority: "Critical", team: "Design", releaseDate: "2024-04-01" },
    { id: 3, feature: "API Gateway", quarter: "Q1", status: "Testing", progress: 85, priority: "High", team: "Engineering", releaseDate: "2024-02-28" },
    { id: 4, feature: "User Dashboard Redesign", quarter: "Q2", status: "Planning", progress: 10, priority: "Medium", team: "Design", releaseDate: "2024-05-15" },
    { id: 5, feature: "AI Integration", quarter: "Q2", status: "Planning", progress: 5, priority: "High", team: "Engineering", releaseDate: "2024-06-30" },
];

const quarterlyData = [
    { quarter: "Q1 2024", planned: 18, completed: 15, inProgress: 3 },
    { quarter: "Q2 2024", planned: 22, completed: 0, inProgress: 2 },
    { quarter: "Q3 2024", planned: 25, completed: 0, inProgress: 0 },
    { quarter: "Q4 2024", planned: 20, completed: 0, inProgress: 0 },
];

export default function ProductRoadmap() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterQuarter, setFilterQuarter] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical": return "bg-red-100 text-red-700";
            case "High": return "bg-orange-100 text-orange-700";
            case "Medium": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Released": return "bg-green-100 text-green-700";
            case "Testing": return "bg-purple-100 text-purple-700";
            case "In Development": return "bg-blue-100 text-blue-700";
            case "Design": return "bg-yellow-100 text-yellow-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Product Roadmap</h2>
                    <p className="text-muted-foreground">Plan and track product features across quarters.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add Feature
                </Button>
            </div>

            {/* Quarterly Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {quarterlyData.map((q) => (
                    <Card key={q.quarter} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">{q.quarter}</p>
                            <h3 className="text-2xl font-bold mt-2">{q.completed + q.inProgress}/{q.planned}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {q.completed} completed, {q.inProgress} in progress
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Roadmap Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Quarterly Progress</CardTitle>
                    <CardDescription>Feature completion by quarter</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={quarterlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="quarter" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="planned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="inProgress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Roadmap Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Feature Roadmap</CardTitle>
                            <CardDescription>Track feature development progress</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search features..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterQuarter} onValueChange={setFilterQuarter}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Quarter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Quarters</SelectItem>
                                    <SelectItem value="Q1">Q1 2024</SelectItem>
                                    <SelectItem value="Q2">Q2 2024</SelectItem>
                                    <SelectItem value="Q3">Q3 2024</SelectItem>
                                    <SelectItem value="Q4">Q4 2024</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="In Development">In Development</SelectItem>
                                    <SelectItem value="Testing">Testing</SelectItem>
                                    <SelectItem value="Released">Released</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feature</TableHead>
                                <TableHead>Quarter</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Release Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roadmapItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.feature}</TableCell>
                                    <TableCell>{item.quarter}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getPriorityColor(item.priority)}>
                                            {item.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={item.progress} className="w-24 h-2" />
                                            <span className="text-sm text-muted-foreground">{item.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.team}</TableCell>
                                    <TableCell>{new Date(item.releaseDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Trash2 className="w-4 h-4" />
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
