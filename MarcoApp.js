import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight, } from 'react-native';

class MarcoApp extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return(
      <View>
        <Text style={styles.Tester}>
          MARCOOOOO
        </Text>
      </View>
    )
   }
 }
 
 const styles = StyleSheet.create({
   Tester: {
     fontSize: 200
   }
 })

export default MarcoApp;