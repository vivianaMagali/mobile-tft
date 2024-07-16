import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const OrderSummary = ({
  orders,
  setShowConfirmOrderModal,
  showOrderSummary,
  total,
  setTotal,
}) => {
  const confirmOrder = () => {
    setShowConfirmOrderModal(true);
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
          <View style={styles.total}>
            <Text style={styles.totalText}>{`Total: ${total?.toFixed(
              2,
            )}€`}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Confirmar pedido"
              onPress={confirmOrder}
              color="#ffffff"
            />
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
  buttonContainer: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
});

export default OrderSummary;
