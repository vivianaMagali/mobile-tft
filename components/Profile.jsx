import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import {FirebaseContext} from '../App';

const Profile = () => {
  const navigation = useNavigation();
  const {user} = useContext(FirebaseContext);

  const logout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error cerrando sesión: ', error);
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {user?.role && (
          <Image source={{uri: user?.img}} style={styles.profileImage} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.role && <Text style={styles.role}>{user?.role}</Text>}
          <Text style={styles.phone}>{user?.phone}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#4B4B4B',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#4B4B4B',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#00796B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
