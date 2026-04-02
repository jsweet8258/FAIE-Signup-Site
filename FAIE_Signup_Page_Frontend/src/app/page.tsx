'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  GraduationCap,
  Users,
  Target,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  Mail,
  Building2,
  Lightbulb,
  Handshake,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    researchArea: '',
    goals: '',
    preferredDate: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with n8n webhook URL
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured')
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Thank You for Your Interest!',
          description: 'Please look for registration confirmation by email.',
        })
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: '',
          researchArea: '',
          goals: '',
          preferredDate: '',
        })
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Please RSVP directly by email to John.Sweet@oregonstate.edu',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToRegistration = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-open-sans)]">
      {/* OSU Header Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <span />
            {/* OSU wordmark removed — placeholder for official logo if needed */}
            <div className="hidden md:flex items-center gap-4">
              <a href="https://oregonstate.edu" className="text-sm text-gray-600 hover:text-[#D73F09] transition-colors">Oregon State University</a>
              <span className="text-gray-300">|</span>
              <a href="https://research.oregonstate.edu" className="text-sm text-gray-600 hover:text-[#D73F09] transition-colors">Research</a>
            </div>
          </div>
        </div>
      </header>

      {/* Site Header */}
      <nav className="bg-[#D73F09] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-[#D73F09] font-bold text-lg">F</span>
              </div>
              <span className="font-semibold text-lg">FAIE Workshop</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-white/90 hover:text-white transition-colors text-sm">About FAIE</a>
              <a href="#workshop" className="text-white/90 hover:text-white transition-colors text-sm">Workshop Details</a>
              <a href="#who" className="text-white/90 hover:text-white transition-colors text-sm">Who Should Attend</a>
              <Button 
                onClick={scrollToRegistration} 
                className="bg-white text-[#D73F09] hover:bg-gray-100 text-sm font-semibold"
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#f7f5f5' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(135deg, #D73F09 0%, #003B5C 100%)' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#423e3c] px-4 py-2 rounded text-sm font-medium mb-6 shadow-sm">
              <GraduationCap className="w-4 h-4 text-[#D73F09]" />
              Research & Innovation | OSU Faculty
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              Transform Your Research Into{' '}
              <span style={{ color: '#D73F09' }}>
                Industry Impact
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#423e3c' }}>
              Join our FAIE Workshop and learn how AI-powered Industry Engagement Plans 
              can connect your research with the right industry partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={scrollToRegistration}
                className="bg-[#D73F09] hover:bg-[#b83507] text-white text-lg px-8 py-6 shadow-lg"
              >
                Reserve Your Spot <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-gray-300 bg-white"
                style={{ color: '#423e3c' }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { number: '2', label: 'Hours', icon: Clock },
              { number: '10-15', label: 'Company Matches', icon: Building2 },
              { number: '1', label: 'Complete IEP', icon: Target },
              { number: '100%', label: 'Free for Faculty', icon: CheckCircle2 },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md border border-gray-100 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: '#D73F09' }} />
                <div className="text-3xl font-bold" style={{ color: '#212529' }}>{stat.number}</div>
                <div className="text-sm" style={{ color: '#423e3c' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is FAIE Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              What is FAIE?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#423e3c' }}>
              The Faculty Advisor for Industry Engagement (FAIE) is an intelligent system that creates 
              personalized Industry Engagement Plans (IEPs) tailored to your research expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Discover Opportunities',
                description: 'AI analyzes your research to identify industry verticals aligned with your expertise.',
              },
              {
                icon: Building2,
                title: 'Company Matching',
                description: 'Receive 10-15 curated company matches with specific entry points and rationale.',
              },
              {
                icon: Handshake,
                title: 'Outreach Ready',
                description: 'Get professionally crafted outreach messages tailored to each company.',
              },
              {
                icon: TrendingUp,
                title: 'Visibility Strategy',
                description: 'Actionable recommendations for conferences, events, and web presence.',
              },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-lg border border-gray-200 hover:border-[#D73F09] transition-all duration-300 bg-gray-50 hover:bg-white">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow">
                  <item.icon className="w-6 h-6" style={{ color: '#D73F09' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#212529' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#423e3c' }}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* Process Flow */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              The FAIE Workflow
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {[
                { step: '1', label: 'Provide Inputs', desc: 'CV, publications, goals' },
                { step: '2', label: 'Discovery Phase', desc: 'DP.0 → DP.5 analysis' },
                { step: '3', label: 'Core Execution', desc: 'S3.1 → S3.7 outputs' },
                { step: '4', label: 'Your IEP', desc: 'Complete action plan' },
              ].map((item, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center px-6">
                    <div className="w-12 h-12 rounded-full bg-[#D73F09] text-white font-bold text-lg flex items-center justify-center mb-3">
                      {item.step}
                    </div>
                    <div className="font-semibold" style={{ color: '#212529' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: '#423e3c' }}>{item.desc}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden md:block w-6 h-6 text-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Details Section */}
      <section id="workshop" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f7f5f5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              Workshop Details
            </h2>
            <p className="text-xl" style={{ color: '#423e3c' }}>
              An interactive session designed to give you hands-on experience with FAIE
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Logistics */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
                Session Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fee2e2' }}>
                    <Clock className="w-6 h-6" style={{ color: '#D73F09' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#212529' }}>Duration</div>
                    <div style={{ color: '#423e3c' }}>2 hours of interactive learning</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fee2e2' }}>
                    <MapPin className="w-6 h-6" style={{ color: '#D73F09' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#212529' }}>Format</div>
                    <div style={{ color: '#423e3c' }}>Hybrid (In-person at OSU + Virtual via Zoom)</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fee2e2' }}>
                    <Users className="w-6 h-6" style={{ color: '#D73F09' }} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#212529' }}>Class Size</div>
                    <div style={{ color: '#423e3c' }}>Limited to 15 participants for personalized attention</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - What You'll Learn */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
                What You&apos;ll Learn
              </h3>
              
              <ul className="space-y-3">
                {[
                  'How to prepare and organize your inputs for FAIE',
                  'Understanding the Discovery Phase (DP.0–DP.5)',
                  'Interpreting your Industry Engagement Plan outputs',
                  'How to use company matches effectively',
                  'Crafting follow-up strategies with outreach templates',
                  'Implementing visibility recommendations',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4A773C' }} />
                    <span className="text-sm" style={{ color: '#423e3c' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What You Receive */}
          <div className="mt-8 rounded-lg p-8 text-white" style={{ background: 'linear-gradient(135deg, #D73F09 0%, #003B5C 100%)' }}>
            <h3 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: "Georgia, serif" }}>
              What You&apos;ll Receive
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, label: 'Complete IEP' },
                { icon: Building2, label: 'Company Match List' },
                { icon: Mail, label: 'Outreach Templates' },
                { icon: TrendingUp, label: 'Visibility Plan' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <item.icon className="w-10 h-10 mx-auto mb-3 opacity-90" />
                  <div className="font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Attend Section */}
      <section id="who" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              Who Should Attend?
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#423e3c' }}>
              This workshop is designed for OSU faculty at any career stage who want to expand their impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: GraduationCap,
                title: 'Faculty Researchers',
                description: 'At any career stage seeking to translate research into real-world applications.',
              },
              {
                icon: Handshake,
                title: 'Industry Partnership Seekers',
                description: 'Those looking to establish or expand collaborations with industry partners.',
              },
              {
                icon: Lightbulb,
                title: 'Innovation Champions',
                description: 'Researchers with innovations ready for commercialization or technology transfer.',
              },
              {
                icon: TrendingUp,
                title: 'Impact Expanders',
                description: 'Anyone wanting to extend their research impact beyond academic boundaries.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fee2e2' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#D73F09' }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#212529' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: '#423e3c' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f7f5f5' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: '#212529' }}>
              Register for the Workshop
            </h2>
            <p className="text-xl" style={{ color: '#423e3c' }}>
              Secure your spot and take the first step toward industry engagement
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 md:p-12 shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-medium" style={{ color: '#423e3c' }}>
                    First Name <span className="text-[#D73F09]">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium" style={{ color: '#423e3c' }}>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium" style={{ color: '#423e3c' }}>
                  Email <span className="text-[#D73F09]">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane.smith@oregonstate.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="font-medium" style={{ color: '#423e3c' }}>
                  Department / College <span className="text-[#D73F09]">*</span>
                </Label>
                <Input
                  id="department"
                  placeholder="College of Engineering, School of MIME"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchArea" className="font-medium" style={{ color: '#423e3c' }}>
                  Research Area(s)
                </Label>
                <Input
                  id="researchArea"
                  placeholder="Machine learning, renewable energy, materials science..."
                  value={formData.researchArea}
                  onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                  className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredDate" className="font-medium" style={{ color: '#423e3c' }}>
                  Preferred Workshop Date <span className="text-[#D73F09]">*</span>
                </Label>
                <Select
                  value={formData.preferredDate}
                  onValueChange={(value) => setFormData({ ...formData, preferredDate: value })}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09]">
                    <SelectValue placeholder="Select a date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="may-2026">May 2026</SelectItem>
                    <SelectItem value="june-2026">June 2026</SelectItem>
                    <SelectItem value="july-2026">July 2026</SelectItem>
                    <SelectItem value="future">Future</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals" className="font-medium" style={{ color: '#423e3c' }}>
                  What do you hope to gain from this workshop?
                </Label>
                <Textarea
                  id="goals"
                  placeholder="I'm interested in connecting with companies in the semiconductor industry..."
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  rows={4}
                  className="border-gray-300 focus:border-[#D73F09] focus:ring-[#D73F09] resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold"
                style={{ backgroundColor: '#D73F09' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm" style={{ color: '#423e3c' }}>
                By registering, you agree to receive communications about the FAIE workshop.
                Your information will not be shared with third parties.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* OSU Footer */}
      <footer className="mt-auto" style={{ backgroundColor: '#212529' }}>
        {/* Contact Bar */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#D73F09] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <span className="font-semibold text-white text-lg">FAIE</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Helping OSU faculty transform research into industry partnerships.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p className="font-medium text-white">John Sweet</p>
                  <p>AI Strategy & Innovation</p>
                  <p>Division of Research & Innovation</p>
                  <p>Oregon State University</p>
                  <a href="mailto:john.sweet@oregonstate.edu" className="text-[#D73F09] hover:underline flex items-center gap-1">
                    john.sweet@oregonstate.edu <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <div className="space-y-2 text-sm">
                  <a href="https://oregonstate.edu" className="text-gray-400 hover:text-[#D73F09] transition-colors flex items-center gap-1">
                    Oregon State University <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://research.oregonstate.edu" className="text-gray-400 hover:text-[#D73F09] transition-colors flex items-center gap-1">
                    Division of Research & Innovation <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="#about" className="text-gray-400 hover:text-[#D73F09] transition-colors block">About FAIE</a>
                  <a href="#register" className="text-gray-400 hover:text-[#D73F09] transition-colors block">Register for Workshop</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OSU Brand Bar */}
        <div className="bg-[#D73F09]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <a href="https://oregonstate.edu" className="text-white hover:opacity-80 transition-opacity">
                  <span className="font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>OREGON STATE UNIVERSITY</span>
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <a href="https://oregonstate.edu/land-acknowledgement" className="hover:text-white transition-colors">Land Acknowledgement</a>
                <span className="text-white/40">|</span>
                <a href="https://oregonstate.edu/accessibility" className="hover:text-white transition-colors">Accessibility</a>
                <span className="text-white/40">|</span>
                <a href="https://oregonstate.edu/official-web-disclaimer" className="hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Oregon State University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
