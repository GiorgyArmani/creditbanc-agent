"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Clock,
  DollarSign,
  BookOpen,
  BarChart,
} from "lucide-react"

interface LandingPageProps {
  // kept for future use if you want to open a modal, but not required now
  onShowAuth?: () => void
}

/**
 * CreditBanc AI — Enhanced Landing Page
 * - Now with dark mode support via ThemeSwitcher
 * - Fixed flexbox layouts for better responsive design
 * - Improved spacing and alignment
 * - Better semantic structure
 */
export function LandingPage(_props: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get McKinsey-level strategic analysis powered by advanced AI algorithms",
    },
    {
      icon: TrendingUp,
      title: "Growth Acceleration",
      description: "Identify and capitalize on growth opportunities with data-driven recommendations",
    },
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Develop comprehensive business strategies tailored to your industry and goals",
    },
    {
      icon: DollarSign,
      title: "Tailored Lending Products",
      description: "Access custom lending solutions designed for your business needs",
    },
    {
      icon: BookOpen,
      title: "Financial Education",
      description: "Learn to manage business finances with expert guidance and resources",
    },
    {
      icon: BarChart,
      title: "Real-Time Analytics",
      description: "Track your financial health and credit score with live dashboards",
    },
  ]

  const benefits = [
    "24/7 AI business coaching availability",
    "Personalized growth strategies",
    "Industry-specific insights",
    "Competitive analysis and positioning",
    "Financial planning and forecasting",
    "Marketing strategy optimization",
    "Custom lending product recommendations",
    "Credit score improvement tools",
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content:
        "CreditBanc AI helped us identify new market opportunities and increase revenue by 150% in just 6 months.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder, GrowthLab",
      content: "The strategic insights are incredible. It's like having a top-tier consultant available 24/7.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Director, InnovateCorp",
      content:
        "Our team productivity improved dramatically after implementing the AI-recommended organizational changes.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Free (Beta)",
      price: "$0",
      period: "7 days",
      description: "Perfect for getting started",
      features: ["5 AI coaching sessions", "Basic business analysis", "Email support", "Core templates access"],
      popular: false,
    },
    {
      name: "Professional",
      price: "$300",
      period: "month",
      description: "For growing businesses",
      features: [
        "Unlimited AI coaching",
        "Advanced analytics",
        "Priority support",
        "All templates & tools",
        "Custom strategies",
        "Team collaboration",
        "Financial education modules",
        "Credit score tracking",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$500",
      period: "month",
      description: "For established companies",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "White-label options",
        "API access",
        "Custom lending products",
        "Priority loan processing",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Credit Banc Finance Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Top Beta Banner */}
      <div className="w-full border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">BETA</Badge>
            <span className="text-gray-700 dark:text-gray-300">
              This is a <span className="font-semibold">Credit Banc</span> product in beta (MVP). We appreciate your feedback.
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
            🚀 Transform Your Business Credit Score
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            AI-Powered Business
            <span className="text-emerald-600 dark:text-emerald-400"> Coaching</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get McKinsey-level strategic insights, personalized growth plans, and 24/7 business coaching powered by
            cutting-edge artificial intelligence. Plus tailored lending products for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-3 w-full sm:w-auto" asChild>
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 w-full sm:w-auto" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
          <div className="mt-6">
            <Link href="/auth/login" className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Credit Banc Finance Academy?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Leverage the power of artificial intelligence to accelerate your business growth and financial mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border dark:border-gray-700 dark:bg-gray-800/50">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <feature.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base dark:text-gray-300">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to Scale Your Business
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our AI-powered platform provides comprehensive business coaching and strategic guidance to help you make
                informed decisions and accelerate growth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 dark:from-emerald-600 dark:to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Instant Insights</h3>
                      <p className="text-white/90">Get answers in seconds with AI-powered analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                      <p className="text-white/90">Your data is protected with enterprise-grade security</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">24/7 Available</h3>
                      <p className="text-white/90">Always here when you need us, day or night</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Business Leaders</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">See what our customers are saying about CreditBanc AI</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border dark:border-gray-700 dark:bg-gray-800/50">
            <CardContent className="text-center pt-6">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 dark:text-gray-200 mb-6 italic">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{testimonials[activeTestimonial].role}</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === activeTestimonial 
                    ? "bg-emerald-600 dark:bg-emerald-400 w-8" 
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section
      <section className="bg-gray-50 dark:bg-gray-800/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Start free, then scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative flex flex-col border dark:border-gray-700 dark:bg-gray-800/50 ${
                  plan.popular ? "ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 dark:bg-emerald-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl dark:text-white mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <CardDescription className="dark:text-gray-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`} 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/auth/sign-up">
                      {plan.name.startsWith("Free") ? "Start Free Trial" : "Get Started"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of business leaders already using AI to accelerate their growth and master their finances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-3 w-full sm:w-auto" asChild>
              <Link href="/auth/sign-up">
                Start Your Free Trial Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-400 hover:underline">
              Prefer to log in?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold">CreditBanc AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering businesses with AI-driven strategic insights, financial education, and coaching.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CreditBanc Finance Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}