/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useSpring, useTransform, useInView } from "motion/react";
import { Zap, ArrowRight, MousePointer2, Sparkles, ChevronDown, Phone, Mail, MapPin, Instagram, Linkedin, MessageSquare, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-electric-blue"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            boxShadow: "0 0 8px var(--color-electric-blue)",
          }}
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            x: [
              Math.random() * 100 + "vw",
              Math.random() * 100 + "vw",
              Math.random() * 100 + "vw"
            ],
            y: [
              Math.random() * 100 + "vh",
              Math.random() * 100 + "vh",
              Math.random() * 100 + "vh"
            ],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-deep-void overflow-x-hidden flex flex-col">
      {/* Background Lightning Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/10 blur-[60px] md:blur-[100px] rounded-full animate-pulse will-change-[opacity,transform]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[60px] md:blur-[100px] rounded-full animate-pulse delay-700 will-change-[opacity,transform]" />
        
        <ParticleBackground />
        
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
              className="w-[80%] h-[80%] border border-electric-blue/20 rounded-full blur-md md:blur-lg will-change-transform"
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
              className="absolute w-[60%] h-[60%] border border-cyan-400/10 rounded-full blur-lg md:blur-xl will-change-transform"
            />
            <Zap className="text-electric-blue/20 w-64 h-64 absolute drop-shadow-[0_0_20px_rgba(0,242,255,0.15)]" />
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-sans font-bold text-xl tracking-tighter text-white uppercase">Creative GFX <span className="text-electric-blue">By Himanshu</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-4 text-sm font-medium"
        >
          {[
            { name: 'About', href: '#about' },
            { name: 'Work', href: '#work' },
            { name: 'Tools', href: '#services' },
            { name: 'Contact', href: '#contact' }
          ].map((item) => (
            <motion.a 
              key={item.name} 
              href={item.href} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-electric-blue hover:bg-white/10 transition-all md:backdrop-blur-sm"
            >
              {item.name}
            </motion.a>
          ))}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12 text-center flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Available for new projects
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.85] tracking-tighter text-white mb-6 max-w-4xl">
            CREATIVE GFX <br />
            <span className="lightning-text italic">BY HIMANSHU</span>
          </h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-electric-blue font-bold text-sm md:text-base mb-8 tracking-widest uppercase"
          >
            Trusted by <Counter value={1000} />+ Clients
          </motion.div>
          
          <p className="text-slate-400 text-base md:text-xl max-w-xl mb-8 leading-relaxed">
            Specializing in high-impact visual identities and electric digital experiences that spark growth.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#work"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-electric-blue text-deep-void font-bold rounded-2xl flex items-center gap-2 glow-border text-base cursor-pointer"
            >
              View Portfolio <ArrowRight size={20} />
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-base md:backdrop-blur-md cursor-pointer"
            >
              Social Links
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="text-electric-blue" size={24} />
          </motion.div>
        </motion.div>
      </main>

      {/* About Me Section */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">
              ABOUT <span className="text-electric-blue">ME</span>
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                I am Himanshu, a passionate graphic designer dedicated to pushing the boundaries of visual storytelling. With a focus on electric digital experiences, I blend creativity with technical precision to deliver high-impact GFX.
              </p>
              <p>
                My mission is to spark growth for brands through innovative design solutions that resonate with audiences and leave a lasting impression in the digital void.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="text-electric-blue w-32 h-32 opacity-20 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-deep-void/80 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="text-white font-bold text-xl mb-1">Himanshu</div>
              <div className="text-electric-blue text-sm uppercase tracking-widest font-bold">Creative Director</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section id="work" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase">
            Recent <span className="text-electric-blue">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A showcase of high-voltage visual identities and digital masterpieces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <motion.div
              key={project}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: project * 0.1 }}
              className="group relative"
            >
              {/* Cornered Border Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-electric-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img 
                  src={`https://picsum.photos/seed/gfx-${project}/1280/720`} 
                  alt={`Project ${project}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-deep-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6">
                  <div className="w-12 h-12 rounded-full bg-electric-blue flex items-center justify-center mb-4 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Zap className="text-deep-void" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">Visual Identity {project}</h3>
                  <p className="text-electric-blue text-xs font-bold uppercase tracking-widest">Branding • GFX</p>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section id="services" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter uppercase">
            Tools <span className="text-electric-blue">I Use</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The industry-standard arsenal I use to craft high-impact visual experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Photoshop', icon: 'Ps', color: 'bg-[#001E36]', textColor: 'text-[#31A8FF]' },
            { name: 'Illustrator', icon: 'Ai', color: 'bg-[#330000]', textColor: 'text-[#FF9A00]' },
            { name: 'Canva', icon: 'Cv', color: 'bg-[#00C4CC]/10', textColor: 'text-[#00C4CC]' },
            { name: 'Corel Draw', icon: 'Cd', color: 'bg-[#004B23]/20', textColor: 'text-[#00FF41]' },
          ].map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className={`absolute inset-0 ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-16 h-16 rounded-xl ${tool.color} border border-white/10 flex items-center justify-center text-2xl font-bold ${tool.textColor} mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                {tool.icon}
              </div>
              
              <h3 className="text-white font-bold text-lg relative z-10 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-electric-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] md:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Years Experience', value: 8, suffix: '+' },
              { label: 'Projects Completed', value: 150, suffix: '+' },
              { label: 'Happy Clients', value: 90, suffix: '+' },
              { label: 'Design Awards', value: 12, suffix: '' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                  <Counter value={stat.value} />{stat.suffix}
                </div>
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section id="contact" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter uppercase">
              Get in <span className="text-electric-blue">Touch</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-md">
              Ready to spark your next project? Let's collaborate and create something legendary.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Phone size={24} />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: <Mail size={24} />, label: 'Email', value: 'hello@himanshu.gfx', href: 'mailto:hello@himanshu.gfx' },
                { icon: <MapPin size={24} />, label: 'Location', value: 'New Delhi, India', href: '#' },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-electric-blue group-hover:bg-electric-blue group-hover:text-deep-void transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-white font-bold text-lg group-hover:text-electric-blue transition-colors">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Social Connect</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Instagram', icon: <Instagram size={20} />, href: '#', color: 'hover:bg-pink-600' },
                { name: 'Discord', icon: <MessageSquare size={20} />, href: '#', color: 'hover:bg-[#5865F2]' },
                { name: 'LinkedIn', icon: <Linkedin size={20} />, href: '#', color: 'hover:bg-[#0A66C2]' },
                { name: 'Behance', icon: <ExternalLink size={20} />, href: '#', color: 'hover:bg-[#0057FF]' },
              ].map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
                >
                  {social.icon}
                  <span className="font-bold text-sm">{social.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-electric-blue/10 border border-electric-blue/20">
              <div className="flex items-center gap-3 text-electric-blue mb-2">
                <Sparkles size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Quick Response</span>
              </div>
              <p className="text-slate-400 text-sm">
                I usually respond within 24 hours. Let's start building your brand's visual legacy today.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="font-sans font-bold text-xl tracking-tighter text-white uppercase mb-4">
            Creative GFX <span className="text-electric-blue">By Himanshu</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Himanshu GFX. All rights reserved. Crafted with precision and electricity.
          </p>
        </div>
      </footer>
    </div>
  );
}
