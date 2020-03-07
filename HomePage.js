import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import List from './List.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarcoApp from './MarcoApp.js'
import BrianApp from './BrianApp.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const exampleData = [
  {name: "home", alert: true, status: false, image: 'home'},
  {name: "gym", alert: true, status: true, image: 'dumbbell'},
  {name: "work", alert: true, status: true, image: 'office-building'},
  {name: "qt", alert: true, status: true, image: 'home-heart'},
  {name: "coffee", alert: true, status: true, image: 'coffee'},
  {name: "Marco", alert: true, status: true, image: 'home-account'},
  {name: "Anthony", alert: true, status: true, image: 'home-account'},
  {name: "BUHRYAN", alert: true, status: true, image: 'home-account'}
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <List todos={this.state.todos}/>
        </ScrollView>
      </View>
    )
  }
}

export default HomePage;


const styles = StyleSheet.create({
  scrollView: {
  },
  mainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#141414',
  },
  title: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center'
  }
});