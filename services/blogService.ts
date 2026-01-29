import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore';
import { BlogEntry } from '../types';

const BLOG_COLLECTION = 'blog_posts';

export const blogService = {
    // Get all blog posts
    getBlogPosts: async (): Promise<BlogEntry[]> => {
        // We fetch all and sort client-side to be safe with mixed data (some have order, some don't)
        const snapshot = await getDocs(collection(db, BLOG_COLLECTION));
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as BlogEntry));

        // Sort by order (asc) -> if order is missing, put at the end (or top? usually end makes sense for new un-ordered items if we assume explicit order is primary)
        // Actually, if we want custom order, we sort by order.
        return posts.sort((a, b) => {
            const orderA = a.order ?? 999999;
            const orderB = b.order ?? 999999;
            return orderA - orderB;
        });
    },

    // Add a new blog post
    addBlogPost: async (post: Omit<BlogEntry, 'id'>) => {
        // Assign a default order (e.g., 0 to put at top, or just huge number to put at bottom)
        // Let's put at the top (order: 0) and we can re-index later if needed.
        // Actually best to get current min order and subtract 1, or just 0.
        // For simplicity, let's just add it. User can drag key.
        const docRef = await addDoc(collection(db, BLOG_COLLECTION), { ...post, order: 0 });
        return { id: docRef.id, ...post, order: 0 };
    },

    // Update a blog post
    updateBlogPost: async (id: string, data: Partial<BlogEntry>) => {
        const docRef = doc(db, BLOG_COLLECTION, id);
        await updateDoc(docRef, data);
    },

    // Delete a blog post
    deleteBlogPost: async (id: string) => {
        const docRef = doc(db, BLOG_COLLECTION, id);
        await deleteDoc(docRef);
    },

    // Batch update order
    reorderBlogPosts: async (posts: BlogEntry[]) => {
        // We receive the full list in the new desired order.
        // We just need to update the 'order' field for each.
        // Using a loop of updateDoc (or writeBatch). Batch is better.
        const { writeBatch } = await import('firebase/firestore');
        const batch = writeBatch(db);

        posts.forEach((post, index) => {
            const docRef = doc(db, BLOG_COLLECTION, post.id);
            batch.update(docRef, { order: index });
        });

        await batch.commit();
    },

    // Migration helper: Upload static posts with specific IDs if possible, or let Firestore generate them.
    migrateStaticPosts: async (posts: BlogEntry[]) => {
        for (const [index, post] of posts.entries()) {
            const docRef = doc(db, BLOG_COLLECTION, post.id);
            // We strip the ID from the data payload since it's the key
            const { id, ...data } = post;
            // Assign initial order based on array index
            await setDoc(docRef, { ...data, order: index }, { merge: true });
        }
    }
};
