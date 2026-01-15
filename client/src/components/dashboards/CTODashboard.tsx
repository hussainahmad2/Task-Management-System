import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export function CTODashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">CTO Overview</h2>
                    <p className="text-muted-foreground">Engineering performance and technical roadmap status.</p>
                </div>
                <Button className="gap-2">
                    <Code2 className="w-4 h-4" /> System Status
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Sprint Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">82%</div>
                        <p className="text-xs text-muted-foreground">Current sprint completion</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pull Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">14</div>
                        <p className="text-xs text-muted-foreground">Open PRs needing review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>System Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">99.98%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
