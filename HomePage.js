import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import List from './List.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarcoApp from './MarcoApp.js'
import BrianApp from './BrianApp.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const exampleData = [
  {name: "home", alert: true, status: false, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "gym", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "work", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "qt", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "coffee", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "Marco", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "Christian", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'},
  {name: "BUHRYAN", alert: true, status: true, image: 'https://image.flaticon.com/icons/svg/846/846551.svg'}
]

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.setState({
      todos: exampleData
    })
  }


  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <Text style={styles.title}>
            BAMK!
          </Text>
          <List todos={this.state.todos}/>
        </ScrollView>
      </View>
    )
  }
}

export default HomePage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 42,
  },
  mainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#141414',
  },
  footerContainer: {
    justifyContent: 'center',
    height: "8%",
    backgroundColor: 'purple'
  },
  title: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center'
  }
});