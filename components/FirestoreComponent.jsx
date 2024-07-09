import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { firestore } from '../firebaseConfig';

const FirestoreComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = await firestore().collection('users').get();
        const usersList = usersCollection.docs.map(doc => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching Firestore data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Users from Firestore:</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
        />
    </View>
  );
};

export default FirestoreComponent;