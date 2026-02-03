import { useState } from 'react';
import { Github, Globe, Cpu } from 'lucide-react';

export default function CreatorWidget() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="fixed bottom-6 left-6 z-50 flex items-center"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            onClick={() => setExpanded(!expanded)}
        >
            <div
                className={`relative h-14 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${expanded ? 'w-[380px]' : 'w-14'
                    }`}
            >
                {/* 3D Orb Logo Anchor (Always Visible) */}
                <div className="absolute left-0 top-0 z-20 w-14 h-14 cursor-pointer group perspective-500">

                    {/* Ambient Glow behind the orb - EMERALD/TEAL */}
                    <div className="absolute -inset-4 bg-emerald-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* The 3D Orb itself */}
                    <div className="relative w-full h-full rounded-full transition-transform duration-300 group-active:scale-95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8),0_4px_6px_-2px_rgba(0,0,0,0.5)] bg-[#001a15]">

                        {/* 1. Metallic Rim (Gradient Border) - STEEL/TEAL */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-800 via-teal-900 to-black p-[1px]">
                            <div className="absolute inset-0 rounded-full bg-[#051a15]" />
                        </div>

                        {/* 2. Inner Sphere Depth (Inset Shadows) - DEEP GREEN */}
                        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0a201a] to-[#000f0a] shadow-[inset_0_2px_4px_rgba(52,211,153,0.05),inset_0_-8px_12px_rgba(0,0,0,0.9)] overflow-hidden">

                            {/* Glass Reflection (Top Gloss) - COOL */}
                            <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[60%] bg-gradient-to-b from-emerald-100/10 to-transparent blur-[1px] rounded-b-[100%]" />

                            {/* Bottom Rim Light reflection - NEON GREEN */}
                            <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-emerald-600/30 to-transparent blur-md" />

                            {/* Center Logo/Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative z-10 p-2 rounded-full bg-gradient-to-br from-teal-900/40 to-black shadow-lg border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                                    <Cpu className="w-5 h-5 text-emerald-600 group-hover:text-emerald-400 transition-colors duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sliding Info Panel */}
                <div className={`absolute left-7 top-1 bottom-1 right-0 bg-[#050a08]/95 backdrop-blur-xl border border-emerald-500/10 rounded-r-full shadow-2xl flex items-center pr-2 pl-9 overflow-hidden transition-all duration-500 origin-left ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none scale-x-90'
                    }`}>
                    {/* Subtle Scanline/Grid bg */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />

                    <div className="flex items-center justify-between w-full relative z-10 pl-2">
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-[#5a8a7a] font-bold mb-0.5">Engineered By</span>
                            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200">
                                Rithik Kumaran K
                            </span>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className="h-6 w-[1px] bg-white/10 mx-2" />

                            <a
                                href="https://github.com/RITHIKKUMARAN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-white/5 hover:bg-black border border-white/5 hover:border-white/20 transition-all duration-300 group/icon hover:scale-110 hover:shadow-lg hover:shadow-emerald-900/20"
                            >
                                <Github className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors" />
                            </a>

                            <a
                                href="https://rithikkumarank-portfolio.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-white/5 hover:bg-emerald-600 border border-white/5 hover:border-white/20 transition-all duration-300 group/icon hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30"
                            >
                                <Globe className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
