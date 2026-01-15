import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    FileText, Search, Filter, Plus, Edit, Trash2, 
    Eye, Download, Clock, CheckCircle, AlertCircle,
    Shield, Users, Building2, Calendar
} from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data
const policies = [
    { id: 1, title: "Remote Work Policy", category: "Workplace", status: "Active", lastUpdated: "2024-01-15", views: 145, author: "HR Team" },
    { id: 2, title: "Code of Conduct", category: "Compliance", status: "Active", lastUpdated: "2024-01-10", views: 289, author: "HR Team" },
    { id: 3, title: "Leave Policy", category: "Benefits", status: "Active", lastUpdated: "2024-01-05", views: 312, author: "HR Team" },
    { id: 4, title: "Dress Code Policy", category: "Workplace", status: "Draft", lastUpdated: "2024-01-20", views: 0, author: "HR Team" },
    { id: 5, title: "Performance Review Guidelines", category: "HR", status: "Active", lastUpdated: "2023-12-20", views: 198, author: "HR Team" },
];

const categories = ["All", "Workplace", "Compliance", "Benefits", "HR", "Security"];

export default function Policies() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredPolicies = policies.filter(policy => {
        const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || policy.category === filterCategory;
        const matchesStatus = filterStatus === "all" || policy.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Company Policies</h2>
                    <p className="text-muted-foreground">Manage and publish company policies and guidelines.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" /> Create Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Policy</DialogTitle>
                            <DialogDescription>Add a new company policy document</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Policy Title</Label>
                                <Input id="title" placeholder="Enter policy title" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.slice(1).map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Policy Content</Label>
                                <Textarea id="content" placeholder="Enter policy content..." className="min-h-[200px]" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>Create Policy</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                                <h3 className="text-2xl font-bold mt-1">{policies.length}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active: {policies.filter(p => p.status === "Active").length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-primary opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                                <h3 className="text-2xl font-bold mt-1">{policies.filter(p => p.status === "Active").length}</h3>
                                <p className="text-xs text-green-500 mt-1">Published</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Draft Policies</p>
                                <h3 className="text-2xl font-bold mt-1">{policies.filter(p => p.status === "Draft").length}</h3>
                                <p className="text-xs text-orange-500 mt-1">Pending review</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                <h3 className="text-2xl font-bold mt-1">{policies.reduce((sum, p) => sum + p.views, 0)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">This month</p>
                            </div>
                            <Eye className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policies Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Policies</CardTitle>
                            <CardDescription>Manage company policies and documents</CardDescription>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search policies..." 
                                    className="pl-9 w-full md:w-64" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Policy Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPolicies.map((policy) => (
                                <TableRow key={policy.id}>
                                    <TableCell className="font-medium">{policy.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{policy.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={policy.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                                            {policy.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(policy.lastUpdated).toLocaleDateString()}</TableCell>
                                    <TableCell>{policy.views}</TableCell>
                                    <TableCell>{policy.author}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
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
