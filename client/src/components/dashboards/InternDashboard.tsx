import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle } from "lucide-react";

export function InternDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Intern Dashboard</h2>
                    <p className="text-muted-foreground">Learning path and assigned tasks.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Learning Path Progress</CardTitle>
                        <CardDescription>Onboarding Module</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">65%</div>
                        <div className="w-full h-2 bg-muted rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { task: 'Setup Development Environment', status: 'Done' },
                                { task: 'Read Documentation', status: 'In Progress' },
                                { task: 'Fix Typo in Footer', status: 'Todo' }
                            ].map((t, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm">{t.task}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-secondary text-secondary-foreground'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
