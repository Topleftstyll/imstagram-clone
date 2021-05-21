import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAZshGg3MT7N79hLYMg8Iv6GNQjfN8Wwho",
    authDomain: "instagram-clone-50b1e.firebaseapp.com",
    projectId: "instagram-clone-50b1e",
    storageBucket: "instagram-clone-50b1e.appspot.com",
    messagingSenderId: "711380964031",
    appId: "1:711380964031:web:ca9e9071b46097ff77ec0a"
};

const firebase = Firebase.initializeApp(config);

const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };