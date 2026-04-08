"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  ArrowRight, ShieldCheck, TrendingUp, PieChart, Activity, 
  FileText, Zap, Lock, RefreshCw, CheckCircle2, ChevronRight,
  Wallet, BarChart3, LineChart, Globe, ChevronDown, Check
} from "lucide-react"

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  return (
    <div className="min-h-screen bg-[#0A0B10] text-gray-50 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0A0B10]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <span className="text-xl font-bold tracking-tighter text-blue-500">∆</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">DeltaView</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#tax" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Tax Reporting</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Security</a>
            <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-[#0A0B10] hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32">
        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>The unified portfolio tracker for Indian investors</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-6 leading-tight"
          >
            Stop Switching Tabs. <br className="hidden md:block" />
            Start Tracking Wealth.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed"
          >
            Connect Zerodha, Groww, and Upstox in seconds. Get real-time XIRR, automate tax reports, and uncover hidden portfolio risks—all in one unified dashboard.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
              Track Your Portfolio Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center gap-2">
              View Live Demo
            </a>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-4"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-bit Encryption</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> Read-only Access</span>
          </motion.p>

          {/* DASHBOARD PREVIEW MOCKUP */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-blue-500/30 to-purple-500/10 opacity-50 blur-lg" />
            <div className="relative rounded-2xl bg-[#12141C] border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-2">
               {/* Faux Browser Window */}
               <div className="w-full h-8 bg-[#1A1C25] border-b border-white/5 rounded-t-xl flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80" />
               </div>
               <div className="w-full h-[500px] md:h-[700px] relative rounded-b-xl overflow-hidden bg-[#0A0B10]">
                 {/* Overlay to prevent scrolling/interaction issues while acting as an image */}
                 <div className="absolute inset-0 z-10 pointer-events-none" />
                 <img 
                   src="/dashboard-screenshot.png" 
                   alt="DeltaView Dashboard Live Mockup" 
                   className="w-full h-full object-cover object-top border-0"
                 />
               </div>
            </div>
          </motion.div>
        </section>

        {/* LOGOS SECTION */}
        <section className="border-y border-white/5 bg-white/[0.02] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400 font-medium mb-6 uppercase tracking-widest">Seamlessly integrates with top Indian brokers</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-3 font-bold text-xl hover:text-blue-400 hover:scale-105 transition-all"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#387ed1] to-blue-600 shadow-lg flex items-center justify-center text-white text-xs">Z</div> Zerodha</div>
               <div className="flex items-center gap-3 font-bold text-xl hover:text-emerald-400 hover:scale-105 transition-all"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d09c] to-emerald-600 shadow-lg flex items-center justify-center text-white text-xs">G</div> Groww</div>
               <div className="flex items-center gap-3 font-bold text-xl hover:text-purple-400 hover:scale-105 transition-all"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5d3bf6] to-purple-600 shadow-lg flex items-center justify-center text-white text-xs">U</div> Upstox</div>
               <div className="flex items-center gap-3 font-bold text-xl hover:text-yellow-400 hover:scale-105 transition-all"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg flex items-center justify-center text-white text-xs">A</div> AngelOne</div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">The pain of scattered wealth. <br/><span className="text-blue-500">Solved.</span></h2>
            <p className="text-lg text-gray-400">
              Stop logging into 4 different apps just to know your net worth. DeltaView aggregates your holdings, calculates your true XIRR, and groups your investments intelligently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-blue-400" />}
              title="Unified Portfolio View"
              desc="View all your stocks, mutual funds, and cash across Zerodha, Groww, and Upstox in one single pane of glass."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
              title="Real-time P&L Tracking"
              desc="Live pricing updates. See your day's P&L, realize vs unrealized gains, and dynamic 30-day mini price charts."
            />
            <FeatureCard 
              icon={<PieChart className="w-6 h-6 text-purple-400" />}
              title="Sector & Risk Exposure"
              desc="Visual donut charts and treemaps breaking down your allocation by sector, market cap, and asset class."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-pink-400" />}
              title="True Portfolio XIRR"
              desc="Calculate accurate annualized returns factoring in every sip, deposit, dividend, and withdrawal across brokers."
            />
            <FeatureCard 
              icon={<Wallet className="w-6 h-6 text-orange-400" />}
              title="Smart Ledger & Funds"
              desc="A passbook-style ledger translating cryptic broker codes into human-readable fund additions and withdrawals."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-blue-400" />}
              title="Corporate Actions"
              desc="Never miss out on dividends, bonuses, or splits. We automatically track and log them against your holdings."
            />
          </div>
        </section>

        {/* TAX REPORTING SHOWCASE */}
        <section id="tax" className="py-24 bg-gradient-to-b from-[#0A0B10] to-[#11131A] border-t border-white/5 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-1/2 h-full bg-emerald-500/5 blur-[200px] pointer-events-none" />
           
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Tax season? <br/>
                    <span className="text-emerald-400">Handled automatically.</span>
                  </h2>
                  <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    Save hours of manual calculation. DeltaView automatically categorizes your trades into STCG and LTCG, applies the ₹1L exemption rules, and gives you your exact tax liability.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "FIFO-based realized P&L calculation", 
                      "Clear STCG (15%) & LTCG (10%) breakdown", 
                      "Export ready-to-file reports for your CA",
                      "Granular trade log with charges (STT, Brokerage)"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/register" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                    See tax calculator in action <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Simulated UI Component for Tax */}
                <div className="relative">
                   <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-500/30 to-blue-500/30 rounded-2xl blur opacity-50" />
                   <div className="relative bg-[#1A1C25] border border-white/10 rounded-2xl p-8 shadow-2xl">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Total Tax Liability (FY 24-25)</p>
                          <h3 className="text-3xl font-bold text-white mt-1">₹ 24,500</h3>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-sm">
                          FY 2024-25
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <p className="font-medium text-white">Short Term (STCG)</p>
                            <p className="text-xs text-gray-400">Gains: ₹1,50,000 @ 15%</p>
                          </div>
                          <p className="font-bold text-red-400">₹ 22,500</p>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                          <div>
                             <div className="flex items-center gap-2">
                                <p className="font-medium text-white">Long Term (LTCG)</p>
                                <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded uppercase font-bold tracking-wider">₹1L Exempt</span>
                             </div>
                            <p className="text-xs text-gray-400">Gains: ₹1,20,000 @ 10%</p>
                          </div>
                          <p className="font-bold text-red-400">₹ 2,000</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 border-t border-white/5">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">3 Steps to Financial Clarity</h2>
             
             <div className="grid md:grid-cols-3 gap-12 relative">
               {/* Connecting lines for md+ screens */}
               <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 z-[-1]" />

               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl font-bold mb-6 backdrop-blur-sm">1</div>
                 <h3 className="text-xl font-bold text-white mb-3">Connect Broker</h3>
                 <p className="text-gray-400 text-center">Securely connect your Zerodha, Groww, or Upstox account via official OAuth integrations.</p>
               </div>
               
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold mb-6 backdrop-blur-sm">2</div>
                 <h3 className="text-xl font-bold text-white mb-3">Auto-Sync</h3>
                 <p className="text-gray-400 text-center">DeltaView fetches your holdings, trades, and ledger data, updating prices in real-time.</p>
               </div>

               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl font-bold mb-6 backdrop-blur-sm">3</div>
                 <h3 className="text-xl font-bold text-white mb-3">Analyze & Optimize</h3>
                 <p className="text-gray-400 text-center">View heatmaps, analyze sector exposure, track corporate actions, and plan your taxes.</p>
               </div>
             </div>
           </div>
        </section>

        {/* SECURITY & TRUST */}
        <section id="security" className="py-24 bg-[#11131A] border-y border-white/5">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-6" />
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bank-Grade Security. Zero Stress.</h2>
             <p className="text-lg text-gray-400 mb-12">
               Your financial data is yours. We use official API integrations provided by brokers to fetch data on a strictly <span className="text-white font-semibold">read-only basis</span>. We cannot execute trades or withdraw funds.
             </p>
             <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <Lock className="w-6 h-6 text-emerald-400 mb-4" />
                  <h4 className="text-white font-bold mb-2">256-Bit Encryption</h4>
                  <p className="text-sm text-gray-400">All data in transit and at rest is secured using industry-standard AES-256 encryption.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <RefreshCw className="w-6 h-6 text-emerald-400 mb-4" />
                  <h4 className="text-white font-bold mb-2">Official APIs Only</h4>
                  <p className="text-sm text-gray-400">No screen scraping or password sharing. We use OAuth 2.0 flows supported directly by brokers.</p>
                </div>
             </div>
           </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">Loved by Investors</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard 
                quote="The STCG/LTCG summary alone is worth its weight in gold. I used to spend days matching trades in Excel before tax filing. Now it takes 5 minutes."
                name="Rahul Sharma"
                role="Retail Investor"
              />
              <TestimonialCard 
                quote="Finally, an app that shows me my ACTUAL portfolio returns (XIRR) across all my accounts, including historical dividends. DeltaView is incredibly polished."
                name="Priya Desai"
                role="Active Trader"
              />
              <TestimonialCard 
                quote="I had investments scattered across Zerodha and an old Upstox account. Seeing everything combined with sector exposure heatmaps completely changed my strategy."
                name="Amit Kumar"
                role="Long-term Investor"
              />
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 border-b border-white/5 relative">
           <div className="absolute right-0 top-0 w-1/3 h-full bg-purple-500/5 blur-[150px] pointer-events-none" />
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
               <p className="text-lg text-gray-400">Track and optimize your wealth with plans built for every stage of your journey.</p>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="p-8 rounded-2xl bg-[#12141C] border border-white/5 hover:border-blue-500/30 transition-all">
                  <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                  <p className="text-gray-400 mb-6">Essential tracking for casual investors.</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-white">₹0</span>
                    <span className="text-gray-500 font-medium">/ forever</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Connect up to 2 brokers</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Real-time P&L tracking</li>
                    <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Basic XIRR calculation</li>
                  </ul>
                  <Link href="/auth/register" className="w-full py-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white transition-all block text-center border border-white/10">
                    Get Started Free
                  </Link>
                </div>
                
                <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-900/40 to-[#12141C] border border-blue-500/30 relative transform md:-translate-y-4 shadow-2xl shadow-blue-500/10 hover:border-blue-400/50 transition-all">
                  <div className="absolute top-0 inset-x-0 mx-auto -translate-y-1/2 w-max px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro Data</h3>
                  <p className="text-blue-200/60 mb-6">Advanced tax planning and analytics.</p>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-white">₹499</span>
                    <span className="text-blue-200/60 font-medium">/ year</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-gray-200"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Unlimited broker connections</li>
                    <li className="flex items-center gap-3 text-gray-200"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Automated STCG & LTCG reports</li>
                    <li className="flex items-center gap-3 text-gray-200"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Sector depth & risk heatmaps</li>
                    <li className="flex items-center gap-3 text-gray-200"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Priority API sync (1-min delay)</li>
                  </ul>
                  <Link href="/auth/register" className="w-full py-4 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all block text-center">
                    Upgrade to Pro
                  </Link>
                </div>
             </div>
           </div>
        </section>

        {/* FAQ */}
        <section className="py-24 border-b border-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <FAQItem 
                id={0}
                question="Which brokers are currently supported?"
                answer="We currently support direct integrations with Zerodha (Kite Connect), Groww, and Upstox. We are actively working on adding Angel One and ICICI Direct."
                activeFaq={activeFaq}
                setActiveFaq={setActiveFaq}
              />
              <FAQItem 
                id={1}
                question="Can DeltaView make trades on my behalf?"
                answer="Absolutely not. We request purely read-only access from your brokers. It is technically impossible for DeltaView to execute trades, modify positions, or withdraw funds."
                activeFaq={activeFaq}
                setActiveFaq={setActiveFaq}
              />
              <FAQItem 
                id={2}
                question="Is DeltaView free to use?"
                answer="Yes! Our core features including portfolio tracking, real-time P&L, and 30-day price charts are entirely free. We may introduce premium features for advanced tax planning in the future."
                activeFaq={activeFaq}
                setActiveFaq={setActiveFaq}
              />
              <FAQItem 
                id={3}
                question="How does the tax calculation work?"
                answer="Our system uses the First-In-First-Out (FIFO) method to calculate realized gains on closed trades. We automatically classify them as Short-Term (STCG) or Long-Term (LTCG) based on holding periods and apply relevant Indian tax rules (like the ₹1L/₹1.25L exemption)."
                activeFaq={activeFaq}
                setActiveFaq={setActiveFaq}
              />
            </div>
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Take Control of Your Wealth</h2>
             <p className="text-xl text-blue-100/70 mb-10">Join thousands of Indian investors tracking their net worth smarter.</p>
             <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white text-blue-600 shadow-lg shadow-white/10 hover:bg-gray-50 transition-all hover:scale-105">
               Create Free Account <ArrowRight className="w-5 h-5" />
             </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#08090D] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
             <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <span className="text-xl font-bold tracking-tighter text-blue-500">∆</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white font-display">DeltaView</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The ultimate unified portfolio intelligence platform for the modern Indian investor.
                </p>
             </div>
             
             <div>
               <h4 className="text-white font-semibold mb-4">Product</h4>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Tax Calculator</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-semibold mb-4">Company</h4>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-semibold mb-4">Legal</h4>
               <ul className="space-y-3 text-sm text-gray-400">
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
               </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} DeltaView Technologies. All rights reserved.</p>
            <p className="text-xs">
              Made with ❤️ for Indian Investors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-colors relative group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, role }: { quote: string, name: string, role: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#12141C] border border-white/5 relative">
      <div className="text-4xl text-blue-500/20 absolute top-4 right-4 font-serif">"</div>
      <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm overflow-hidden">
          <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=transparent`} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold">{name}</h4>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ id, question, answer, activeFaq, setActiveFaq }: any) {
  const isActive = activeFaq === id;
  return (
    <div className="border border-white/5 bg-[#12141C] rounded-xl overflow-hidden transition-all">
      <button 
        className="w-full text-left p-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={() => setActiveFaq(isActive ? null : id)}
      >
        <h4 className="text-white font-medium pr-8">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isActive ? "rotate-180 text-blue-400" : ""}`} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
          {answer}
        </div>
      </motion.div>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
