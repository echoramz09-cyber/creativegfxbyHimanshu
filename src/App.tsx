/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Zap, ArrowRight, MousePointer2, Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-deep-void overflow-x-hidden">
      {/* Background Lightning Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        
        {/* Background Animation Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-[80%] h-[80%] border border-electric-blue/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-[60%] h-[60%] border border-cyan-400/10 rounded-full blur-2xl"
            />
            <Zap className="text-electric-blue/20 w-64 h-64 absolute drop-shadow-[0_0_30px_rgba(0,242,255,0.2)]" />
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center glow-border group-hover:scale-110 transition-transform">
            <Zap className="text-deep-void fill-deep-void" size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter text-white uppercase">Creative GFX <span className="text-electric-blue">By Himanshu</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400"
        >
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-electric-blue transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue transition-all group-hover:w-full" />
            </a>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
        >
          Let's Talk
        </motion.button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} />
            Available for new projects
          </div>
          
          <h1 className="font-display text-6xl md:text-9xl font-bold leading-[0.85] tracking-tighter text-white mb-10 max-w-5xl">
            CREATIVE GFX <br />
            <span className="lightning-text italic">BY HIMANSHU</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed">
            Specializing in high-impact visual identities and electric digital experiences that spark growth.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-electric-blue text-deep-void font-bold rounded-2xl flex items-center gap-2 glow-border text-lg"
            >
              View Portfolio <ArrowRight size={24} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-lg backdrop-blur-md"
            >
              My Process
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Years Experience', value: '08+' },
              { label: 'Projects Completed', value: '150+' },
              { label: 'Happy Clients', value: '90+' },
              { label: 'Design Awards', value: '12' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
