import React, {useContext} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {FirebaseContext} from '../App';
import recordImg from '../assets/record-logo.png';

const Record = ({setShowRecord, showRecord}) => {
  const {record} = useContext(FirebaseContext);

  return (
    <Modal
      transparent={true}
      visible={showRecord}
      onRequestClose={() => setShowRecord(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Image style={styles.icon} source={recordImg} />
            <Text style={styles.title}>Historial</Text>
            <TouchableOpacity
              onPress={() => setShowRecord(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {record.length > 0 ? (
            <ScrollView contentContainerStyle={styles.recordContainer}>
              {record.map((rec, index) => (
                <View key={index} style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordTitle}>{rec.name}</Text>
                  </View>
                  <Text style={styles.recordDate}>{rec.date}</Text>
                  {rec.order.map((order, idx) => (
                    <View key={`${order.name}-${idx}`} style={styles.orderItem}>
                      <Text style={styles.orderText}>
                        x{order.amount} {order.name}
                      </Text>
                      <Text style={styles.orderPrice}>
                        {order.amount * order.price}€
                      </Text>
                    </View>
                  ))}
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total: {rec.total?.toFixed(2)}€
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyMessage}>Tu historial está vacío</Text>
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
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5, // Shadow for Android
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconLarge: {
    width: 48,
    height: 48,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  recordContainer: {
    flexGrow: 1,
    paddingHorizontal: 8,
  },
  recordCard: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    elevation: 3, // Shadow for Android
  },
  recordHeader: {
    backgroundColor: 'teal',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recordTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordDate: {
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  orderText: {
    fontSize: 14,
  },
  orderPrice: {
    fontSize: 14,
    color: 'gray',
  },
  totalContainer: {
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyMessage: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Record;
