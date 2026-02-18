import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Package, Store, Globe, Palette, ArrowLeft, Award, BookOpen } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import {
  aboutHero,
  aboutNarrative,
  aboutHighlight,
  aboutClosing,
  expertiseCards,
  achievements,
  experienceStats,
  education,
  languages,
} from '../data/aboutPage';

const EXPERTISE_ICONS = [Package, Store, Globe, Palette] as const;
const CARD_BORDER = { green: 'hover:border-green-500/50', orange: 'hover:border-orange-500/50' } as const;
const ICON_COLOR = { green: 'text-green-400', orange: 'text-orange-400' } as const;

export default function AboutCvPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [location.hash]);

  return (
    <PageLayout title="Profile (CV) - ShalConnects">
      <PageSection>
        <PageContainer maxWidth="4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>

          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 lg:border-[6px] border-gray-700/50 shadow-2xl group">
              <img
                src="/images/profile.png"
                alt={aboutHero.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  const fb = t.parentElement?.querySelector<HTMLElement>('.fallback-bg');
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div className="fallback-bg hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-green-500/40 via-orange-500/30 to-green-500/40">
                <User className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white opacity-90" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-pulse" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{aboutHero.name}</h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">{aboutHero.title}</p>
            <p className="text-sm text-gray-500 italic mt-2">"{aboutHero.quote}"</p>
          </div>

          <div className="space-y-6 sm:space-y-8 text-gray-300 leading-relaxed">
            {aboutNarrative.map((p, i) => (
              <p key={i} className="text-base sm:text-lg">{p}</p>
            ))}
            <div className="bg-gray-800/50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg my-6 sm:my-8">
              <p className="text-base sm:text-lg italic text-gray-200">{aboutHighlight}</p>
            </div>
            <p className="text-base sm:text-lg font-medium text-white">{aboutClosing}</p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {expertiseCards.map((card, i) => {
              const Icon = EXPERTISE_ICONS[i];
              const border = CARD_BORDER[card.color];
              const iconCls = ICON_COLOR[card.color];
              return (
                <div key={i} className={`bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 transition-all ${border}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${iconCls}`} />
                    <h3 className="text-lg sm:text-xl font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection id="achievements" showBorder>
        <PageContainer maxWidth="4xl">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-orange-500 flex items-center justify-center">
              <Award size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Achievements & Experience</h2>
          </div>
          <ul className="space-y-3 mb-10">
            {achievements.map((a, i) => (
              <li key={i} className="flex gap-2 text-gray-300">
                <span className="text-green-500 mt-1.5">•</span>
                <span className="text-base sm:text-lg">{a}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {experienceStats.map((stat, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-orange-500 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection showBorder>
        <PageContainer maxWidth="4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Education & Languages</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Education</h3>
              <ul className="space-y-2 text-gray-300">
                {education.map((e, i) => (
                  <li key={i}><span className="text-gray-500">{e.period}</span> — {e.desc}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Languages</h3>
              <p className="text-gray-300">{languages.join(', ')}</p>
            </div>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection id="team" showBorder>
        <PageContainer maxWidth="4xl">
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
              <Users size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">My Team</h2>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg text-gray-400 mb-2">Team information coming soon...</p>
            <p className="text-sm text-gray-500">We're building something great together. Check back soon.</p>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection showBorder>
        <PageContainer maxWidth="4xl" className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Let's Build Something Together</h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Whether you need a website, an eCommerce solution, or a custom product, I'm here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#contact" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all hover:scale-105" style={{ background: 'linear-gradient(to right, #176641, #da651e)', color: 'white' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(21, 102, 65, 0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>Get in Touch</Link>
            <Link to="/#work" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border-2 transition-all hover:scale-105" style={{ borderColor: '#176641', color: '#4a9d6f' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(21, 102, 65, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>View My Work</Link>
          </div>
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
