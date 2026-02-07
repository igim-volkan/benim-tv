import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Product, Order } from '../types';

const PRODUCTS: Product[] = [
    {
        id: 'p11',
        title: 'Entel Logolu T-Shirt',
        price: 700,
        image: '/entel-tshirt.jpg',
        images: [
            '/entel-tshirt.jpg',
            '/entel-tshirt-2.jpg',
            '/entel-tshirt-3.jpg'
        ],
        images: [
            '/entel-tshirt.jpg',
            '/entel-tshirt-2.jpg',
            '/entel-tshirt-3.jpg'
        ],
        description: 'Entel serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.',
        label: 'YENİ'
    },
    {
        id: 'p1',
        title: 'Vurgun Logolu T-Shirt',
        price: 700,
        image: '/vurgun-tshirt.png',
        images: ['/vurgun-tshirt.png', '/vurgun-tshirt-2.jpg', '/vurgun-tshirt-4.jpg'],
        description: 'Vurgun serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.'
    },
    {
        id: 'p2',
        title: 'Nazar Logolu T-Shirt',
        price: 700,
        image: '/nazar-tshirt.png',
        images: ['/nazar-tshirt.png', '/nazar-tshirt-2.jpg', '/nazar-tshirt-3.jpg', '/nazar-tshirt-4.jpg'],
        description: 'Nazar serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.'
    },
    {
        id: 'p9',
        title: 'Merveler Logolu T-shirt',
        price: 700,
        image: '/merveler-tshirt-main.jpg',
        images: [
            '/merveler-tshirt-main.jpg',
            '/merveler-tshirt-2-new.jpg',
            '/merveler-tshirt-3-new.jpg'
        ],
        images: [
            '/merveler-tshirt-main.jpg',
            '/merveler-tshirt-2-new.jpg',
            '/merveler-tshirt-3-new.jpg'
        ],
        description: 'Merveler serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.',
        label: 'YENİ'
    },
    {
        id: 'p10',
        title: 'Obez Logolu T-Shirt',
        price: 700,
        image: '/obez-tshirt.jpg',
        images: [
            '/obez-tshirt.jpg',
            '/obez-tshirt-2.jpg',
            '/obez-tshirt-3.jpg',
            '/obez-tshirt-4.jpg'
        ],
        images: [
            '/obez-tshirt.jpg',
            '/obez-tshirt-2.jpg',
            '/obez-tshirt-3.jpg',
            '/obez-tshirt-4.jpg'
        ],
        description: 'Obez serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.',
        label: 'YENİ'
    },
    {
        id: 'p12',
        title: 'Atarlı Logolu T-Shirt',
        price: 700,
        image: '/atarli-tshirt.jpg',
        images: [
            '/atarli-tshirt.jpg',
            '/atarli-tshirt-2.jpg',
            '/atarli-tshirt-3.jpg'
        ],
        images: [
            '/atarli-tshirt.jpg',
            '/atarli-tshirt-2.jpg',
            '/atarli-tshirt-3.jpg'
        ],
        description: 'Atarlı serisi özel tasarım t-shirt. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.',
        label: 'YENİ'
    },
    {
        id: 'p3',
        title: 'Nazar Logolu Hoodie',
        price: 1200, // Estimated price, can be updated later or removed as UI doesn't show it
        image: '/nazar-hoodie.png',
        description: 'Nazar serisi özel tasarım hoodie. %100 pamuk, oversize kesim. Sınırlı sayıda üretim.'
    },
    {
        id: 'p4',
        title: 'Vurgun Logolu Önlük',
        price: 500, // Estimated price
        image: '/vurgun-apron.png',
        price: 500, // Estimated price
        image: '/vurgun-apron.png',
        description: 'Vurgun serisi özel tasarım mutfak önlüğü. Leke tutmaz kumaş.',
        label: 'YENİ'
    },
    {
        id: 'p5',
        title: 'Nazar Logolu Bez Torba',
        price: 250, // Estimated price
        image: '/nazar-tote.png',
        description: 'Nazar serisi özel tasarım bez torba. %100 pamuk.'
    },
    {
        id: 'p6',
        title: 'Vurgun Logolu Sweatshirt',
        price: 900, // Estimated price
        image: '/vurgun-sweatshirt.png',
        description: 'Vurgun serisi özel tasarım sweatshirt. %100 pamuk, rahat kesim.'
    },
    {
        id: 'p7',
        title: 'Nazar Logolu Yastık',
        price: 300, // Estimated price
        image: '/nazar-pillow.png',
        description: 'Nazar serisi özel tasarım kırlent yastık. Fermuarlı kılıf, kaliteli baskı.'
    },
    {
        id: 'p8',
        title: 'Vurgun Logolu Bez Torba',
        price: 250, // Estimated price
        image: '/vurgun-tote.jpg',
        description: 'Vurgun serisi özel tasarım bez torba. Kırmızı renk, dayanıklı kumaş.'
    }
];

export const shopService = {
    getProducts: async (): Promise<Product[]> => {
        // Currently returning static data, can be moved to Firestore later
        return PRODUCTS;
    },

    createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
        try {
            const ordersRef = collection(db, 'orders');
            const docRef = await addDoc(ordersRef, {
                ...orderData,
                status: 'pending', // Keep initial status as pending
                createdAt: Date.now(),
                quantity: orderData.quantity || 1 // Default to 1 if not provided
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    getOrders: async (): Promise<Order[]> => {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
        } catch (error) {
            console.error("Error fetching orders:", error);
            return [];
        }
    },

    updateOrderStatus: async (id: string, status: 'pending' | 'completed'): Promise<void> => {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, { status });
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    }
};
