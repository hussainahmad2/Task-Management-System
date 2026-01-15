import { useOrganizations } from "@/hooks/use-organizations";
import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export function EmployeeDashboard() {
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { data: myTasks } = useTasks(activeOrg?.id);

    // Filter for my tasks (simplified for now, ideally backend filters)
    const todoTasks = myTasks?.filter(t => t.status === 'todo').length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-display font-bold tracking-tight">My Workspace</h2>
                <p className="text-muted-foreground">Manage your daily tasks and schedule.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>My Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{todoTasks}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
