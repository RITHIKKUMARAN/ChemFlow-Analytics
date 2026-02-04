import { Github, Linkedin } from 'lucide-react';

export default function BuiltBy() {
    return (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 animate-fade-in-up z-50 pointer-events-none">
            <div className="group relative hover:scale-105 transition-transform duration-500 ease-out cursor-default pointer-events-auto">
                {/* Dynamic Floating Animation */}
                <div className="animate-float">
                    {/* Dynamic Ambient Glow (Pulses on Hover) */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/0 via-violet-600/40 to-cyan-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 w-full mx-auto" />

                    {/* Rotating Gradient Border */}
                    <div className="relative p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/50 transition-colors duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/30 to-transparent translate-x-[-100%] group-hover:animate-[gradient_3s_linear_infinite]" />

                        {/* Main Content Pill */}
                        <div className="relative flex items-center gap-4 p-2 pr-6 rounded-full bg-[#0a0a12]/90 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50 group-hover:shadow-[0_10px_40px_-5px_rgba(124,58,237,0.3)] transition-all duration-500">

                            {/* Inner Shine Effect */}
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-40" />

                            <span className="pl-3 text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                                Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-bold group-hover:from-violet-300 group-hover:to-cyan-300 group-hover:drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all duration-300">Rithik Kumaran K</span>
                            </span>

                            <div className="h-4 w-[1px] bg-white/10 group-hover:bg-white/30 transition-colors" />

                            <div className="flex gap-2">
                                <a
                                    href="https://github.com/RITHIKKUMARAN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/5 hover:bg-black border border-white/5 hover:border-white/30 transition-all duration-300 group/icon relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
                                    aria-label="GitHub Profile"
                                >
                                    <Github className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors relative z-10" />
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/rithikkumarank/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/5 hover:bg-blue-600 border border-white/5 hover:border-white/30 transition-all duration-300 group/icon relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                                    aria-label="LinkedIn Profile"
                                >
                                    <Linkedin className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors relative z-10" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
