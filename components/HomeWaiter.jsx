import React, {useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
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
  return (
    <View style={styles.container}>
      <Text>Camarero: {user.name} </Text>
      <Button style={styles.boton} title="Nueva Comanda" onPress={newCommand} />
      <Button
        style={styles.boton}
        title="Pedidos Pendientes"
        onPress={pendingOrders}
      />
    </View>
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
  boton: {
    width: '100%',
    borderRadius: 5,
    color: '#008080',
  },
});
export default HomeWaiter;
