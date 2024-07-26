import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import waiter from '../assets/camarero.png';
import firestore from '@react-native-firebase/firestore';
import {typeRole} from '../utils';

const CallToWaiter = ({setCallToWaiter, callToWaiter, table}) => {
  const [tokensWaiter, setTokensWaiter] = useState([]);

  // Obtengo los tokens de los camareros
  useEffect(() => {
    const usersCollectionRef = firestore().collection('users');

    usersCollectionRef.onSnapshot(snapshot => {
      setTokensWaiter(
        snapshot.docs
          .filter(doc => doc.data().role === typeRole.waiter)
          .map(doc => doc.data().token),
      );
    });
  }, []);

  const getTheCheck = () => {
    const title = 'Llevar cuenta';
    const body = `${('Llevar cuenta a la mesa nº', table)}`;
    sendPushNotification(title, body, table);
    setCallToWaiter(false);
  };

  const callTheWaiter = () => {
    const title = 'Acercase a la mesa';
    const body = `${('Llevar cuenta a la mesa nº', table)}`;
    sendPushNotification(title, body, table);
    setCallToWaiter(false);
  };

  // Endpoint para enviar la notificación push al dispositivo que realizó el pedido
  const sendPushNotification = async () => {
    try {
      await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${process.env.REACT_APP_KEY_SERVER}`,
        },
        body: JSON.stringify({
          registration_ids: tokensWaiter,
          notification: {
            title: 'Título de la notificación',
            body: 'Cuerpo de la notificación',
          },
        }),
      });
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={callToWaiter}
      onRequestClose={() => setCallToWaiter(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Image source={waiter} style={styles.icon} />
            <Text style={styles.title}>Llamar al camarero</Text>
            <TouchableOpacity
              onPress={() => setCallToWaiter(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={getTheCheck}>
              <Text style={styles.buttonText}>Traer la cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={callTheWaiter}>
              <Text style={styles.buttonText}>Acercarse a la mesa</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '60%',
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
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
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
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 24,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CallToWaiter;
