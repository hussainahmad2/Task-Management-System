import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, BarChart3, Users2, ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-white">E</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Enterprise</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button>Get Started <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-8">
              Manage your workforce <span className="text-primary">with precision</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              The all-in-one platform for enterprise task management, employee hierarchy, and performance analytics. Built for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track performance metrics, burn rates, and project completion in real-time with beautiful dashboards.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Role Hierarchy</h3>
              <p className="text-muted-foreground">
                Define clear organizational structures with multi-level role management and permissions.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-grade security with audit logs, role-based access control, and data encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">
            © 2025 Enterprise Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
