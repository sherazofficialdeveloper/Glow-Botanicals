// frontend/src/app/(shop)/about/page.jsx
'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Leaf, 
  Heart, 
  Shield, 
  Award, 
  Users, 
  Star,
  ChevronRight,
  Clock,
  CheckCircle,
  Globe,
  Truck,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'Pure botanical ingredients, free from harmful chemicals and synthetic additives.',
      color: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Shield,
      title: 'Dermatologically Tested',
      description: 'Tested by dermatologists to ensure safety and efficacy for all skin types.',
      color: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Heart,
      title: 'Cruelty-Free',
      description: 'Never tested on animals. Certified cruelty-free and vegan-friendly.',
      color: 'from-rose-50 to-rose-100',
      iconColor: 'text-rose-600',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Finest ingredients from around the world for exceptional results.',
      color: 'from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const stats = [
    { number: '15,000+', label: 'Happy Customers', icon: Users },
    { number: '50+', label: 'Products', icon: Sparkles },
    { number: '4.9', label: 'Average Rating', icon: Star },
    { number: '30+', label: 'Countries', icon: Globe },
  ];

  const team = [
    { 
      name: 'Sarah Johnson', 
      role: 'Founder & CEO', 
      image: '👩',
      description: '15+ years in beauty industry, passionate about natural skincare.',
    },
    { 
      name: 'Dr. Emily Chen', 
      role: 'Chief Scientist', 
      image: '👩‍🔬',
      description: 'PhD in Cosmetic Chemistry, leading product innovation.',
    },
    { 
      name: 'Maria Rodriguez', 
      role: 'Product Development', 
      image: '👩‍💻',
      description: 'Expert in botanical formulations and sustainable sourcing.',
    },
    { 
      name: 'James Wilson', 
      role: 'Quality Assurance', 
      image: '🧑‍🔬',
      description: 'Ensuring every product meets the highest quality standards.',
    },
  ];

  const reasons = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On all orders over $35, delivered to your doorstep.',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: RefreshCw,
      title: '30-Day Guarantee',
      description: 'Love your glow or get a full refund. No questions asked.',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Our team is always here to help you glow.',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Shield,
      title: '100% Safe',
      description: 'All products are dermatologically tested and safe.',
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <Container className="py-8 sm:py-12 lg:py-16">
      {/* ============================================================
       1. HERO SECTION
       ============================================================ */}
      <div className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 lg:p-16 text-center mb-16 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d9006c]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white px-5 py-2 rounded-full text-xs font-bold text-[#d9006c] shadow-sm mb-6 border border-rose-100">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Our Story</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Glowing Skin,{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#d9006c] to-[#d4af37] bg-clip-text text-transparent">
              Naturally
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            We believe true beauty comes from nature. Our mission is to bring you 
            the purest botanical skincare that delivers real, visible results.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/products">
              <Button className="flex items-center space-x-2 bg-[#d9006c] hover:bg-[#a80052]">
                <span>Shop Now</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Contact Us</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
       2. STATS SECTION
       ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-[#d9006c]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.number}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* ============================================================
       3. OUR MISSION
       ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center space-x-2 bg-rose-50 px-4 py-1.5 rounded-full text-xs font-bold text-[#d9006c] mb-4 border border-rose-100">
            <Shield className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Pure Beauty,{' '}
            <span className="text-[#d9006c]">Simple Routine</span>
          </h2>
          
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-4">
            Glowly Botanical was born from a simple idea: skincare should be effective, 
            safe, and enjoyable. We combine traditional botanical wisdom with modern 
            science to create products that truly work.
          </p>
          
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            Our <strong className="text-[#d9006c]">3-Minute Glow</strong> routine makes it easy to achieve radiant skin without 
            complicated steps. Just three minutes a day, and you'll see the difference.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>100% Natural Ingredients</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Dermatologically Tested</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Cruelty-Free</span>
            </div>
          </div>
        </div>
        
        <div className="order-1 lg:order-2">
          <div className="relative">
            <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-4 border border-rose-100 shadow-xl">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#d9006c]/10 to-[#d4af37]/10 flex items-center justify-center">
                <img
                  src="/WhatsApp_Image_2025-09-06_at_12.08.36_AM.jpg"
                  alt="About Glowly Botanical"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-about.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-rose-100 max-w-[180px]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#d9006c]" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">3-Minute</p>
                    <p className="text-xs text-gray-500">Glow Routine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
       4. OUR VALUES
       ============================================================ */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-rose-50 px-4 py-1.5 rounded-full text-xs font-bold text-[#d9006c] mb-3 border border-rose-100">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Values</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            What Makes Us <span className="text-[#d9006c]">Different</span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We're committed to creating skincare that's good for you and good for the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 text-center border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${value.iconColor}`} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{value.title}</h4>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
       5. WHY CHOOSE US (NEW SECTION)
       ============================================================ */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-rose-50 px-4 py-1.5 rounded-full text-xs font-bold text-[#d9006c] mb-3 border border-rose-100">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Your <span className="text-[#d9006c]">Trusted</span> Skincare Partner
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We're dedicated to providing you with the best skincare experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${reason.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${reason.iconColor}`} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{reason.title}</h4>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
       6. TEAM SECTION
       ============================================================ */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-rose-50 px-4 py-1.5 rounded-full text-xs font-bold text-[#d9006c] mb-3 border border-rose-100">
            <Users className="w-3.5 h-3.5" />
            <span>Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Meet the <span className="text-[#d9006c]">Experts</span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Passionate professionals dedicated to bringing you the best in botanical skincare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center mx-auto mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">
                {member.image}
              </div>
              <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
              <p className="text-sm text-[#d9006c] font-medium">{member.role}</p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
       7. CTA SECTION - FIXED COLORS
       ============================================================ */}
      <div className="relative bg-gradient-to-r from-[#d9006c] to-[#a80052] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
            Ready to Start Your Glow Journey?
          </h2>
          <p className="text-white/90 mt-3 text-base sm:text-lg">
            Join thousands of happy customers who've discovered the power of pure botanicals.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link href="/products">
              <Button className="bg-white text-[#B10258] hover:bg-gray-100 flex items-center space-x-2 px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all">
                <span>Shop Now</span>
                <Sparkles className="w-4 h-4 text-[#d9006c]" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center space-x-2 px-8 py-3 text-base">
                <span>Contact Us</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>Free Shipping Over $35</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}