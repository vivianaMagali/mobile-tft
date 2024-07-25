import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {getKeyByValueOfStateOrder, stateOrders} from '../utils';

// Importa las imágenes
import order from '../assets/comida.png';
import {FirebaseContext} from '../App';

const WaitTime = ({setShowWaitTime, showWaitTime}) => {
  const {record} = useContext(FirebaseContext);

  return (
    <Modal
      transparent={true}
      visible={showWaitTime}
      onRequestClose={() => setShowWaitTime(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Image source={order} style={styles.icon} />
            <Text style={styles.title}>Tiempo de espera</Text>
            <TouchableOpacity
              onPress={() => setShowWaitTime(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {record.length > 0 ? (
            <FlatList
              data={record}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) =>
                item.state !== stateOrders.TERMINADO && (
                  <View style={styles.recordContainer}>
                    <Text>Restaurante: {item.name}</Text>
                    <Text>Pedido: {item.orderId}</Text>
                    <Text>Estado: {getKeyByValueOfStateOrder(item.state)}</Text>
                    <Text>Tiempo restante aprox: {item.waitTime} min.</Text>
                    {index !== record.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                )
              }
            />
          ) : (
            <Text style={styles.noOrdersText}>
              No tienes ningún pedido pendiente
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5, // Shadow for Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  recordContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#333',
  },
});

export default WaitTime;
