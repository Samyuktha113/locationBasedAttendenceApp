import { getStorage } from 'firebase/storage';

import { app } from './firebaseAuth'; // Ensure this is the initialized app

const storage = getStorage(app);
export { storage };
