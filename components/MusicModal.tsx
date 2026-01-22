import React, { useState, useEffect } from 'react';
import { Music, X, RefreshCw, ListMusic } from 'lucide-react';

interface MusicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MusicVideo {
    embed: string;
    text: string;
}

const MUSIC_VIDEOS: MusicVideo[] = [
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/7GlsxNI4LVI?si=BhifaelrwxrVQsih" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Dünyanın gürültüsünü susturup evrenin sonsuzluğunu hissetmek istediğinizde bu parçayı başlatın. Sadece bir film müziği değil, bir zaman makinesi.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/f1w4qnfux-o?si=EaiJsH4Soxgb1J27" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Bazı aşklar kelimelerle değil, bu keman sesindeki o ağır adımlarla anlatılır. Sinema tarihinin en zarif melankolisi.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/30jrmzzgHLc?si=xVD80KxJDJmCexTD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Dışarıda neon ışıkları, elinizde direksiyon ve kafanızda binbir düşünce... Şehri bir film sahnesine dönüştürmek için tek ihtiyacınız olan bu ritim.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/07xTvC5a9YQ?si=5c9YmglAB0NQCjp2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Bugün her şey çok mu gri görünüyor? Bu akordeon sesiyle kendinize bir Paris sabahı ısmarlayın. Küçük şeylerin büyüsüne kapılma vakti.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/D9OhQVuupdY?si=xbdhdV_9xd3xVDMT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Yağmurlu bir cam kenarı, loş bir ışık ve dijital bir huzur. Geleceğin yalnızlığını bu seste bulacaksınız.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Flb01Ni3p3M?si=KpN0s37OONQatJzJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: "Bazı melodiler ilk notasından itibaren size bir hikaye anlatmaya başlar. Bu parça, sinemanın 'dokunulamaz' zirvesinden gelen bir miras gibi."
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/aOHmfq2AUaU?si=-itaNVtBJBHmx6z4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Zamanın daraldığını, işlerin ciddiye bindiğini hissettiğiniz o anların müziği. Nabzınızı hızlandırmak istiyorsanız sesi biraz daha açın.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/1hLIXrlpRe8?si=cdb3r4Bdh3d8Ke45" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Güne enerjik bir giriş yapmak için daha iyisi yok. Bir restoranda masaya çıkıp dans etme isteği uyandırabilir, hazırlıklı olun!'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ppzoBclWpaA?si=UHYlFlSNgQUZqK6y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Unutmak istediğiniz ama bir yandan da sımsıkı sarıldığınız o anılara adanmış bir parça. Kar yağarken camdan bakmalık.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/PYI09PMNazw?si=RNWXitF9Fu_kF13M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: "Efsanevi Ennio Morricone'den bir şaheser. Adım adım yükselen bu melodiyle kendinizi bir çölün ortasında, büyük bir maceranın eşiğinde hissedeceksiniz."
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/K61-tK7Xlzg?si=Npodep-wyu6RaETM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Bir karakterin kırılışını ve yeniden doğuşunu anlatan en hüzünlü çello sesi. Kendi içinizdeki sessiz dansa eşlik edecek bir başyapıt.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/HSW9UPQbeVQ?si=rReYPU7OyjTOmjW1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'İskoç yaylalarının rüzgarını yüzünüzde hissettiren, özgürlük ve aşkın o muazzam karışımı. Gözlerinizi kapatın ve o uçsuz bucaksız yeşilliği hayal edin.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/LF9_9MZyQGo?si=EGowbvmlr0Nc0YV0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Modern klasik müziğin dâhisi Sakamoto’dan kalbe dokunan bir piyano melodisi. Sadece bir film müziği değil, ruhu dinlendiren bir terapi seansı.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/_DxjFs_dsR8?si=tC6Yhgq57Zx6Mjle" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'En karanlık hikayelerin bile içinde bir zarafet vardır. Bu vals sizi bir yandan dansa davet ederken, diğer yandan kalbinize ince bir sızı bırakacak.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/mqgEYRtWMJU?si=HgrKzbTxWL2eEQA-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Daft Punk’ın sinematik evrene bıraktığı en büyük miras. Gece ışıklı bir caddede yürürken veya çalışırken odaklanmak için birebir.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/yRh-dzrI4Z4?si=J8poy-EJBafh-sMx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Hayatın rutininden sıkıldığınızda bu ritme tutunun. Sizi koltuğunuzdan alıp uçsuz bucaksız denizlerde bir maceraya sürükleyecek kadar güçlü.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/057A1RdssoU?si=0XCqLp69bHawuZRq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Kemanın ağladığı o an. İnsan ruhunun en karanlık ve en aydınlık yanlarını aynı anda hissettiren, kalbe kazınan bir ağıt.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/-bzWSJG93P8?si=qFmII-Lfe7vLYPaO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: "Sadece bir 'kötü adam' müziği değil, bir gövde gösterisi. Bu parçayı dinlerken kendinizi galaksiyi yönetmeye hazır hissetmemeniz imkansız."
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/6lRqY7eu0BU?si=KwtY_vevloIYX0Kx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Bu siteyi açma sebebim olan o sinema tutkusunun bestelenmiş hali. Eski bir sinema salonunun tozlu koltuklarını ve film makinelerinin sesini hatırlatır.'
    },
    {
        embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/c56t7upa8Bk?si=yORzihYFJnjyudnH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        text: 'Ve final... Usulca başlayıp devasa bir dalgaya dönüşen bu parça, her notasında zamanın akışını ve geri gelmeyecek anların ağırlığını hissettiriyor. Derin bir nefes alın ve kendinizi bu yükselişe bırakın.'
    }
];

