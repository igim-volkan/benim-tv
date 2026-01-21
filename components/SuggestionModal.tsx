import React, { useState } from 'react';
import { Mail, User, Send } from 'lucide-react';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; surname: string; message: string }) => Promise<void>;
    isSubmitting: boolean;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit({ name, surname, message });
            setName('');
            setSurname('');
            setMessage('');
            alert("ÖNERİNİZ İLETİLDİ / SENT");
            onClose();
        } catch (error) {
            alert("HATALI IŞLEM / ERROR");
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-xl bg-neutral-900 border-4 border-white p-1 shadow-[10px_10px_0px_#000]">
                {/* Header */}
                <div className="bg-white text-black px-4 py-2 flex justify-between items-center font-bold text-2xl mb-4">
                    <div className="flex items-center gap-2">
                        <Mail />
                        <span>ÖNERİ FORMU</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-black hover:text-white px-2 transition-colors">[X]</button>
                </div>

                <form onSubmit={handleSubmit} className="bg-black border-2 border-neutral-700 p-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-white font-bold block mb-2">ADI</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-neutral-500 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 pl-10 font-mono focus:border-yellow-400 outline-none"
                                    placeholder="JANE"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-white font-bold block mb-2">SOYADI</label>
                            <input
                                type="text"
                                required
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                className="w-full bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono focus:border-yellow-400 outline-none"
                                placeholder="DOE"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-white font-bold block mb-2">ÖNERİ / ŞİKAYET</label>
                        <textarea
                            required
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="w-full h-32 bg-neutral-900 border-2 border-neutral-700 text-white p-2 font-mono focus:border-yellow-400 outline-none resize-none"
                            placeholder="Mesajınız..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow-400 text-black font-bold py-3 text-xl hover:bg-white transition-colors flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? 'GÖNDERİLİYOR...' : (
                            <>
                                <Send className="w-5 h-5" />
                                [ GÖNDER ]
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
