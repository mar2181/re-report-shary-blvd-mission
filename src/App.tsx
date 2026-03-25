import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle, Phone, Mail, Menu,
  Printer, Building2, Users, DollarSign, BarChart3,
  ShoppingBag, Car, Home, Zap, Target, X
} from 'lucide-react'

// ─── DATA ──────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'summary',    label: 'Executive Summary' },
  { id: 'property',  label: 'Site Analysis' },
  { id: 'market',    label: 'Market Overview' },
  { id: 'comps',     label: 'Comparable Projects' },
  { id: 'financial', label: 'Financial Projections' },
  { id: 'scenarios', label: 'Development Scenarios' },
  { id: 'risks',     label: 'Risks & Mitigants' },
  { id: 'verdict',   label: 'Recommendation' },
  { id: 'sources',   label: 'Sources' },
]

const STATS = [
  { label: 'Address',        value: '5414 S Shary Blvd' },
  { label: 'City',           value: 'Mission, TX 78572' },
  { label: 'County',         value: 'Hidalgo County' },
  { label: 'Corridor',       value: 'S Shary Rd / Shary Blvd' },
  { label: 'Avg Land Price',  value: '$219,747/AC' },
  { label: 'Retail Rent',    value: '$23/SF NNN (avg)' },
]

const MARKET_STATS = [
  { label: 'Mission Population (2026)', value: '89,929', trend: '+0.76%/yr', icon: Users, up: true },
  { label: 'Avg Household Income',      value: '$88,528', trend: '+$13K projected by 2029', icon: DollarSign, up: true },
  { label: 'Avg Retail Rent (Mission)', value: '$23/SF NNN', trend: 'LoopNet Q1 2026', icon: ShoppingBag, up: true },
  { label: 'Commercial Land (avg)',      value: '$219,747/AC', trend: '139 active listings', icon: Building2, up: null },
  { label: 'Shary Corridor Vacancy',    value: '~6–8%',  trend: 'Neighborhood centers', icon: BarChart3, up: null },
  { label: 'Sharyland HH Income',       value: 'Upper-Mid', trend: 'Above avg vs. Mission', icon: TrendingUp, up: true },
]

const COMPS = [
  {
    name: 'Shary Town Plaza',
    address: '209 N Shary Rd, Mission, TX',
    sf: '24,000',
    type: 'Neighborhood Retail',
    anchor: 'Dunkin\' Donuts + inline retail',
    opened: 'Q2 2024',
    proximity: '~2 mi N',
    notes: 'Adjacent to HEB, Ross, Target, Home Depot corridor. Domain Development. Inline suites.',
    status: 'Active/Leased',
    color: 'green'
  },
  {
    name: 'Shary Plaza (CBG)',
    address: 'S Shary Rd, Mission, TX',
    sf: 'N/A',
    type: 'Neighborhood Retail',
    anchor: 'Adjacent to Walmart',
    opened: 'Existing',
    proximity: '~1–2 mi',
    notes: 'Small-format suites. Well-suited for retail/professional services. Adjacent to Walmart center.',
    status: 'Active',
    color: 'blue'
  },
  {
    name: 'Market at Sharyland Place',
    address: 'Expressway 83, Mission, TX',
    sf: '108,262',
    type: 'Community Retail Center',
    anchor: "Dollar Tree, Kohl's",
    opened: 'Existing (for sale)',
    proximity: '~3 mi N',
    notes: '11.66 acres. Major Hwy 83 exposure. Institutional-quality asset. Listed on LoopNet.',
    status: 'For Sale',
    color: 'amber'
  },
  {
    name: 'Mirabelle Plaza',
    address: 'Sharyland area, Mission, TX',
    sf: '~20,000',
    type: 'Neighborhood Retail',
    anchor: 'Mixed inline',
    opened: '2022–2023',
    proximity: '~2–3 mi',
    notes: 'Domain Development. Built alongside 100-lot Mirabelle residential development. "Overwhelming success" per developer.',
    status: 'Stabilized',
    color: 'green'
  },
  {
    name: '605 N Shary Rd (Land Comp)',
    address: '605 N Shary Rd, Mission, TX',
    sf: ' -- ',
    type: 'Commercial Land',
    anchor: '4.675 Acres',
    opened: 'Active listing',
    proximity: '~3 mi N',
    notes: '$5,800,000 list price = $1,240,267/acre. Prime N Shary Rd corridor land pricing.',
    status: 'For Sale $5.8M',
    color: 'amber'
  },
]

