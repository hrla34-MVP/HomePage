/*
## TO START
  - npm install
  - expo start
*/
// front end
import React from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, ScrollView, KeyboardAvoidingView, StatusBar, Modal, TouchableHighlight, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//<MaterialCommunityIcons name={this.props.todo.image} color={'white'} size={70} />


// server
import gql from 'graphql-tag'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import * as TaskManager from 'expo-task-manager'
import {Notifications} from 'expo';


const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://geofencing-notification.herokuapp.com/graphql'
    // uri: 'http://localhost:8000/graphql' --> for development / testing
  }),
  cache: new InMemoryCache()
});

export default class MarcoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null, // error message holder
      mapRegion: {
        longitude: 0,
        ladtitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }, // Delta numbers determine zoom

      myAddress: '', //  current set address ; chg by "_saveAddress" or "_getLocationAsync"
      mylocation: null, // current location coords

      newAddress: '', // new address properties
      newcoors: {}, // coordinates corresponding to a new address => Database _ coords


      areaName:'', // NAME of the defined area => Database _ name
      radius: 100, // RADIUS of the defined area => Database _ radius ; default of 100m

      // ------states for modal

      // Address
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      street: '',
      city:'',
      region:'',
      zip: '',

      // Events
      notiOpen: false,
      notiEnter: false, // Enter => Database _ Enter
      notiExit: false,  // Exit => Databse _ Exit
      notiTitle: '',
      notiBody: '',

    //states for event handling
        //  enter_noti : true(on) / false(off)
        //  exit_noti : true(on)/ false(off)
        //  notification : true/ false
        //  title
        //  body

      iconhold: '',
      icon: 'home-account',
      areas: []
    }
  }





  // - when you first load the page, it will get the current location's coordinates by calling _getLocationAsync method
  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }

  }
// ------------------------------------------------------
  // server - get request
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
      areas : response.data.areas
    }, () => console.log('***************This is the areas: \n',this.state.areas)));
  };

/*
          latitude
          longitude
          radius
          enter
          exit
          title
          body
 */
