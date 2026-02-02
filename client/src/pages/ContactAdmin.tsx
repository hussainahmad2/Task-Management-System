import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, MessageSquare, Send, Home, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactAdmin() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }
        
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 10) {
            newErrors.message = "Message should be at least 10 characters";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // In a real application, this would send the request to the backend
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast({
                title: "Request Sent!",
                description: "Your registration request has been sent to the administrator. You will receive a response shortly.",
            });
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
            
            // Optionally redirect to login after a delay
            setTimeout(() => {
                setLocation("/login");
            }, 3000);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Information */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary/90 p-12 text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/50" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
                            <Send className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-3xl tracking-tight">EnterpriseOS</h1>
                            <p className="text-primary-foreground/80">Secure. Compliant. Efficient.</p>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold leading-tight max-w-lg mb-6">
                        Need an account? Contact your administrator.
                    </h1>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-300" />
                            <span>Account registration requires admin approval</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-300" />
                            <span>Admin will review your request</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-300" />
                            <span>You'll receive login credentials via email</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 opacity-80">
                    <p>© 2025 EnterpriseOS. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Contact Administrator</h2>
                        <p className="text-muted-foreground mt-2">
                            Fill out the form below to request an account
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Registration Request</CardTitle>
                            <CardDescription>
                                Submit your details to request an account from your administrator
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            className="pl-9"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="pl-9"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        placeholder="Account Registration Request"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {errors.subject && (
                                        <p className="text-sm text-destructive">{errors.subject}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <div className="relative">
                                        <MessageSquare className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Please provide details about why you need an account..."
                                            className="pl-9 min-h-[120px]"
                                            value={formData.message}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.message && (
                                        <p className="text-sm text-destructive">{errors.message}</p>
                                    )}
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Please correct the errors above before submitting.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Send className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Request
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full" 
                                        onClick={() => setLocation("/login")}
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        Back to Login
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login">
                            <span className="text-primary font-medium hover:underline cursor-pointer">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}