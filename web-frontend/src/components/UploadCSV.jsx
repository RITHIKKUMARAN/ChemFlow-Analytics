import { useRef, useState } from 'react';
import { datasetAPI } from '../utils/api';
import gsap from 'gsap';

export default function UploadCSV({ onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const btnRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            await datasetAPI.uploadCSV(file, (progress) => {
                gsap.to(btnRef.current, {
                    '--progress': `${progress}%`,
                    duration: 0.5
                });
            });
            onUploadSuccess();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            gsap.set(btnRef.current, { '--progress': '0%' });
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, .xlsx, .xls"
                className="hidden"
            />
            <button
                ref={btnRef}
                className="btn btn-primary relative overflow-hidden group"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                style={{ background: 'linear-gradient(90deg, rgba(79, 140, 255, 0.4) var(--progress, 0%), var(--color-accent) var(--progress, 0%))' }}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {uploading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            INGESTING...
                        </>
                    ) : (
                        <>
                            <span>UPLOAD DATASET</span>
                            <span className="text-xs opacity-60">(.CSV, .XLSX)</span>
                        </>
                    )}
                </span>
                {/* Progress Bar Overlay */}
                <div className="absolute inset-0 bg-accent/20 w-[var(--progress,0%)] transition-all duration-300 pointer-events-none" />
            </button>
        </div>
    );
}
