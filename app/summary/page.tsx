'use client';

import { useEffect } from 'react';

export default function ExecutiveSummaryPDF() {
  useEffect(() => {
    // Auto-trigger print dialog after a short delay (optional)
    // Uncomment if you want automatic print prompt:
    // setTimeout(() => window.print(), 500);
  }, []);

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @media screen {
          body {
            background: #f8fafc;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Screen-only toolbar */}
        <div className="print:hidden bg-slate-100 border-b border-slate-200 py-3 px-6 flex items-center justify-between sticky top-0 z-50">
          <a href="/" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2">
            ← Back to presentation
          </a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">Print-optimised summary</span>
            <button
              onClick={() => window.print()}
              className="bg-[#5B2D86] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4a2470] transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Main content - A4 optimised */}
        <div className="max-w-[210mm] mx-auto p-8 print:p-0">
          
          {/* Header */}
          <header className="mb-8 pb-6 border-b-2 border-[#5B2D86]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black text-[#5B2D86] mb-1">The Engine Room</h1>
                <p className="text-lg text-slate-600">Executive Summary — Frisson Labs Joint Venture</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Nescot College</p>
                <p>February 2026</p>
              </div>
            </div>
          </header>

          {/* TL;DR Box */}
          <section className="mb-8 bg-[#14B8A6]/10 border-2 border-[#14B8A6] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#14B8A6] mb-4 flex items-center gap-2">
              ⚡ TL;DR — The 30-Second Version
            </h2>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#14B8A6] shrink-0">1.</span>
                <span>Nescot invests <strong>~£200k capital</strong> (not grants) in computing facilities upgrade</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#14B8A6] shrink-0">2.</span>
                <span>Facilities become <strong>The Engine Room</strong> — a professional AI studio where T Level students run <strong className="text-[#14B8A6]">Frisson Labs</strong>, a real software company</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#14B8A6] shrink-0">3.</span>
                <span><strong>Worst case:</strong> Nescot owns industry-standard facilities showcasing best practice (the investment needed anyway)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#14B8A6] shrink-0">4.</span>
                <span><strong>Best case:</strong> Nescot owns 50% of a revenue-generating software company + national recognition as an AI-focused FE pioneer</span>
              </li>
            </ol>
          </section>

          {/* Key Metrics */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Key Metrics</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Investment Required', value: '£200k', sub: 'Indicative capital bid' },
                { label: 'Break-even Point', value: 'Year 3', sub: 'Projected self-sustaining' },
                { label: "Nescot's 50% Share (Yr 5)", value: '£136k+', sub: 'Annual revenue share' },
                { label: 'Student Capacity', value: '30+', sub: 'Target by full operation' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                  <p className="text-xl font-black text-[#5B2D86]">{item.value}</p>
                  <p className="font-medium text-xs text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What It Is */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">What is The Engine Room?</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              <strong>The Engine Room</strong> is Nescot&apos;s innovation initiative that launches <strong className="text-[#14B8A6]">Frisson Labs</strong> — a real commercial software company where T Level students deliver paid client work.
              This <strong>public-private partnership</strong> directly advances <strong>economic development</strong>, <strong>social inclusion</strong>, and <strong>employer engagement</strong> in Surrey.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Students gain <strong>450+ hours of commercial experience</strong> (40% more than T Level placement minimum) whilst Nescot builds a <strong>replicable, nationally-recognised</strong> model.
              The computing department needs this facilities upgrade regardless — <strong className="text-[#14B8A6]">Frisson Labs transforms necessary capital spend into potential revenue</strong>.
            </p>
          </section>

          {/* The Problem We Solve */}
          <section className="mb-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-3">The Problem We Solve</h2>
            <div className="grid grid-cols-3 gap-4 text-sm text-center">
              <div>
                <p className="text-2xl font-black text-red-600">47%</p>
                <p className="text-slate-600">of T Level providers struggle to find quality placements</p>
              </div>
              <div>
                <p className="text-2xl font-black text-red-600">72%</p>
                <p className="text-slate-600">of tech employers say graduates lack commercial skills</p>
              </div>
              <div>
                <p className="text-2xl font-black text-red-600">6 months</p>
                <p className="text-slate-600">average time for new grads to become productive</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">The Engine Room eliminates all three problems simultaneously.</p>
          </section>

          {/* Risk Profile */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Risk Profile: Floor vs Ceiling</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h3 className="font-bold text-red-700 mb-2">🛡️ Floor (Worst Case)</h3>
                <ul className="space-y-1 text-slate-700">
                  <li>✓ Industry-standard T Level facilities</li>
                  <li>✓ Internal recruitment AI (£40-100k savings)</li>
                  <li>✓ Equipment at book value</li>
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <h3 className="font-bold text-amber-700 mb-2">📊 Base (Expected)</h3>
                <ul className="space-y-1 text-slate-700">
                  <li>✓ Everything in Floor, plus...</li>
                  <li>✓ £136k+ annual revenue (Yr 5)</li>
                  <li>✓ 50% equity in business</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h3 className="font-bold text-green-700 mb-2">🚀 Upside (Best Case)</h3>
                <ul className="space-y-1 text-slate-700">
                  <li>✓ Everything in Base, plus...</li>
                  <li>✓ £300k+ returns or exit</li>
                  <li>✓ National AI pioneer status</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Revenue Streams */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">6 Revenue Streams</h2>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { name: 'Project Delivery', range: '£2-15k/project', icon: '🎯' },
                { name: 'Resource Augmentation', range: '£200-400/day', icon: '👥' },
                { name: 'Graduate Placement', range: '10-15% salary', icon: '🎓' },
                { name: 'Adult Upskilling', range: '£500-2k/cohort', icon: '📚' },
                { name: 'Enterprise Training', range: '£5-20k/programme', icon: '🏆' },
                { name: 'Recruitment Savings', range: '£40-100k/yr*', icon: '🔍' },
              ].map((stream, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200">
                  <span className="text-base">{stream.icon}</span>
                  <div>
                    <p className="font-medium text-slate-800 leading-tight">{stream.name}</p>
                    <p className="text-[#14B8A6] font-bold">{stream.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Implementation Timeline</h2>
            <div className="flex items-center justify-between text-xs">
              {[
                { phase: 'Setup', time: 'Q1-Q2 2026', desc: 'Facilities, hiring, pilot clients' },
                { phase: 'Launch', time: 'Sep 2026', desc: 'First T Level cohort' },
                { phase: 'Scale', time: '2027-28', desc: 'Expand clients & capacity' },
                { phase: 'Sustain', time: 'Year 3+', desc: 'Break-even & growth' },
              ].map((item, i) => (
                <div key={i} className="text-center flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#5B2D86] text-white flex items-center justify-center mx-auto mb-1 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="font-bold text-slate-800">{item.phase}</p>
                  <p className="text-[#14B8A6] font-medium">{item.time}</p>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Executive Leadership Standards */}
          <section className="mb-6 bg-slate-900 text-white rounded-xl p-5">
            <h2 className="text-lg font-bold mb-3">Executive Leadership Standards</h2>
            <p className="text-sm text-white/80 mb-3">
              The CEO role demands <strong className="text-white">exceptional technical leadership, educational expertise, and commercial acumen</strong> — operating at the highest levels of both industry and academia to scale innovation while developing the next generation of technologists.
            </p>
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-[#14B8A6]">25+</p>
                <p className="text-white/70">Years Leadership</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-[#14B8A6]">Advanced</p>
                <p className="text-white/70">Degrees</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-[#14B8A6]">Enterprise</p>
                <p className="text-white/70">AI Architecture</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-lg font-bold text-[#14B8A6]">Multiple</p>
                <p className="text-white/70">Exits</p>
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Governance & Structure</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="font-bold text-slate-800 mb-2">🏛️ Joint Venture (50/50)</p>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• Nescot: 50% equity, facilities, students</li>
                  <li>• Frisson Labs: 50% equity, delivery, leadership</li>
                  <li>• Joint steering committee oversight</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="font-bold text-slate-800 mb-2">💰 CEO Compensation</p>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>• Salary capped at £60k until breakeven</li>
                  <li>• Aligned incentives with performance</li>
                  <li>• Skin in the game from day one</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Strategic Alignment */}
          <section className="mb-6 bg-gradient-to-r from-[#5B2D86] to-[#14B8A6] text-white rounded-xl p-5">
            <h2 className="text-lg font-bold mb-3">Strategic Alignment</h2>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-bold mb-1">🤝 Public-Private Partnership</p>
                <p className="text-white/80">Genuine joint venture with shared risk and reward</p>
              </div>
              <div>
                <p className="font-bold mb-1">📊 Economic Development</p>
                <p className="text-white/80">Direct talent pipeline for Surrey&apos;s 62k+ enterprises</p>
              </div>
              <div>
                <p className="font-bold mb-1">❤️ Social Inclusion</p>
                <p className="text-white/80">Paid positions and real skills for students</p>
              </div>
            </div>
          </section>

          {/* FE Precedents */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">FE Innovation Precedents</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="font-bold text-slate-800">Ada College</p>
                <p className="text-slate-600">Industry-sponsored digital sixth form with employer-led curriculum</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="font-bold text-slate-800">Loughborough College</p>
                <p className="text-slate-600">Commercial training arms generating £2M+ annually</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="font-bold text-slate-800">Activate Learning</p>
                <p className="text-slate-600">Student-run enterprises across hospitality and creative sectors</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">No FE college has done this at scale for software — Nescot would be first.</p>
          </section>

          {/* Next Steps */}
          <section className="mb-6 border-2 border-[#5B2D86] rounded-xl p-5">
            <h2 className="text-lg font-bold text-[#5B2D86] mb-3">Recommended Next Steps</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p><strong>1.</strong> Schedule 30-minute deep-dive session</p>
                <p><strong>2.</strong> Review full presentation at <strong className="text-[#14B8A6]">frisson-labs.com/pitch</strong></p>
              </div>
              <div>
                <p><strong>3.</strong> Introduce to Finance, Curriculum, Governors</p>
                <p><strong>4.</strong> Agree timeline for formal proposal</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
            <p><strong>Contact:</strong> hello@frisson-labs.com | frisson-labs.com</p>
            <p className="mt-1">Confidential — For Nescot Executive Team Only</p>
          </footer>

        </div>
      </div>
    </>
  );
}
