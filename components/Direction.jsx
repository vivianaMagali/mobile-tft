import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ScrollView} from 'react-native-gesture-handler';

const Direction = ({
  direction,
  setPlace,
  selectedOptionPlace,
  setSelectedOptionPlace,
  setTable,
  setDescription,
  setDetail,
}) => {
  // const pickerRef = useRef();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>¿Dónde deseas comerlo?</Text>
      <Picker
        // ref={pickerRef}
        style={styles.picker}
        selectedValue={selectedOptionPlace}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedOptionPlace(itemValue)
        }>
        <Picker.Item label="A domicilio" value="home" />
        <Picker.Item label="Recogida en local" value="pickup" />
        <Picker.Item label="Estoy en una mesa" value="local" />
      </Picker>

      {selectedOptionPlace === 'home' && (
        <View>
          <ScrollView>
            <GooglePlacesAutocomplete
              placeholder="Busca una dirección..."
              onPress={(data, details = null) => {
                setPlace(data.description);
              }}
              query={{
                key: 'AIzaSyDbKaQl6IEo_hLQ-qBLV-uPEEaIvbe8ULk',
                language: 'es',
              }}
              // style={styles.input}
            />
            <TextInput
              required
              style={styles.input}
              placeholder="Nº piso, portal, etc."
              name="detail"
              onChangeText={setDetail}
            />
          </ScrollView>
        </View>
      )}

      {selectedOptionPlace === 'pickup' && (
        <Text style={styles.pickupText}>{direction}</Text>
      )}

      {selectedOptionPlace === 'local' && (
        <TextInput
          required
          style={styles.input}
          placeholder="Nº de mesa."
          keyboardType="numeric"
          onChangeText={setTable}
          name="table"
        />
      )}

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>¿Deseas añadir un comentario?</Text>
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.textarea}
          placeholder="Ej: el bocadillo partido a la mitad"
          name="description"
          onChangeText={setDescription}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  homeContainer: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pickupText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  textarea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
});

export default Direction;
