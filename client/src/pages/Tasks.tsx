import Layout from "@/components/Layout";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type CreateTaskRequest } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";

export default function Tasks() {
  const { data: orgs } = useOrganizations();
  const activeOrg = orgs?.[0];
  const { data: tasks, isLoading } = useTasks(activeOrg?.id);
  const createTask = useCreateTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<Omit<CreateTaskRequest, 'orgId' | 'createdById'>>({
    resolver: zodResolver(insertTaskSchema.omit({ orgId: true, createdById: true })),
    defaultValues: {
      status: 'todo',
      priority: 'medium'
    }
  });

  const onSubmit = (data: any) => {
    if (!activeOrg) return;
    createTask.mutate({ 
      orgId: activeOrg.id, 
      data 
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">Manage projects and assignments.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9 w-64 bg-background" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...form.register("title")} placeholder="Enter task title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea {...form.register("description")} placeholder="Describe the task details..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select onValueChange={(v) => form.setValue("priority", v as any)} defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" {...form.register("dueDate")} />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createTask.isPending}>
                      {createTask.isPending ? "Creating..." : "Create Task"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <TaskBoard tasks={tasks || []} onStatusChange={() => {}} />
        )}
      </div>
    </Layout>
  );
}
