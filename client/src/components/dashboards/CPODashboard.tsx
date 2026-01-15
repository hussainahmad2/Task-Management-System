import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function CPODashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">Product Dashboard</h2>
                    <p className="text-muted-foreground">Product metrics and roadmap velocity.</p>
                </div>
                <Button className="gap-2">
                    <Rocket className="w-4 h-4" /> Feature Request
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Feature Velocity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Features delivered this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4.8/5</div>
                        <p className="text-xs text-muted-foreground">Average feature satisfaction</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
