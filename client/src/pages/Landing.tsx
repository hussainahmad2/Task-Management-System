import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Briefcase, Shield, Users, Zap, Globe, Lock, CheckCircle, Star, DollarSign, Calendar, TrendingUp, Activity, Monitor, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">Enterprise Solutions</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Transform Your <span className="text-primary">Business Operations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Streamline workflows, enhance productivity, and drive growth with our comprehensive enterprise solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Enterprises</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-16">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Activity className="w-6 h-6" />, title: "Real-time Monitoring", desc: "Track all operations in real-time with live dashboards." },
              { icon: <Shield className="w-6 h-6" />, title: "Enterprise Security", desc: "Bank-grade security with HIPAA and ISO compliance." },
              { icon: <Users className="w-6 h-6" />, title: "Team Collaboration", desc: "Seamless collaboration across departments and roles." },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Advanced Analytics", desc: "Data-driven insights for smarter business decisions." },
              { icon: <Briefcase className="w-6 h-6" />, title: "Project Management", desc: "Complete project lifecycle with task tracking." },
              { icon: <Calendar className="w-6 h-6" />, title: "Leave Management", desc: "Streamlined leave approval workflows for HR teams." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-16">Cross-Platform Solution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Monitor className="w-8 h-8" />, title: "Web Application", desc: "Full-featured web app for desktop users with advanced capabilities." },
              { icon: <Smartphone className="w-8 h-8" />, title: "Mobile App", desc: "Native mobile app for iOS and Android for on-the-go access." },
              { icon: <Zap className="w-8 h-8" />, title: "API Integration", desc: "Robust API for seamless integration with your existing systems." },
            ].map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-8 bg-gradient-to-b from-white to-slate-50 border-0 shadow-lg">
                  <div className="mx-auto mb-4 text-primary">{platform.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{platform.title}</h3>
                  <p className="text-muted-foreground">{platform.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">Compliance & Security</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Built with industry standards in mind for maximum security and compliance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Lock className="w-5 h-5" />, label: "ISO 27001" },
              { icon: <Shield className="w-5 h-5" />, label: "HIPAA" },
              { icon: <CheckCircle className="w-5 h-5" />, label: "SOC 2" },
              { icon: <Lock className="w-5 h-5" />, label: "GDPR" },
            ].map((compliance, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                <div className="text-primary">{compliance.icon}</div>
                <span className="font-medium">{compliance.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-16">Trusted by Industry Leaders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Revolutionary platform that transformed our operations overnight. The leave approval workflow alone saved us hours each week.", author: "Sarah Johnson", role: "CTO, TechCorp" },
              { quote: "Unparalleled security and efficiency. HIPAA compliance made it easy to adopt across our healthcare organization.", author: "Michael Chen", role: "CEO, Global Inc" },
              { quote: "The analytics capabilities alone are worth the investment. We've seen a 35% increase in productivity.", author: "Emma Rodriguez", role: "Director, InnovateCo" },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-slate-50">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                    <div className="text-center">
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of companies leveraging our platform for growth.</p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="px-8 bg-white text-primary hover:bg-slate-100 shadow-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}