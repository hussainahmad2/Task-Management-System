import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type CreateTaskRequest } from "@shared/schema";
import { useCreateTask } from "@/hooks/use-tasks";
import { useEmployees } from "@/hooks/use-employees";
import { useOrganizations } from "@/hooks/use-organizations";

interface CreateTaskFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreateTaskForm({ onSuccess, onCancel }: CreateTaskFormProps) {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: employees } = useEmployees(activeOrg?.id);
    const createTask = useCreateTask();

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
                form.reset();
                onSuccess?.();
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label>Task Title</Label>
                <Input {...form.register("title")} placeholder="e.g. Redesign Home Page" className="h-11" />
                {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select onValueChange={(v) => form.setValue("priority", v as any)} defaultValue="medium">
                        <SelectTrigger>
                            <SelectValue />
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
                    <Label>Status</Label>
                    <Select onValueChange={(v) => form.setValue("status", v as any)} defaultValue="todo">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Assignee</Label>
                <Select onValueChange={(v) => form.setValue("assigneeId", parseInt(v))} >
                    <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees?.map(emp => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.user?.firstName} {emp.user?.lastName} ({emp.designation})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Due Date</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" {...form.register("dueDate")} className="pl-9" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    {...form.register("description")}
                    placeholder="Detailed explanation of requirements..."
                    className="min-h-[120px] resize-none"
                />
            </div>

            <div className="pt-4 flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                )}
                <Button type="submit" disabled={createTask.isPending} className="w-32">
                    {createTask.isPending ? "Creating..." : "Create Task"}
                </Button>
            </div>
        </form>
    );
}
