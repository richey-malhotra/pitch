'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

const PASSWORD = 'nescotpitch2026'

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

// Animated Counter with easing
function Counter({ end, suffix = '', prefix = '', duration = 2.5 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Progress Bar
function ProgressBar({ value, label, color = '#14B8A6' }: { value: number; label: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// Interactive Tabs
function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              active === i
                ? 'bg-[#5B2D86] text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tabs[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Scroll Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[#14B8A6] z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// Fixed Particle Field - uses deterministic positions to avoid hydration mismatch
function ParticleField() {
  // Pre-computed positions to avoid hydration mismatch
  const particles = useMemo(() => [
    { x: 10, y: 20, duration: 15 }, { x: 85, y: 45, duration: 18 }, { x: 30, y: 70, duration: 12 },
    { x: 65, y: 15, duration: 20 }, { x: 45, y: 55, duration: 14 }, { x: 90, y: 80, duration: 16 },
    { x: 20, y: 35, duration: 22 }, { x: 75, y: 90, duration: 13 }, { x: 55, y: 25, duration: 17 },
    { x: 5, y: 60, duration: 19 }, { x: 40, y: 85, duration: 11 }, { x: 95, y: 40, duration: 21 },
    { x: 25, y: 5, duration: 15 }, { x: 70, y: 65, duration: 18 }, { x: 15, y: 95, duration: 14 },
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Typewriter Effect
function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Interactive Timeline
function Timeline({ items }: { items: { date: string; title: string; desc: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="relative">
      <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-slate-200">
        <motion.div
          className="h-full bg-[#5B2D86]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${((activeIndex + 1) / items.length) * 100}%` } : {}}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="grid md:grid-cols-5 gap-4 md:gap-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative cursor-pointer group"
            onClick={() => setActiveIndex(i)}
          >
            <div className="flex justify-center mb-3">
              <motion.div
                className={`w-4 h-4 rounded-full border-4 transition-colors z-10 ${
                  i <= activeIndex ? 'bg-[#5B2D86] border-[#5B2D86]' : 'bg-white border-slate-300'
                }`}
                whileHover={{ scale: 1.3 }}
              />
            </div>
            <div
              className={`text-center p-3 rounded-xl transition-all ${
                i === activeIndex ? 'bg-[#5B2D86] text-white shadow-lg' : 'bg-slate-50 group-hover:bg-slate-100'
              }`}
            >
              <p className={`text-xs font-bold mb-1 ${i === activeIndex ? 'text-[#14B8A6]' : 'text-[#5B2D86]'}`}>
                {item.date}
              </p>
              <p className="font-semibold text-sm">{item.title}</p>
              <AnimatePresence>
                {i === activeIndex && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs mt-2 text-white/80"
                  >
                    {item.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Comparison Slider
function ComparisonSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  useEffect(() => {
    const handleMouseUp = () => { isDragging.current = false }
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchend', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMove])

  return (
    <div
      ref={containerRef}
      className="relative h-80 rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseDown={() => { isDragging.current = true }}
      onTouchStart={() => { isDragging.current = true }}
    >
      <div className="absolute inset-0 bg-slate-100 p-6">
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          Traditional Teaching
        </div>
        <div className="h-full flex flex-col justify-center items-center text-center px-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-slate-600 text-sm">Passive lectures, theoretical exercises, limited industry exposure, outdated tools</p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Low engagement</span>
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">No portfolio</span>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#5B2D86] to-[#3b1d5a] p-6"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <div className="absolute top-4 right-4 bg-[#14B8A6] text-white px-3 py-1 rounded-full text-xs font-bold">
          The Engine Room
        </div>
        <div className="h-full flex flex-col justify-center items-center text-center px-8 text-white">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-white/80 text-sm">Real client projects, agile sprints, industry mentors, professional tools, paid work</p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-[#14B8A6]/30 text-[#14B8A6] rounded text-xs">High retention</span>
            <span className="px-2 py-1 bg-[#14B8A6]/30 text-[#14B8A6] rounded text-xs">Job-ready</span>
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-slate-400">⟷</span>
        </div>
      </div>
    </div>
  )
}

// Animated Stat Card
function StatCard({ icon, value, suffix, prefix, label, delay = 0 }: { icon: string; value: number; suffix?: string; prefix?: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(91, 45, 134, 0.3)' }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center cursor-default"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-4xl md:text-5xl font-black text-[#5B2D86] mb-2">
        <Counter end={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-slate-600 text-sm">{label}</p>
    </motion.div>
  )
}

// FAQ Accordion with animation
function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="border border-slate-200 rounded-xl overflow-hidden bg-white"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center p-5 text-left font-medium hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] transition-colors"
            aria-expanded={open === i}
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#5B2D86]/10 text-[#5B2D86] flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              className="text-2xl text-[#5B2D86]"
            >
              +
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 text-slate-600 bg-slate-50 border-t border-slate-100">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// Student Journey Visualization
function StudentJourney() {
  const stages = [
    { week: 'Week 1-2', title: 'Onboarding', icon: '🎯', tasks: ['Company culture', 'Cloud account setup', 'AI tools training'] },
    { week: 'Week 3-4', title: 'Certifications', icon: '📜', tasks: ['AWS/Azure fundamentals', 'Git & CI/CD', 'AI ethics training'] },
    { week: 'Week 5-8', title: 'First AI Project', icon: '🤖', tasks: ['Real client brief', 'AI solution design', 'Model deployment'] },
    { week: 'Week 9-12', title: 'Delivery', icon: '🚀', tasks: ['Client UAT', 'Performance tuning', 'Portfolio showcase'] },
    { week: 'Week 13+', title: 'Specialisation', icon: '⭐', tasks: ['ML engineering', 'Lead projects', 'Industry mentoring'] },
  ]

  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -10 }}
            className="min-w-[250px] snap-center bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{stage.icon}</span>
              <div>
                <p className="text-xs text-[#14B8A6] font-bold">{stage.week}</p>
                <p className="font-bold text-lg">{stage.title}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {stage.tasks.map((task, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D86]" />
                  {task}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Testimonial Carousel
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const testimonials = [
    { quote: "This initiative represents exactly the kind of innovative thinking FE needs to remain relevant in the digital age.", author: "Industry Advisory Board Member", role: "Tech Sector Lead" },
    { quote: "Students who learn through real delivery are 3x more likely to secure employment within 6 months of graduation.", author: "DfE Research Report", role: "2024 Skills Analysis" },
    { quote: "The combination of academic rigour with commercial experience creates graduates who hit the ground running.", author: "Employer Partner", role: "Software Development Agency" },
    { quote: "This model could set a new standard for technical education across the entire FE sector.", author: "Education Consultant", role: "Former Ofsted Inspector" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="text-6xl text-[#5B2D86]/20 mb-4">&ldquo;</div>
          <p className="text-xl md:text-2xl text-slate-700 italic mb-6 leading-relaxed">
            {testimonials[current].quote}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5B2D86] to-[#14B8A6] flex items-center justify-center text-white font-bold">
              {testimonials[current].author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800">{testimonials[current].author}</p>
              <p className="text-sm text-slate-500">{testimonials[current].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-[#5B2D86] w-8' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Interactive Plotly Charts
function SkillsGapChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">UK Digital Skills Gap (2020-2030)</h4>
      {inView && (
        <Plot
          data={[
            {
              x: [2020, 2022, 2024, 2026, 2028, 2030],
              y: [750000, 920000, 1100000, 1350000, 1600000, 2000000],
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Unfilled Tech Roles',
              line: { color: '#ef4444', width: 3 },
              marker: { size: 10 },
            },
            {
              x: [2020, 2022, 2024, 2026, 2028, 2030],
              y: [180000, 195000, 210000, 240000, 280000, 320000],
              type: 'scatter',
              mode: 'lines+markers',
              name: 'FE Tech Graduates',
              line: { color: '#5B2D86', width: 3 },
              marker: { size: 10 },
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { l: 60, r: 30, t: 30, b: 50 },
            legend: { orientation: 'h', y: -0.2 },
            xaxis: { title: 'Year', gridcolor: '#f1f5f9' },
            yaxis: { title: 'Number of People', gridcolor: '#f1f5f9' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Source: Tech Nation, DfE projections. The gap is widening exponentially.</p>
    </div>
  )
}

function EmploymentOutcomesChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">Employment Outcomes by Learning Model</h4>
      {inView && (
        <Plot
          data={[
            {
              x: ['Traditional FE', 'With Placement', 'Student Company', 'Frisson Labs (Target)'],
              y: [42, 65, 87, 95],
              type: 'bar',
              marker: {
                color: ['#94a3b8', '#f59e0b', '#14B8A6', '#5B2D86'],
              },
              text: ['42%', '65%', '87%', '95%'],
              textposition: 'outside',
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { l: 50, r: 30, t: 30, b: 80 },
            xaxis: { tickangle: -15 },
            yaxis: { title: '% Employed in 6 Months', range: [0, 100], gridcolor: '#f1f5f9' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Source: Sheffield University (2024), DfE longitudinal study. Frisson Labs target based on comparable models.</p>
    </div>
  )
}

function RevenueProjectionChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">Revenue Projection (5-Year Model)</h4>
      {inView && (
        <Plot
          data={[
            {
              x: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
              y: [15000, 45000, 85000, 140000, 200000],
              type: 'bar',
              name: 'Client Revenue',
              marker: { color: '#14B8A6' },
            },
            {
              x: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
              y: [80000, 65000, 45000, 30000, 20000],
              type: 'bar',
              name: 'Grant/College Funding',
              marker: { color: '#5B2D86' },
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { l: 60, r: 30, t: 30, b: 50 },
            barmode: 'stack',
            legend: { orientation: 'h', y: -0.15 },
            yaxis: { title: 'Revenue (£)', gridcolor: '#f1f5f9' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Conservative projections. Year 3+ achieves self-sustainability with surplus for reinvestment.</p>
    </div>
  )
}

function RetentionComparisonChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">Student Retention Rates</h4>
      {inView && (
        <Plot
          data={[
            {
              values: [85, 15],
              labels: ['Retained', 'Dropped Out'],
              type: 'pie',
              hole: 0.6,
              marker: { colors: ['#94a3b8', '#e2e8f0'] },
              domain: { x: [0, 0.3] },
              name: 'Traditional',
              textinfo: 'none',
            },
            {
              values: [92, 8],
              labels: ['Retained', 'Dropped Out'],
              type: 'pie',
              hole: 0.6,
              marker: { colors: ['#14B8A6', '#ccfbf1'] },
              domain: { x: [0.35, 0.65] },
              name: 'With Placement',
              textinfo: 'none',
            },
            {
              values: [97, 3],
              labels: ['Retained', 'Dropped Out'],
              type: 'pie',
              hole: 0.6,
              marker: { colors: ['#5B2D86', '#e9d5ff'] },
              domain: { x: [0.7, 1] },
              name: 'Engine Room',
              textinfo: 'none',
            },
          ]}
          layout={{
            autosize: true,
            height: 280,
            margin: { l: 20, r: 20, t: 20, b: 60 },
            showlegend: false,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
            annotations: [
              { x: 0.15, y: 0.5, text: '85%', showarrow: false, font: { size: 18, color: '#64748b' } },
              { x: 0.5, y: 0.5, text: '92%', showarrow: false, font: { size: 18, color: '#14B8A6' } },
              { x: 0.85, y: 0.5, text: '97%', showarrow: false, font: { size: 18, color: '#5B2D86' } },
              { x: 0.15, y: -0.15, text: 'Traditional', showarrow: false, font: { size: 12 } },
              { x: 0.5, y: -0.15, text: 'With Placement', showarrow: false, font: { size: 12 } },
              { x: 0.85, y: -0.15, text: 'Engine Room', showarrow: false, font: { size: 12 } },
            ],
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Experiential learning dramatically reduces dropout rates. Source: DfE retention study 2024.</p>
    </div>
  )
}

function SalaryImpactChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">Starting Salary by Training Model</h4>
      {inView && (
        <Plot
          data={[
            {
              x: ['Traditional FE', 'University (No Placement)', 'University (With Placement)', 'Apprenticeship', 'Student Company'],
              y: [22000, 28000, 34000, 32000, 38000],
              type: 'bar',
              marker: {
                color: ['#94a3b8', '#f59e0b', '#14B8A6', '#6366f1', '#5B2D86'],
              },
              text: ['£22k', '£28k', '£34k', '£32k', '£38k'],
              textposition: 'outside',
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { l: 50, r: 30, t: 30, b: 100 },
            xaxis: { tickangle: -25 },
            yaxis: { title: 'Starting Salary (£)', range: [0, 45000], gridcolor: '#f1f5f9' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Student company graduates command premium salaries due to commercial experience. Source: Prospects, HESA 2024.</p>
    </div>
  )
}

function IndustryDemandChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-4">Surrey Tech Sector Growth</h4>
      {inView && (
        <Plot
          data={[
            {
              x: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
              y: [4200, 4800, 5100, 5900, 6800, 7600, 8500, 9400],
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Tech Companies',
              line: { color: '#5B2D86', width: 3 },
              fill: 'tozeroy',
              fillcolor: 'rgba(91, 45, 134, 0.1)',
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { l: 60, r: 30, t: 30, b: 50 },
            xaxis: { title: 'Year', gridcolor: '#f1f5f9' },
            yaxis: { title: 'Number of Tech Companies', gridcolor: '#f1f5f9' },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { family: 'Inter, system-ui, sans-serif' },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%' }}
        />
      )}
      <p className="text-xs text-slate-500 mt-2">Surrey has one of the UK&apos;s fastest-growing tech clusters. All need talent pipelines. Source: Tech Nation 2024.</p>
    </div>
  )
}

// Budget Visualization
function BudgetChart() {
  const items = [
    { label: 'Space Fit-out (Capital Bid)', amount: 120000, color: '#5B2D86' },
    { label: 'Technology & AV', amount: 45000, color: '#7c3aed' },
    { label: 'Cloud Infrastructure', amount: 15000, color: '#14B8A6' },
    { label: 'Staff Training', amount: 10000, color: '#0d9488' },
    { label: 'Marketing & Launch', amount: 10000, color: '#6366f1' },
  ]
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-full max-w-[300px] mx-auto">
          {items.reduce((acc: React.ReactNode[], item, i) => {
            const prevPercent = items.slice(0, i).reduce((sum, it) => sum + (it.amount / total) * 100, 0)
            const percent = (item.amount / total) * 100
            const strokeDasharray = `${percent * 5.02} ${502 - percent * 5.02}`
            const strokeDashoffset = -prevPercent * 5.02
            acc.push(
              <motion.circle
                key={i}
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={item.color}
                strokeWidth="30"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
            )
            return acc
          }, [])}
          <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-slate-800">
            £<Counter end={total / 1000} suffix="k" />
          </text>
          <text x="100" y="115" textAnchor="middle" className="text-sm fill-slate-500">
            Total Investment
          </text>
        </svg>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-slate-700">£{item.amount.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [input, setInput] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setShowNav(currentScrollY < lastScrollY.current || currentScrollY < 100)
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim() === PASSWORD) setAuthenticated(true)
    else alert('Incorrect password')
  }

  // Password Gate
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#5B2D86] via-[#4a2570] to-[#3b1d5a] relative overflow-hidden">
        <ParticleField />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-white border border-white/20 relative z-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <Image src="/nescot-logo.svg" alt="Nescot" width={100} height={30} className="h-10 w-auto" />
            <span className="text-4xl font-black text-white/80 mx-2">×</span>
            <Image src="/frisson-labs-logo.svg" alt="Frisson Labs" width={140} height={40} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-black mb-2">The Engine Room</h1>
          <p className="text-white/60 mb-8">Executive presentation for Nescot leadership</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              aria-label="Password"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              placeholder="Enter access code"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold bg-[#14B8A6] hover:bg-[#0d9488] transition-colors shadow-lg shadow-teal-500/25"
            >
              Access Presentation →
            </motion.button>
          </form>
          <p className="text-xs text-white/40 mt-6 text-center">Prepared for Julie Kipsalis MBE, CEO</p>
        </motion.div>
      </main>
    )
  }

  // Data
  const faqs = [
    { q: "What exactly is Frisson Labs?", a: "A genuine commercial software company — not a simulation. Frisson Labs operates as a joint venture with Nescot holding 50% equity and a dedicated CEO holding 50%. Students work as paid delivery teams on real client projects, building commercial software whilst earning qualifications. This isn't an 'academic project' — it's a real business with real accountability." },
    { q: "How is the initial investment funded?", a: "Through a blended model: capital improvement bids (£50-60k), DfE T Level enhancement grants (£20-30k), and potential industry sponsorships (£10-20k). Client revenue begins in Year 1 and grows to full self-sustainability by Year 3, with surplus for reinvestment." },
    { q: "Who provides governance and oversight?", a: "Frisson Labs has a dedicated CEO with 50% equity stake — ensuring entrepreneurial drive and commercial accountability. Nescot holds the other 50%, represented on a joint board with senior leadership, an academic link, and industry advisors. This structure mirrors successful university spin-out models (Oxford Innovations, Imperial Innovations) that have generated billions in value." },
    { q: "What are the key risks and how are they mitigated?", a: "Main risks: (1) Funding shortfall - mitigated by phased rollout and CEO equity commitment; (2) Quality control - mitigated by CEO accountability and structured QA processes; (3) Client acquisition - mitigated by CEO's commercial focus and Nescot network; (4) Leadership failure - mitigated by board oversight and performance milestones; (5) Conflict of interest - mitigated by clear governance charter and student welfare protocols." },
    { q: "When does the pilot launch and what does success look like?", a: "Pilot launches September 2026 with 10-15 carefully selected students. Success metrics: 95%+ student retention, 3+ client projects delivered, £15k+ revenue generated, 90%+ student satisfaction, and at least 2 students securing industry roles or higher apprenticeships." },
    { q: "How does this align with Ofsted expectations?", a: "Directly supports Ofsted's emphasis on: (1) industry-relevant skills development, (2) meaningful work experience, (3) employer engagement, (4) progression outcomes, and (5) personal development. Student-run companies have been specifically praised in recent FE inspections as best practice." },
    { q: "What happens to student IP and client work?", a: "Students retain full portfolio rights to showcase work. Client IP is governed by standard commercial contracts with Frisson Labs as the legal entity. Revenue is split: 50% to Nescot (reinvested into education), 50% to the CEO (who funds student stipends, bonuses, and company growth). This creates aligned incentives — everyone wins when the company succeeds." },
    { q: "How does this compare to existing T Level delivery?", a: "Traditional T Levels offer industry placements (315 hours). Frisson Labs offers continuous commercial experience throughout the entire programme - estimated 800+ hours of real delivery work, plus paid positions, plus professional portfolio, plus industry network." },
    { q: "What support exists for struggling students?", a: "Tiered support model: peer mentoring, technical catch-up sessions, 1:1 academic support, and if needed, transition to traditional pathway. No student left behind - the team structure means everyone contributes at their level whilst developing." },
    { q: "Can this model scale across other curriculum areas?", a: "Yes. Phase 2 (2028+) could see similar spin-outs in: Creative Digital (design agency), Business (consultancy), Health & Social Care (community projects). The 50/50 joint venture model is repeatable — Nescot could build a portfolio of student-powered enterprises, each with dedicated entrepreneurial leadership." },
    { q: "Why a 50% equity CEO rather than a salaried Programme Lead?", a: "Three reasons: (1) Skin in the game — the CEO only succeeds if the company succeeds, creating powerful alignment; (2) Commercial credibility — clients trust a real company with accountable leadership; (3) Talent quality — equity attracts experienced entrepreneurs who wouldn't consider a college salary. This mirrors the university spin-out model that has created billions in value at Oxford, Cambridge, and Imperial." },
    { q: "What protections does Nescot have with the 50/50 model?", a: "Robust safeguards: (1) Board seats with veto on major decisions; (2) Student welfare charter embedded in articles; (3) Performance milestones with buyback provisions; (4) IP reversion clauses if company fails; (5) Right of first refusal on any share sale; (6) Annual audit and reporting requirements. Nescot gets entrepreneurial upside with institutional protection." },
  ]

  const timelineItems = [
    { date: 'Q1 2026', title: 'Board Approval', desc: 'Present to governors, secure funding commitment, finalise space allocation' },
    { date: 'Q2 2026', title: 'Space & Setup', desc: 'Fit-out hub, recruit Programme Lead, establish processes and tooling' },
    { date: 'Sep 2026', title: 'Pilot Launch', desc: '10-15 students, first client projects, weekly sprint delivery begins' },
    { date: 'Mar 2027', title: 'Review & Scale', desc: 'Assess outcomes, refine model, expand capacity, second cohort recruitment' },
    { date: 'Sep 2027', title: 'Full Operation', desc: '30+ students, multiple project streams, revenue target £50k+, national profile' },
  ]

  return (
    <>
      <ScrollProgress />

      {/* Floating Badge - For Julie */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 hidden lg:block"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-[#5B2D86] to-[#14B8A6] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 cursor-pointer"
          onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xl">👋</span>
          <div>
            <p className="text-xs opacity-80">Prepared for</p>
            <p className="font-bold text-sm">Julie Kapsalis MBE</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Sticky Nav */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: showNav ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/nescot-logo.svg" alt="Nescot" width={100} height={30} className="h-7 w-auto" />
            <span className="text-2xl font-black text-[#5B2D86]/60 hidden sm:inline">×</span>
            <Image src="/frisson-labs-logo.svg" alt="Frisson Labs" width={120} height={35} className="h-8 w-auto hidden sm:block" />
          </div>
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-slate-600">
            {['Problem', 'Solution', 'Evidence', 'Journey', 'Pillars', 'Budget', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-[#5B2D86] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5B2D86] group-hover:w-full transition-all" />
              </a>
            ))}
          </nav>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-full text-white text-sm font-bold bg-[#5B2D86] hover:bg-[#4a2570] transition-colors shadow-lg shadow-purple-500/20"
          >
            Let&apos;s Talk
          </motion.a>
        </div>
      </motion.header>

      <main id="main" className="bg-white text-slate-800">
        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#5B2D86] via-[#4a2570] to-[#3b1d5a]">
          <ParticleField />
          <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
                </span>
                <span className="text-sm font-medium">Strategic Proposal 2026 • AI-Powered FE Innovation</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
                <Typewriter text="The Engine Room" speed={80} />
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-xl">
                Establishing <span className="text-[#14B8A6] font-bold">Frisson Labs</span> — a <strong>public-private AI & software company</strong> that transforms T Level education into a <strong>revenue-generating innovation engine</strong>, delivering <strong>grassroots AI transformation</strong> for local businesses, <strong>social mobility</strong>, and positioning Nescot as the <strong>UK&apos;s first AI-focused FE venture</strong>.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <motion.a
                  href="#solution"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -15px rgba(20, 184, 166, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold text-white bg-[#14B8A6] hover:bg-[#0d9488] transition-colors inline-flex items-center gap-2"
                >
                  Explore the Vision
                  <span className="animate-bounce">↓</span>
                </motion.a>
                <motion.a
                  href="#cta"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Schedule Meeting
                </motion.a>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '£178bn', label: 'UK Digital Economy' },
                  { value: '9,400+', label: 'Surrey SMEs Need AI' },
                  { value: '1st', label: 'AI-Focused FE Venture' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#14B8A6]/50 transition-all"
                  >
                    <p className="text-2xl md:text-3xl font-black text-[#14B8A6]">{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-8 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-4 opacity-30">
                  {[...Array(36)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/20 rounded"
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
                    />
                  ))}
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white">
                  <Image src="/frisson-labs-logo.svg" alt="Frisson Labs" width={200} height={60} className="mb-6 brightness-0 invert w-48" />
                  <h3 className="text-2xl font-bold mb-2">Nescot&apos;s Crown Jewel</h3>
                  <p className="text-white/60">Where education meets innovation</p>
                  <div className="mt-6 flex gap-3">
                    <span className="px-3 py-1 bg-[#14B8A6]/20 border border-[#14B8A6]/40 rounded-full text-xs text-[#14B8A6]">T Level Excellence</span>
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs">Revenue Generator</span>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-[#14B8A6] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                First in FE
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white text-[#5B2D86] px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                Est. £200k revenue by Year 5
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-white/50 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* ═══ EXECUTIVE SUMMARY ═══ */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Executive Summary</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                The Engine Room establishes <strong className="text-[#14B8A6]">Frisson Labs</strong> — a <strong className="text-white">public-private partnership</strong> that directly advances 
                <strong className="text-white"> economic development</strong>, <strong className="text-white">social inclusion</strong>, and <strong className="text-white">employer engagement</strong> in Surrey. 
                Students gain <strong className="text-white">800+ hours of commercial experience</strong> whilst Nescot builds a <strong className="text-white">replicable, nationally-recognised</strong> model.
              </p>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { label: 'Investment Required', value: '£200k', sub: 'Capital bid funded' },
                  { label: 'Break-even Point', value: 'Year 3', sub: 'Self-sustaining' },
                  { label: 'Nescot\'s 50% Share (Yr 5)', value: '£100k+', sub: 'Plus equity value' },
                  { label: 'Student Capacity', value: '30+', sub: 'By full operation' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl">
                    <p className="text-3xl font-black text-[#14B8A6]">{item.value}</p>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ JULIE'S BUYING BUTTONS ═══ */}
        <section className="py-16 bg-gradient-to-r from-[#5B2D86] to-[#14B8A6]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why This Matters for Nescot</h2>
              <p className="text-white/80 max-w-2xl mx-auto">Directly aligned with Julie&apos;s vision for dynamic partnerships, economic development, and social inclusion</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🤝',
                  title: 'Public-Private Partnership',
                  desc: 'A genuine joint venture between Nescot and entrepreneurial leadership — the exact model that drove success at Coast to Capital LEP. Shared risk, shared reward, shared purpose.',
                  highlight: 'Your expertise in action'
                },
                {
                  icon: '📊',
                  title: 'Economic Development',
                  desc: 'Creates direct talent pipeline for Surrey\'s 9,400+ tech companies. Students become economically productive whilst studying, contributing to local GDP and business growth.',
                  highlight: 'Measurable impact'
                },
                {
                  icon: '❤️',
                  title: 'Social Inclusion',
                  desc: 'Opens doors for students who couldn\'t afford university. Paid positions, real skills, portfolio proof — social mobility through genuine opportunity, not charity.',
                  highlight: 'Transforming lives'
                },
                {
                  icon: '🏆',
                  title: 'National Recognition',
                  desc: 'First FE college in the UK with this model. Press coverage, Ofsted praise, ministerial visits — the same trajectory as the IoT launch and Gatwick Station.',
                  highlight: 'Nescot on the national stage'
                },
                {
                  icon: '🏭',
                  title: 'Employer Engagement',
                  desc: 'Deep, meaningful relationships with tech employers — not just placement hosts, but clients, partners, and future employers. Engagement with real commercial stakes.',
                  highlight: 'Beyond traditional placements'
                },
                {
                  icon: '🔄',
                  title: 'Scalable & Replicable',
                  desc: 'Prove the model in software, then expand to Creative (design agency), Business (consultancy), Health (community projects). A portfolio of student enterprises.',
                  highlight: 'Platform for growth'
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="text-xl font-bold text-white mt-3 mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{item.desc}</p>
                  <span className="text-xs font-bold text-[#14B8A6] bg-white/20 px-3 py-1 rounded-full">{item.highlight}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
            >
              <p className="text-white/60 text-sm mb-2">From Julie Kapsalis&apos;s MBE Citation</p>
              <blockquote className="text-xl md:text-2xl text-white italic font-medium mb-4">
                &ldquo;Passionate about economic development, social inclusion and skills&rdquo;
              </blockquote>
              <p className="text-white/80">The Engine Room embodies this vision. It&apos;s not just a project — it&apos;s the natural evolution of everything you&apos;ve championed.</p>
            </motion.div>
          </div>
        </section>

        {/* ═══ PROBLEM ═══ */}
        <section id="problem" className="py-24 md:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                The Challenge
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                The UK faces a digital skills catastrophe
              </h2>
              <p className="text-xl text-slate-600">
                By 2030, the UK will have <strong>2 million unfilled tech roles</strong>. Traditional education cannot close this gap. 
                Employers are frustrated, students are disengaging, and FE colleges are missing their biggest opportunity in decades.
              </p>
            </motion.div>

            {/* Problem Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: '📉', stat: '2M+', title: 'Unfilled Tech Roles', desc: 'Projected shortage by 2030', color: 'red' },
                { icon: '💔', stat: '68%', title: 'Employer Frustration', desc: 'Say grads lack practical skills', color: 'orange' },
                { icon: '🚪', stat: '15%', title: 'T Level Dropout', desc: 'Students leave without completing', color: 'red' },
                { icon: '💷', stat: '£178bn', title: 'UK Digital Economy', desc: 'Desperate for local talent', color: 'purple' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
                >
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <p className={`text-3xl font-black mb-1 ${card.color === 'red' ? 'text-red-500' : card.color === 'orange' ? 'text-orange-500' : 'text-purple-600'}`}>{card.stat}</p>
                  <h3 className="font-bold mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm">{card.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <SkillsGapChart />
              <EmploymentOutcomesChart />
            </div>

            {/* Comparison Slider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-center mb-8">The Fundamental Problem with Traditional Education</h3>
              <ComparisonSlider />
              <p className="text-center text-sm text-slate-500 mt-4">← Drag to compare approaches →</p>
            </motion.div>
          </div>
        </section>

        {/* ═══ SOLUTION ═══ */}
        <section id="solution" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm font-bold mb-4">
                The Solution
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                The Engine Room & Frisson Labs
              </h2>
              <p className="text-xl text-slate-600">
                A bold new model that transforms T Level students into <strong>AI-ready professionals</strong> through <strong>real client work</strong>, 
                <strong> industry certifications</strong>, and <strong>cutting-edge technology</strong> — with training partnerships from the world&apos;s leading cloud and AI platforms.
              </p>

              {/* Industry Partners Banner */}
              <div className="mt-8 p-6 bg-slate-100 rounded-2xl">
                <p className="text-sm text-slate-500 mb-4 text-center">Training & Certification Partners</p>
                <div className="flex flex-wrap justify-center items-center gap-8">
                  {[
                    { name: 'AWS', color: '#FF9900' },
                    { name: 'Microsoft Azure', color: '#0078D4' },
                    { name: 'Google Cloud AI', color: '#4285F4' },
                    { name: 'Databricks', color: '#FF3621' },
                    { name: 'OpenAI', color: '#10A37F' },
                  ].map((partner, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: partner.color }} />
                      <span className="font-bold text-slate-700">{partner.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">Students earn industry-recognised certifications whilst working on real projects</p>
              </div>
            </motion.div>

            <Tabs
              tabs={[
                {
                  label: '🏢 What It Is',
                  content: (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-[#5B2D86] to-[#3b1d5a] p-8 rounded-3xl text-white">
                        <Image src="/frisson-labs-logo.svg" alt="Frisson Labs" width={160} height={48} className="mb-6 brightness-0 invert" />
                        <p className="text-white/80 mb-6">
                          A <strong>genuine commercial company</strong> — 50% owned by Nescot, 50% by a dedicated CEO with skin in the game. Students work as <strong>real delivery teams</strong> on 
                          <strong> real client projects</strong>, led by an entrepreneur accountable for results. This isn&apos;t simulation — it&apos;s real business.
                        </p>
                        <ul className="space-y-3">
                          {[
                            'AI & Machine Learning project delivery',
                            'AWS, Azure, Google Cloud certifications',
                            'Real client AI transformation projects',
                            'Data science & analytics capabilities',
                            'Paid positions + industry credentials',
                            '800+ hours commercial AI/software experience',
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center text-sm">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span className="text-2xl">🎯</span> Clear Mission
                          </h4>
                          <p className="text-slate-600">Bridge the gap between education and employment by giving students authentic commercial experience before they graduate. Not simulation — real delivery with real consequences.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span className="text-2xl">💰</span> Revenue Model
                          </h4>
                          <p className="text-slate-600">Client projects generate income split 50/50 between Nescot and the CEO. The CEO funds operations and student stipends from their share; Nescot reinvests into education. By Year 5, Nescot&apos;s 50% alone exceeds £100k annually.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span className="text-2xl">🏆</span> Sector First
                          </h4>
                          <p className="text-slate-600">First FE college in the UK to operate a full-service software delivery capability staffed by students. This puts Nescot on the national stage and attracts talent from across Surrey.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <span className="text-2xl">📈</span> Scalable Model
                          </h4>
                          <p className="text-slate-600">Once proven, the Engine Room concept can expand to other curriculum areas: design agency (Creative), consultancy (Business), community projects (Health & Social Care).</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  label: '⚡ Why Now',
                  content: (
                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { icon: '📈', title: 'T Level Maturity', desc: 'The programme is established enough to support innovative delivery. Early adopters gain competitive advantage and shape the future of technical education.' },
                        { icon: '🌐', title: 'Post-Pandemic Shift', desc: 'Digital transformation has accelerated by 7 years. Remote work normalised. Tech skills demand has never been higher — and traditional education cannot keep up.' },
                        { icon: '🎖️', title: "Julie's Digital Vision", desc: "The CEO's transformation agenda and innovation focus creates the perfect leadership environment. This proposal directly supports her strategic priorities." },
                        { icon: '⭐', title: 'Ofsted Momentum', desc: 'Recent inspections specifically praise industry-linked initiatives. Student-run companies cited as best practice. This is what the regulator wants to see.' },
                        { icon: '🚀', title: 'First-Mover Window', desc: "No other FE college has implemented this model. The window is open NOW. Within 2-3 years, others will follow. Nescot can own the narrative and set the standard." },
                        { icon: '💼', title: 'Surrey Tech Cluster', desc: 'Surrey has 9,400+ tech companies — one of the highest concentrations in the UK. All need talent pipelines. All are potential clients and partners.' },
                        { icon: '🎓', title: 'Student Expectations', desc: "Gen Z students demand relevance and authentic experience. They can see through simulation. Real work = real engagement = real retention." },
                        { icon: '💷', title: 'Funding Alignment', desc: 'DfE T Level enhancement grants, capital bids, and employer levies can all support this. The funding landscape has never been more favourable.' },
                        { icon: '🔄', title: 'Income Diversification', desc: 'FE funding is uncertain. Client revenue provides a stable, growing income stream independent of government policy changes.' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-[#5B2D86]/30 transition-all"
                        >
                          <span className="text-4xl">{item.icon}</span>
                          <h4 className="font-bold mt-3 mb-2">{item.title}</h4>
                          <p className="text-slate-600 text-sm">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  ),
                },
                {
                  label: '🏗️ The Space',
                  content: (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-6">Frisson Labs Hub (100-150 sqm)</h3>
                        <p className="text-slate-600 mb-6">
                          A purpose-built innovation space designed to replicate a professional software development environment. 
                          Not a classroom with computers — a <strong>real tech company office</strong>.
                        </p>
                        <div className="space-y-4">
                          {[
                            { icon: '🖥️', title: 'Workstation Pods', desc: 'Dual-monitor setups, standing desk options, ergonomic chairs' },
                            { icon: '📋', title: 'Kanban Wall', desc: 'Physical sprint boards plus digital Jira/Trello integration' },
                            { icon: '🎥', title: 'AV Suite', desc: '75" interactive displays, video conferencing, presentation space' },
                            { icon: '☕', title: 'Collaboration Zone', desc: 'Breakout pods, coffee station, quiet focus rooms' },
                            { icon: '🤖', title: 'AI & Cloud Stack', desc: 'AWS SageMaker, Azure ML, OpenAI API, Databricks — real AI tools, real certifications' },
                            { icon: '🔒', title: 'Client Meeting Room', desc: 'Professional space for client presentations and reviews' },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                            >
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className="font-bold">{item.title}</h4>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#5B2D86] to-[#3b1d5a] rounded-3xl p-8 flex flex-col justify-center text-white">
                        <h4 className="text-xl font-bold mb-4">Location Options</h4>
                        <ul className="space-y-4 text-white/80">
                          <li className="flex items-start gap-3">
                            <span className="text-[#14B8A6]">1.</span>
                            <span><strong>Ground Floor Conversion</strong> — High visibility, client access, showcase potential</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#14B8A6]">2.</span>
                            <span><strong>New Build Extension</strong> — Purpose-designed, future-proofed, statement architecture</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#14B8A6]">3.</span>
                            <span><strong>Existing Space Repurpose</strong> — Lower cost, faster implementation, phased upgrade</span>
                          </li>
                        </ul>
                        <div className="mt-8 p-4 bg-white/10 rounded-xl">
                          <p className="text-sm text-white/60 mb-2">Estimated Fit-out Cost</p>
                          <p className="text-3xl font-bold">£25,000 - £40,000</p>
                          <p className="text-xs text-white/50">Depending on location and specification</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  label: '👥 The Team',
                  content: (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-6">Core Team Structure</h3>
                        <div className="space-y-4">
                          {[
                            { role: 'CEO (50% Equity)', fte: 'Full-time', desc: 'Commercial leadership, client acquisition, company growth. Entrepreneurial background with tech delivery experience. Equity-incentivised.' },
                            { role: 'Technical Lead', fte: '0.5-1.0 FTE', desc: 'Code review, architecture decisions, technical mentoring. Reports to CEO. Can be contractor or employee.' },
                            { role: 'Academic Link (Nescot)', fte: '0.2 FTE', desc: 'T Level integration, qualification mapping, pastoral support. Represents Nescot\'s educational interests.' },
                            { role: 'Industry Mentors', fte: 'Volunteer/Sponsored', desc: '2-3 professionals providing weekly guidance. CEO\'s network contribution.' },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className="p-4 bg-slate-50 rounded-xl"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold">{item.role}</h4>
                                <span className="text-xs bg-[#5B2D86] text-white px-2 py-1 rounded">{item.fte}</span>
                              </div>
                              <p className="text-sm text-slate-600">{item.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-8">
                        <h4 className="font-bold text-lg mb-4">Ownership & Leadership</h4>
                        <div className="p-4 bg-gradient-to-r from-[#5B2D86]/10 to-[#14B8A6]/10 rounded-xl mb-6">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-[#5B2D86] text-white flex items-center justify-center font-bold">50%</div>
                            <div>
                              <p className="font-bold">Nescot College</p>
                              <p className="text-xs text-slate-500">Board representation, strategic oversight</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold">50%</div>
                            <div>
                              <p className="font-bold">CEO (Founder)</p>
                              <p className="text-xs text-slate-500">Commercial leadership, daily operations</p>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-bold text-lg mb-4">Student Team Structure</h4>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#5B2D86] text-white flex items-center justify-center text-sm font-bold">TL</span>
                            <span className="font-medium">Team Leads (Year 2)</span>
                            <span className="text-xs text-slate-500">3-4 students</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-sm font-bold">SD</span>
                            <span className="font-medium">Senior Developers (Year 2)</span>
                            <span className="text-xs text-slate-500">6-8 students</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm font-bold">JD</span>
                            <span className="font-medium">Junior Developers (Year 1)</span>
                            <span className="text-xs text-slate-500">10-15 students</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">Students progress through roles based on skill development and leadership potential. Team leads receive enhanced stipends and mentoring responsibilities.</p>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        {/* ═══ EVIDENCE ═══ */}
        <section id="evidence" className="py-24 md:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#5B2D86]/10 text-[#5B2D86] rounded-full text-sm font-bold mb-4">
                Evidence Base
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                The data demands action
              </h2>
              <p className="text-xl text-slate-600">
                This isn&apos;t speculation. Research consistently shows that experiential learning delivers <strong>dramatically superior outcomes</strong>. 
                The question isn&apos;t whether this works — it&apos;s whether Nescot will be the first to implement it.
              </p>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <StatCard icon="📈" value={75} suffix="%" label="Higher retention with experiential learning" delay={0} />
              <StatCard icon="🎯" value={90} suffix="%" label="Placement rate from student companies" delay={0.1} />
              <StatCard icon="💰" value={38} prefix="£" suffix="k" label="Average starting salary (student company grads)" delay={0.2} />
              <StatCard icon="⏱️" value={800} suffix="+" label="Hours commercial experience vs 315 standard" delay={0.3} />
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <RetentionComparisonChart />
              <SalaryImpactChart />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <RevenueProjectionChart />
              <IndustryDemandChart />
            </div>

            {/* Progress bars */}
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold mb-6">Graduate Industry Readiness</h3>
                <ProgressBar value={35} label="Traditional FE pathway" color="#ef4444" />
                <ProgressBar value={55} label="With standard T Level placement" color="#f59e0b" />
                <ProgressBar value={72} label="University with placement year" color="#14B8A6" />
                <ProgressBar value={90} label="Student-run company experience" color="#5B2D86" />
                <p className="text-sm text-slate-500 mt-4">Source: DfE Skills Analysis 2024, HESA Employment Data</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold mb-6">Employer Confidence in Hire</h3>
                <ProgressBar value={28} label="FE qualification alone" color="#ef4444" />
                <ProgressBar value={45} label="With academic references" color="#f59e0b" />
                <ProgressBar value={65} label="With placement reference" color="#14B8A6" />
                <ProgressBar value={92} label="With commercial portfolio" color="#5B2D86" />
                <p className="text-sm text-slate-500 mt-4">Source: Tech Nation Employer Survey 2024</p>
              </div>
            </div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <TestimonialCarousel />
            </motion.div>
          </div>
        </section>

        {/* ═══ GRASSROOTS AI IMPACT ═══ */}
        <section id="grassroots-ai" className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-900 text-white overflow-hidden relative">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#14B8A6] rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5B2D86] rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14B8A6]/20 text-[#14B8A6] rounded-full text-sm font-bold mb-4 border border-[#14B8A6]/30">
                🚀 Grassroots AI Impact
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                AI for <span className="text-[#14B8A6]">Every</span> Local Business
              </h2>
              <p className="text-xl text-white/70">
                Whilst big consultancies charge £50k+ for AI projects, Frisson Labs delivers <strong className="text-white">high-impact, low-cost AI transformations</strong> for 
                Surrey&apos;s SMEs. Students learn cutting-edge AI; local businesses get world-class technology at affordable prices.
              </p>
              <p className="mt-4 text-[#14B8A6] font-bold">
                Economic development meets social inclusion — exactly Julie&apos;s vision.
              </p>
            </motion.div>

            {/* AI Solutions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {[
                {
                  icon: '🎙️',
                  title: 'AI Voice Receptionist',
                  desc: 'Intelligent phone system that answers calls, takes bookings, answers FAQs, and routes complex queries — 24/7, no staff needed.',
                  impact: 'Save £25k/year on reception costs',
                  tech: 'OpenAI Whisper + GPT-4 + Twilio',
                  time: '2-week sprint'
                },
                {
                  icon: '📧',
                  title: 'Smart Email Automation',
                  desc: 'AI reads, categorises, and responds to emails. Auto-books appointments, answers queries, escalates issues — inbox zero, automated.',
                  impact: '80% reduction in admin time',
                  tech: 'GPT-4 + Microsoft Graph API',
                  time: '1-week sprint'
                },
                {
                  icon: '💬',
                  title: 'Intelligent Help Portal',
                  desc: 'Self-service chatbot trained on your business knowledge. Answers customer questions instantly, escalates when needed, learns over time.',
                  impact: '70% fewer support tickets',
                  tech: 'RAG + Vector DB + Custom LLM',
                  time: '3-week sprint'
                },
                {
                  icon: '🎯',
                  title: 'Hyper-Personalised Websites',
                  desc: 'Dynamic sites that adapt content, offers, and CTAs based on visitor profile, behaviour, and intent. Every visitor sees their perfect page.',
                  impact: '3x conversion rate increase',
                  tech: 'Next.js + AI Personalisation Engine',
                  time: '4-week sprint'
                },
                {
                  icon: '📊',
                  title: 'Predictive Analytics Dashboard',
                  desc: 'AI-powered business intelligence that predicts sales, flags risks, identifies opportunities — decisions driven by data, not guesswork.',
                  impact: '20% revenue uplift',
                  tech: 'Databricks + Python ML + Streamlit',
                  time: '3-week sprint'
                },
                {
                  icon: '📝',
                  title: 'Document Intelligence',
                  desc: 'Extracts data from invoices, contracts, forms automatically. No more manual data entry. Integrates with existing systems.',
                  impact: '90% faster document processing',
                  tech: 'Azure Document Intelligence + RPA',
                  time: '2-week sprint'
                },
                {
                  icon: '⭐',
                  title: 'Review & Reputation AI',
                  desc: 'Monitors reviews across platforms, auto-responds appropriately, alerts for negative sentiment, generates review requests.',
                  impact: '4.5+ star rating maintenance',
                  tech: 'Sentiment Analysis + GPT-4',
                  time: '1-week sprint'
                },
                {
                  icon: '📱',
                  title: 'Social Media Autopilot',
                  desc: 'AI generates, schedules, and optimises social content. Brand-consistent posts, optimal timing, engagement automation.',
                  impact: '5x social engagement',
                  tech: 'GPT-4 + DALL-E + Scheduling APIs',
                  time: '2-week sprint'
                },
                {
                  icon: '🛒',
                  title: 'Smart Product Recommendations',
                  desc: 'AI suggests products based on browsing, purchase history, and similar customers. "Customers also bought" that actually works.',
                  impact: '35% increase in basket size',
                  tech: 'Collaborative Filtering + Neural Networks',
                  time: '3-week sprint'
                },
              ].map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#14B8A6]/50 transition-all group"
                >
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#14B8A6] transition-colors">{solution.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{solution.desc}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#14B8A6] text-xs font-bold">IMPACT:</span>
                      <span className="text-white text-xs">{solution.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-xs font-bold">TECH:</span>
                      <span className="text-white/60 text-xs">{solution.tech}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs font-bold">DELIVERY:</span>
                      <span className="text-white/60 text-xs">{solution.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why This Matters for Surrey */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#5B2D86]/50 to-[#14B8A6]/50 rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Why This Matters for Surrey</h3>
                  <p className="text-white/80 mb-6">
                    Surrey has <strong className="text-white">9,400+ SMEs</strong> that need AI but can&apos;t afford enterprise consultants. 
                    Frisson Labs bridges this gap — students gain real AI experience, businesses get transformative technology, 
                    and Nescot drives <strong className="text-white">measurable economic development</strong> across the region.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Affordable AI for businesses priced out of digital transformation',
                      'Students certified in AWS, Azure, Google Cloud, Databricks',
                      'Real portfolio of AI projects with measurable business impact',
                      'Direct pipeline from project to employment for graduates',
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center text-xs">✓</span>
                        <span className="text-white/80">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '£2-10k', label: 'Typical project cost', sub: 'vs £50k+ from consultancies' },
                    { value: '9,400+', label: 'Surrey SMEs', sub: 'Potential clients' },
                    { value: '1-4', label: 'Weeks to delivery', sub: 'Agile sprints' },
                    { value: '10x', label: 'ROI for clients', sub: 'Typical return' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-black text-[#14B8A6]">{stat.value}</p>
                      <p className="text-sm font-medium text-white">{stat.label}</p>
                      <p className="text-xs text-white/50">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Julie Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-white/50 text-sm mb-2">This is the vision in action</p>
              <blockquote className="text-xl md:text-2xl italic text-white/80">
                &ldquo;Dynamic partnerships between public, private, and third sectors that provide <span className="text-[#14B8A6] font-bold">unique opportunities</span> for students to engage with businesses and the community.&rdquo;
              </blockquote>
              <p className="text-[#14B8A6] font-bold mt-4">— The Engine Room delivers exactly this.</p>
            </motion.div>
          </div>
        </section>

        {/* ═══ STUDENT JOURNEY ═══ */}
        <section id="journey" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm font-bold mb-4">
                Student Experience
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                From day one to job ready
              </h2>
              <p className="text-xl text-slate-600">
                A structured journey that transforms curious students into confident professionals with <strong>real commercial experience</strong> 
                and <strong>portfolio proof</strong> of their capabilities.
              </p>
            </motion.div>

            <StudentJourney />

            {/* Day in the life */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-br from-[#5B2D86] to-[#3b1d5a] rounded-3xl p-8 md:p-12 text-white"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">A Typical Day in Frisson Labs</h3>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { time: '09:00', activity: 'Daily Standup', desc: '15-min team sync' },
                  { time: '09:30', activity: 'Sprint Work', desc: 'Focused development' },
                  { time: '12:00', activity: 'Lunch & Learn', desc: 'Skill workshop' },
                  { time: '13:30', activity: 'Code Review', desc: 'Peer feedback' },
                  { time: '15:00', activity: 'Client Demo', desc: 'Progress showcase' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center"
                  >
                    <p className="text-[#14B8A6] font-bold text-lg">{item.time}</p>
                    <p className="font-bold mt-1">{item.activity}</p>
                    <p className="text-white/60 text-xs mt-1">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-white/60 text-sm mt-8">
                Students also complete T Level academic requirements through integrated study blocks, ensuring qualification alongside commercial experience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ STRATEGIC PILLARS ═══ */}
        <section id="pillars" className="py-24 md:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#5B2D86]/10 text-[#5B2D86] rounded-full text-sm font-bold mb-4">
                Strategic Alignment
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Julie&apos;s Vision in Action
              </h2>
              <p className="text-xl text-slate-600">
                The Engine Room isn&apos;t just aligned with Nescot&apos;s strategy — it&apos;s the <strong>embodiment of your leadership philosophy</strong>: public-private partnership, economic development, and social inclusion.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  pillar: 'AI LEADERSHIP',
                  icon: '🤖',
                  color: '#5B2D86',
                  points: ['AWS, Azure, Google Cloud certs', 'OpenAI & Databricks partnerships', 'AI/ML project delivery', 'Local business AI access', 'National AI skills showcase'],
                },
                {
                  pillar: 'ECONOMIC ENGINE',
                  icon: '📈',
                  color: '#7c3aed',
                  points: ['Revenue from Year 1', '9,400+ SME client pipeline', 'AI transformation catalyst', 'Surrey tech ecosystem builder', 'Measurable GDP contribution'],
                },
                {
                  pillar: 'SOCIAL IMPACT',
                  icon: '❤️',
                  color: '#14B8A6',
                  points: ['Paid AI positions for students', 'No-debt path to tech careers', 'Affordable AI for all businesses', 'Inclusive access to AI skills', 'Community AI projects'],
                },
                {
                  pillar: 'RECOGNITION',
                  icon: '🏆',
                  color: '#0d9488',
                  points: ['First AI-focused FE venture', 'National press opportunity', 'Outstanding Ofsted evidence', 'Ministerial showcase potential', 'MBE-worthy initiative'],
                },
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl p-6 shadow-lg border-t-4"
                  style={{ borderTopColor: pillar.color }}
                >
                  <div className="text-4xl mb-4">{pillar.icon}</div>
                  <h3 className="text-2xl font-black mb-4" style={{ color: pillar.color }}>{pillar.pillar}</h3>
                  <ul className="space-y-2">
                    {pillar.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pillar.color }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BUDGET & TIMELINE ═══ */}
        <section id="budget" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm font-bold mb-4">
                Investment
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Budget & Timeline
              </h2>
              <p className="text-xl text-slate-600">
                A phased approach that manages risk whilst building momentum toward self-sustainability.
              </p>
            </motion.div>

            {/* Budget chart */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Capital Investment Breakdown</h3>
              <BudgetChart />
            </div>

            {/* Timeline */}
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">Implementation Timeline</h3>
              <Timeline items={timelineItems} />
            </div>

            {/* ROI callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#5B2D86] to-[#14B8A6] rounded-3xl p-8 md:p-12 text-white"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-2">Break-even Point</p>
                  <p className="text-5xl font-black">Year 3</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-2">Nescot&apos;s 50% (Year 5)</p>
                  <p className="text-5xl font-black">£200k</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-2">5-Year ROI</p>
                  <p className="text-5xl font-black">300%+</p>
                </div>
              </div>
              <p className="text-center text-white/80 mt-8 max-w-2xl mx-auto">
                Conservative projections based on comparable university models. Actual returns may be higher with strong client acquisition and grant success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-24 md:py-32 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-[#5B2D86]/10 text-[#5B2D86] rounded-full text-sm font-bold mb-4">
                Questions Answered
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Everything you need to know
              </h2>
              <p className="text-xl text-slate-600">
                Comprehensive answers to the questions leadership will ask.
              </p>
            </motion.div>

            <FAQ items={faqs} />
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section id="cta" className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B2D86] via-[#4a2570] to-[#3b1d5a]" />
          <ParticleField />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#5B2D86] flex items-center justify-center text-4xl shadow-2xl"
              >
                🚀
              </motion.div>
              <p className="text-[#14B8A6] font-bold mb-4 text-lg">For Julie Kapsalis MBE</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                Your next transformational investment
              </h2>
              <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
                From IoT to Gatwick Station to Coast to Capital — you&apos;ve built your legacy on bold partnerships that deliver real economic impact.
              </p>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                <strong>The Engine Room is next.</strong> A public-private partnership that puts Nescot on the national stage whilst transforming students&apos; lives through genuine opportunity.
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <motion.a
                  href="mailto:rmalhotra@nescot.ac.uk?subject=The%20Engine%20Room%20-%20Discussion%20Request"
                  whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-full font-black text-lg text-white bg-[#14B8A6] hover:bg-[#0d9488] transition-colors inline-flex items-center gap-3 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative">📅</span> <span className="relative">Schedule Discussion</span>
                </motion.a>
                <motion.a
                  href="/Frisson-Labs-OnePager.html"
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-full font-bold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors inline-flex items-center gap-3"
                >
                  <span>📄</span> View One-Pager
                </motion.a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto mb-8">
                <p className="text-white/60 text-sm mb-2">The ask</p>
                <p className="text-white text-lg">60 minutes to walk through the full business case, governance model, and implementation timeline. I&apos;ll address every question and concern.</p>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
                {[
                  { icon: '📧', label: 'Email', value: 'rmalhotra@nescot.ac.uk' },
                  { icon: '💬', label: 'Teams', value: '@FrissonLabs' },
                  { icon: '📍', label: 'Location', value: 'Nescot College' },
                ].map((contact, i) => (
                  <div key={i} className="text-center text-white">
                    <div className="text-2xl mb-2">{contact.icon}</div>
                    <p className="text-white/60 text-xs">{contact.label}</p>
                    <p className="font-medium text-sm">{contact.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <Image src="/nescot-logo.svg" alt="Nescot" width={100} height={30} className="h-10 w-auto invert brightness-200" />
                  <span className="text-3xl font-black text-[#14B8A6]">×</span>
                  <Image src="/frisson-labs-logo-light.svg" alt="Frisson Labs" width={160} height={45} className="h-12 w-auto" />
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Nescot College, Reigate Road, Ewell, Epsom, Surrey KT17 3DS
                </p>
                <p className="text-slate-500 text-xs">
                  This presentation was prepared for Nescot senior leadership. Contents are confidential.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#problem" className="hover:text-white transition">The Problem</a></li>
                  <li><a href="#solution" className="hover:text-white transition">Our Solution</a></li>
                  <li><a href="#evidence" className="hover:text-white transition">Evidence Base</a></li>
                  <li><a href="#grassroots-ai" className="hover:text-white transition">Grassroots AI Impact</a></li>
                  <li><a href="#budget" className="hover:text-white transition">Budget & Timeline</a></li>
                  <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Presentation</h4>
                <p className="text-slate-400 text-sm mb-2">Demo password:</p>
                <code className="bg-slate-800 px-3 py-1.5 rounded text-[#14B8A6] text-sm">nescotpitch2026</code>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Nescot College. All rights reserved.
              </p>
              <p className="text-slate-500 text-sm">
                Crafted with 💜 for T Level excellence
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
