import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Shield, CheckCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const { loginMutation } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await loginMutation.mutateAsync(data);
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in."
            });
            setLocation("/dashboard");
        } catch (error: any) {
            // The error message from backend is already user-friendly ("Incorrect username" or "Incorrect password")
            // But we can standardize it if needed
            toast({
                title: "Login Failed",
                description: error.message || "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary/90 p-12 text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/50" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-3xl tracking-tight">EnterpriseOS</h1>
                            <p className="text-primary-foreground/80">Secure. Compliant. Efficient.</p>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold leading-tight max-w-lg mb-6">
                        Manage your workforce with precision and scale.
                    </h1>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span>ISO 27001 Certified</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span>99.9% Uptime</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 opacity-80">
                    <p>© 2025 EnterpriseOS. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {loginMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {loginMutation.error?.message || "Invalid username or password"}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    className="pl-9"
                                    {...form.register("username")}
                                    disabled={loginMutation.isPending}
                                />
                            </div>
                            {form.formState.errors.username && (
                                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password">
                                    <span className="text-sm text-primary hover:underline cursor-pointer">Forgot password?</span>
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-9 pr-9"
                                    {...form.register("password")}
                                    disabled={loginMutation.isPending}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className="rounded border-input bg-background"
                            />
                            <Label htmlFor="remember" className="text-sm">Remember me</Label>
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/contact-admin">
                            <span className="text-primary font-medium hover:underline cursor-pointer">Contact Admin</span>
                        </Link>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h3 className="text-sm font-medium mb-3 text-center">Trusted by enterprises worldwide</h3>
                        <div className="flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="text-xs">100+ Companies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">ISO 27001</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs">HIPAA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}