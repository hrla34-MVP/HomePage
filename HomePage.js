import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, } from 'react-native';
import List from './List.js';

//server
import gql from 'graphql-tag'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

//address convert
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// define location fences
import fenceDefiner from './FenceDefiner/fenceDefiner.js';


// const exampleData = [
//   {name: "home", helloImHere: false, status: false, image: 'home'},
//   {name: "gym", helloImHere: false, status: true, image: 'dumbbell'},
//   {name: "work", helloImHere: true, status: true, image: 'office-building'},
//   {name: "qt", helloImHere: false, status: true, image: 'home-heart'},
//   {name: "coffee", helloImHere: false, status: true, image: 'coffee'},
//   {name: "school", helloImHere: false, status: true, image: 'school'},
//   {name: "church", helloImHere: false, status: true, image: 'church'},
//   {name: "BUHRYAN", helloImHere: false, status: true, image: 'home-account'}
// ]


const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://geofencing-notification.herokuapp.com/graphql'
    // uri: 'http://localhost:8000/graphql' --> for development / testing
  }),
  cache: new InMemoryCache()
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this._getLocationAsync();

    this.getAll()

    // this.convertAddress(this.state.)

  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
  }

  getAll = function() {
    client.query({
      query: gql `
      query areas {
        areas {
          name
          latitude
          longitude
          radius
          enter
          exit
          title
          body
          icon
        }
      }`
    })
    .then(response => this.setState({
      todos : response.data.areas
    }, () => {
      console.log('**************** This is the areas (afterGetAll): \n',this.state.todos);
      // fenceDefiner(this.state.todos);
      fenceDefiner(exampleData);
    }));
  };


  convertAddress(lat, lng){
    let myAddress = Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng
    })
    let AddressStr = this._getAddress(myAddress[0])
    return AddressStr;
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


let exampleData = [
  {
    name: 'Hack Reactor-',
    longitude: -118.391144,
    latitude: 33.975750,
    radius: 50,
    enter: true,
    exit: true
  },
  {
    name: 'UCLA-',
    longitude: -118.45,
    latitude: 34.07,
    radius: 50,
    enter: true,
    exit: false
  }
]