const SCENARIOS = [
  {
    name: 'Conservative',
    label: 'Small Strip (8,000 SF)',
    color: 'border-t-amber-500',
    badge: 'bg-amber-500/20 text-amber-300',
    sf: '8,000',
    landCost: '$500,000',
    devCost: '$1,440,000',
    totalInvestment: '$1,940,000',
    grossRent: '$184,000',
    noi: '$165,600',
    capRate: '8.5%',
    estValue: '$1,948,235',
    equity: '~$8,235',
    rentPSF: '$23/SF NNN',
    desc: '4–6 inline suites (1,200–2,000 SF each). Targets local services: nail salon, insurance, tax, phone repair, fast-casual QSR.',
    irr: '9–11%',
    risk: 'LOW',
    riskColor: 'text-green-400',
  },
  {
    name: 'Base Case',
    label: 'Neighborhood Center (18,000 SF)',
    color: 'border-t-amber-400',
    badge: 'bg-amber-400/20 text-amber-300',
    sf: '18,000',
    landCost: '$750,000',
    devCost: '$3,240,000',
    totalInvestment: '$3,990,000',
    grossRent: '$414,000',
    noi: '$372,600',
    capRate: '9.3%',
    estValue: '$4,475,000',
    equity: '~$485,000',
    rentPSF: '$23/SF NNN',
    desc: '8–12 suites across 1–2 buildings. Anchor: QSR or dollar store. Supporting: services, medical, beauty, finance.',
    irr: '13–16%',
    risk: 'MODERATE',
    riskColor: 'text-amber-400',
    featured: true,
  },
  {
    name: 'Aggressive',
    label: 'Mixed-Use Center (30,000 SF)',
    color: 'border-t-green-400',
    badge: 'bg-green-500/20 text-green-300',
    sf: '30,000',
    landCost: '$1,100,000',
    devCost: '$5,400,000',
    totalInvestment: '$6,500,000',
    grossRent: '$690,000',
    noi: '$579,600',
    capRate: '8.9%',
    estValue: '$7,244,000',
    equity: '~$744,000',
    rentPSF: '$23/SF NNN',
    desc: 'Multi-building development with drive-thru pad, inline retail, and potential medical/professional office component.',
    irr: '14–18%',
    risk: 'HIGHER',
    riskColor: 'text-red-400',
  },
]

const RISKS = [
  {
    risk: 'Competition from established retail on N Shary Rd corridor (Shary Town Plaza, Walmart center)',
    level: 'HIGH',
    color: 'text-red-400 bg-red-950/50 border-red-800/50',
    mitigant: 'S Shary Blvd (south) serves underserved residential neighborhoods vs. established N Shary retail. Different trade area and demographics.',
  },
  {
    risk: 'Unknown lot size / acreage  --  could significantly impact buildable SF and feasibility',
    level: 'HIGH',
    color: 'text-red-400 bg-red-950/50 border-red-800/50',
    mitigant: 'Verify via Hidalgo County CAD (hidalgoad.org). Property must be min. 1.5–2 acres for 18,000+ SF center with parking.',
  },
  {
    risk: 'Zoning verification required  --  must confirm commercial or B-1/B-2 zoning for retail use',
    level: 'HIGH',
    color: 'text-red-400 bg-red-950/50 border-red-800/50',
    mitigant: 'City of Mission rezoning process exists but takes 60–90 days. Adjacent Shary Rd properties are generally commercial-zoned.',
  },
  {
    risk: 'Construction cost escalation  --  retail construction in TX running $120–$200/SF in 2025',
    level: 'MEDIUM',
    color: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    mitigant: 'Get 3 GC bids before committing. Base case uses $180/SF which is mid-market. Phase construction to manage exposure.',
  },
  {
    risk: 'Anchor tenant dependency  --  without an anchor (QSR, dollar store, pharmacy), inline leasing is slower',
    level: 'MEDIUM',
    color: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    mitigant: 'Pre-leasing strategy: target Dollar General, Dominos, or Subway as anchors before breaking ground.',
  },
  {
    risk: 'Mission retail vacancy rising  --  Texas statewide retail vacancy at 8.5% (TRERC Fall 2025)',
    level: 'MEDIUM',
    color: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    mitigant: 'S Shary corridor is neighborhood-serving, which historically outperforms regional/lifestyle retail during softening cycles.',
  },
  {
    risk: 'Traffic count verification needed on S Shary Blvd at this location',
    level: 'LOW',
    color: 'text-green-400 bg-green-950/50 border-green-800/50',
    mitigant: 'Pull TxDOT traffic count data for S Shary Blvd. Ideal is 20,000+ VPD for neighborhood retail viability.',
  },
]

