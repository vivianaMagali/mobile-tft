import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FirebaseContext} from '../App';
import firestore from '@react-native-firebase/firestore';
import {stateOrders} from '../utils';
import {useNavigation} from '@react-navigation/native';
import OrderSummary from './OrderSummary';

const PendingOrdersOfWaiter = ({route}) => {
  const {user} = useContext(FirebaseContext);
  const [commands, setComandas] = useState([]);
  const [pendingCommandSelected, setPendingCommandSelected] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const commandCollectionRef = firestore()
      .collection('restaurants')
      .doc(user?.uidRestaurant)
      .collection('comandas');

    const unsubscribe = commandCollectionRef.onSnapshot(
      snapshot => {
        const fetchedCommand = snapshot.docs
          .map(doc => ({
            ...doc.data(),
          }))
          .filter(
            comanda =>
              comanda.userUid === user?.uidUser &&
              comanda.state === stateOrders.RECIBIDO,
          );
        setComandas(fetchedCommand);
      },
      error => {
        console.error('Error al obtener lras comandas:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uidRestaurant, user?.uidUser]);

  const selectedCommand = commandSelected => {
    // navigation.navigate('Restaurant', {uidRestaurant: user?.uidRestaurant});
    setPendingCommandSelected(commandSelected);
  };

  return (
    <>
      {commands?.length > 0 &&
        commands.map((command, index) => (
          // <ScrollView style={styles.scrollView}>
          //  orders={command.order},
          // setShowConfirmOrderModal,
          // setShowOrderSummary,
          // total,
          // resetQuantities,
          <>
            <View key={index}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => selectedCommand(command)}>
                <Text style={styles.buttonText}>Mesa: {command.table}</Text>
              </TouchableOpacity>
            </View>
            {pendingCommandSelected && (
              <OrderSummary orders={command.order} total={command.total} />
            )}
          </>
          // </ScrollView>
        ))}
    </>
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
  button: {
    width: '100%',
    backgroundColor: '#008080',
    borderRadius: 5,
    padding: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});
export default PendingOrdersOfWaiter;
