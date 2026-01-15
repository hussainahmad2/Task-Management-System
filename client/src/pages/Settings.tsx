import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useOrganizations } from "@/hooks/use-organizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User, Building2, Bell, Shield,
    Palette, LogOut, Save, Camera, UploadCloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/use-theme";

export default function Settings() {
    const { user } = useAuth();
    const { data: orgs } = useOrganizations();
    const activeOrg = orgs?.[0];
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Theme hooks
    const { theme, setTheme, density, setDensity } = useTheme();

    const handleSave = () => {
        toast({
            title: "Settings saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        setIsUploading(true);
        try {
            const res = await fetch("/api/user/profile-photo", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            await res.json();
            await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

            toast({
                title: "Profile photo updated",
                description: "Your new profile picture has been saved.",
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Could not upload profile photo. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <Layout>
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-display font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
                <Separator className="my-6" />

                <Tabs defaultValue="general" className="w-full space-y-6">
                    <div className="w-full overflow-x-auto pb-2">
                        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
                            <TabsTrigger value="general" className="gap-2 px-4 py-2">
                                <User className="w-4 h-4" /> General
                            </TabsTrigger>
                            <TabsTrigger value="account" className="gap-2 px-4 py-2">
                                <Shield className="w-4 h-4" /> Account
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="gap-2 px-4 py-2">
                                <Palette className="w-4 h-4" /> Appearance
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2 px-4 py-2">
                                <Bell className="w-4 h-4" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="organization" className="gap-2 px-4 py-2">
                                <Building2 className="w-4 h-4" /> Organization
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* General Settings */}
                    <TabsContent value="general" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    This is how others will see you on the site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative group">
                                        <Avatar className="h-24 w-24 cursor-pointer ring-4 ring-background shadow-lg transition-transform group-hover:scale-105">
                                            <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                                {user?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md cursor-pointer hover:bg-primary/90 transition-colors"
                                            onClick={triggerFileUpload}
                                        >
                                            <Camera className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="space-y-2 text-center md:text-left flex-1">
                                        <h4 className="font-semibold text-lg">Profile Picture</h4>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
                                            Supports JPG, PNG or GIF. Max size 5MB.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={triggerFileUpload}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? "Uploading..." : "Upload New"}
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" value={user?.username || ""} disabled className="bg-muted" />
                                            <p className="text-[10px] text-muted-foreground">
                                                Username cannot be changed.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Input id="role" value={user?.role || ""} disabled className="bg-muted capitalize" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" defaultValue={user?.firstName || ""} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" defaultValue={user?.lastName || ""} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input id="bio" placeholder="Write a short bio about yourself..." />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-end">
                                <Button onClick={handleSave} className="gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Account Settings */}
                    <TabsContent value="account" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>
                                    Manage your password and security settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new">New Password</Label>
                                        <Input id="new" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm">Confirm Password</Label>
                                        <Input id="confirm" type="password" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-between">
                                <Button variant="ghost" size="sm">Forgot Password?</Button>
                                <Button onClick={handleSave}>Update Password</Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-red-200 dark:border-red-900 overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                                <CardDescription>
                                    Irreversible actions for your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Deleting your account will remove all your data, including tasks and history.
                                </p>
                            </CardContent>
                            <CardFooter className="border-t bg-red-50 dark:bg-red-900/10 px-6 py-4">
                                <Button variant="destructive" className="gap-2">
                                    <LogOut className="w-4 h-4" /> Delete Account
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Appearance Settings */}
                    <TabsContent value="appearance" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Preferences</CardTitle>
                                <CardDescription>
                                    Customize the look and feel of the application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Toggle between light and dark themes.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={theme === "dark"}
                                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Compact Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Increase information density on the dashboard.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={density === "compact"}
                                        onCheckedChange={(checked) => setDensity(checked ? "compact" : "default")}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Settings */}
                    <TabsContent value="notifications" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>
                                    Choose what you want to be notified about via email.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Task Assignments</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive emails when you are assigned a new task.
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Project Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get weekly digests of project progress.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Organization Settings */}
                    <TabsContent value="organization" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Details</CardTitle>
                                <CardDescription>
                                    Manage company-wide settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Organization Name</Label>
                                    <Input value={activeOrg?.name || ""} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input value={activeOrg?.slug || ""} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Plan</Label>
                                    <Input value={activeOrg?.plan || ""} disabled className="uppercase" />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}
