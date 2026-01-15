import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Server, Wifi, Cpu } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function CIODashboard() {
    const networkLoad = [
        { time: '09:00', load: 45 },
        { time: '10:00', load: 55 },
        { time: '11:00', load: 78 },
        { time: '12:00', load: 82 },
        { time: '13:00', load: 60 },
        { time: '14:00', load: 75 },
        { time: '15:00', load: 65 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight">IT Infrastructure</h2>
                    <p className="text-muted-foreground">System health, security, and network performance.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Shield className="w-4 h-4" /> Security Audit
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Server className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Security clean</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.99%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Server Load</CardTitle>
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42%</div>
                        <p className="text-xs text-muted-foreground">Resource utilization</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Network Traffic</CardTitle>
                        <CardDescription>Real-time bandwidth usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={networkLoad}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="load" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Infrastructure Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Database-01', status: 'Healthy', latency: '12ms' },
                                { name: 'API-Cluster', status: 'Healthy', latency: '45ms' },
                                { name: 'CDN-Edge', status: 'Healthy', latency: '28ms' },
                                { name: 'Auth-Svc', status: 'WARN', latency: '120ms' },
                            ].map(svc => (
                                <div key={svc.name} className="flex items-center justify-between border-b last:border-0 pb-2">
                                    <div>
                                        <div className="font-medium text-sm">{svc.name}</div>
                                        <div className="text-xs text-muted-foreground">{svc.latency}</div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${svc.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {svc.status}
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
