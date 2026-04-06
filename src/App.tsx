/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useSpring, useTransform, useInView, AnimatePresence } from "motion/react";
import { Zap, ArrowRight, MousePointer2, Sparkles, ChevronDown, Phone, Mail, MapPin, Instagram, Linkedin, MessageSquare, ExternalLink, Settings, X, Save, Plus, Trash2, LogIn, LogOut, Image as ImageIcon, Type, Link as LinkIcon, Palette } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "./firebase";
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, updateDoc, query, orderBy, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";

const ICON_MAP: Record<string, any> = {
  Instagram, Linkedin, MessageSquare, ExternalLink, Phone, Mail, MapPin, Zap, Sparkles, 
  Github: ExternalLink, Twitter: MessageSquare, Youtube: ExternalLink, Facebook: ExternalLink
};

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Dynamic Data State
  const [config, setConfig] = useState<any>({
    heroTitle: "CREATIVE GFX",
    heroSubtitle: "BY HIMANSHU",
    trustedBy: 1000,
    aboutTitle: "ABOUT ME",
    aboutContent1: "I am Himanshu, a passionate graphic designer dedicated to pushing the boundaries of visual storytelling. With a focus on electric digital experiences, I blend creativity with technical precision to deliver high-impact GFX.",
    aboutContent2: "My mission is to spark growth for brands through innovative design solutions that resonate with audiences and leave a lasting impression in the digital void.",
    aboutRole: "Creative Director",
    aboutImageUrl: "https://picsum.photos/seed/himanshu/800/800",
    aboutImageScale: 1,
    phone: "+91 98765 43210",
    email: "hello@himanshu.gfx",
    location: "New Delhi, India"
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user && (user.email === 'richspoiz09@gmail.com' || user.email === 'himanshugfx@himanshu.gfx'));
    });

    const unsubConfig = onSnapshot(doc(db, "config", "main"), (doc) => {
      if (doc.exists()) setConfig(doc.data());
    });

    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("order")), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubTools = onSnapshot(query(collection(db, "tools"), orderBy("order")), (snap) => {
      setTools(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubSocials = onSnapshot(query(collection(db, "socials"), orderBy("order")), (snap) => {
      setSocials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubAuth();
      unsubConfig();
      unsubProjects();
      unsubTools();
      unsubSocials();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (loginForm.username === 'himanshugfx' && loginForm.password === 'himanshu2009') {
      const email = 'himanshugfx@himanshu.gfx';
      const password = 'himanshu2009';
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setShowLogin(false);
        setLoginForm({ username: '', password: '' });
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            setShowLogin(false);
            setLoginForm({ username: '', password: '' });
          } catch (createErr: any) {
            setLoginError('Auth failed: ' + createErr.message);
          }
        } else {
          setLoginError('Auth failed: ' + err.message);
        }
      }
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setShowAdminPanel(false);
  };

  const updateConfig = async (newData: any) => {
    await setDoc(doc(db, "config", "main"), newData, { merge: true });
  };

  const addProject = async () => {
    await addDoc(collection(db, "projects"), {
      title: "New Project",
      category: "Branding • GFX",
      imageUrl: "https://picsum.photos/seed/new/1280/720",
      order: projects.length,
      scale: 1
    });
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
  };

  const updateProject = async (id: string, data: any) => {
    await updateDoc(doc(db, "projects", id), data);
  };

  const addTool = async () => {
    await addDoc(collection(db, "tools"), {
      name: "New Tool",
      icon: "T",
      color: "bg-white/10",
      textColor: "text-white",
      order: tools.length
    });
  };

  const addSocial = async () => {
    await addDoc(collection(db, "socials"), {
      name: "New Social",
      href: "#",
      iconName: "ExternalLink",
      color: "hover:bg-white/20",
      order: socials.length
    });
  };

  const seedDefaultData = async () => {
    // Seed Config
    await setDoc(doc(db, "config", "main"), config);

    // Seed Socials
    const defaultSocials = [
      { name: 'Instagram', iconName: 'Instagram', href: '#', color: 'hover:bg-pink-600', order: 0 },
      { name: 'Discord', iconName: 'MessageSquare', href: '#', color: 'hover:bg-[#5865F2]', order: 1 },
      { name: 'LinkedIn', iconName: 'Linkedin', href: '#', color: 'hover:bg-[#0A66C2]', order: 2 },
      { name: 'Behance', iconName: 'ExternalLink', href: '#', color: 'hover:bg-[#0057FF]', order: 3 },
    ];
    for (const s of defaultSocials) {
      await addDoc(collection(db, "socials"), s);
    }

    // Seed Tools
    const defaultTools = [
      { name: 'Photoshop', icon: 'Ps', color: 'bg-[#001E36]', textColor: 'text-[#31A8FF]', order: 0 },
      { name: 'Illustrator', icon: 'Ai', color: 'bg-[#330000]', textColor: 'text-[#FF9A00]', order: 1 },
      { name: 'Canva', icon: 'Cv', color: 'bg-[#00C4CC]/10', textColor: 'text-[#00C4CC]', order: 2 },
      { name: 'Corel Draw', icon: 'Cd', color: 'bg-[#004B23]/20', textColor: 'text-[#00FF41]', order: 3 },
    ];
    for (const t of defaultTools) {
      await addDoc(collection(db, "tools"), t);
    }

    // Seed Projects
    for (let i = 1; i <= 6; i++) {
      await addDoc(collection(db, "projects"), {
        title: `Visual Identity ${i}`,
        category: "Branding • GFX",
        imageUrl: `https://picsum.photos/seed/gfx-${i}/1280/720`,
        order: i - 1,
        scale: 1
      });
    }
    alert("Default data seeded! You can now edit everything.");
  };

  return (
    <div className="min-h-screen bg-deep-void overflow-x-hidden flex flex-col">
      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-deep-void z-[100] overflow-y-auto p-6 md:p-12"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Settings className="text-electric-blue w-8 h-8" /> Admin Dashboard
                  </h2>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 242, 255, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={seedDefaultData}
                    className="text-xs uppercase tracking-widest font-bold text-electric-blue border-2 border-electric-blue/30 hover:border-electric-blue px-6 py-2 rounded-full transition-all flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Seed Initial Data
                  </motion.button>
                </div>
                <button 
                  onClick={() => setShowAdminPanel(false)} 
                  className="p-3 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <X className="text-white group-hover:rotate-90 transition-transform" size={28} />
                </button>
              </div>

              <div className="space-y-16 pb-24">
                {/* Hero & About Config */}
                <section className="space-y-8">
                  <h3 className="text-xl font-bold text-electric-blue uppercase tracking-[0.2em] flex items-center gap-3 border-b border-white/10 pb-4">
                    <Type size={20} /> Site Content
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Hero Title</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.heroTitle}
                        onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Hero Subtitle</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.heroSubtitle}
                        onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Title</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.aboutTitle}
                        onChange={(e) => updateConfig({ aboutTitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Role</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.aboutRole}
                        onChange={(e) => updateConfig({ aboutRole: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Trusted By Count</label>
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.trustedBy}
                        onChange={(e) => updateConfig({ trustedBy: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Content 1</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none h-32 transition-all"
                        value={config.aboutContent1}
                        onChange={(e) => updateConfig({ aboutContent1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Content 2</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none h-32 transition-all"
                        value={config.aboutContent2}
                        onChange={(e) => updateConfig({ aboutContent2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Image URL</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.aboutImageUrl}
                        onChange={(e) => updateConfig({ aboutImageUrl: e.target.value })}
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">About Image Scale ({config.aboutImageScale || 1})</label>
                      <input 
                        type="range" min="0.5" max="2" step="0.1"
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                        value={config.aboutImageScale || 1}
                        onChange={(e) => updateConfig({ aboutImageScale: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Info */}
                <section className="space-y-8">
                  <h3 className="text-xl font-bold text-electric-blue uppercase tracking-[0.2em] flex items-center gap-3 border-b border-white/10 pb-4">
                    <Phone size={20} /> Contact Details
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Phone</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.phone}
                        onChange={(e) => updateConfig({ phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Email</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.email}
                        onChange={(e) => updateConfig({ email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Location</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-electric-blue outline-none transition-all"
                        value={config.location}
                        onChange={(e) => updateConfig({ location: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* Projects Config */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-electric-blue uppercase tracking-[0.2em] flex items-center gap-3">
                      <ImageIcon size={20} /> Projects
                    </h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addProject} 
                      className="flex items-center gap-2 px-6 py-3 bg-electric-blue text-deep-void font-bold rounded-2xl text-sm shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                      <Plus size={18} /> Add New Project
                    </motion.button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 group hover:border-electric-blue/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <input 
                            className="bg-transparent text-white text-lg font-bold outline-none focus:text-electric-blue w-full mr-4"
                            value={project.title}
                            onChange={(e) => updateProject(project.id, { title: e.target.value })}
                          />
                          <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <div className="grid gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Category</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white"
                              value={project.category}
                              onChange={(e) => updateProject(project.id, { category: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Image URL</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white"
                              value={project.imageUrl}
                              onChange={(e) => updateProject(project.id, { imageUrl: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Scale ({project.scale || 1})</label>
                              <input 
                                type="range" min="0.5" max="2" step="0.1"
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-electric-blue"
                                value={project.scale || 1}
                                onChange={(e) => updateProject(project.id, { scale: parseFloat(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Display Order</label>
                              <input 
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white"
                                value={project.order}
                                onChange={(e) => updateProject(project.id, { order: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Tools Config */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-electric-blue uppercase tracking-[0.2em] flex items-center gap-3">
                      <Palette size={20} /> Tools Arsenal
                    </h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTool} 
                      className="flex items-center gap-2 px-6 py-3 bg-electric-blue text-deep-void font-bold rounded-2xl text-sm shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                      <Plus size={18} /> Add New Tool
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                      <div key={tool.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 relative group">
                        <button onClick={() => deleteDoc(doc(db, "tools", tool.id))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                          <Trash2 size={16} />
                        </button>
                        <div className="space-y-3">
                          <input 
                            className="w-full bg-transparent text-white font-bold text-center outline-none focus:text-electric-blue"
                            value={tool.name}
                            onChange={(e) => updateDoc(doc(db, "tools", tool.id), { name: e.target.value })}
                          />
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold block text-center">Icon</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white text-center"
                              value={tool.icon}
                              onChange={(e) => updateDoc(doc(db, "tools", tool.id), { icon: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold block text-center">Color Class</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white text-center"
                              value={tool.color}
                              onChange={(e) => updateDoc(doc(db, "tools", tool.id), { color: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Socials Config */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-electric-blue uppercase tracking-[0.2em] flex items-center gap-3">
                      <LinkIcon size={20} /> Social Network
                    </h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addSocial} 
                      className="flex items-center gap-2 px-6 py-3 bg-electric-blue text-deep-void font-bold rounded-2xl text-sm shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                      <Plus size={18} /> Add Social Link
                    </motion.button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {socials.length === 0 && (
                      <div className="md:col-span-2 p-12 border-2 border-dashed border-white/10 rounded-3xl text-center">
                        <p className="text-slate-500 mb-4 font-bold uppercase tracking-widest">No social links found in database</p>
                        <button onClick={seedDefaultData} className="text-electric-blue font-bold hover:underline">Click "Seed Initial Data" at the top to fix this</button>
                      </div>
                    )}
                    {socials.map((social) => (
                      <div key={social.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group">
                        <div className="flex items-center justify-between">
                          <input 
                            className="bg-transparent text-white font-bold outline-none focus:text-electric-blue"
                            value={social.name}
                            onChange={(e) => updateDoc(doc(db, "socials", social.id), { name: e.target.value })}
                          />
                          <button onClick={() => deleteDoc(doc(db, "socials", social.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">URL</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                              value={social.href}
                              onChange={(e) => updateDoc(doc(db, "socials", social.id), { href: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Icon Name</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                              value={social.iconName}
                              onChange={(e) => updateDoc(doc(db, "socials", social.id), { iconName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Hover Color Class (e.g., hover:bg-pink-600)</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                              value={social.color}
                              onChange={(e) => updateDoc(doc(db, "socials", social.id), { color: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row gap-6 justify-between items-center">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-500/10 px-6 py-3 rounded-2xl transition-all"
                  >
                    <LogOut size={20} /> Sign Out Dashboard
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdminPanel(false)} 
                    className="px-12 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    Close Dashboard
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-void/90 backdrop-blur-md z-[110] flex items-center justify-center p-6"
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onSubmit={handleLogin}
              className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
                <p className="text-slate-400 text-sm">Enter your credentials to access the panel</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase font-bold">Username</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-electric-blue outline-none"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase font-bold">Password</label>
                  <input 
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-electric-blue outline-none"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogin(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,242,255,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-4 bg-electric-blue text-deep-void font-bold rounded-2xl shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all"
                >
                  Login Now
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
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
            {config.heroTitle} <br />
            <span className="lightning-text italic">{config.heroSubtitle}</span>
          </h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-electric-blue font-bold text-sm md:text-base mb-8 tracking-widest uppercase"
          >
            Trusted by <Counter value={config.trustedBy} />+ Clients
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
              {config.aboutTitle.split(' ')[0]} <span className="text-electric-blue">{config.aboutTitle.split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>{config.aboutContent1}</p>
              <p>{config.aboutContent2}</p>
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
            {config.aboutImageUrl ? (
              <img 
                src={config.aboutImageUrl} 
                alt="Himanshu" 
                style={{ transform: `scale(${config.aboutImageScale || 1})` }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Zap className="text-electric-blue w-32 h-32 opacity-20 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            )}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-deep-void/80 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="text-white font-bold text-xl mb-1">Himanshu</div>
              <div className="text-electric-blue text-sm uppercase tracking-widest font-bold">{config.aboutRole}</div>
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
          {(projects.length > 0 ? projects : [1, 2, 3, 4, 5, 6]).map((project: any, i: number) => (
            <motion.div
              key={project.id || project}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              {/* Cornered Border Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-electric-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img 
                  src={project.imageUrl || `https://picsum.photos/seed/gfx-${project}/1280/720`} 
                  alt={project.title || `Project ${project}`}
                  style={{ transform: `scale(${project.scale || 1})` }}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-deep-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6">
                  <div className="w-12 h-12 rounded-full bg-electric-blue flex items-center justify-center mb-4 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Zap className="text-deep-void" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">{project.title || `Visual Identity ${project}`}</h3>
                  <p className="text-electric-blue text-xs font-bold uppercase tracking-widest">{project.category || 'Branding • GFX'}</p>
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
          {(tools.length > 0 ? tools : [
            { name: 'Photoshop', icon: 'Ps', color: 'bg-[#001E36]', textColor: 'text-[#31A8FF]' },
            { name: 'Illustrator', icon: 'Ai', color: 'bg-[#330000]', textColor: 'text-[#FF9A00]' },
            { name: 'Canva', icon: 'Cv', color: 'bg-[#00C4CC]/10', textColor: 'text-[#00C4CC]' },
            { name: 'Corel Draw', icon: 'Cd', color: 'bg-[#004B23]/20', textColor: 'text-[#00FF41]' },
          ]).map((tool: any, i: number) => (
            <motion.div
              key={tool.id || tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              <div className={`absolute inset-0 ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-16 h-16 rounded-xl ${tool.color} border border-white/10 flex items-center justify-center text-2xl font-bold ${tool.textColor || 'text-white'} mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
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
                { icon: <Phone size={24} />, label: 'Phone', value: config.phone, href: `tel:${config.phone}` },
                { icon: <Mail size={24} />, label: 'Email', value: config.email, href: `mailto:${config.email}` },
                { icon: <MapPin size={24} />, label: 'Location', value: config.location, href: '#' },
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
              {(socials.length > 0 ? socials : [
                { name: 'Instagram', iconName: 'Instagram', href: '#', color: 'hover:bg-pink-600' },
                { name: 'Discord', iconName: 'MessageSquare', href: '#', color: 'hover:bg-[#5865F2]' },
                { name: 'LinkedIn', iconName: 'Linkedin', href: '#', color: 'hover:bg-[#0A66C2]' },
                { name: 'Behance', iconName: 'ExternalLink', href: '#', color: 'hover:bg-[#0057FF]' },
              ]).map((social: any, i: number) => {
                const Icon = ICON_MAP[social.iconName] || ExternalLink;
                return (
                  <motion.a
                    key={social.id || social.name}
                    href={social.href}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 transition-all duration-300 ${social.color} hover:text-white hover:border-transparent`}
                  >
                    <Icon size={20} />
                    <span className="font-bold text-sm">{social.name}</span>
                  </motion.a>
                );
              })}
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
          <p className="text-slate-500 text-sm mb-8">
            © {new Date().getFullYear()} Himanshu GFX. All rights reserved. Crafted with precision and electricity.
          </p>
          
          <div className="flex justify-center gap-4">
            {isAdmin ? (
              <button 
                onClick={() => setShowAdminPanel(true)}
                className="text-[10px] uppercase tracking-[0.3em] text-electric-blue font-bold hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                <Settings size={12} /> Open Admin Panel
              </button>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold hover:text-slate-400 transition-colors"
              >
                Admin Access
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
