import React, {useState, useEffect, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Login from './components/Login';
import ConfirmOrder from './components/ConfirmOrder';
import Direction from './components/Direction';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {doc, getDoc} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import HomeWaiter from './components/HomeWaiter';
import PendingOrdersOfWaiter from './components/PendingOrdersOfWaiter';
import Profile from './components/Profile';

const Stack = createStackNavigator();
export const FirebaseContext = createContext();

//Solicito permiso para enviar notificaciones
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

//Obtengo el token del dispositivo móvil y lo almaceno en el estado
const getToken = async setToken => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    setToken(fcmToken);
  } else {
    console.log('Failed to get FCM token');
  }
};

//Recibir notificación con app abierta
const setupNotificationOpenedAppHandler = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    Alert.alert(
      'A new FCM message arrived with open app!',
      JSON.stringify(remoteMessage),
    );
  });
};

//Recibir notificación con app en segundo plano
const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    Alert.alert(
      'A new FCM message arrived background app!',
      JSON.stringify(remoteMessage),
    );
  });
};

//Recibo notificación en que plano?
const setupNotificationListener = () => {
  messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};

function App() {
  const [user, setUser] = useState();
  const [record, setRecord] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    requestUserPermission();
    getToken(setToken);
    setupNotificationListener() ||
      setupBackgroundMessageHandler() ||
      setupNotificationOpenedAppHandler();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userDocRef = doc(firestore(), 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setUser({uid: user.uid, ...userDoc.data()});
        const recordCollectionRef = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('record');
        const unsubscribeRecord = recordCollectionRef.onSnapshot(
          snapshot => {
            setRecord(
              snapshot.docs.map(docRecord => {
                const data = docRecord.data();
                return data;
              }),
            );
          },
          error => {
            console.error('Error al suscribirse a onSnapshot: ', error); // Manejo de errores
          },
        );
        return () => unsubscribeRecord();
      } else {
        setUser(null);
        setRecord([]);
      }
    });

    return () => unsubscribe();
  }, [token]);

  return (
    <FirebaseContext.Provider value={{user, record, token: token}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
          <Stack.Screen name="Direction" component={Direction} />
          <Stack.Screen name="HomeWaiter" component={HomeWaiter} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen
            name="PendingOrdersOfWaiter"
            component={PendingOrdersOfWaiter}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseContext.Provider>
  );
}

export default App;
