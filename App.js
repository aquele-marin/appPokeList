/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import Axios from 'axios';

// Item da lista de pokemons
const Item = ({ name, image }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemName}>{name}</Text>
      <Image source={{
        uri: image
      }} style={styles.listImage}/>
    </View>
  )
}

const App = () => {
  const [pokeOffset, setPokeOffset] = useState(0);
  const [pokeList, setPokeList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
 
  // Funçãoo que busca pokemons na API
  const fetchData = async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      const response = await Axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${pokeOffset}&limit=20`);
      let vetor = [];

      // Percorre cada pokemon buscando suas informações individualmente
      for (const pokemon of response.data.results) {
        const _response = await Axios.get(pokemon.url);
        vetor.push(_response.data);
      }

      // atualiza lista de pokemons com o vetor dos atuais e o vetor dos que foram buscados no momento
      setPokeList([... pokeList, ... vetor]);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setRefreshing(false);
    }
  }

  // Inicia a primeira busca, e observa a variavel que muda quando for necessário buscar novos pokemons
  useEffect(() => {
    fetchData();
  }, [pokeOffset]);

  // Renderiza item da lista
  const renderItem = ({ item }) => <Item name={item.name} image={item.sprites.front_default}/>

  return (
    <View style={styles.body}>
      <View style={styles.lists}>
        <View style={styles.firstList}>
          <Text style={styles.firstListHeader}>Pokelist</Text>
          <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={pokeList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            setPokeOffset(pokeOffset+20);
          }}
          refreshing={refreshing}
          />
        </View>
      </View>
    </View>
  );
};

// Estilização
const styles = StyleSheet.create({
  body: {
    flex: 100,
    marginVertical: '10%',
    marginHorizontal: '5%',
  },
  lists: {
    flex: 100,
    flexDirection: 'row',
  },
  firstList: {
    flex: 60,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#B2bAEA',
    elevation: 12,
  },
  firstListHeader: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#a1d9f9',
    fontSize: 42,
    paddingLeft: 30,
  },
  listItem: {
    height: 78,
    flexDirection: 'row',    
  },
  listImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  listItemName: {
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center'
  }
});

export default App;
