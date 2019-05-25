import React, { Component } from "react";
import { Alert, View, TextInput, StyleSheet, AsyncStorage, KeyboardAvoidingView, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { Picker, Spinner, Switch, Button, Text, Toast, Container, Header, Title, Input, Content, Icon, Body, Left, ActionSheet, ListItem, Item, Right, Label } from "native-base";
import Orientation from 'react-native-orientation-locker';
import Dialog from "react-native-dialog";
import { Decimal } from 'decimal.js';

const Realm = require('realm');

class FormNota extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      realm: null,     
      produtos: [],
      itensNota: []      
      
    };
  }

  componentDidMount() {

    navigationListener = this.props.navigation.addListener('willFocus', () => {

      Orientation.lockToLandscapeLeft(); 

      const realm = new Realm();

      let produtos = realm.objects('Produto');

      this.setState({ 
        realm,
        produtos, 
        loading: false
      });    


    })

  }

  selectProduct(item, quantidade){
 
    let valorTotalNota = 0;
    let itensNota = [];
    let ind = false;

    for(let i in this.state.itensNota){

      let a = this.state.itensNota[i];
        
      if(item.id == a.produto_id){

        ind = true;

        //SE EXISTE ESTOQUE DISPONÍVEL INCREMENTA, SE NÃO, MANTÉM QUANTIDADE ANTERIOR
        let refQtd = (item.estoque >= (a.quantidade + quantidade)) ? a.quantidade + quantidade : a.quantidade;

        valorTotalNota = Decimal.add(valorTotalNota, Decimal.mul(refQtd, a.preco)).toString();
        itensNota.push({ cod: null, nome: a.nome, preco: a.preco, desconto: a.desconto, imgTablet: a.imgTablet, quantidade: refQtd, estoque: a.estoque, produto_id: a.produto_id });

        

      }else{

        valorTotalNota = Decimal.add(valorTotalNota, Decimal.mul(a.quantidade, a.preco)).toString();
        itensNota.push({ cod: null, nome: a.nome, preco: a.preco, desconto: a.desconto, imgTablet: a.imgTablet, quantidade: a.quantidade, estoque: a.estoque, produto_id: a.produto_id });

      }

    }

    if(!ind && item.estoque > 0){
 
      valorTotalNota = Decimal.add(valorTotalNota, Decimal.mul(quantidade, item.preco)).toString();      
      itensNota.splice(0, 0, { cod: null, nome: item.nome, preco: item.preco, desconto: item.desconto, imgTablet: item.imgTablet, quantidade: quantidade, estoque: item.estoque, produto_id: item.id });
    
    }  

    this.setState({ itensNota, valor_distribuido: valorTotalNota });

  }

  formatPrice(value) {
    let val = (value/1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }


  render() {

    if (this.state.loading){
      return (
        <View style={{ flex:1, justifyContent: 'center',alignItems: 'center' }}>
          <Spinner color='green' />
        </View>
      );
    }

    return (
      <Container style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row' }}>        
          <View style={{flex: 1, paddingHorizontal: 5 }}>      
                        
                  <View style={{ marginLeft: 0, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#eaeaea', alignSelf: 'stretch', flexDirection: 'row' }}>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Cod
                    </Text>
                    <Text style={{ flex: 3 }}>
                      Descrição
                    </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Desc.
                    </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Qtd
                    </Text> 
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Preço
                    </Text> 
                  </View>
                  <FlatList
                    style={{ paddingRight: 10 }}
                    data={this.state.produtos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {

                        return (

                          <ListItem
                            onPress={ ()=> { this.selectProduct(item, 1) } }
                            onLongPress={ ()=> { this.selectProduct(item, 5) } }
                            style={{ marginLeft: 0, paddingRight: 0, paddingHorizontal: 10, flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}
                          >                        
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.id}
                            </Text>
                            <Text style={{ flex: 3 }}>
                              {item.nome}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.desconto ? 'S': 'N'}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.estoque}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              R$ {this.formatPrice(item.preco)}
                            </Text>                            
                          </ListItem>                         
                        );                   

                    }}                    
                  />              
                           
          </View>
          <View style={{ flex: 1 }}>             
                
              <View style={{ flex: 1 }}>
                
                <View style={{ flex: 1 }}>
                  <View style={{ marginLeft: 0, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#eaeaea', alignSelf: 'stretch', flexDirection: 'row' }}>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Cod
                    </Text>
                    <Text style={{ flex: 3 }}>
                      Descrição
                    </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Desc.
                    </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Qtd
                    </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                      Preço
                    </Text>  
                  </View>
                  <FlatList
                      data={this.state.itensNota}
                      keyExtractor={item => item.cod}
                      renderItem={({ item }) => {

                        return (

                          <ListItem
                            style={{ marginLeft: 0, paddingHorizontal: 10, flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}
                          >                        
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.produto_id}
                            </Text>
                            <Text style={{ flex: 3 }}>
                              {item.nome}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.desconto ? 'S': 'N'}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              {item.quantidade}
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'center' }}>
                              R$ {this.formatPrice(item.preco)}
                            </Text>                            
                          </ListItem>

                        );                       
                      }}                    
                  />
                </View>
              </View>       

          </View>
        </View>       
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: '#ae35d6'
  },
  headerLeft: {
    marginRight: 10, 
    flex: 0,
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
  },


});

export default FormNota;