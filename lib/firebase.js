import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

//an object for our firebase config
const firebaseConfig={
    apiKey: "AIzaSyCFUhcE-eiBdx4JfpLzfR_F4zqW5_Gl1dA",
    authDomain: "nextice-d470b.firebaseapp.com",
    projectId: "nextice-d470b",
    storageBucket: "nextice-d470b.appspot.com",
    messagingSenderId: "688322559162",
    appId: "1:688322559162:web:d8cc645ac88b59f5949683",
    measurementId: "G-CZCQHQSPCW"
}

//you can only initialize firebase app once, but sometimes next may want to initialize again, so
//we set condition here to initialize only if number of app is zero
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    
    return userDoc;
  }
  
  /**`
   * Converts a firestore document to JSON
   * @param  {DocumentSnapshot} doc
   */
  export function postToJSON(doc) {
    const data = doc.data();
    return {
      ...data,
      // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt.toMillis(),
    };
  }

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const increment=firebase.firestore.FieldValue.increment

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
