import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, History, Layout, Rocket, Sparkles, ChevronRight } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { PitchForm, PitchFormData } from './components/PitchForm'
import { PitchChat, Slide } from './components/PitchChat'
import { useAuth } from './hooks/useAuth'
import { blink } from './lib/blink'
import { toast } from 'react-hot-toast'

interface PitchRecord {
  id: string
  startupName: string
  industry: string
  slides: string
  createdAt: string
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&q=80&w=2000"

export default function App() {
  const { user, loading: authLoading, isAuthenticated, login } = useAuth()
  const [view, setView] = useState<'hero' | 'form' | 'deck' | 'history'>('hero')
  const [currentSlides, setCurrentSlides] = useState<Slide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<PitchRecord[]>([])
  const [formData, setFormData] = useState<PitchFormData | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory()
      setView('form')
    } else {
      setView('hero')
    }
  }, [isAuthenticated])

  const loadHistory = async () => {
    try {
      const records = await blink.db.pitches.list({
        orderBy: { createdAt: 'desc' },
        limit: 10
      })
      setHistory(records as unknown as PitchRecord[])
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleGenerate = async (data: PitchFormData) => {
    setIsGenerating(true)
    setFormData(data)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `You are STARTZEN, an elite startup strategist. Generate a compelling 6-slide investor-ready pitch deck for a startup named "${data.startupName}".
        The main theme/vision is: ${data.mainTheme}.
        
        Using only this name and theme, extrapolate a professional business plan including:
        1. Title Slide (Catchy tagline)
        2. The Problem (What pain point does this vision address?)
        3. The Solution (How does "${data.startupName}" solve it uniquely?)
        4. Market Opportunity (Who is the target audience and what is the market scale?)
        5. Business Model (How will it make money based on this theme?)
        6. The Vision/Call to Action (The long-term impact).
        
        Make the content professional, compelling, and ready for VC scrutiny.`,
        schema: {
          type: 'object',
          properties: {
            slides: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  type: { type: 'string', enum: ['title', 'problem', 'solution', 'market', 'team', 'ask'] },
                  bulletPoints: { type: 'array', items: { type: 'string' } }
                },
                required: ['title', 'content', 'type']
              }
            }
          },
          required: ['slides']
        }
      })

      const generatedSlides = (object as any).slides as Slide[]
      setCurrentSlides(generatedSlides)
      setView('deck')

      // Save to database
      if (user) {
        await blink.db.pitches.create({
          userId: user.id,
          startupName: data.startupName,
          industry: 'STARTZEN AI',
          details: JSON.stringify(data),
          slides: JSON.stringify(generatedSlides)
        })
        loadHistory()
      }
      
      toast.success('Pitch deck generated successfully!')
    } catch (error) {
      console.error('Generation failed:', error)
      toast.error('Failed to generate pitch deck. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectHistoryItem = (record: PitchRecord) => {
    setCurrentSlides(JSON.parse(record.slides))
    setFormData(JSON.parse(record.details))
    setView('deck')
  }

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Hero Section */}
              <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
                </div>
                
                <div className="relative z-20 text-center space-y-12 max-w-5xl mx-auto px-6 py-32">
                  <div className="space-y-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-primary/5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-primary border border-primary/10"
                    >
                      <Sparkles size={14} />
                      <span>The Global Standard for Startup Strategy</span>
                    </motion.div>
                    <h1 className="text-7xl sm:text-[9rem] font-black tracking-tighter leading-[0.85] font-serif">
                      Pitch <span className="text-primary italic">Better</span>.<br />
                      Raise <span className="text-primary italic">Faster</span>.
                    </h1>
                    <p className="text-xl sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                      Transform your startup vision into a compelling strategic narrative that captures investors' attention in seconds.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                      onClick={login}
                      className="px-12 py-6 bg-primary text-primary-foreground rounded-full text-xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-primary/30"
                    >
                      Analyze My Vision <ChevronRight size={24} />
                    </button>
                    <button className="px-12 py-6 rounded-full text-xl font-bold border-2 border-border/50 hover:bg-secondary transition-all">
                      Browse Gallery
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-24 border-t border-border/40">
                    {[
                      { label: 'Founders Helped', value: '50K+' },
                      { label: 'Capital Raised', value: '$2.5B+' },
                      { label: 'Success Velocity', value: '4.2x' },
                      { label: 'Time Efficiency', value: '98%' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <section className="py-32 px-4 bg-secondary/30">
                <div className="max-w-6xl mx-auto space-y-20">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black font-serif">Everything You Need To Secure Funding</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Stop spending weeks on slides. Focus on your business while we handle the design and strategy.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "AI Strategy Engine",
                        desc: "Our AI understands what investors want to see and structures your deck for maximum impact.",
                        icon: Sparkles
                      },
                      {
                        title: "Designer Quality",
                        desc: "Beautiful, professional layouts that look like they cost thousands of dollars to create.",
                        icon: Layout
                      },
                      {
                        title: "Investor-Ready",
                        desc: "Follows proven structures used by top Y-Combinator and Sequoia-backed startups.",
                        icon: Rocket
                      }
                    ].map((feature, i) => (
                      <div key={i} className="p-8 glass-morphism rounded-[2rem] space-y-4 border-zinc-200">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground">
                          <feature.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-32 pb-20 px-4 space-y-12 max-w-4xl mx-auto"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">STARTZEN</h2>
                <p className="text-muted-foreground font-medium text-lg">Define your vision. We'll handle the strategy.</p>
              </div>
              <PitchForm onSubmit={handleGenerate} isLoading={isGenerating} />
              
              {history.length > 0 && (
                <div className="pt-20 space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    <History size={24} /> Recent Pitches
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectHistoryItem(item)}
                        className="glass-morphism p-6 rounded-3xl text-left hover:scale-[1.02] transition-all group border-border"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Rocket size={20} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold mb-1">{item.startupName}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{item.industry}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'deck' && (
            <motion.div
              key="deck"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32 pb-20 px-4 space-y-12"
            >
              <div className="flex justify-between items-center max-w-4xl mx-auto">
                <button
                  onClick={() => setView('form')}
                  className="px-6 py-3 rounded-full border-2 border-primary/10 font-bold hover:bg-secondary transition-all flex items-center gap-2"
                >
                  <Plus size={20} /> New Pitch
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-black tracking-tight">AI Strategy Insight</h2>
                </div>
                <div className="w-32" /> {/* Spacer */}
              </div>
              <PitchChat 
                slides={currentSlides} 
                onRegenerate={() => setView('form')} 
                startupName={formData?.startupName || 'Your Startup'} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="py-20 border-t border-primary/5 text-center">
        <div className="space-y-4">
          <p className="text-xl font-serif italic text-primary">"Crafted by Abhi"</p>
          <p className="text-sm font-medium text-muted-foreground">&copy; 2026 STARTZEN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
