import Layout from "@/components/Layout";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { useEmployees } from "@/hooks/use-employees";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus, Search, Filter, LayoutGrid, List, Calendar,
  MoreHorizontal, Clock, CheckCircle2
} from "lucide-react";
import { useState } from "react";
// Removed unused form imports
import { format } from "date-fns";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Tasks() {
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: tasks, isLoading } = useTasks(activeOrg?.id);
  const { data: employees } = useEmployees(activeOrg?.id);
  const createTask = useCreateTask();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const filteredTasks = tasks?.filter(t =>
    !filterPriority || t.priority === filterPriority
  );

  const stats = {
    total: tasks?.length || 0,
    todo: tasks?.filter(t => t.status === 'todo').length || 0,
    inProgress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
  };

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        {/* Header with Stats */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold tracking-tight">Project Tasks</h2>
              <p className="text-muted-foreground">Manage and track project deliverables.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
                <Button
                  variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                  className="h-8 px-2"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" /> Board
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-2"
                >
                  <List className="w-4 h-4 mr-2" /> List
                </Button>
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
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between border-b pb-4">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-full border">
                <Clock className="w-3.5 h-3.5" />
                <strong className="text-foreground">{stats.todo}</strong> To Do
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-900">
                <Clock className="w-3.5 h-3.5" />
                <strong className="text-foreground">{stats.inProgress}</strong> In Progress
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <strong className="text-foreground">{stats.completed}</strong> Completed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9 h-9" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterPriority(null)}>All Priorities</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority('high')}>High Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPriority('critical')}>Critical Priority</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {viewMode === 'board' ? (
              <TaskBoard tasks={filteredTasks || []} onStatusChange={() => { }} />
            ) : (
              <div className="border rounded-lg bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Task Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks?.length ? filteredTasks.map(task => (
                      <TableRow key={task.id} className="group">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{task.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{task.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "capitalize",
                            task.status === 'completed' && "bg-green-50 text-green-700 border-green-200",
                            task.status === 'in_progress' && "bg-blue-50 text-blue-700 border-blue-200",
                          )}>
                            {task.status?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn(
                            "capitalize",
                            task.priority === 'critical' && "bg-red-50 text-red-700 border-red-200",
                            task.priority === 'high' && "bg-orange-50 text-orange-700 border-orange-200",
                          )}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={(task as any).assignee?.user?.profileImageUrl} />
                              <AvatarFallback className="text-[10px]">
                                {(task as any).assignee?.user?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{(task as any).assignee?.user?.firstName || "Unassigned"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                            {task.dueDate && <Calendar className="w-3.5 h-3.5" />}
                            {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No tasks found matching current filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
