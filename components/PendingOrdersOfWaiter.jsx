import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {FirebaseContext} from '../App';
import firestore from '@react-native-firebase/firestore';
import {stateOrders} from '../utils';
import OrderSummary from './OrderSummary';

const PendingOrdersOfWaiter = ({route}) => {
  const {user} = useContext(FirebaseContext);
  const [commands, setComandas] = useState([]);
  const [pendingCommandSelected, setPendingCommandSelected] = useState(null);

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
            id: doc.id,
          }))
          .filter(
            comanda =>
              comanda.userUid === user?.uidUser &&
              comanda.state === stateOrders.RECIBIDO,
          );
        setComandas(fetchedCommand);
      },
      error => {
        console.error('Error al obtener las comandas:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uidRestaurant, user?.uidUser]);

  const selectedCommand = commandSelected => {
    setPendingCommandSelected(commandSelected);
    console.log(commandSelected);
  };

  return (
    <ScrollView style={styles.scrollView}>
      {commands.length > 0 &&
        commands.map((command, index) => (
          <View key={command.id}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => selectedCommand(command)}>
              <Text style={styles.buttonText}>Mesa: {command.table}</Text>
            </TouchableOpacity>
            {pendingCommandSelected &&
              pendingCommandSelected.id === command.id && (
                <OrderSummary
                  orders={pendingCommandSelected.order}
                  total={pendingCommandSelected.total}
                  showOrderSummary={true}
                />
              )}
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#008080',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PendingOrdersOfWaiter;
