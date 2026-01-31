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

        // Progress simulation
        gsap.to(btnRef.current, {
            background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--bg-surface) 0%)',
            duration: 2,
            onUpdate: function () {
                const prog = this.progress() * 100;
                btnRef.current.style.background = `linear-gradient(90deg, rgba(79, 140, 255, 0.2) ${prog}%, transparent ${prog}%)`;
            }
        });

        try {
            await datasetAPI.uploadCSV(file);
            onUploadSuccess();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            gsap.set(btnRef.current, { background: 'transparent' });
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                style={{ display: 'none' }}
            />
            <button
                ref={btnRef}
                className="btn-tech btn-primary"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                style={{ overflow: 'hidden' }}
            >
                {uploading ? 'INGESTING PREFLIGHT...' : 'UPLOAD DATASET'}
            </button>
        </div>
    );
}
