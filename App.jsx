import React, {useState, useEffect, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Login from './components/Login';
import ConfirmOrder from './components/ConfirmOrder';
import Direction from './components/Direction';
import {onAuthStateChanged} from '@react-native-firebase/auth';
import {auth, firestore} from './firebaseConfig';
import {doc, getDoc} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import axios from 'axios';

const Stack = createStackNavigator();
export const FirebaseContext = createContext();

const sendTokenToServer = async token => {
  try {
    console.log('FCM Token:', token);
    await axios.post('http://192.168.1.76:3001/token', {
      token,
    });
  } catch (error) {
    console.error('Failed to send token to server:', error);
  }
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    console.log('Notification permission not granted');
  }
};

const getToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    sendTokenToServer(fcmToken);
  } else {
    console.log('Failed to get FCM token');
  }
};

const setupNotificationOpenedAppHandler = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('User tapped on notification:', remoteMessage);
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('A new FCM message arrived in background!', remoteMessage);
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

const setupNotificationListener = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

function App() {
  const [user, setUser] = useState();
  const [record, setRecord] = useState([]);

  useEffect(() => {
    requestUserPermission();
    getToken();
    setupNotificationListener();
    setupBackgroundMessageHandler();
    setupNotificationOpenedAppHandler();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth(), async user => {
      if (user) {
        const userDocRef = doc(firestore(), 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setUser({uid: user.uid, ...userDoc.data()});

        const recordCollectionRef = firestore().collection('record');
        const unsubscribeRecord = recordCollectionRef.onSnapshot(snapshot => {
          setRecord(snapshot.docs.map(doc => doc.data()));
        });

        return () => unsubscribeRecord();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{user, record}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
          <Stack.Screen name="Direction" component={Direction} />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseContext.Provider>
  );
}

export default App;
