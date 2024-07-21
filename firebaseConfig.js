import {initializeApp} from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBxbdrtuQiF1R__wTJ4dE-ItFkF4lw34dE',
  authDomain: 'tft-bd.firebaseapp.com',
  databaseURL: 'https://tft-bd-default-rtdb.firebaseio.com',
  projectId: 'tft-bd',
  storageBucket: 'tft-bd.appspot.com',
  messagingSenderId: '606394326708',
  appId: '1:606394326708:web:1280aeadb0d64d4da701e1',
  measurementId: 'G-10V5RBVRL5',
};

const app = initializeApp(firebaseConfig);

export {app, firestore, auth};
