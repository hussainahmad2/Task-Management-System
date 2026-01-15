import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Star, Search, Filter, Calendar, TrendingUp, 
    Users, CheckCircle, Clock, AlertCircle, FileText,
    Target, Award, BarChart3, UserCheck
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data
const upcomingReviews = [
    { id: 1, employee: "John Smith", position: "Senior Developer", department: "Engineering", dueDate: "2024-02-15", status: "Scheduled", avatar: "JS", lastReview: "2023-11-15" },
    { id: 2, employee: "Sarah Johnson", position: "Product Manager", department: "Product", dueDate: "2024-02-20", status: "Scheduled", avatar: "SJ", lastReview: "2023-11-20" },
    { id: 3, employee: "Mike Chen", position: "UX Designer", department: "Design", dueDate: "2024-02-18", status: "In Progress", avatar: "MC", lastReview: "2023-11-18" },
];

const completedReviews = [
    { id: 4, employee: "Emily Davis", position: "Marketing Lead", department: "Marketing", completedDate: "2024-01-10", rating: 4.5, avatar: "ED" },
    { id: 5, employee: "David Wilson", position: "Sales Manager", department: "Sales", completedDate: "2024-01-12", rating: 4.8, avatar: "DW" },
];

const performanceData = [
    { skill: 'Technical', score: 85 },
    { skill: 'Communication', score: 90 },
    { skill: 'Leadership', score: 75 },
    { skill: 'Problem Solving', score: 88 },
    { skill: 'Teamwork', score: 92 },
];

const departmentPerformance = [
    { department: "Engineering", avgRating: 4.6, reviews: 12 },
    { department: "Sales", avgRating: 4.8, reviews: 8 },
    { department: "Marketing", avgRating: 4.4, reviews: 6 },
    { department: "HR", avgRating: 4.7, reviews: 4 },
];

export default function PerformanceReviews() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Performance Reviews</h2>
                    <p className="text-muted-foreground">Schedule and manage employee performance evaluations.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Calendar className="w-4 h-4" /> Schedule Review
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming Reviews</p>
                                <h3 className="text-2xl font-bold mt-1">{upcomingReviews.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">This month</p>
                            </div>
                            <Calendar className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <h3 className="text-2xl font-bold mt-1">{completedReviews.length}</h3>
                                <p className="text-xs text-green-500 mt-1">This quarter</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                                <h3 className="text-2xl font-bold mt-1">4.6</h3>
                                <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
                            </div>
                            <Star className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">On Track</p>
                                <h3 className="text-2xl font-bold mt-1">85%</h3>
                                <p className="text-xs text-muted-foreground mt-1">Employees</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Radar Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Average performance metrics by skill</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={performanceData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="skill" />
                                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                    <Radar name="Performance" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Department Ratings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Ratings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {departmentPerformance.map((dept) => (
                            <div key={dept.department} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{dept.department}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold">{dept.avgRating}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {dept.reviews} reviews
                                </div>
                                <Progress value={dept.avgRating * 20} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Reviews Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Performance Reviews</CardTitle>
                            <CardDescription>Manage employee performance evaluations</CardDescription>
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
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList>
                            <TabsTrigger value="upcoming">
                                Upcoming ({upcomingReviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({completedReviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="all">All Reviews</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming" className="mt-6">
                            <div className="space-y-4">
                                {upcomingReviews.map((review) => (
                                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {review.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{review.employee}</p>
                                                <p className="text-sm text-muted-foreground">{review.position} • {review.department}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">Due: {new Date(review.dueDate).toLocaleDateString()}</p>
                                                <p className="text-xs text-muted-foreground">Last: {new Date(review.lastReview).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={review.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}>
                                                {review.status}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <FileText className="w-4 h-4 mr-1" /> Start Review
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="completed" className="mt-6">
                            <div className="space-y-4">
                                {completedReviews.map((review) => (
                                    <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {review.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{review.employee}</p>
                                                <p className="text-sm text-muted-foreground">{review.position} • {review.department}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium">Completed: {new Date(review.completedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{review.rating}</span>
                                            </div>
                                            <Button size="sm" variant="ghost">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="all" className="mt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...upcomingReviews, ...completedReviews].map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{review.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    {review.employee}
                                                </div>
                                            </TableCell>
                                            <TableCell>{review.position}</TableCell>
                                            <TableCell>{review.department}</TableCell>
                                            <TableCell>
                                                {(review as any).dueDate ? new Date((review as any).dueDate).toLocaleDateString() : 
                                                 (review as any).completedDate ? new Date((review as any).completedDate).toLocaleDateString() : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={(review as any).status === "Completed" ? "bg-green-100 text-green-700" : 
                                                                  (review as any).status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                                                                  "bg-orange-100 text-orange-700"}>
                                                    {(review as any).status || "Completed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(review as any).rating ? (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{(review as any).rating}</span>
                                                    </div>
                                                ) : '-'}
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
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
