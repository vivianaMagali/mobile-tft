import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {doc, getDoc, setDoc} from '@react-native-firebase/firestore';
import {firestore, auth} from '../firebaseConfig';
import logo from '../assets/logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = () => {
  const [registering, setRegistering] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!registering) {
      try {
        await signInWithEmailAndPassword(auth(), email, password);
        setError('');
        const user = auth().currentUser;
        const userDocRef = doc(firestore(), 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists) {
          const userData = userDoc.data();
          const userRole = userData.role;

          if (userRole === 'Camarero') {
            // navigation.navigate('');
          } else {
            navigation.navigate('Home');
          }
        } else {
          console.log('no entra');
        }
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          setError('Error: El usuario es incorrecto');
        } else if (error.code === 'auth/wrong-password') {
          setError('Error: La contraseña es incorrecta');
        } else {
          setError(error.message);
          console.error('Error:', error.message);
        }
      }
    } else {
      try {
        const {user} = await createUserWithEmailAndPassword(
          auth(),
          email,
          password,
        );
        const userData = {email, name, phone};
        const userRef = doc(firestore(), 'users', user.uid);
        await setDoc(userRef, userData);
        setError('');
        navigation.navigate('Home');
      } catch (error) {
        if (error.code === 'auth/weak-password') {
          setError(
            'Error: La contraseña es demasiado débil. Debe tener al menos 6 caracteres.',
          );
        } else if (error.code === 'auth/email-already-in-use') {
          setError('Error: Este correo ya ha sido registrado');
        } else {
          setError(error.message);
          console.error('Error:', error.message);
        }
      }
    }
  };

  const showVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>
          {!registering ? 'Iniciar sesión' : 'Registrarse'}
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View>
          {registering ? (
            <>
              <Text style={styles.label}>Nombre*</Text>
              <TextInput
                style={styles.input}
                autoComplete="name"
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>Teléfono*</Text>
              <TextInput
                style={styles.input}
                autoComplete="phone"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
              />
            </>
          ) : null}
          <Text style={styles.label}>Correo electrónico*</Text>
          <TextInput
            style={styles.input}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Contraseña*</Text>
          <View>
            <TextInput
              style={styles.input}
              autoComplete="password"
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              value={password}
            />
            <TouchableOpacity onPress={showVisible} style={styles.icon}>
              <Icon
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={24}
                color="grey"
              />
            </TouchableOpacity>
          </View>
          <Button
            title={!registering ? 'Iniciar sesión' : 'Registrarse'}
            onPress={handleSubmit}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.switchText}>
          {!registering ? (
            <>
              {'¿No tienes cuenta? '}
              <Text
                onPress={() => {
                  setRegistering(!registering);
                  setError('');
                }}
                style={styles.switchLink}>
                Regístrate
              </Text>
            </>
          ) : (
            <Text
              onPress={() => {
                setRegistering(!registering);
                setError('');
              }}
              style={styles.switchLink}>
              Inicia sesión
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityToggle: {
    marginLeft: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
  },
  switchLink: {
    color: '#007BFF',
  },
});

export default Login;
