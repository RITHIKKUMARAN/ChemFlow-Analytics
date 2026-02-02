import { useState, useRef } from 'react';
import { datasetAPI } from '../utils/api';
import gsap from 'gsap';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function UploadCSV({ onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const progressRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        // Animate progress
        if (progressRef.current) {
            gsap.to(progressRef.current, {
                width: '100%',
                duration: 2,
                ease: 'power2.inOut'
            });
        }

        try {
            await datasetAPI.uploadDataset(file);

            // Success animation
            if (progressRef.current) {
                gsap.to(progressRef.current, {
                    backgroundColor: '#34d399',
                    duration: 0.3,
                    onComplete: () => {
                        setProgress(100);
                        setTimeout(() => {
                            setUploading(false);
                            setProgress(0);
                            if (onUploadSuccess) onUploadSuccess();
                        }, 500);
                    }
                });
            }
        } catch (err) {
            console.error('Upload failed:', err);

            // Error animation
            if (progressRef.current) {
                gsap.to(progressRef.current, {
                    backgroundColor: '#fb7185',
                    duration: 0.3,
                    onComplete: () => {
                        setTimeout(() => {
                            setUploading(false);
                            setProgress(0);
                        }, 1000);
                    }
                });
            }
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="relative group">
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
            />

            {/* Glow Effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500 ${uploading ? 'opacity-0' : ''}`} />

            <label
                htmlFor={uploading ? '' : 'file-upload'}
                className={`relative flex items-center gap-3 px-8 py-3 rounded-full bg-[#0f111a] border border-white/10 hover:border-white/20 hover:bg-[#1a1d2d] transition-all duration-300 cursor-pointer overflow-hidden ${uploading ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'
                    }`}
            >
                {/* Grading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {uploading ? (
                    <>
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                        <span className="font-medium text-slate-300">Processing...</span>
                    </>
                ) : (
                    <>
                        <UploadCloud className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        <span className="font-display font-semibold text-white tracking-wide text-sm group-hover:text-cyan-50 transition-colors">Upload Dataset</span>
                    </>
                )}
            </label>

            {/* Progress Bar Container */}
            {uploading && (
                <div className="absolute top-full left-0 right-0 mt-3">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <div
                            ref={progressRef}
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-xs text-center text-slate-400 mt-1 font-mono">ENCRYPTING & UPLOADING</div>
                </div>
            )}
        </div>
    );
}
