import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    UserPlus, Search, Filter, Calendar, MapPin, Briefcase, 
    Mail, Phone, FileText, CheckCircle, XCircle, Clock, 
    TrendingUp, Users, Building2
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data for candidates
const mockCandidates = [
    { id: 1, name: "John Smith", position: "Senior Developer", stage: "Interview", appliedDate: "2024-01-10", experience: "5 years", location: "Remote", status: "active" },
    { id: 2, name: "Sarah Johnson", position: "Product Manager", stage: "Screening", appliedDate: "2024-01-12", experience: "7 years", location: "New York", status: "active" },
    { id: 3, name: "Mike Chen", position: "UX Designer", stage: "Applied", appliedDate: "2024-01-15", experience: "3 years", location: "San Francisco", status: "active" },
    { id: 4, name: "Emily Davis", position: "DevOps Engineer", stage: "Offer", appliedDate: "2024-01-08", experience: "4 years", location: "Remote", status: "offer" },
    { id: 5, name: "David Wilson", position: "Marketing Lead", stage: "Interview", appliedDate: "2024-01-11", experience: "6 years", location: "Chicago", status: "active" },
];

const pipelineData = [
    { name: 'Applied', value: 45, color: '#94a3b8' },
    { name: 'Screening', value: 20, color: '#60a5fa' },
    { name: 'Interview', value: 12, color: '#818cf8' },
    { name: 'Offer', value: 5, color: '#34d399' },
];

const stageColors: Record<string, string> = {
    "Applied": "bg-slate-100 text-slate-700",
    "Screening": "bg-blue-100 text-blue-700",
    "Interview": "bg-purple-100 text-purple-700",
    "Offer": "bg-green-100 text-green-700",
    "Hired": "bg-emerald-100 text-emerald-700",
    "Rejected": "bg-red-100 text-red-700",
};

export default function Recruitment() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStage, setFilterStage] = useState("all");

    const filteredCandidates = mockCandidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = filterStage === "all" || candidate.stage === filterStage;
        return matchesSearch && matchesStage;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Recruitment Pipeline</h2>
                    <p className="text-muted-foreground">Manage candidates and track hiring progress.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <UserPlus className="w-4 h-4" /> Post New Position
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                                <h3 className="text-2xl font-bold mt-1">82</h3>
                            </div>
                            <Users className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Pipeline</p>
                                <h3 className="text-2xl font-bold mt-1">45</h3>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Offers Extended</p>
                                <h3 className="text-2xl font-bold mt-1">5</h3>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                                <h3 className="text-2xl font-bold mt-1">8</h3>
                            </div>
                            <Briefcase className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pipeline Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recruitment Pipeline</CardTitle>
                        <CardDescription>Candidate distribution by hiring stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="h-[200px] w-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pipelineData}
                                            dataKey="value"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                        >
                                            {pipelineData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                {pipelineData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Calendar className="w-4 h-4" /> Schedule Interview
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <FileText className="w-4 h-4" /> Generate Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Mail className="w-4 h-4" /> Send Bulk Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Building2 className="w-4 h-4" /> View Open Positions
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Candidates Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Candidates</CardTitle>
                            <CardDescription>Manage and track candidate applications</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search candidates..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStage} onValueChange={setFilterStage}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stages</SelectItem>
                                    <SelectItem value="Applied">Applied</SelectItem>
                                    <SelectItem value="Screening">Screening</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCandidates.map((candidate) => (
                                <TableRow key={candidate.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{candidate.name}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {candidate.name.toLowerCase().replace(' ', '.')}@email.com
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{candidate.position}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={stageColors[candidate.stage] || "bg-gray-100 text-gray-700"}>
                                            {candidate.stage}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{candidate.experience}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {candidate.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <XCircle className="w-4 h-4 text-red-500" />
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
