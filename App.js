import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MarcoApp from './MarcoApp.js'
import BrianApp from './BrianApp.js'
import HomePage from './HomePage.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tabs = createBottomTabNavigator();

function MyHeader() {
  return(
    <View style={styles.headerContainer}>
      {/* <Text style={styles.headerText}>BAMK</Text> */}
    </View>
  )
}

function MyTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="HomePage"
      tabBarOptions={{
        activeTintColor: '#e91e63',
        showLabel: false,
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: 'black'
        }
      }}
    >
      <Tabs.Screen
        name="Todos"
        component={BrianApp}
        options={{
          tabBarLabel: 'Todos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={'white'} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: 'HomePage',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={'white'} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="Address"
        component={MarcoApp}
        options={{
          tabBarLabel: 'Address',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={'white'} size={35} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
    return (
      <NavigationContainer>
        <MyHeader/>
        <MyTabs />
      </NavigationContainer>
    )
  }

  const styles = StyleSheet.create({
    headerContainer: {
      height: '10%',
      backgroundColor: 'black',
      borderBottomColor: 'white'
    },
    headerText: {
      color: 'white',
      fontSize: 50,
      textAlign: 'center'
    }
  })


// const styles = StyleSheet.create({
//   contentContainer: {
//     flex: 1,
//     backgroundColor: '#d3d3d3',
//     justifyContent: 'center',
//   },
// });

//141414 is the black color i like
