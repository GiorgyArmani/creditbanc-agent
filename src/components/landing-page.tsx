// creditbanc-agent/src/components/landing-page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

interface LandingPageProps {
  // kept for future use if you want to open a modal, but not required now
  onShowAuth?: () => void
}

/**
 * CreditBanc AI — Landing (BETA)
 * - Uses your original styles & copy (English)
 * - No header here (we keep the header from app/page.tsx)
 * - All CTAs point to /auth/sign-up or /auth/login
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
    }
    
  ]

  const benefits = [
    "24/7 AI business coaching availability",
    "Personalized growth strategies",
    "Industry-specific insights",
    "Competitive analysis and positioning",
    "Financial planning and forecasting",
    "Marketing strategy optimization",
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
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Top Beta Banner */}
      <div className="w-full border-b">
        <div className="container mx-auto px-4 py-2 text-center text-sm">
          <Badge className="mr-2 bg-emerald-600 text-white hover:bg-emerald-600">BETA</Badge>
          <span className="text-gray-700">
            This is a <span className="font-semibold">CreditBanc</span> product in beta (MVP). We appreciate your feedback.
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            🚀 Transform Your Business Credit Score
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Business
            <span className="text-emerald-600"> Coaching</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get McKinsey-level strategic insights, personalized growth plans, and 24/7 business coaching powered by
            cutting-edge artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <Link href="/auth/login" className="text-sm text-emerald-700 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Credit Banc Finance Academy?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leverage the power of artificial intelligence to accelerate your business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Scale Your Business
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform provides comprehensive business coaching and strategic guidance to help you make
                informed decisions and accelerate growth.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-white/20 rounded-full p-3">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instant Insights</h3>
                    <p className="text-white/80">Get answers in seconds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-white/20 rounded-full p-3">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure & Private</h3>
                    <p className="text-white/80">Your data is protected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">24/7 Available</h3>
                    <p className="text-white/80">Always here when you need us</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Business Leaders</h2>
          <p className="text-xl text-gray-600">See what our customers are saying about CreditBanc AI</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6">"{testimonials[activeTestimonial].content}"</blockquote>
              <div>
                <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[activeTestimonial].role}</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeTestimonial ? "bg-emerald-600" : "bg-gray-300"
                }`}
                aria-label={`Switch testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Start free, then scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-emerald-500" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/auth/sign-up">
                      {plan.name.startsWith("Free") ? "Start Free Trial" : "Get Started"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of business leaders already using AI to accelerate their growth.
          </p>
          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link href="/auth/sign-up">
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-3">
            <Link href="/auth/login" className="text-sm text-emerald-700 hover:underline">
              Prefer to log in?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (kept — optional if you want only the global footer) */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold">CreditBanc AI</span>
              </div>
              <p className="text-gray-400">Empowering businesses with AI-driven strategic insights and coaching.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CreditBanc AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