const FINANCIALS_BASE = [
  { item: 'Land Cost (est.)',             value: '$750,000',   note: 'Based on $219K/AC avg × ~3.4 AC est.' },
  { item: 'Construction (18K SF × $180)', value: '$3,240,000', note: 'Mid-market TX retail, 2025 costs' },
  { item: 'Soft Costs (15%)',             value: '$486,000',   note: 'Architecture, permits, engineering, legal' },
  { item: 'Contingency (5%)',             value: '$162,000',   note: 'Standard development contingency' },
  { item: 'Total Development Cost',        value: '$4,638,000', note: 'All-in before financing', bold: true },
  { item: 'Gross Annual Rent (100% occ.)', value: '$414,000',  note: '$23/SF NNN × 18,000 SF' },
  { item: 'Less: Vacancy (10%)',           value: '-$41,400',  note: 'Conservative stabilization assumption', neg: true },
  { item: 'Effective Gross Income',        value: '$372,600',  note: '', bold: true },
  { item: 'Operating Expenses (NNN ~0%)',  value: '$0',        note: 'Tenant-paid under NNN structure' },
  { item: 'Net Operating Income',          value: '$372,600',  note: 'Stabilized year 1', bold: true, gold: true },
  { item: 'Implied Value @ 8.5% Cap',      value: '$4,383,000', note: 'Market cap rate for neighborhood center' },
  { item: 'Implied Value @ 8.0% Cap',      value: '$4,657,500', note: 'Premium for strong location/anchor' },
  { item: 'Development Profit (8.5% cap)', value: '-$255,000',  note: 'Thin at current land pricing  --  see notes', neg: true },
  { item: 'Development Profit (8.0% cap)', value: '+$19,500',   note: 'Breakeven at 8.0% cap', gold: true },
]

const TEN_YEAR = [
  { year: 1,  rent: '$23.00', noi: '$372,600', cumNOI: '$372,600',   value: '$4,383,000' },
  { year: 2,  rent: '$23.69', noi: '$384,678', cumNOI: '$757,278',   value: '$4,525,000' },
  { year: 3,  rent: '$24.40', noi: '$396,419', cumNOI: '$1,153,697', value: '$4,664,000' },
  { year: 5,  rent: '$25.88', noi: '$420,624', cumNOI: '$1,980,000', value: '$4,948,000' },
  { year: 7,  rent: '$27.43', noi: '$446,169', cumNOI: '$2,840,000', value: '$5,249,000' },
  { year: 10, rent: '$29.95', noi: '$487,134', cumNOI: '$4,120,000', value: '$5,731,000' },
]

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0d1b2a]/95 backdrop-blur border-b border-[#2a3a4a] flex items-center px-6 gap-4 z-50">
      <button className="lg:hidden text-white" onClick={onMenu}><Menu className="w-5 h-5" /></button>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-amber-400 font-bold text-sm tracking-widest uppercase">RE/MAX Elite</span>
        <span className="text-slate-500 text-sm hidden sm:inline">· Feasibility Report</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-xs text-slate-500 hidden md:block">5414 S Shary Blvd · Mission, TX · March 2026</span>
        <button onClick={() => window.print()} className="no-print flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-[#2a3a4a] px-3 py-1.5 rounded-md">
          <Printer className="w-3.5 h-3.5" />Print / PDF
        </button>
      </div>
    </nav>
  )
}

