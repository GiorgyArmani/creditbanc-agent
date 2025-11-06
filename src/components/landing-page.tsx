"use client"

import { useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { FAQAccordion } from "@/components/faq-accordion"
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
  MessageSquare,
  Award,
  TrendingDown,
} from "lucide-react"

interface LandingPageProps {
  onShowAuth?: () => void
}

/**
 * Credit Banc Finance Academy — Landing Page with FAQ
 * - Dark mode support
 * - Fixed flexbox layouts
 * - Comprehensive FAQ section optimized for AI search engines
 * - Structured data for SEO
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
      title: "Credit Score Growth",
      description: "Build and improve your business credit score with personalized action plans",
    },
    {
      icon: Award,
      title: "Fundability Enhancement",
      description: "Increase your chances of loan approval with our fundability optimization tools",
    },
    {
      icon: DollarSign,
      title: "Tailored Lending Products",
      description: "Access custom lending solutions designed for your business needs and credit profile",
    },
    {
      icon: BookOpen,
      title: "Financial Education",
      description: "Learn to manage business finances with expert guidance and comprehensive courses",
    },
    {
      icon: BarChart,
      title: "Real-Time Analytics",
      description: "Track your financial health and credit score with live dashboards and alerts",
    },
  ]

  const benefits = [
    "24/7 AI business coaching availability",
    "Personalized credit building strategies",
    "Fundability score improvement tools",
    "Industry-specific financial insights",
    "Competitive analysis and positioning",
    "Financial planning and forecasting",
    "Custom lending product recommendations",
    "Credit score tracking and monitoring",
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content:
        "Credit Banc AI helped us improve our business credit score from 520 to 720 and secure $250K in funding within 6 months!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder, GrowthLab",
      content:
        "The AI coach identified gaps in our fundability we didn't even know existed. Game-changing for our financing strategy.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Director, InnovateCorp",
      content:
        "From understanding credit reports to securing our first business loan - this platform guided us every step of the way.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Free (Beta)",
      price: "$0",
      period: "7 days",
      description: "Perfect for getting started",
      features: [
        "5 AI coaching sessions",
        "Basic credit score analysis",
        "Email support",
        "Core templates access",
        "Fundability assessment",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$300",
      period: "month",
      description: "For growing businesses",
      features: [
        "Unlimited AI coaching",
        "Advanced credit analytics",
        "Priority support",
        "All templates & tools",
        "Custom credit strategies",
        "Team collaboration",
        "Financial education modules",
        "Real-time credit monitoring",
        "Lending product matching",
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
        "Multi-business management",
      ],
      popular: false,
    },
  ]

  // FAQ items optimized for AI search engines
  const faqItems = [
    {
      question: "How does Credit Banc Finance Academy help improve my business credit score?",
      answer:
        "Credit Banc uses AI-powered analysis to identify specific factors affecting your business credit score. Our platform provides personalized action plans including: payment history optimization, credit utilization strategies, vendor credit building, trade line management, and dispute resolution guidance. The AI coach monitors your progress 24/7 and adjusts recommendations based on your improvement trajectory. Most clients see measurable credit score improvements within 60-90 days.",
      category: "Credit Building",
    },
    {
      question: "What is fundability and how do you help me improve it?",
      answer:
        "Fundability is your business's ability to qualify for financing. It's determined by factors like credit score, business structure, documentation, financial history, and industry risk profile. We help improve your fundability by: analyzing your current fundability score, identifying documentation gaps, optimizing your business structure, building vendor credit relationships, improving financial reporting, and matching you with lenders who specialize in your industry and credit profile. Our AI identifies the fastest paths to approval.",
      category: "Fundability",
    },
    {
      question: "How does the AI business coach work?",
      answer:
        "Our AI business coach is available 24/7 and provides McKinsey-level strategic guidance tailored to your business. It analyzes your financial data, credit reports, industry trends, and business goals to deliver personalized recommendations. The coach helps with: credit score improvement strategies, financial planning, cash flow optimization, lending product selection, business growth strategies, and risk management. Think of it as having a CFO and financial advisor combined, always available when you need guidance.",
      category: "AI Coaching",
    },
    {
      question: "What makes your lending products 'tailor-made'?",
      answer:
        "Unlike traditional lending platforms, we don't offer one-size-fits-all solutions. Our AI analyzes your business profile, credit history, industry, revenue patterns, and funding needs to match you with optimal lending products. We work with 50+ lending partners offering term loans, lines of credit, equipment financing, invoice factoring, and SBA loans. The AI considers your approval likelihood, interest rates, terms, and repayment structure to recommend only products you're likely to qualify for, saving you time and protecting your credit from unnecessary inquiries.",
      category: "Lending",
    },
    {
      question: "Can you help if my business credit score is low or non-existent?",
      answer:
        "Absolutely! We specialize in helping businesses build credit from scratch or recover from low scores. For new businesses, we guide you through establishing your business identity, obtaining an EIN, registering with credit bureaus (Dun & Bradstreet, Experian, Equifax), and building initial trade lines. For businesses with low scores, our AI identifies negative factors, creates dispute strategies for errors, develops payment optimization plans, and finds alternative financing options while you rebuild. We've helped businesses go from no credit to fundable in as little as 6 months.",
      category: "Credit Building",
    },
    {
      question: "How quickly can I see results?",
      answer:
        "Results vary by starting point, but here are typical timelines: Credit score improvements: 60-90 days for measurable gains, Fundability optimization: 30-45 days for documentation and structure improvements, First lending approval: 90-120 days for businesses building from scratch, 30-60 days for businesses with existing credit. Our AI provides milestone tracking so you can see progress in real-time. The free 7-day trial gives you a complete fundability assessment and 90-day improvement roadmap.",
      category: "Getting Started",
    },
    {
      question: "What financial education resources do you provide?",
      answer:
        "Our platform includes comprehensive financial education covering: business credit fundamentals, fundability optimization, financial statement analysis, cash flow management, lending options and terms, business structure optimization, tax strategy basics, and scaling financing strategies. Content is delivered through interactive modules, video tutorials, case studies, and real-world examples. The AI coach personalizes your learning path based on your knowledge gaps and business stage.",
      category: "Education",
    },
    {
      question: "Do I need to connect my bank accounts or share sensitive financial data?",
      answer:
        "You control what data you share. For basic credit building guidance, you only need to provide business information and credit reports. For advanced analytics and personalized lending recommendations, connecting financial accounts provides better insights. All data is encrypted with bank-level security (256-bit SSL), and we never sell your information. You can disconnect accounts anytime. We're SOC 2 Type II certified and fully compliant with financial data protection regulations.",
      category: "Security",
    },
    {
      question: "How is this different from just working with a bank or credit repair company?",
      answer:
        "Banks focus on whether to approve you today. Credit repair companies focus only on disputes. Credit Banc provides a complete ecosystem: AI-powered coaching available 24/7 (not just business hours), comprehensive fundability improvement (not just score disputes), lending product matching across 50+ partners (not just one bank), financial education tailored to your needs, real-time monitoring and alerts, and strategic business growth guidance. It's like having a financial advisor, credit expert, and business consultant in one platform.",
      category: "Platform Value",
    },
    {
      question: "What's included in the free 7-day trial?",
      answer:
        "The free trial includes: complete fundability assessment, business credit score analysis, 5 AI coaching sessions, personalized 90-day credit improvement roadmap, access to financial education modules, lending product recommendations, and email support. No credit card required to start. After 7 days, you can choose to upgrade to Professional or Enterprise, or continue with limited free features. We want you to experience the platform's value before committing.",
      category: "Getting Started",
    },
    {
      question: "Can I use this for multiple businesses?",
      answer:
        "Yes! The Professional plan supports one business, while the Enterprise plan includes multi-business management. This is ideal for entrepreneurs managing multiple entities, CPAs serving clients, or business consultants. Each business gets its own dashboard, credit tracking, and AI coaching. The Enterprise plan also includes consolidated reporting across all businesses and advanced team collaboration features.",
      category: "Plans & Pricing",
    },
    {
      question: "Will using your platform affect my credit score?",
      answer:
        "No, using our platform does not impact your credit score. We use soft inquiries for credit analysis, which don't affect scores. When you're ready to apply for actual lending products, those applications may result in hard inquiries, but our AI pre-qualifies you to minimize unnecessary applications. We're transparent about when a hard inquiry will occur. Our credit building strategies actively improve your score through positive reporting, payment optimization, and credit utilization management.",
      category: "Credit Building",
    },
  ]

  // Structured data for search engines (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Credit Banc Finance Academy",
    description:
      "AI-powered business credit building and financial education platform helping entrepreneurs improve fundability and access tailored lending products",
    url: "https://creditbanc.io",
    logo: "public/header-logo.png",
    sameAs: [
      "https://www.linkedin.com/company/credit-banc",
      "https://facebook.com/creditbanc",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1247",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "500",
      offerCount: "3",
    },
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <Script id="faq-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <Script id="organization-structured-data" type="application/ld+json">
        {JSON.stringify(organizationData)}
      </Script>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="falogo.png" alt="Logo" className="h-20 w-100" />
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
                This is a <span className="font-semibold">Credit Banc</span> product in beta (MVP). We appreciate your
                feedback.
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
              🚀 Build Business Credit & Improve Fundability
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              AI-Powered Business Credit
              <span className="text-emerald-600 dark:text-emerald-400"> Building</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Improve your business credit score, enhance fundability, and access tailored lending products with 24/7 AI
              coaching. Get McKinsey-level guidance powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-3 w-full sm:w-auto" asChild>
                <Link href="/auth/sign-up">
                  Start Free 7-Day Trial
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
              Everything You Need to Build Business Credit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform helps you improve credit scores, enhance fundability, and access the right
              financing for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border dark:border-gray-700 dark:bg-gray-800/50"
              >
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
                  Transform Your Business Finances
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Our comprehensive platform combines AI coaching, financial education, and strategic credit building to
                  help you secure the funding your business needs.
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
                        <h3 className="font-semibold text-lg mb-1">Instant Credit Analysis</h3>
                        <p className="text-white/90">
                          Get comprehensive credit reports and fundability scores in seconds
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Bank-Level Security</h3>
                        <p className="text-white/90">
                          Your financial data is protected with 256-bit encryption and SOC 2 compliance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">24/7 AI Guidance</h3>
                        <p className="text-white/90">
                          Access expert financial coaching anytime, day or night, from anywhere
                        </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how we've helped businesses improve credit and secure funding
            </p>
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

          {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Build Your Business Credit?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of entrepreneurs using AI to improve credit scores, enhance fundability, and secure the
              funding they need to grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-3 w-full sm:w-auto" asChild>
                <Link href="/auth/sign-up">
                  Start Your Free 7-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-400 hover:underline">
                Prefer to log in?
              </Link>
            </div>
          </div>
        </section>


        {/* FAQ Section - NEW! */}
        <section className="bg-gray-50 dark:bg-gray-800/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <MessageSquare className="h-4 w-4 mr-2 inline" />
                  Frequently Asked Questions
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Everything You Need to Know
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Learn how we help you build credit, improve fundability, and access the right financing
                </p>
              </div>

              <FAQAccordion items={faqItems} />

              <div className="mt-12 text-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl border dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our team is here to help you understand how we can transform your business finances.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link href="/auth/sign-up">Start Free Trial</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free, then scale as your credit and business grow
            </p>
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
        </section> */}

      
        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <img src="falogo.png" alt="Logo" className="h-20 w-100" />
                </div>
                <p className="text-gray-300 text-sm">
                  Empowering businesses with AI-driven credit building, financial education, and tailored lending
                  solutions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="#features" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Credit Banc Finance Academy. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}