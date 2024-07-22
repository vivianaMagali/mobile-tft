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
import {doc, getDoc, deleteDoc} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import axios from 'axios';
import HomeWaiter from './components/HomeWaiter';
import PendingOrdersOfWaiter from './components/PendingOrdersOfWaiter';

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

//Envío el token del dispositivo móvil al servidor
// const sendTokenToServer = async token => {
//   console.log('token axios', token);
//   try {
//     await axios.post('https://ef9c-90-165-59-29.ngrok-free.app/api/token', {
//       token,
//     });
//   } catch (error) {
//     console.error('Failed to send token to server:', error);
//   }
// };

//Obtengo el token del dispositivo móvil y lo almaceno en el estado
const getToken = async setToken => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    setToken(fcmToken);
    // sendTokenToServer(fcmToken); //para que lo quiero enviar al servidor ? si alli no lo voy a usar
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

// async function eliminarDocumentoPorID(collectionName, documentID) {
//   try {
//     // Referencia al documento
//     const docRef = doc(firestore(), collectionName, documentID);

//     // Elimina el documento
//     await deleteDoc(docRef);

//     console.log(`Documento con ID ${documentID} eliminado exitosamente.`);
//   } catch (error) {
//     console.error('Error al eliminar el documento: ', error);
//   }
// }

function App() {
  const [user, setUser] = useState();
  const [record, setRecord] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    requestUserPermission();
    getToken(setToken);
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
    <FirebaseContext.Provider value={{user, record, token: token}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="ConfirmOrder" component={ConfirmOrder} />
          <Stack.Screen name="Direction" component={Direction} />
          <Stack.Screen name="HomeWaiter" component={HomeWaiter} />
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
