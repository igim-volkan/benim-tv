import React, { useState } from 'react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { Product } from '../types';
import { shopService } from '../services/shopService';

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(product?.image || '');

    // Reset state when product changes
    React.useEffect(() => {
        if (product) {
            setActiveImage(product.image);
            setEmail('');
            setNote('');
            setSuccessMessage(null);
        }
    }, [product]);

    if (!product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await shopService.createOrder({
                productId: product.id,
                productName: product.title,
                quantity: 1,
                customerEmail: email,
                customerNote: note,
                status: 'pending'
            });
            setSuccessMessage("SİPARİŞİNİZ ALINDI! EN KISA SÜREDE SİZE DÖNÜŞ YAPACAĞIZ.");
            setTimeout(() => {
                onClose();
                setSuccessMessage(null);
                setNote('');
                setEmail('');
            }, 3000);
        } catch (error: any) {
            console.error("Error creating order:", error);
            alert(`Sipariş oluşturulurken bir hata oluştu: ${error.message || error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="relative w-full max-w-4xl bg-neutral-900 border-4 border-white shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Product Image with Blurred Background */}
                <div className="w-full md:w-1/2 relative min-h-[300px] overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-white group flex flex-col">
                    <div className="flex-1 relative overflow-hidden group">
                        {/* Blurred Background Layer */}
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                            style={{ backgroundImage: `url(${activeImage})` }}
                        />

                        {/* Main Image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <img
                                src={activeImage}
                                alt={product.title}
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                            />
                        </div>
                    </div>

                    {/* Thumbnails (Only if multiple images exist) */}
                    {product.images && product.images.length > 1 && (
                        <div className="bg-black p-2 flex justify-center gap-2 border-t-2 border-neutral-800 z-20">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 border-2 relative overflow-hidden transition-all ${activeImage === img ? 'border-yellow-400 opacity-100' : 'border-neutral-600 opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details & Form */}
                <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="bg-blue-800 text-white p-4 flex justify-between items-center border-b-4 border-white shrink-0">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-xl font-black tracking-widest teletext-shadow">ÜRÜN DETAY</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-red-600 hover:bg-red-500 text-white p-1 transition-colors border-2 border-transparent hover:border-white"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-neutral-300 font-mono text-lg leading-relaxed border-l-4 border-yellow-400 pl-4 py-1">
                                {product.description}
                            </p>
                        </div>

                        {successMessage ? (
                            <div className="bg-green-900/50 border-2 border-green-500 p-6 text-center animate-in zoom-in duration-300">
                                <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">TEŞEKKÜRLER!</h3>
                                <p className="text-green-300 text-lg font-mono">{successMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-black border-2 border-neutral-700 p-6 space-y-4 mt-auto">
                                <h3 className="text-cyan-400 font-bold border-b border-neutral-700 pb-2 mb-4">
                                    SİPARİŞ FORMU
                                </h3>

                                <div>
                                    <label className="block text-neutral-500 text-xs font-bold mb-1">E-POSTA ADRESİNİZ</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-neutral-900 border-2 border-neutral-600 text-white p-3 focus:border-yellow-400 focus:outline-none placeholder-neutral-700 font-mono"
                                        placeholder="ornek@email.com"
                                    />
                                    <p className="text-neutral-500 text-[10px] mt-1">
                                        * Size ulaşabilmemiz için geçerli bir e-posta adresi giriniz.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-neutral-500 text-xs font-bold mb-1">AÇIKLAMA (OPSİYONEL)</label>
                                    <textarea
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        rows={3}
                                        className="w-full bg-neutral-900 border-2 border-neutral-600 text-white p-3 focus:border-yellow-400 focus:outline-none placeholder-neutral-700 font-mono resize-none"
                                        placeholder="Eklemek istediğiniz notlar..."
                                    />
                                </div>

                                <div className="pt-2">

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-green-600 text-white font-bold text-xl py-3 border-2 border-transparent hover:bg-green-500 hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'İŞLENİYOR...' : '[ SİPARİŞ VER ]'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
