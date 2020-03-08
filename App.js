import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MarcoApp from './MarcoApp.js'
import BrianApp from './BrianApp.js'
import HomePage from './HomePage.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';


import taskDefiner from './FenceDefiner/taskDefiner.js';
import * as TaskManager from 'expo-task-manager';

// to set up the tasks!
taskDefiner();

const FooterBar = createBottomTabNavigator();

function MyHeader() {
  return(
    <View style={styles.headerContainer}></View>
  )
}

function MyFooterBar() {
  return (
    <FooterBar.Navigator
      initialRouteName="HomePage"
      tabBarOptions={{
        activeTintColor: '#e91e63',
        inactiveTintColor: 'white',
        showLabel: false,
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: 'black',
          borderTopColor: 'black',
        }
      }}
    >
      <FooterBar.Screen
        name="Todos"
        component={BrianApp}
        options={{
          tabBarLabel: 'Todos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={35} />
          ),
        }}
      />
      <FooterBar.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: 'HomePage',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={35} />
          ),
        }}
      />
      <FooterBar.Screen
        name="Address"
        component={MarcoApp}
        options={{
          tabBarLabel: 'Address',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={35} />
          ),
        }}
      />
    </FooterBar.Navigator>
  );
}

export default function App() {
    return (
      <NavigationContainer>
        {/* <MyHeader/> */}
        <MyFooterBar />
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

  TaskManager.defineTask('notification', (val) => {
    let data = val.data;
    let error = val.error;

    let eventType = data.eventType;
    let region = data.region;

    // let parsedFromIdentifier = JSON.parse(region.identifier);



    if (error) {
      console.error(error.message);
    }

    // We are opting to just use default messages
    if (eventType === Location.GeofencingEventType.Enter) {
      // scheduleNotification(region, `You have entered ${region}`);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      // scheduleNotification(region, `You have left ${region}`);
    }

    // This would have let us do custom messages
    // scheduleNotification(parsedFromIdentifier.title, parsedFromIdentifier.body);

  })