export const MusicModal: React.FC<MusicModalProps> = ({ isOpen, onClose }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // Randomize on open
    useEffect(() => {
        if (isOpen) {
            handleRandomize();
        }
    }, [isOpen]);

    const handleRandomize = () => {
        const randomIndex = Math.floor(Math.random() * MUSIC_VIDEOS.length);
        setCurrentVideoIndex(randomIndex);
    };

    if (!isOpen) return null;

    const currentVideo = MUSIC_VIDEOS[currentVideoIndex];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-4xl bg-neutral-900 border-4 border-white p-1 shadow-[10px_10px_0px_#000]">
                {/* Header */}
                <div className="bg-pink-500 text-black px-4 py-2 flex justify-between items-center font-bold text-2xl mb-1">
                    <div className="flex items-center gap-2">
                        <Music />
                        <span>600 MÜZİK KUTUSU</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-black hover:text-white px-2 transition-colors">[X]</button>
                </div>

                {/* Content */}
                <div className="bg-black border-2 border-neutral-700 p-4 sm:p-8 text-white flex flex-col items-center gap-6">

                    <div className="w-full aspect-video border-2 border-neutral-800">
                        <div
                            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                            dangerouslySetInnerHTML={{ __html: currentVideo.embed }}
                        />
                    </div>

                    <p className="text-xl text-center font-medium text-pink-400 max-w-2xl leading-relaxed">
                        "{currentVideo.text}"
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleRandomize}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 font-bold border-2 border-transparent hover:border-pink-500 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw size={20} />
                            <span>KARIŞTIR</span>
                        </button>
                        <a
                            href="https://www.youtube.com/watch?v=JuSsvM8B4Jc&list=PLh15T1z9GF_G3CcazBAjoBZeTiOEIAdd7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 font-bold border-2 border-transparent hover:border-pink-500 transition-colors flex items-center gap-2"
                        >
                            <ListMusic size={20} />
                            <span>OYNATMA LİSTESİ</span>
                        </a>
                    </div>

                    <p className="text-neutral-600 text-xs">
                        * Rastgele bir parça seçildi.
                    </p>

                </div>
            </div>
        </div>
    );
};