// variables: {"name": this.state.name, "latitude": this.state.mapRegion.latitude, "longitude": this.state.mapRegion.longitude, "radius": this.state.radius, "enter": this.state.notiEnter, "exit": this.state.notiExit, "title": "", "body": ""},


  postOne(){
    var name = this.state.areaName;
    var latitude = this.state.mapRegion.latitude;
    var longitude = this.state.mapRegion.longitude;
    var radius = this.state.radius;
    var enter = this.state.notiEnter;
    var exit = this.state.notiExit;
    var icon = this.state.icon

    client.mutate({
      variables: {"name": name, "latitude": latitude, "longitude": longitude, "radius": radius, "enter": enter, "exit": exit, "title": "", "body": "", "icon": icon},
      mutation: gql`
      mutation createArea ($name: String!, $latitude: Float!, $longitude: Float!, $radius: Int!, $enter: Boolean!, $exit: Boolean!, $title: String!, $body: String!, $icon: String!) {
        createArea (name: $name, latitude: $latitude, longitude: $longitude, radius: $radius, enter: $enter, exit: $exit, title: $title, body: $body, icon: $icon) {
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
     }).then(response => console.log('From Post Request: ', response))
     .catch(err => console.error(err));
  }


  setModalVisible(){
    this.setState({modalVisible: !this.state.modalVisible})
  }
  setModalVisible2(){
    this.setState({modalVisible2: !this.state.modalVisible2})
  }
  setModalVisible3(){
    this.setState({modalVisible3: !this.state.modalVisible3})
  }

  _saveIcon(){
    this.setState({icon: this.state.iconhold})
  }

  handleEventOpen(){
    this.setState({
      notiOpen: false
    })
  }

  handleNotiOpen(){
    this.setState({
      notiOpen: !this.state.notiOpen
    })
  }

  handleNotiEnter(){
    this.setState({
      notiEnter: !this.state.notiEnter
    })
  }

  handleNotiExit(){
    this.setState({
      notiExit: !this.state.notiExit
    })
  }

// ------------------------------------------------------
  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };
// ------------------------------------------------------
  //get my current location and chg myaddress in the state
    //this will set mylocation to current location
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let mylocation = await Location.getCurrentPositionAsync({});
    let myAddress = await Location.reverseGeocodeAsync({
      latitude: mylocation.coords.latitude,
      longitude: mylocation.coords.longitude
    })
    let AddressStr = this._getAddress(myAddress[0])

    this.setState({
      myAddress: AddressStr,
      mylocation,
      mapRegion: {
      latitude: mylocation.coords.latitude,
      longitude: mylocation.coords.longitude,
      latitudeDelta: 0.005, // Delta numbers determine zoom
      longitudeDelta: 0.005 // Delta numbers determine zoom
      }
    })
  };
// ------------------------------------------------------
    //this method will convert an full address object to a full address string
  _getAddress = (addressObj) => {
    var name = addressObj.name;
    var street = addressObj.street;
    var city = addressObj.city;
    var state =addressObj.region;// state
    var postalcode = addressObj.postalCode;
    var country = addressObj.country;
    var result = `${name} ${street}, ${city}, ${state} ${postalcode}, ${country}`;
    return result;
  }
// ------------------------------------------------------
  // pass down a string of address or location info as an argument
  _getCoors = async (newAddress) => { //
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

      //calling geocodeAsync with argument of a address will give you an object containing ladtitude and longitude
    var coorsObj = await Location.geocodeAsync(newAddress)

      //reassign newcoors
    this.setState({
      newcoors: coorsObj
    })
  }
// ------------------------------------------------------
  _saveAddress = async () => {
    var newAddress = `${this.state.street}, ${this.state.city}, ${this.state.region} ${this.state.zip}, United States`
      // create a address string that is made with input feilds and pass it down to get_Coors to get coordinate of it
    await this._getCoors(newAddress)
      // new coords will be saved in "state.newcoors"

    // if coords does not exist -> give it an error msg and ask to chg address input

      //get the latitude and longitude from newcoors
    var newLad = this.state.newcoors[0].latitude;
    var newLng = this.state.newcoors[0].longitude;

      //using the newcoors's lad and lng, get the correct address by passing it down to reverseGeocodeAsync
    let myAddress = await Location.reverseGeocodeAsync({
      latitude: newLad,
      longitude: newLng
    })

      //"myAddress[0]" will be an obj consisted with properties (name,street,city,region,postalcode,country)
        //so pass it down to getAddress to get the full address in one string
    let AddressStr = this._getAddress(myAddress[0])

      // reassign states ;
        //myAddress -> new full address in one string searched by input
        //newAddress -> incomplete addresss which is a combination of inputs
        //mapRegion.newLad , mapRegion.newLgn are from "this.state.newcoors" which is a new coordinate

    this.setState({
      myAddress: AddressStr,
      mapRegion: {
        latitude: newLad,
        longitude: newLng,
        latitudeDelta: 0.005, // Delta numbers determine zoom
        longitudeDelta: 0.005 // Delta numbers determine zoom
      },
      newAddress
    })
  }
// ------------------------------------------------------RENDERING
  render(){
    let text = 'Waiting..';
    let myadd = 'Waiting..';
    let newadd = 'Waiting..';
    let newcoors = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.mylocation) {
      text = JSON.stringify(this.state.mylocation);
      myadd = this.state.myAddress; // this will be the address show up below the map
      newcoors = JSON.stringify(this.state.newcoors);
      newadd = this.state.newAddress;
    }

    if(this.state.radius > 0 && this.state.radius < 10001){
      var mapCircle = this.state.radius;
    } else if (this.state.radius > 10000){
      var mapCircle = 10000
    } else {
      var mapCircle = 100
    }

// ------------------------------------------------------HTML
    return (
      <View>
      {/* <StatusBar barStyle="dark-content"/> */}
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
      <View style={styles.conOne}>
        <View style={styles.conTwo0}>
          <View style={styles.conTwo00}>
          <View style={{marginTop: 22}}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              presentationStyle="pageSheet"
              style={styles.addressModal}
            >
              <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
              <View style={{marginTop: '100%', alignItems: "center", justifyContent:"center", backgroundColor: "transparent"}}>

                <View style={styles.input1}>
                  <TextInput
                    placeholder="Street Address"
                    keyboardAppearance="dark"
                    placeholderTextColor="rgb(200,200,200)"
                    style={{color: 'white'}}
                    onChangeText={(text) => this.setState({
                      street: text
                    })}
                  />
                </View>
                <View style={styles.input2}>
                  <TextInput
                    placeholder="City"
                    keyboardAppearance="dark"
                    placeholderTextColor="rgb(200,200,200)"
                    style={{color: 'white'}}
                    onChangeText={(text) => this.setState({
                      city: text
                    })}
                  />
                </View>
                  <View style={styles.input3}>
                    <View style={styles.input4}>
                      <TextInput
                        placeholder="State"
                        keyboardAppearance="dark"
                        placeholderTextColor="rgb(200,200,200)"
                        style={{color: 'white'}}
                        onChangeText={(text) => this.setState({
                          region: text
                        })}
                      />
                    </View>
                    <View style={styles.input5}>
                      <TextInput
                        placeholder="Zip Code"
                        keyboardAppearance="dark"
                        placeholderTextColor="rgb(200,200,200)"
                        keyboardType="number-pad"
                        style={{color: 'white'}}
                        onChangeText={(text) => this.setState({
                          zip: text
                        })}
                      />
                    </View>
                  </View>
                  <View style={styles.input6}>
                    <View style={styles.save}>
                      <Button
                        onPress={async () => {
                          await this._saveAddress()
                          await this.setModalVisible()
                        }}
                        title="save"
                        color="white"
                      />
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible2}
              presentationStyle="pageSheet"
              style={styles.addressModal}
            >
              <TouchableWithoutFeedback onPress={()=> {
                Keyboard.dismiss()}}>
                <View style={{marginTop: '100%', alignItems: "center", justifyContent:"center", backgroundColor: "transparent"}}>
                  <View style={{width: '80%', height: 240, backgroundColor: "rgb(40,40,40)",    justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.eventsTitle}>
                      <Text style={{ ...styles.eventsFont, fontSize: 16}}>EVENTS</Text>
                    </View>
                    <View style={styles.eventwrapper}>
                      {!this.state.notiOpen ? (
                        <TouchableHighlight style={styles.events1} onPress={()=>this.handleNotiOpen()} underlayColor='transparent'><Text style={styles.eventsFont}>Notification +</Text></TouchableHighlight>
                         ) : (
                        <TouchableHighlight style={styles.events1open} onPress={()=>this.handleNotiOpen()} underlayColor='transparent'><Text style={styles.eventsFont}>Notification -</Text></TouchableHighlight>
                      )}
                      {!this.state.notiOpen ? (<View></View>):(
                        <View style={{...styles.eventsNoti, flexDirection: 'row'}}>
                          <TouchableHighlight
                          onPress={()=>{
                            this.handleNotiEnter()
                          }}
                          color="white"
                          style={styles.events2}
                          >
                          {this.state.notiEnter ? (<Text style={{color: 'white'}}>On Enter : ON</Text>) : (<Text style={{color: 'white'}}>On Enter : OFF</Text>)}
                          </TouchableHighlight>
                          <TouchableHighlight
                          onPress={()=>{
                            this.handleNotiExit()
                          }}
                          color="white"
                          style={styles.events2}
                          >
                            {this.state.notiExit ? (<Text style={{color: 'white'}}>On Exit : ON</Text>) : (<Text style={{color: 'white'}}>On Exit : OFF</Text>)}
                          </TouchableHighlight>
                        </View>
                      )}
                      <View style={styles.events1}><Text style={styles.eventsFont}>Bluetooth +</Text></View>
                      <View style={styles.events1}><Text style={styles.eventsFont}>Wifi +</Text></View>

                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible3}
              presentationStyle="pageSheet"
              style={styles.addressModal}
            >
              <View style={{marginTop: '100%', alignItems: "center", justifyContent:"center", backgroundColor: "transparent"}}>
                <View style={{width: 300, height: 330, backgroundColor: "rgb(40,40,40)",    justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.iconBox}>
                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'home' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'home'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'dumbbell' },() => console.log(this.state.icon))}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'dumbbell'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'home-heart' })}
                      color="white"
                      style={styles.events3}
                    >
                     <MaterialCommunityIcons name={'home-heart'} color={'white'} size={50} />
                    </TouchableHighlight>
                  </View>

                  <View style={styles.iconBox}>
                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'coffee' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'coffee'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'school' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'school'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'church' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'church'} color={'white'} size={50} />
                    </TouchableHighlight>
                  </View>
                  <View style={styles.iconBox}>
                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'home-account' })}
                      color="white"
                      style={styles.events3}
                    >
                     <MaterialCommunityIcons name={'home-account'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'library' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'library'} color={'white'} size={50} />
                    </TouchableHighlight>

                    <TouchableHighlight
                      onPress={()=> this.setState({ iconhold: 'office-building' })}
                      color="white"
                      style={styles.events3}
                    >
                      <MaterialCommunityIcons name={'office-building'} color={'white'} size={50} />
                    </TouchableHighlight>
                  </View>
                    <View style={styles.save}>
                      <Button
                        onPress={async () => {
                          await this._saveIcon()
                          await this.setModalVisible3()
                        }}
                        title="save"
                        color="white"
                      />
                    </View>
                </View>
              </View>
            </Modal>
      </View>
          </View>
          <View style={styles.conTwo01}>
            <View style={{ ...styles.conThree2, justifyContent: 'center',
            // alignItems: 'start',
            top: '20%' ,leftPadding: 10}}>
              <Text style={{width: 300, color:'white', fontSize: 24}}>REGISTER AREA</Text>
            </View>
          </View>
        </View>
        <View style={styles.conTwo1}>
          <View style={styles.conThree1}>
            <MapView region={this.state.mapRegion}
            onRegionChange={this._handleMapRegionChange} style={styles.mapStyle}>
              <Circle center={{latitude: /*this.state.mapRegion.latitude*/ -118, longitude: /*this.state.mapRegion.longitude*/ 33}} radius={mapCircle} fillColor="rgba(180,180,180,0.7)" zIndex={2} strokeWidth={0.001}/>
            </MapView>
          </View>
          <View style={styles.conThree2}>
              {/* <Text style={{width: 300, color:'white'}}> :: AREA ADDRESS ::</Text> */}
              <Text style={{width: 300, color:'white'}}> {myadd}</Text>
            </View>
          <View style={styles.conThree3}>
            <View style={styles.conFour1}>
              <TextInput
                placeholder="Area Name"
                keyboardAppearance="dark"
                placeholderTextColor="grey"
                style={{color: 'white'}}
                onChangeText={(text) => this.setState({
                  areaName: text
                })}
              />
            </View>
            <View style={styles.conFour2}>
              <TextInput
                placeholder="Radius 100m, 200m..."
                keyboardAppearance="dark"
                keyboardType="number-pad"
                placeholderTextColor="grey"
                style={{color: 'white'}}
                onChangeText={(text) => {
                  if(Number(text) > 10000){
                    this.setState({
                      radius: 10000
                    })
                  } else {
                    this.setState({
                      radius: Number(text)
                    })
                  }
                  }}
              />
            </View>
          </View>
        </View>
        <View style={styles.conTwo2}>
          <View style={styles.conThree4}>
            <View style={styles.conFourhold}>
              <View style={styles.conFour3}>
                <TouchableHighlight
                onPress={this._getLocationAsync}
                color="white"
                >
                  <Text style={{color: 'white'}}>CURRENT LOCATION +</Text>
                </TouchableHighlight>
              </View>
              {/* <TouchableOpacity onPress={ ()=> { 
                  TaskManager.getRegisteredTasksAsync().then(val => console.log(`All Registered Tasks\n`,JSON.stringify(val)));
                }}><Text style={{color: 'white'}}>GetAllRegisteredTasks</Text></TouchableOpacity>
              <TouchableOpacity onPress={ ()=> { 
                  Location.getCurrentPositionAsync({})
                    .then(val => console.log(`location: `, val));

                }}><Text style={{color: 'white'}}>GetAllRegisteredTasks</Text></TouchableOpacity> */}
              <View style={styles.conFour4}>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible()
                  }}>
                  <Text style={{color: 'white'}}>ADDRESS +</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.conFour4}>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible2()
                    this.handleEventOpen()
                  }}>
                  <Text style={{color: 'white'}}>EVENT +</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.conFour4}>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible3()
                  }}>
                  <Text style={{color: 'white'}}>ICON +</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={styles.conThree5}>
            <View style={styles.conFour5}>
              <Text style={{color: 'white'}} onPress={
                async () => {
                  await this.postOne()
                  await this.getAll()
              }}>REGISTER</Text>
            </View>
          </View>
        </View>
        <View style={styles.conTwo10}>
        </View>
        </View>
      </TouchableWithoutFeedback>
      </View>
    )
  };
}
// ------------------------------------------------------STYLING
const styles = StyleSheet.create({
  conOne:{
    height: Dimensions.get('window').height,
    justifyContent: 'flex-start',
  },
  conTwo0:{
    flex: 1.5,
    backgroundColor: 'rgb(14,14,14)'
  },
  conTwo00:{
    flex: 1,
    backgroundColor: 'rgb(14,14,14)'
  },
  conTwo01:{
    flex: 2,
    backgroundColor: 'rgb(14,14,14)',
    color: 'white'
  },
  conTwo1:{
    flex: 5,
  },
  conTwo2:{
    flex: 5
  },
  conTwo10:{
    flex: 1.5,
    backgroundColor:'rgb(14,14,14)'
  },
  conThree1:{
    height: '100%',
    flex: 6,
  },
  mapStyle: {
    height: '100%',
    width: Dimensions.get('window').width
  },
  conThree2:{
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(14,14,14)',
    padding: 15
  },
  conThree3:{
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  conThree4:{
    flex: 3,
    backgroundColor: 'rgb(14,14,14)',
  },
  conThree5:{
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(14,14,14)',
  },
  conFour1:{
    height: '100%',
    flex: 1,
    backgroundColor: 'rgb(14,14,14)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  conFour2:{
    height: '100%',
    backgroundColor: 'rgb(14,14,14)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  conFourhold:{
    height: '100%'
  },
  conFour3:{
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(14,14,14)',
  },
  conFour4:{
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(14,14,14)'
  },
  conFour5:{
    height: 50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgb(30,30,30)',
  },
  inputBox:{
    // backgroundColor: 'blue',
    height: 250,
    width: 300,
    justifyContent: 'space-around'
  },
  input1:{
    height: 50,
    width: 300,
    backgroundColor: 'rgb(40,40,40)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input2:{
    height: 50,
    width: 300,
    backgroundColor: 'rgb(40,40,40)',
    color:'rgb(14,14,14)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input3:{
    height: 50,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input4:{
    flex: 1,
    height: 50,
    width: '50%',
    backgroundColor: 'rgb(40,40,40)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input5:{
    flex: 1,
    height: 50,
    width: '50%',
    backgroundColor: 'rgb(40,40,40)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input6: {
    height: 50,
    width: 300,
    backgroundColor: "rgb(40,40,40)",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  save :{
    width: '50%',
    height: 50,
    backgroundColor: 'rgb(40,40,40)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  current :{
    width: 50,
    height: 50,
    position: 'absolute',
    top: '80%',
    bottom: '5%',
    zIndex: 2
  },
  addressModal:{

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgb(30,30,30)',
  },
  eventsTitle:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  events1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingRight: '40%'
  },
  events1open:{
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingRight: '40%',
    // backgroundColor: 'rgb(20,20,20)'
  },
  events2:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    // paddingRight: '20%',
    // backgroundColor: 'rgb(20,20,20)'

  },
  eventsFont: {
    color: 'white'
  },
  eventwrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsNoti: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50%',
    // backgroundColor: 'blue'
  },
  events3 :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90
  },
  iconBox :{
    flexDirection: 'row'
  }

});

/*
# Resoureces

react-native-maps // MapView
  url : https://docs.expo.io/versions/latest/sdk/map-view/

expo-location // converting coors/addresses
  url : https://docs.expo.io/versions/latest/sdk/location/#locationgeocodeasyncaddress

test address :
  6060 Center Dr, Los Angeles, CA 9004
*/