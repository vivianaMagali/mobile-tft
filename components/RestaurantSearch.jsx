import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

const RestaurantSearch = ({ restaurantList }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Restaurante..."
          placeholderTextColor="#9CA3AF"
          required
        />
        <TouchableOpacity style={styles.searchButton}>
          {/* <Ionicons name="md-search" size={20} color="white" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    width: '80%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default RestaurantSearch;