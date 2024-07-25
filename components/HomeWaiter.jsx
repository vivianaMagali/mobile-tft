import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FirebaseContext} from '../App';

const HomeWaiter = () => {
  const {user} = useContext(FirebaseContext);
  const navigation = useNavigation();

  const newCommand = () => {
    navigation.navigate('Restaurant', {uidRestaurant: user.uidRestaurant});
  };

  const pendingOrders = () => {
    navigation.navigate('PendingOrdersOfWaiter');
  };

  const logout = () => {
    // Aquí deberías implementar la lógica de cierre de sesión
    console.log('Cerrar sesión');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camarero: {user.name}</Text>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={newCommand}>
          <Text style={styles.buttonText}>Nueva Comanda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pendingOrders}>
          <Text style={styles.buttonText}>Pedidos Pendientes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.singOutButtonWrapper}>
        <TouchableOpacity style={styles.singOutButton} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#008080',
    borderRadius: 5,
    padding: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  singOutButtonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  singOutButton: {
    width: '100%',
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeWaiter;
