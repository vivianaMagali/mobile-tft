import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {doc, getDoc, setDoc, addDoc} from '@react-native-firebase/firestore';
import {FirebaseContext} from '../App';
import {firestore} from '../firebaseConfig';
import {formatDate, generateUID, stateOrders} from '../utils';
import {TextInput} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const OrderSummary = ({
  orders,
  setShowConfirmOrderModal,
  showOrderSummary,
  setShowOrderSummary,
  total,
  setTotal,
}) => {
  const {user} = useContext(FirebaseContext);
  const dateNow = new Date();
  const [table, setTable] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const confirmOrder = async () => {
    if (user.role === 'Camarero' && !table) {
      setError('Introduce número de mesa');
      return;
    }
    if (user.role === 'Camarero') {
      const commandCollectionRef = firestore()
        .collection('restaurants')
        .doc(user.uidRestaurant)
        .collection('comandas');
      const newCommand = {
        date: formatDate(dateNow),
        order: orders,
        state: stateOrders.RECIBIDO,
        userUid: user.uidUser,
        category: 'local',
        table,
        description,
        total,
        orderId: generateUID(),
        waitTime: 55,
        paymentStatus: false,
      };
      try {
        const commandDocRef = await commandCollectionRef.add(newCommand);
        const updatedDocData = {
          ...newCommand,
          uidOrder: commandDocRef.id,
        };
        await setDoc(commandDocRef, updatedDocData);
      } catch (e) {
        console.error('Error añadiendo el documento: ', e);
      }
      setShowOrderSummary(false);
      console.log('entre en el if');
      navigation.navigate('HomeWaiter');
    } else {
      setShowConfirmOrderModal(true);
    }
  };

  useEffect(() => {
    setTotal(
      orders.reduce((acc, order) => acc + order.amount * order.price, 0),
    );
  }, [orders, setTotal]);

  return showOrderSummary ? (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tu pedido</Text>
        </View>
        <View style={styles.content}>
          {user.role === 'Camarero' && (
            <View style={styles.container}>
              <TextInput
                required
                style={styles.table}
                placeholder="Nº de mesa"
                name="table"
                keyboardType="numeric"
                onChangeText={number => {
                  setTable(number);
                  setError('');
                }}
              />
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          {orders.map((order, index) => (
            <View style={styles.item} key={`${order.name}-${index}`}>
              <View style={styles.itemInfo}>
                <Text
                  style={
                    styles.itemText
                  }>{`x${order.amount} ${order.name}`}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {(order.amount * order.price).toFixed(2)}€
              </Text>
            </View>
          ))}
          {user.role === 'Camarero' ? (
            <TextInput
              multiline
              numberOfLines={4}
              style={styles.textarea}
              placeholder="Ej: el bocadillo partido a la mitad"
              name="description"
              onChangeText={setDescription}
            />
          ) : (
            <View style={styles.total}>
              <Text style={styles.totalText}>{`Total: ${total?.toFixed(
                2,
              )}€`}</Text>
            </View>
          )}

          <View>
            <Button title="Confirmar pedido" onPress={confirmOrder} />
          </View>
        </View>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    backgroundColor: '#4CAF50',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888888',
  },
  total: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  table: {
    height: 40,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    width: '40%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    // marginBottom: 20,
    fontWeight: 'bold',
  },
  textarea: {
    flex: 1,
    textAlignVertical: 'top',
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    // paddingHorizontal: 20,
  },
  error: {
    color: '#FF0000',
    marginBottom: 10,
  },
});

export default OrderSummary;
