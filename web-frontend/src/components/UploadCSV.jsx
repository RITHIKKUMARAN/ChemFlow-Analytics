/**
 * CSV Upload Component with Progress Animation
 */
import { useState, useRef, useEffect } from 'react';
import { datasetAPI } from '../utils/api';
import gsap from 'gsap';

function UploadCSV({ onUploadSuccess }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const progressBarRef = useRef(null);

    useEffect(() => {
        if (uploading && progress > 0) {
            gsap.to(progressBarRef.current, {
                width: `${progress}%`,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [progress, uploading]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        // Validate file type
        if (!file.name.endsWith('.csv')) {
            setError('Please upload a CSV file');
            return;
        }

        setError('');
        setUploading(true);
        setProgress(0);

        try {
            const result = await datasetAPI.uploadCSV(file, (progressPercent) => {
                setProgress(progressPercent);
            });

            // Success animation
            gsap.to('.upload-container', {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
            });

            setUploading(false);
            setProgress(0);

            if (onUploadSuccess) {
                onUploadSuccess(result);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please try again.');
            setUploading(false);
            setProgress(0);

            // Error shake animation
            gsap.fromTo('.upload-container',
                { x: -5 },
                { x: 5, duration: 0.1, repeat: 5, yoyo: true }
            );
        }
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-container glass" style={styles.container}>
            <h3 style={styles.title}>📤 Upload CSV File</h3>

            <div
                style={{
                    ...styles.dropZone,
                    ...(dragActive ? styles.dropZoneActive : {}),
                    ...(uploading ? styles.dropZoneDisabled : {}),
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!uploading ? onButtonClick : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    style={styles.fileInput}
                    onChange={handleChange}
                    disabled={uploading}
                />

                {uploading ? (
                    <div style={styles.uploadingState}>
                        <div className="spinner" style={styles.spinner}></div>
                        <p style={styles.uploadingText}>Uploading... {progress}%</p>
                        <div style={styles.progressBarContainer}>
                            <div
                                ref={progressBarRef}
                                style={styles.progressBar}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.idleState}>
                        <div style={styles.icon}>📁</div>
                        <p style={styles.dropText}>
                            <strong>Drag and drop</strong> your CSV file here
                        </p>
                        <p style={styles.orText}>or</p>
                        <button className="btn btn-secondary" type="button">
                            Browse Files
                        </button>
                        <p style={styles.hintText}>
                            CSV file with columns: Equipment_ID, Equipment_Type, Flowrate, Pressure, Temperature
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div style={styles.errorAlert}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        marginBottom: '2rem',
    },
    title: {
        marginBottom: '1.5rem',
        fontSize: '1.5rem',
    },
    dropZone: {
        border: '2px dashed rgba(255, 255, 255, 0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        background: 'rgba(17, 24, 39, 0.4)',
    },
    dropZoneActive: {
        borderColor: 'var(--color-accent-primary)',
        background: 'rgba(59, 130, 246, 0.1)',
        transform: 'scale(1.02)',
    },
    dropZoneDisabled: {
        cursor: 'not-allowed',
        opacity: 0.7,
    },
    fileInput: {
        display: 'none',
    },
    idleState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    icon: {
        fontSize: '4rem',
        marginBottom: '0.5rem',
    },
    dropText: {
        fontSize: '1.125rem',
        color: 'var(--color-text-secondary)',
    },
    orText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
    },
    hintText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.75rem',
        marginTop: '0.5rem',
        maxWidth: '500px',
    },
    uploadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    spinner: {
        width: '40px',
        height: '40px',
    },
    uploadingText: {
        fontSize: '1.125rem',
        color: 'var(--color-text-primary)',
        fontWeight: 600,
    },
    progressBarContainer: {
        width: '100%',
        maxWidth: '400px',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        background: 'var(--gradient-success)',
        borderRadius: 'var(--radius-full)',
        width: '0%',
    },
    errorAlert: {
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-md)',
        color: '#fca5a5',
        fontSize: '0.875rem',
    },
};

export default UploadCSV;
