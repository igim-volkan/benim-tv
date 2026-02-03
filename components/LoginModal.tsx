import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            onLoginSuccess();
            onClose();

        } catch (err: any) {
            console.error("Login Error Details:", err);
            const errorCode = err.code || "unknown";
            setError(`Giriş başarısız. (${errorCode})`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-md bg-neutral-900 border-2 border-white p-8 relative shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="bg-neutral-800 p-4 rounded-full mb-4">
                        <Lock size={32} className="text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Yönetici Girişi</h2>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 mb-4 text-center text-sm font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-neutral-400 text-sm font-bold mb-2">E-POSTA</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-neutral-700 text-white p-3 focus:border-yellow-400 focus:outline-none transition-colors !text-transform-none"
                            style={{ textTransform: 'none' }}
                            placeholder="yonetici@benimtv.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-neutral-400 text-sm font-bold mb-2">ŞİFRE</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-neutral-700 text-white p-3 pr-12 focus:border-yellow-400 focus:outline-none transition-colors !text-transform-none"
                                style={{ textTransform: 'none' }}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 mt-4 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                    </button>
                </form>
            </div>
        </div>
    );
};
