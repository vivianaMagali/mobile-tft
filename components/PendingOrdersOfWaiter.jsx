import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {FirebaseContext} from '../App';
import firestore from '@react-native-firebase/firestore';

const PendingOrdersOfWaiter = ({route}) => {
  const {user} = useContext(FirebaseContext);
  const [comandas, setComandas] = useState([]);

  useEffect(() => {
    const commandCollectionRef = firestore()
      .collection('restaurants')
      .doc(user.uidRestaurant)
      .collection('comandas');

    const unsubscribe = commandCollectionRef.onSnapshot(
      snapshot => {
        const fetchedCommand = snapshot.docs
          .map(doc => ({
            ...doc.data(),
          }))
          .filter(comanda => comanda.userUid === user.uidUser);
        setComandas(fetchedCommand);
      },
      error => {
        console.error('Error al obtener lras comandas:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user.uidRestaurant, user.uidUser]);

  return (
    <View>
      <Text>prueba</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boton: {
    width: '100%',
    borderRadius: 5,
    color: '#008080',
  },
});
export default PendingOrdersOfWaiter;
