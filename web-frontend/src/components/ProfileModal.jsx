import { useState, useEffect } from 'react';
import { X, User, Lock, Save, AlertCircle, Shield, Mail, KeyRound } from 'lucide-react';
import { authAPI } from '../utils/api';

export default function ProfileModal({ isOpen, onClose, currentUser }) {
    const [username, setUsername] = useState(currentUser?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Update form when currentUser loads/changes
    useEffect(() => {
        if (currentUser?.username) {
            setUsername(currentUser.username);
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (newPassword && newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.updateProfile(
                username !== currentUser?.username ? username : null,
                currentPassword || null,
                newPassword || null
            );

            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                onClose();
                window.location.reload(); // Refresh to update username in UI
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f111a] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Panel - Profile Card */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-slate-900 border-r border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    {/* Animated animated background mesh */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3),transparent_60%)] animate-slow-spin opacity-50" />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Innovation: Orbital Atom Avatar */}
                        <div className="relative w-36 h-36 mb-6 flex items-center justify-center perspective-[1000px]">
                            {/* Orbital Rings */}
                            <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-[spin_8s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)' }} />
                            <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(70deg)' }} />
                            <div className="absolute inset-2 border border-white/10 rounded-full animate-pulse bg-white/5 backdrop-blur-md" />

                            {/* Core */}
                            <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                                <span className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                    {username ? username.charAt(0).toUpperCase() : 'U'}
                                </span>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute -top-2 right-0 w-3 h-3 bg-cyan-400 rounded-full drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-bounce" />
                            <div className="absolute bottom-4 -left-2 w-2 h-2 bg-purple-500 rounded-full drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                        </div>

                        <h2 className="text-3xl font-display font-bold text-white mb-1 tracking-tight drop-shadow-lg">
                            {username}
                        </h2>

                        {/* Modern Email Display */}
                        <div className="mt-8 relative group/email cursor-default">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-md opacity-50 group-hover/email:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl transition-transform hover:scale-105">
                                <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500">
                                    <Mail className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm text-cyan-50 font-medium tracking-wide">{currentUser?.email || 'No email set'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Edit Form */}
                <div className="w-full md:w-3/5 p-8 bg-[#0f111a]">
                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        Account Settings
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Identity */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</label>
                                <div className="h-px bg-white/10 flex-grow ml-4"></div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-slate-300">Display Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500/50 transition-all font-medium hover:bg-white/[0.05]"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Security */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security</label>
                                <div className="h-px bg-white/10 flex-grow ml-4"></div>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 mb-2 block">Current Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all font-mono text-sm"
                                            placeholder="Enter to change password"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all font-mono text-sm"
                                            placeholder="New Password"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all font-mono text-sm"
                                            placeholder="Re-enter New Password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm animate-in fade-in slide-in-from-top-1">
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                {success}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-black rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
