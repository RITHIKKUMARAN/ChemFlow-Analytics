import { useState, useRef } from 'react';
import { datasetAPI } from '../utils/api';
import gsap from 'gsap';

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
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
            />
            <label
                htmlFor={uploading ? '' : 'file-upload'}
                className={`btn-primary cursor-pointer inline-flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {uploading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        <span>📤</span>
                        <span>Upload Dataset</span>
                    </>
                )}
            </label>

            {/* Progress Bar */}
            {uploading && (
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        ref={progressRef}
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
