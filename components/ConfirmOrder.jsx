import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {formatDate, generateUID, stateOrders} from '../utils';
import Direction from './Direction';
import firestore from '@react-native-firebase/firestore';
import {RestaurantContext} from '../context/context';
import {FirebaseContext} from '../App';

const ConfirmOrder = ({
  orders,
  setShowConfirmOrderModal,
  setShowOrderSummary,
  total,
  resetQuantities,
}) => {
  const [place, setPlace] = useState(null);
  const {restaurant} = useContext(RestaurantContext);
  const {user, token} = useContext(FirebaseContext);
  const [inputValue, setInputValue] = useState('');
  const navigation = useNavigation();
  const [comandas, setComandas] = useState([]);
  const [selectedOptionPlace, setSelectedOptionPlace] = useState('home');
  const [detail, setDetail] = useState('');
  const [description, setDescription] = useState('');
  const [table, setTable] = useState('');

  useEffect(() => {
    const comandasCollectionRef = firestore()
      .collection('restaurants')
      .doc(restaurant.uid)
      .collection('comandas');

    const unsubscribe = comandasCollectionRef.onSnapshot(snapshot => {
      setComandas(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [restaurant.uid]);

  const saveOrder = async () => {
    const dateNow = new Date();

    const orderList = comandas.length;
    const waitTime = Math.floor(orderList * 5);

    const getData = () => {
      const baseData = {
        date: formatDate(dateNow),
        order: orders,
        state: stateOrders.RECIBIDO,
        userUid: user.uidUser,
        category: selectedOptionPlace,
        description,
        name: restaurant?.basic_information?.name,
        total,
        orderId: generateUID(),
        waitTime,
        paymentStatus: false,
        token,
      };

      if (selectedOptionPlace === 'home') {
        return {
          ...baseData,
          placeId: place,
          direction: inputValue,
          detail,
        };
      } else if (selectedOptionPlace === 'local') {
        return {
          ...baseData,
          table,
        };
      } else {
        return {
          ...baseData,
          direction: restaurant?.basic_information?.direction,
        };
      }
    };

    const docData = getData();
    try {
      const commandCollectionRef = firestore()
        .collection('restaurants')
        .doc(restaurant.uid)
        .collection('comandas');
      const commandDocRef = await commandCollectionRef.add(docData);
      const updatedDocData = {
        ...getData(),
        uidOrder: commandDocRef.id,
      };
      await commandDocRef.set(updatedDocData);

      const recordCollectionRef = firestore()
        .collection('users')
        .doc(user.uidUser)
        .collection('record');
      const recordDocRef = await recordCollectionRef.add(docData);
      const updatedDocRecord = {
        ...getData(),
        uidOrder: recordDocRef.id,
      };
      await recordDocRef.set(updatedDocRecord);

      setShowConfirmOrderModal(false);
      setShowOrderSummary(false);
      resetQuantities();
      navigation.navigate('Restaurant', {uidRestaurant: restaurant.uid});
    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirmar pedido</Text>
            <TouchableOpacity onPress={() => setShowConfirmOrderModal(false)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <View>
              <Text style={styles.label}>Tus productos</Text>
              {orders?.map((order, index) => (
                <View key={`${order.name}-${index}`} style={styles.orderItem}>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderText}>
                      <Text style={styles.fontBold}>x{order.amount}</Text>{' '}
                      {order.name}
                    </Text>
                    <Text style={styles.orderPrice}>
                      {(order.amount * order.price)?.toFixed(2)}€
                    </Text>
                  </View>
                  {order.ingredients && (
                    <Text style={styles.ingredientsText}>
                      ({order.ingredients})
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: {total?.toFixed(2)}€</Text>
            </View>
            <Direction
              direction={restaurant?.basic_information?.direction}
              setPlace={setPlace}
              selectedOptionPlace={selectedOptionPlace}
              setSelectedOptionPlace={setSelectedOptionPlace}
              setTable={setTable}
              setDescription={setDescription}
              setDetail={setDetail}
            />
            <View style={styles.buttonContainer}>
              <Button title="Aceptar" onPress={saveOrder} color="#008080" />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    height: '80%',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 10,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 14,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  orderPrice: {
    fontSize: 14,
    color: 'gray',
  },
  ingredientsText: {
    fontSize: 12,
    color: 'gray',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ConfirmOrder;
