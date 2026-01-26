import React from 'react';
import { Heart, ExternalLink, Ticket } from 'lucide-react';

interface PatreonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PatreonModal: React.FC<PatreonModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-2xl bg-neutral-900 border-4 border-white p-1 shadow-[10px_10px_0px_#000]">
                {/* Header */}
                <div className="bg-cyan-400 text-black px-4 py-2 flex justify-between items-center font-bold text-2xl mb-1">
                    <div className="flex items-center gap-2">
                        <Ticket />
                        <span>BİR FİLM ISMARLA</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-black hover:text-white px-2 transition-colors">[X]</button>
                </div>

                {/* Content */}
                <div className="bg-black border-2 border-neutral-700 p-8 text-white flex flex-col items-center text-center gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar font-inter font-normal">

                    <h2 className="text-2xl font-bold text-cyan-400">
                        "Sıradaki Filmim Sizin Ellerinizde: Yönetmen Koltuğuna Siz Geçin!"
                    </h2>

                    <p className="text-lg text-neutral-300 leading-relaxed">
                        Bir filmsever için en büyük keyif, 'Acaba ne hissedecek?' diye merak ettiği o filmi bir başkasına izletip tepkisini görmektir. Şimdi bu gücü size devrediyorum! Patreon üzerinden bana bir 'Bilet' ısmarlayarak, bir sonraki filmimi seçebilir ve beni sinematik bir maceraya (ya da bir felakete!) sürükleyebilirsiniz.
                    </p>

                    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg w-full">
                        <p className="text-red-400 font-bold mb-2">⚠ Ancak uyarıyorum:</p>
                        <p className="text-neutral-300">Bu sadece bir öneri değil, bir sinematik düello!</p>
                    </div>

                    <div className="w-full text-left space-y-4">
                        <h3 className="text-xl font-bold text-white border-b border-neutral-700 pb-2">
                            Sınırları Zorlamaya Var Mısınız?
                        </h3>

                        <div>
                            <span className="text-cyan-400 font-bold block mb-1">"İşkence Seansı"</span>
                            <p className="text-neutral-400 text-lg">IMDb puanı yerlerde sürünen (evet, o 2.4'lük felaketlerden bahsediyorum), mantık hatalarıyla dolu, bitmek bilmeyen o korkunç filmi izlemem için bana meydan okuyabilirsiniz. Acımı, detaylı bir "Neden izlememelisiniz?" yazısıyla burada paylaşacağım.</p>
                        </div>

                        <div>
                            <span className="text-cyan-400 font-bold block mb-1">"Sanat Sabır İşidir"</span>
                            <p className="text-neutral-400 text-lg">Siyah-beyaz, tek mekanda geçen ve karakterin 45 dakika boyunca sadece duvara baktığı 6 saatlik o Macar sanat filmini mi merak ediyorsunuz? Gönderin gelsin! Uykumla olan savaşımı ve filmin derinliklerindeki (varsa) anlamı sizin için deşifre edeyim.</p>
                        </div>

                        <div>
                            <span className="text-cyan-400 font-bold block mb-1">"Gizli Hazineni Paylaş"</span>
                            <p className="text-neutral-400 text-lg">Ya da "Bunu benden başka kimse bilmez ama harikadır" dediğiniz o kült yapımı gönderin, hakkını beraber teslim edelim.</p>
                        </div>
                    </div>

                    <div className="w-full text-left space-y-4 pt-4 border-t border-neutral-800">
                        <h3 className="text-xl font-bold text-white border-b border-neutral-700 pb-2">
                            Süreç Nasıl İşliyor?
                        </h3>
                        <ul className="space-y-2 text-neutral-300 list-disc list-inside">
                            <li><strong className="text-white">Biletini Al:</strong> Patreon'dan biletini seç ve meydan okumanı başlat.</li>
                            <li><strong className="text-white">Görevi Ver:</strong> İzlememi istediğin filmi (ne kadar tuhaf veya uzun olduğu fark etmez) bana ilet.</li>
                            <li><strong className="text-white">İncelemeyi Bekle:</strong> O filmi bizzat izleyip, tüm dürüstlüğümle (ve bazen gözyaşlarımla) hazırladığım detaylı incelemeyi burada, ismine özel bir teşekkürle yayınlayayım.</li>
                        </ul>
                    </div>

                    <p className="text-neutral-400 text-lg mt-2">
                        Spend your time watching great movies... Ama bazen de en kötülerini izleyelim ki iyilerin kıymetini bilelim, değil mi?
                    </p>

                    <p className="text-cyan-400 font-bold">
                        Hadi, mısırları hazırlayın ve bana ne izleyeceğimi söyleyin. En "absürt" isteği sabırsızlıkla bekliyorum!
                    </p>

                    <a
                        href="https://www.patreon.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-cyan-400 text-black px-8 py-4 text-2xl font-bold hover:bg-white hover:text-cyan-500 transition-colors flex items-center justify-center gap-2 mt-4 font-mono uppercase tracking-wider"
                    >
                        <span>PATREON'A GİT</span>
                        <ExternalLink size={24} />
                    </a>

                </div>
            </div>
        </div>
    );
};
