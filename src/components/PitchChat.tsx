import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MessageSquare, Share2, Download, RefreshCcw, User, Bot, CheckCircle2 } from 'lucide-react'

export interface Slide {
  title: string
  content: string
  type: 'title' | 'problem' | 'solution' | 'market' | 'team' | 'ask'
  bulletPoints?: string[]
}

interface PitchChatProps {
  slides: Slide[]
  onRegenerate: () => void
  startupName: string
}

export function PitchChat({ slides, onRegenerate, startupName }: PitchChatProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <RefreshCcw size={16} /> New Session
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"><Share2 size={18} /></button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"><Download size={18} /></button>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {/* User Input "Message" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 justify-end"
        >
          <div className="chat-bubble-user max-w-[80%]">
            <p className="font-medium">Generate a pitch for <span className="font-bold underline">"{startupName}"</span>. Focus on the core vision and strategy.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
            <User size={20} />
          </div>
        </motion.div>

        {/* AI Response "Messages" */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0 border border-border">
              <Bot size={20} />
            </div>
            <div className="flex-1 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="chat-bubble-ai"
              >
                <div className="flex items-center gap-2 mb-4 text-primary font-bold text-xs uppercase tracking-widest">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>STARTZEN INTELLIGENCE</span>
                </div>
                <p className="text-xl font-bold leading-tight text-primary mb-2 font-serif">
                  Analysis Complete.
                </p>
                <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                  I've processed your vision for <span className="text-primary font-black underline decoration-primary/30">"{startupName}"</span>. 
                  Below is the investor-ready strategic narrative structured for maximum clarity and impact.
                </p>
              </motion.div>

              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * index + 0.4 }}
                  className="chat-bubble-ai group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="absolute top-4 right-6 text-[10px] font-black tracking-widest uppercase text-primary/40 group-hover:text-primary transition-colors">
                    PHASE 0{index + 1}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">{slide.type}</span>
                  </div>

                  <h3 className="text-3xl font-black mb-6 tracking-tight font-serif text-primary leading-tight">
                    {slide.title}
                  </h3>

                  {slide.bulletPoints ? (
                    <div className="grid gap-4">
                      {slide.bulletPoints.map((point, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 * index + 0.6 + i * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-background/40 border border-border/20 group-hover:border-primary/20 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-muted-foreground font-semibold leading-relaxed">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-background/40 border border-border/20 group-hover:border-primary/20 transition-colors">
                      <p className="text-muted-foreground font-semibold leading-relaxed text-lg">
                        {slide.content}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: slides.length * 0.15 + 0.8 }}
                className="flex flex-col items-center gap-6 pt-12"
              >
                <div className="flex items-center gap-4 w-full text-sm font-black text-primary/30 uppercase tracking-[0.3em]">
                  <div className="h-px flex-1 bg-border/40" />
                  <span>End of Analysis</span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                    <Download size={16} /> Export Strategy PDF
                  </button>
                  <button className="px-8 py-4 border-2 border-border/60 rounded-full font-black text-sm flex items-center gap-2 hover:bg-secondary transition-all">
                    <Share2 size={16} /> Share Insight
                  </button>
                  <button 
                    onClick={onRegenerate}
                    className="px-8 py-4 border-2 border-primary/20 text-primary rounded-full font-black text-sm flex items-center gap-2 hover:bg-primary/5 transition-all"
                  >
                    <RefreshCcw size={16} /> Refine Vision
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
