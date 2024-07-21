import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {formatDate, generateUID, stateOrders} from '../utils';
import Direction from './Direction';
import {firestore, auth} from '../firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  collection,
} from '@react-native-firebase/firestore';
import {RestaurantContext} from '../context/context';
import {FirebaseContext} from '../App';

const ConfirmOrder = ({
  orders,
  setOrders,
  setShowConfirmOrderModal,
  setShowOrderSummary,
  total,
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

  const saveOrder = async () => {
    const dateNow = new Date();
    const comandasDocRef = doc(
      firestore(),
      'restaurants',
      user.uidRestaurant,
      'comandas',
    );
    comandasDocRef.onSnapshot(snapshot => {
      setComandas(snapshot.docs.map(doc => doc.data()));
    });

    const orderList = comandas.size;
    const waitTime = Math.floor(orderList * 5);

    const getData = () => {
      if (selectedOptionPlace === 'home') {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uidUser,
          category: selectedOptionPlace,
          placeId: place,
          direction: inputValue,
          detail,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
          token,
        };
      } else if (selectedOptionPlace === 'local') {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uidUser,
          category: selectedOptionPlace,
          table,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
          token, //si lo pide el camarero, solo el token del camarero, si lo pide el cliente, el token del cliente
          //me faltaria algo que indicara a que camarero enviar la notificacion o se lo envio a todos los camareros?
        };
      } else {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uidUser,
          direction: restaurant.basic_information.direction,
          category: selectedOptionPlace,
          description,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime,
          paymentStatus: false,
          token,
        };
      }
    };
    const docData = getData();
    console.log('el valor de docData es', docData);
    try {
      console.log('entro en el try');
      const commandCollectionRef = firestore()
        .collection('restaurants')
        .doc(user.uidRestaurant)
        .collection('comandas');
      const docCommandRef = await addDoc(commandCollectionRef, docData);
      const updatedDocData = {
        ...docData,
        uidOrder: docCommandRef.id,
      };
      await setDoc(docCommandRef, updatedDocData);
      const recordCollectionRef = firestore()
        .collection('users')
        .doc(user.uidUser)
        .collection('record');
      const {userUid, ...rest} = docData;
      const docRecordRef = await addDoc(recordCollectionRef, rest);
      const updatedRecordDocData = {
        ...rest,
        userUid: user.uidUser,
        recordId: docRecordRef.id,
      };
      await setDoc(docCommandRef, updatedDocData);
      await setDoc(docRecordRef, updatedRecordDocData);
      // setOrders([]);
      // setShowConfirmOrderModal(false);
      // setShowOrderSummary(false);
      navigation.navigate('Restaurant', {uidRestaurant: user.uidRestaurant});
    } catch (e) {
      console.error('Error añadiendo el documento: ', e.error);
    }
  };
  return (
    // <View style={styles.modalContainer}>
    <Modal style={styles.modalContent}>
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
          restaurant={restaurant}
          setPlace={setPlace}
          selectedOptionPlace={selectedOptionPlace}
          setSelectedOptionPlace={setSelectedOptionPlace}
          setTable={setTable}
          setDescription={setDescription}
          setDetail={setDetail}
        />
        {/* <TextInput
          style={styles.input}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder="Enter address"
        /> */}
        <View style={styles.buttonContainer}>
          <Button title="Aceptar" onPress={saveOrder} color="#008080" />
        </View>
      </ScrollView>
    </Modal>
    // </View>
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
