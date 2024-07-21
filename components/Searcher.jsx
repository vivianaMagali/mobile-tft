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
    marginTop: 1,
    marginBottom: 1,
  },
  searchSection: {
    flexDirection: 'row',
    width: '90%',
  },
  input: {
    flex: 1,
    padding: 3,
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    borderRadius: 10,
  },
});

export default Searcher;
