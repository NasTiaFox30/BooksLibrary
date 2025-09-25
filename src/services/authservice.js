import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

export const signIn = async (username, password) => {
    try {
        const usersRef = collection(db, 'authUsers');
        const q = query(usersRef, 
            where('username', '==', username), 
            where('password', '==', password)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { 
                success: true, 
                user: { 
                    id: userDoc.id, 
                    ...userDoc.data() 
                } 
            };
        } else {
            return { 
                success: false, 
                message: 'Невірне ім\'я користувача або пароль' 
            };
        }
    } catch (error) {
        console.error('Помилка аутентифікації:', error);
        return { 
            success: false, 
            message: 'Помилка сервера. Спробуйте пізніше.' 
        };
    }
}