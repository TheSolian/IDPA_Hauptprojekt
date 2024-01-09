import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAmgIldchL6QLKes8WfPMrgCnAXnDiDfCA',
  authDomain: 'wirtschaftsquiz-6431b.firebaseapp.com',
  projectId: 'wirtschaftsquiz-6431b',
  storageBucket: 'wirtschaftsquiz-6431b.appspot.com',
  messagingSenderId: '185853349221',
  appId: '1:185853349221:web:2db4ac68ebc5491fb0a58c',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
