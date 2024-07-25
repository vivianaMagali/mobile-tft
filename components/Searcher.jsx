import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const Searcher = ({filterList}) => {
  const [text, setText] = useState('');

  const handleTextChange = textInput => {
    setText(textInput);
    filterList(textInput);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          value={text}
          onChangeText={handleTextChange}
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  searchSection: {
    flexDirection: 'row',
    width: '90%',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    padding: 3,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 18,
    color: '#1F2937',
  },
});

export default Searcher;
