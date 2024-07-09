import React, { useState, useEffect, createContext } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { styled } from 'nativewind';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Login from './components/Login';
import ConfirmOrder from './components/ConfirmOrder';
import Direction from './components/Direction';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { auth, firestore } from './firebaseConfig';

const Stack = createStackNavigator();
export const FirebaseContext = createContext();

function App() {

  const [user, setUser] = useState();
  const [record, setRecord] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth(), async (user) => {
      if (user) {
        const userDocRef = doc(firestore(), "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUser({ uid: user.uid, ...userDoc.data() });

        const recordCollectionRef = collection(userDocRef, "record");

        const unsubscribeRecord = onSnapshot(recordCollectionRef, (snapshot) => {
          setRecord(snapshot.docs.map((doc) => doc.data()));
        });

        return () => unsubscribeRecord();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []); 

  return (
    <FirebaseContext.Provider value={{ user, record }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
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
