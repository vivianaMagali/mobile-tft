import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {formatDate, generateUID, stateOrders} from '../utils';
import Direction from './Direction';
import {firestore, auth} from '../firebaseConfig';
import {doc, getDoc, setDoc, addDoc} from '@react-native-firebase/firestore';
import {RestaurantContext} from '../context/context';

const ConfirmOrder = ({
  orders,
  setOrders,
  setShowConfirmOrderModal,
  setShowOrderSummary,
  total,
}) => {
  const [place, setPlace] = useState(null);
  const {restaurant} = useContext(RestaurantContext);
  const [inputValue, setInputValue] = useState('');
  const navigation = useNavigation();
  const [comandas, setComandas] = useState([]);

  const saveOrder = async () => {
    const dateNow = new Date();
    // const comandasRef = collection(db, "restaurants", "4ZqlXIbiVNyvQugNbcl4", "comandas");

    // const querySnapshot = await getDocs(comandasRef);
    const restaurantDocRef = firestore()
      .collection('restaurants')
      .doc(restaurant.uid);

    const comandasCollectionRef = restaurantDocRef.collection('comandas');
    comandasCollectionRef.onSnapshot(snapshot => {
      setComandas(snapshot.docs.map(doc => doc.data()));
    });

    const orderList = comandas.size;
    const waitTime = Math.floor(orderList * 5);

    const getData = () => {
      if (category === 'home') {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          category,
          placeId: place,
          direction: inputValue,
          detail,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
        };
      } else if (category === 'local') {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          category,
          table,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
        };
      } else {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          direction: restaurant.basic_information.direction,
          category,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
        };
      }
    };
    const docData = getData();
    try {
      const docRef = await addDoc(comandasRef, docData);
      const updatedDocData = {
        ...docData,
        uidOrder: docRef.id,
      };
      await setDoc(docRef, updatedDocData);
      const recordRef = collection(db, 'users', user.uid, 'record');
      const {userUid, ...rest} = docData;
      const docRecordRef = await addDoc(recordRef, rest);
      const updatedRecordDocData = {
        ...rest,
        userUid: user.uid,
        recordId: docRecordRef.id,
      };
      await setDoc(docRef, updatedDocData);
      await setDoc(docRecordRef, updatedRecordDocData);
      setOrders([]);
      setShowConfirmOrderModal(false);
      setShowOrderSummary(false);
    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
    }
  };

  return (
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
          <Direction restaurant={restaurant} setPlace={setPlace} />
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Enter address"
          />
          <View style={styles.buttonContainer}>
            <Button title="Aceptar" onPress={saveOrder} color="#008080" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    borderBottomWidth: 1,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});

export default ConfirmOrder;
