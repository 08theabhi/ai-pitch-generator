import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Rocket, Sparkles, Brain } from 'lucide-react'

export interface PitchFormData {
  startupName: string
  mainTheme: string
}

interface PitchFormProps {
  onSubmit: (data: PitchFormData) => void
  isLoading: boolean
}

export function PitchForm({ onSubmit, isLoading }: PitchFormProps) {
  const [formData, setFormData] = useState<PitchFormData>({
    startupName: '',
    mainTheme: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isFormComplete = () => {
    return formData.startupName && formData.mainTheme
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-morphism rounded-[3rem] p-12 shadow-2xl relative border-border/40 bg-white/80 dark:bg-zinc-900/80">
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-primary/60 ml-1">Startup Name</label>
            <input
              type="text"
              name="startupName"
              value={formData.startupName}
              onChange={handleChange}
              placeholder="e.g. Acme AI"
              className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-lg font-bold placeholder:font-medium"
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-primary/60 ml-1">Main Theme / Vision</label>
            <textarea
              name="mainTheme"
              value={formData.mainTheme}
              onChange={handleChange}
              rows={4}
              placeholder="What is the core vision or theme of your startup? e.g. Sustainable energy for urban cities..."
              className="w-full bg-secondary/50 border border-border/50 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none text-lg font-bold leading-relaxed placeholder:font-medium"
            />
          </div>

          <button
            onClick={() => onSubmit(formData)}
            disabled={isLoading || !isFormComplete()}
            className="w-full px-8 py-6 bg-primary text-primary-foreground rounded-full font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-2xl shadow-primary/30 mt-6"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Crafting Strategy...</span>
              </>
            ) : (
              <>
                Generate Strategy <Sparkles size={24} />
              </>
            )}
          </button>
        </div>
      </div>
      
      <p className="text-center mt-10 text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-60">
        PROCESSED BY <span className="text-primary">STARTZEN ENGINE</span> V2.4
      </p>
    </div>
  )
}