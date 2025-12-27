import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Users, Code, Palette, Rocket, Brain, Sparkles, Calendar, Globe, Smartphone, Package, Award, BookOpen, ExternalLink } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function AboutPage() {
  const location = useLocation();

  // Handle hash navigation (e.g., /about#team)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the '#'
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location.hash]);
  return (
    <PageLayout title="About Us - ShalConnects">
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <div 
          className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom right, rgba(21, 102, 65, 0.2), rgba(17, 24, 39, 1), rgba(218, 101, 30, 0.15))'
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(21, 102, 65, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(218, 101, 30, 0.3) 0%, transparent 50%)'
          }}></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm sm:text-base"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 via-green-500 to-orange-500 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Building digital solutions, one project at a time. Still learning. Still building. Still here.
            </p>
          </div>
        </div>

        {/* About Me Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8 sm:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-orange-500 flex items-center justify-center">
                <User size={24} className="sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">About Me</h2>
            </div>

            <div className="space-y-6 sm:space-y-8 text-gray-300 leading-relaxed">
              <p className="text-base sm:text-lg">
                I'm <span className="text-white font-semibold">Shalauddin</span>. I work in IT as a freelancer, but honestly, I'm more of a builder than a "job title." I design WordPress and Shopify sites, handle eCommerce listings, do graphics, social media, and virtual assistant work. Basically, if it lives on the internet and needs to work properly, I've probably touched it.
              </p>

              <p className="text-base sm:text-lg">
                I like understanding why things work—not just how. That's why psychology pulls me in. Same reason astronomy does. Big questions, big patterns, small human problems floating in a massive universe. Keeps me grounded.
              </p>

              <p className="text-base sm:text-lg">
                I'm curious about the future. AI, emerging tech, new systems—stuff that can change how we live and earn. Lately, I've been building AI-powered products instead of just selling my time, because deep down I know hourly work isn't the endgame for me.
              </p>

              <div className="bg-gray-800/50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg my-6 sm:my-8">
                <p className="text-base sm:text-lg italic text-gray-200">
                  I'll be real: I lose motivation fast. I overthink. I get lazy when things feel slow or messy. I start strong, pause, then restart. But I always come back. That part matters.
                </p>
              </div>

              <p className="text-base sm:text-lg">
                I don't want noise. I want leverage. Systems. Products. Something I can build once and improve over time instead of starting from zero every day.
              </p>

              <p className="text-base sm:text-lg font-medium text-white">
                I'm not lost—I'm figuring it out in public, one project at a time.
              </p>

              <p className="text-base sm:text-lg font-medium text-white">
                Still learning. Still building. Still here.
              </p>
            </div>

            {/* Skills/Interests Grid */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                  <h3 className="text-lg sm:text-xl font-semibold">What I Build</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  WordPress & Shopify sites, eCommerce solutions, graphics, and digital products
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
                  <h3 className="text-lg sm:text-xl font-semibold">What Interests Me</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Psychology, astronomy, AI, emerging tech, and systems that create leverage
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                  <h3 className="text-lg sm:text-xl font-semibold">Where I'm Headed</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Building products over selling time. Creating systems that scale and improve over time
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
                  <h3 className="text-lg sm:text-xl font-semibold">My Approach</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Figuring it out in public, one project at a time. Learning, building, iterating
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Work History Timeline Section */}
        <section id="work-history" className="py-12 sm:py-16 md:py-20 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8 sm:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-orange-500 flex items-center justify-center">
                <Calendar size={24} className="sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Work History</h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-green-400 to-orange-500 transform md:-translate-x-1/2"></div>

              {/* Timeline Items */}
              <div className="space-y-8 sm:space-y-12">
                {/* 2024 - Right Side (Index 0) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Date Badge - Left Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pr-8 md:text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2024</span>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Content Card - Right Side */}
                    <div className="md:w-1/2 md:pl-8 ml-8 sm:ml-12 md:ml-0">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-pink-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                            <Globe size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg sm:text-xl font-bold text-white">Launched Be Better You</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">Product</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2">
                              Motivational content platform with daily quotes, blog posts, and resources to inspire personal growth.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">WordPress</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Content Platform</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Another 2024 Event - Left Side (Index 1) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Content Card - Left Side */}
                    <div className="md:w-1/2 md:pr-8 md:text-right ml-8 sm:ml-12 md:ml-0 order-2 md:order-1">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-indigo-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3 flex-row-reverse md:flex-row">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Package size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-row-reverse md:flex-row justify-end md:justify-start">
                              <h3 className="text-lg sm:text-xl font-bold text-white">Launched Balanze</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">SaaS</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2 text-right md:text-left">
                              Full-stack personal finance management platform with multi-currency support and real-time analytics.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">React</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">TypeScript</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Supabase</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Date Badge - Right Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pl-8 order-1 md:order-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2024</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2023 - Right Side (Index 2) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Date Badge - Left Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pr-8 md:text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2023</span>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Content Card - Right Side */}
                    <div className="md:w-1/2 md:pl-8 ml-8 sm:ml-12 md:ml-0">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <Smartphone size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg sm:text-xl font-bold text-white">Screen Time Tracker v10</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">App</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2">
                              Android productivity app with real-time overlay, detailed analytics, and privacy-first local data storage.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Android</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Kotlin</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2023 Learning - Left Side (Index 3) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Content Card - Left Side */}
                    <div className="md:w-1/2 md:pr-8 md:text-right ml-8 sm:ml-12 md:ml-0 order-2 md:order-1">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-orange-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3 flex-row-reverse md:flex-row">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                            <BookOpen size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-row-reverse md:flex-row justify-end md:justify-start">
                              <h3 className="text-lg sm:text-xl font-bold text-white">Mastered React & TypeScript</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Learning</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2 text-right md:text-left">
                              Deep dive into modern React patterns, TypeScript, and advanced state management for building scalable applications.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">React 18</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">TypeScript</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Zustand</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Date Badge - Right Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pl-8 order-1 md:order-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2022 - Right Side (Index 4) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Date Badge - Left Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pr-8 md:text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2022</span>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Content Card - Right Side */}
                    <div className="md:w-1/2 md:pl-8 ml-8 sm:ml-12 md:ml-0">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-green-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Rocket size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg sm:text-xl font-bold text-white">Founded ShalConnects</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Milestone</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2">
                              Started my freelance journey, focusing on WordPress, Shopify, eCommerce, and digital solutions.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">WordPress</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Shopify</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">eCommerce</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2021 - Left Side (Index 5) */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {/* Content Card - Left Side */}
                    <div className="md:w-1/2 md:pr-8 md:text-right ml-8 sm:ml-12 md:ml-0 order-2 md:order-1">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-purple-500/50 transition-all">
                        <div className="flex items-start gap-3 mb-3 flex-row-reverse md:flex-row">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Award size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-row-reverse md:flex-row justify-end md:justify-start">
                              <h3 className="text-lg sm:text-xl font-bold text-white">First Major Client Project</h3>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Project</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-400 mb-2 text-right md:text-left">
                              Completed a full eCommerce platform redesign that increased client sales by 200% in the first quarter.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">WordPress</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">WooCommerce</span>
                              <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">Custom Design</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-4 sm:left-6 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-500 to-orange-500 border-4 border-gray-900 transform md:-translate-x-1/2 z-10"></div>

                    {/* Date Badge - Right Side */}
                    <div className="flex-shrink-0 md:w-1/2 md:pl-8 order-1 md:order-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-green-500/30">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm sm:text-base font-semibold text-white">2021</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-theme mb-2">8+</div>
                <div className="text-xs sm:text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-theme mb-2">150+</div>
                <div className="text-xs sm:text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-theme mb-2">200+</div>
                <div className="text-xs sm:text-sm text-gray-400">Happy Clients</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-theme mb-2">5+</div>
                <div className="text-xs sm:text-sm text-gray-400">Products Launched</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-12 sm:py-16 md:py-20 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8 sm:mb-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                <Users size={24} className="sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">My Team</h2>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 sm:p-8 md:p-10 text-center">
              <p className="text-base sm:text-lg text-gray-400 mb-4">
                Team information coming soon...
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                We're building something great together. Check back soon to meet the team.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Let's Build Something Together
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Whether you need a website, an eCommerce solution, or a custom product, I'm here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all hover:scale-105"
                style={{ 
                  background: 'linear-gradient(to right, #176641, #da651e)',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(21, 102, 65, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <span>Get in Touch</span>
              </Link>
              <Link
                to="/#work"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all hover:scale-105 border-2"
                style={{ 
                  borderColor: '#176641',
                  color: '#4a9d6f'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(21, 102, 65, 0.1)';
                  e.currentTarget.style.color = '#4a9d6f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4a9d6f';
                }}
              >
                <span>View My Work</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

