import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Sparkles, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { user, login, logout, isAuthenticated } = useAuth()
  const logoUrl = "https://v3b.fal.media/files/b/0a8c7d38/j68C2F1QUpTPaCbpS2a0H.png"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism px-8 py-4 rounded-full border-border/40">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden"
          >
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover p-1" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">STARTZEN</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none mt-1">AI Strategist</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Platform</a>
          <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Showcase</a>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-full border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {user?.display_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-bold">{user?.display_name || 'User'}</span>
              </div>
              <button 
                onClick={logout}
                className="p-3 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Sign In
            </button>
          )}
          <button className="md:hidden p-3 hover:bg-secondary rounded-full">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