function Sidebar({ active, open, onClose }: { active: string, open: boolean, onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-[#0d1827] border-r border-[#2a3a4a] z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {open && (
          <button className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="py-6 flex-1 overflow-y-auto">
          <p className="px-5 text-[10px] tracking-[3px] uppercase text-slate-600 font-semibold mb-4">Navigation</p>
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={onClose}
               className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-l-[3px] transition-all ${active === s.id ? 'text-amber-400 border-l-amber-400 bg-white/5' : 'text-slate-400 border-l-transparent hover:text-white hover:bg-white/5'}`}>
              {s.label}
            </a>
          ))}
        </div>
        <div className="px-5 pb-6 border-t border-[#2a3a4a] pt-4">
          <p className="text-xs text-slate-400 font-semibold">Juan Jose Elizondo</p>
          <p className="text-xs text-amber-400">RE/MAX Elite</p>
          <p className="text-xs text-slate-600 mt-1">Rio Grande Valley, TX</p>
        </div>
      </aside>
    </>
  )
}

function SectionWrap({ id, children }: { id: string, children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      className="px-6 lg:px-12 py-14 border-b border-[#2a3a4a]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  )
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('summary')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const ids = SECTIONS.map(s => s.id)
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-25% 0px -65% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d1b2a]">
      <Topbar onMenu={() => setOpen(true)} />
      <Sidebar active={active} open={open} onClose={() => setOpen(false)} />

      <main className="lg:pl-64 pt-16">

        {/* ── HERO ── */}
        <section id="summary" className="px-6 lg:px-12 pt-14 pb-12 border-b border-[#2a3a4a] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-transparent pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative">
            <p className="eyebrow">Shopping Center Feasibility Study</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              5414 S Shary Boulevard
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-1.5 mb-8">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              Mission, Texas 78572 · Hidalgo County
            </p>
            <div className="flex flex-wrap gap-8 text-sm text-slate-400 mb-10">
              <div><p>Prepared by</p><p className="text-white font-medium">Juan Jose Elizondo · RE/MAX Elite</p></div>
              <div><p>Report Date</p><p className="text-white font-medium">March 25, 2026</p></div>
              <div><p>Analysis Type</p><p className="text-white font-medium">Retail Development Feasibility</p></div>
              <div><p>Corridor</p><p className="text-white font-medium">S Shary Blvd, Mission TX</p></div>
            </div>

            {/* Verdict Banner */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6 max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-400 font-bold text-lg mb-1">PROCEED WITH CONDITIONS</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The S Shary Boulevard corridor in Mission is an active, growing retail trade area with strong demand fundamentals. A small-to-mid neighborhood center (8,000–18,000 SF) is <strong className="text-white">feasible</strong> at this location  --  but only after verifying lot size, current zoning, and traffic counts. At current Mission land pricing (~$219K/AC avg), margin is tight on larger projects; a conservative 8,000 SF strip or a pre-leased anchor strategy significantly de-risks the investment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-[#2a3a4a]">
          {STATS.map((s, i) => (
            <div key={i} className="px-5 py-5 border-r border-[#2a3a4a] last:border-r-0">
              <p className="stat-label">{s.label}</p>
              <p className="text-base font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── SITE ANALYSIS ── */}
        <SectionWrap id="property">
          <p className="eyebrow">Site Analysis</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Property & Location Overview</h2>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />Site Characteristics
                </h3>
                {[
                  { label: 'Address', value: '5414 S Shary Boulevard, Mission, TX 78572' },
                  { label: 'County', value: 'Hidalgo County' },
                  { label: 'Corridor', value: 'S Shary Blvd (S of Business 83)' },
                  { label: 'Lot Size', value: '⚠️ Verify via Hidalgo CAD  --  critical for feasibility' },
                  { label: 'Zoning', value: '⚠️ Must confirm commercial zoning with City of Mission' },
                  { label: 'Utilities', value: 'City water/sewer expected  --  verify at site' },
                  { label: 'Topography', value: 'RGV is flat  --  minimal grading costs expected' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-[#2a3a4a] last:border-0 text-sm">
                    <span className="text-slate-400 w-28 flex-shrink-0">{r.label}</span>
                    <span className="text-white">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />Strategic Location Factors
                </h3>
                {[
                  { icon: Car,       label: 'Traffic Access',     value: 'S Shary Blvd is a major N-S arterial in Mission with high residential traffic feeding south Mission neighborhoods' },
                  { icon: Home,      label: 'Trade Area',         value: 'Surrounded by established single-family residential subdivisions  --  captive neighborhood demand' },
                  { icon: ShoppingBag, label: 'Retail Nodes',    value: 'N Shary corridor (HEB, Ross, Target, Home Depot, Walmart, Dunkin) is ~2 mi north  --  no strong competition to south' },
                  { icon: Users,     label: 'Demographics',       value: 'Sharyland submarket: upper-middle income, above Mission average. Strongest retail demographics in the corridor.' },
                  { icon: Zap,       label: 'Growth Catalyst',    value: 'Mission growing at 0.76%/yr (pop. 89,929 in 2026). Residential subdivisions still being built in south Mission.' },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3 py-2.5 border-b border-[#2a3a4a] last:border-0 text-sm">
                    <r.icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-400 font-medium text-xs mb-0.5">{r.label}</p>
                      <p className="text-slate-300">{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Verifications Box */}
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-6">
            <p className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />Critical Items to Verify Before Proceeding
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: '1', title: 'Lot Size', desc: 'Pull from Hidalgo County CAD (hidalgoad.org). Need min. 1.5 AC for viable 8K SF center; 3+ AC for 18K SF center with parking.' },
                { n: '2', title: 'Zoning', desc: 'Confirm commercial zoning with City of Mission (missiontexas.us). If residential, a rezoning to B-1/B-2 commercial is possible but adds 60–90 days.' },
                { n: '3', title: 'Traffic Count', desc: 'Pull TxDOT traffic count on S Shary Blvd. Need 15,000+ VPD for strip; 25,000+ for full neighborhood center viability.' },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-800/50 text-red-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{item.n}</div>
                  <div>
                    <p className="text-red-300 font-semibold text-sm">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrap>

        {/* ── MARKET OVERVIEW ── */}
        <SectionWrap id="market">
          <p className="eyebrow">Market Intelligence</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-8">Mission, TX Retail Market Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {MARKET_STATS.map((s, i) => (
              <div key={i} className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <s.icon className="w-5 h-5 text-amber-400" />
                  {s.up !== null && (
                    s.up
                      ? <TrendingUp className="w-4 h-4 text-green-400" />
                      : <Minus className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="text-2xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="stat-label">{s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Narrative */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Why Shary Corridor Works for Retail</h3>
              {[
                'S Shary Blvd is a primary N-S arterial connecting established and growing residential neighborhoods to Business 83 and I-2, generating consistent captive traffic.',
                'Sharyland submarket has above-average household income for Mission  --  residents tend to spend more locally and prefer convenience over driving to regional centers.',
                'Mission population is projected to reach 88,209+ by 2029. Residential subdivisions in south Mission continue to be built, expanding the retail trade area.',
                'The Shary corridor success is proven: Shary Town Plaza (2024) and Mirabelle Plaza (2022) both report strong absorption. Domain Development called demand extraordinary.',
                'Average retail rent of $23/SF NNN in Mission provides sufficient yield for small-format neighborhood development when construction costs are controlled.',
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#2a3a4a] last:border-0 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300">{p}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Retail Demand Drivers</h3>
              <div className="space-y-4">
                {[
                  { label: 'Population Growth', pct: 75, color: 'bg-green-400' },
                  { label: 'Income Level (Sharyland)', pct: 82, color: 'bg-amber-400' },
                  { label: 'Supply Gap (S Shary)', pct: 70, color: 'bg-amber-400' },
                  { label: 'Traffic Potential', pct: 65, color: 'bg-blue-400' },
                  { label: 'Competitive Pressure', pct: 45, color: 'bg-red-400' },
                ].map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{d.label}</span>
                      <span className="text-white font-medium">{d.pct}%</span>
                    </div>
                    <div className="h-2 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${d.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${d.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">Relative index scores based on market research and comparable corridor analysis.</p>
            </div>
          </div>
        </SectionWrap>

        {/* ── COMPS ── */}
        <SectionWrap id="comps">
          <p className="eyebrow">Comparable Projects</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Shary Corridor & Mission Retail Comps</h2>
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3a4a] bg-[#111827]">
                    {['Project', 'Address', 'SF', 'Type', 'Anchor', 'Opened', 'Proximity', 'Notes'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-slate-500 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPS.map((c, i) => (
                    <tr key={i} className="border-b border-[#2a3a4a] hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{c.name}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{c.address}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{c.sf}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{c.type}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{c.anchor}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap text-xs">{c.opened}</td>
                      <td className="px-4 py-3 text-amber-400 font-medium whitespace-nowrap text-xs">{c.proximity}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-xs">{c.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-[#1a2535] border border-amber-400/20 rounded-xl p-5">
            <p className="text-amber-400 font-semibold text-sm mb-2">Key Takeaway from Comps</p>
            <p className="text-slate-300 text-sm">Domain Development's two Shary corridor projects (Shary Town Plaza + Mirabelle Plaza) both achieved strong absorption in 24,000 SF format. N Shary Rd has the dominant grocery-anchored power center cluster (HEB + Target + Home Depot). The <strong className="text-white">opportunity on S Shary Blvd</strong> is to serve the residential neighborhoods to the south that don't have convenient walkable/drivable retail within their immediate trade area.</p>
          </div>
        </SectionWrap>

        {/* ── FINANCIAL PROJECTIONS ── */}
        <SectionWrap id="financial">
          <p className="eyebrow">Financial Analysis</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Base Case Projections  --  18,000 SF Center</h2>

          {/* Financial table */}
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-[#2a3a4a] flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-400 rounded-sm" />
              <h3 className="text-white font-semibold">Development Pro Forma  --  Base Case (18,000 SF NNN)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {FINANCIALS_BASE.map((r, i) => (
                    <tr key={i} className={`border-b border-[#2a3a4a] last:border-0 ${r.bold ? 'bg-white/5' : ''}`}>
                      <td className={`px-6 py-3 ${r.bold ? 'text-white font-bold' : 'text-slate-400'}`}>{r.item}</td>
                      <td className={`px-6 py-3 text-right font-mono font-semibold ${r.gold ? 'text-amber-400' : r.neg ? 'text-red-400' : r.bold ? 'text-white' : 'text-slate-200'}`}>{r.value}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs hidden md:table-cell">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 10-year table */}
          <h3 className="text-white font-semibold text-lg mb-4">10-Year NOI Projection (3% annual rent escalation)</h3>
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a3a4a] bg-[#111827]">
                    {['Year', 'Rent PSF', 'NOI', 'Cumulative NOI', 'Est. Value @ 8.5% Cap'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-slate-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEN_YEAR.map((r, i) => (
                    <tr key={i} className="border-b border-[#2a3a4a] last:border-0 hover:bg-white/5">
                      <td className="px-4 py-3 text-white font-bold">{r.year}</td>
                      <td className="px-4 py-3 text-amber-400 font-mono">{r.rent}</td>
                      <td className="px-4 py-3 text-slate-200 font-mono">{r.noi}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono">{r.cumNOI}</td>
                      <td className="px-4 py-3 text-green-400 font-mono font-semibold">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-slate-500">Assumes 90% avg occupancy, 3% annual NNN rent escalation, 8.5% exit cap rate. Development cost excludes financing costs. Land pricing based on Mission avg $219K/AC  --  actual site pricing must be verified.</p>
        </SectionWrap>

        {/* ── SCENARIOS ── */}
        <SectionWrap id="scenarios">
          <p className="eyebrow">Development Scenarios</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-8">Three Paths Forward</h2>
          <div className="grid lg:grid-cols-3 gap-5">
            {SCENARIOS.map((s, i) => (
              <div key={i} className={`bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-7 border-t-[3px] ${s.color} ${s.featured ? 'ring-1 ring-amber-400/30 scale-[1.02]' : ''} relative`}>
                {s.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-[#0d1b2a] text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">RECOMMENDED</div>}
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${s.badge}`}>{s.name}</span>
                <h3 className="text-white font-bold text-lg mb-1">{s.label}</h3>
                <p className="text-slate-400 text-sm mb-5">{s.desc}</p>
                <div className="space-y-2 text-sm mb-5">
                  {[
                    { label: 'Building SF',      value: s.sf + ' SF' },
                    { label: 'Land Cost (est.)',  value: s.landCost },
                    { label: 'Dev Cost',          value: s.devCost },
                    { label: 'Total Investment',  value: s.totalInvestment },
                    { label: 'Gross Rent (100%)', value: s.grossRent },
                    { label: 'NOI (90% occ.)',    value: s.noi },
                    { label: 'Cap Rate',          value: s.capRate },
                    { label: 'Est. Value',        value: s.estValue },
                  ].map((r, j) => (
                    <div key={j} className="flex justify-between border-b border-[#2a3a4a] pb-1.5 last:border-0">
                      <span className="text-slate-400">{r.label}</span>
                      <span className="text-white font-semibold">{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Levered IRR</p>
                    <p className="text-white font-bold">{s.irr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Risk Level</p>
                    <p className={`font-bold ${s.riskColor}`}>{s.risk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-6">Land cost estimates based on Mission avg $219,747/AC. Construction at $180/SF. Actual site pricing and zoning must be confirmed before financial commitments. These are pre-feasibility estimates only.</p>
        </SectionWrap>

        {/* ── RISKS ── */}
        <SectionWrap id="risks">
          <p className="eyebrow">Due Diligence</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Risks & Mitigating Factors</h2>
          <div className="space-y-4">
            {RISKS.map((r, i) => (
              <div key={i} className={`border rounded-xl p-5 ${r.color}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="font-semibold text-sm">{r.risk}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${r.color} whitespace-nowrap flex-shrink-0`}>{r.level}</span>
                </div>
                <div className="flex items-start gap-3 pl-7">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm"><strong className="text-green-400">Mitigant:</strong> {r.mitigant}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── VERDICT ── */}
        <SectionWrap id="verdict">
          <p className="eyebrow">Professional Recommendation</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Conclusion & Next Steps</h2>
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-slate-400">Verdict:</span>
              <span className="text-3xl font-black text-amber-400">PROCEED WITH CONDITIONS</span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-3xl mb-6">
              5414 S Shary Boulevard sits in one of Mission's most active retail corridors, serving a growing, above-average income residential trade area with minimal direct competition to the south. The fundamental case for a neighborhood shopping center here is solid.
            </p>
            <p className="text-slate-300 leading-relaxed max-w-3xl mb-6">
              However, <strong className="text-white">three items must be verified before any financial commitment:</strong> lot size (critical for buildable SF), current zoning (commercial vs. residential), and traffic counts (determines viable center size). If these confirm a 2+ acre commercially-zoned site with 20,000+ VPD on S Shary Blvd, this becomes a compelling opportunity.
            </p>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              The recommended path is the <strong className="text-amber-400">Base Case (18,000 SF)</strong> with a pre-leasing strategy: secure 1–2 anchor tenants (QSR, dollar store, or medical) before breaking ground. This de-risks lease-up, improves financing terms, and supports a stronger exit cap rate.
            </p>
          </div>

          {/* Action Items */}
          <h3 className="text-white font-semibold text-lg mb-4">Immediate Next Steps</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Pull CAD Record', desc: 'Go to hidalgoad.org → search 5414 S Shary. Get exact lot size, owner of record, legal description, and current assessed value.' },
              { step: '2', title: 'Verify Zoning', desc: 'Call City of Mission Planning Dept. (956-580-8686) or check GIS map. Confirm B-1/B-2 commercial or determine rezoning path/timeline.' },
              { step: '3', title: 'Get Traffic Count', desc: 'Pull TxDOT count on S Shary Blvd at this location (txdot.gov/traffic-count-maps). 20K+ VPD = strong; 10–20K = strip viable; <10K = re-evaluate.' },
              { step: '4', title: 'Negotiate Land Price', desc: 'With lot size confirmed, target $180–$200K/AC based on Mission avg and distance from prime N Shary nodes. Below-avg price improves margin significantly.' },
              { step: '5', title: 'Pre-lease Anchor', desc: 'Approach Dollar General, Dominos Pizza, Subway, or a medical/dental chain before committing to full development. One anchor dramatically improves project economics.' },
              { step: '6', title: 'Get GC Bids', desc: 'Engage 2–3 South Texas GCs for preliminary pricing on 8,000–18,000 SF strip concept. Confirm construction costs are in $160–$190/SF range for RGV market.' },
            ].map((item) => (
              <div key={item.step} className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 font-black text-sm flex items-center justify-center flex-shrink-0">{item.step}</div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── SOURCES ── */}
        <SectionWrap id="sources">
          <p className="eyebrow">Data Sources</p>
          <h2 className="font-serif text-3xl text-white font-bold mb-6">Sources & Disclosures</h2>
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-6 mb-6">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              This Feasibility Study is prepared by Juan Jose Elizondo, RE/MAX Elite, for informational purposes only. All financial projections, market statistics, and development assumptions are estimates based on publicly available third-party data. Lot size, zoning, utilities, and actual land pricing must be independently verified. This report does not constitute an appraisal, legal advice, or a guarantee of returns. All projections involve inherent uncertainty and actual results may differ materially.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Mission, TX Population & Demographics: World Population Review, Mission EDC, U.S. Census Bureau 2024',
              'Avg Retail Rent $23/SF NNN: LoopNet Mission TX Retail Space for Lease data, Q1 2026',
              'Commercial Land Pricing $219,747/AC: LandSearch.com, 139 active Mission commercial listings',
              'Shary Town Plaza: MyRGV.com, October 2023  --  Domain Development press release',
              'Mirabelle Plaza / Domain Development: Domain Development press release via MyRGV.com',
              'Shary Plaza (CBG): CBG Commercial Real Estate listing  --  cbgcre.com',
              'Market at Sharyland Place: LoopNet Listing #38745509  --  Kimco Realty',
              'Texas Retail Market: TRERC (Texas Real Estate Research Center) Commercial Fall 2025',
              'Sharyland Income Demographics: NeighborhoodScout.com',
              'Mission TX Income: Mission EDC demographics page, U.S. Census Bureau 2024',
              'Construction Costs: Cushman & Wakefield 2025 U.S. Retail Fit Out Cost Guide',
              'Lot size, zoning, tax data: Hidalgo County Appraisal District (hidalgoad.org)  --  MUST VERIFY',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#111827] border border-[#2a3a4a] rounded-lg p-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <p className="text-slate-400 text-xs">{s}</p>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── CONTACT ── */}
        <section className="px-6 lg:px-12 py-14">
          <p className="eyebrow">Your Advisor</p>
          <div className="bg-[#1a2535] border border-[#2a3a4a] rounded-xl p-8 max-w-md">
            <p className="font-serif text-2xl text-white font-bold mb-1">Juan Jose Elizondo</p>
            <p className="text-amber-400 font-semibold mb-1">RE/MAX Elite</p>
            <p className="text-slate-400 text-sm mb-6">Commercial Real Estate Advisor · Rio Grande Valley, TX</p>
            <div className="space-y-3">
              <a href="tel:9563937828" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors text-sm">
                <Phone className="w-4 h-4 text-amber-400" />(956) 393-7828
              </a>
              <a href="mailto:elizondojuanjose@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors text-sm">
                <Mail className="w-4 h-4 text-amber-400" />elizondojuanjose@gmail.com
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
