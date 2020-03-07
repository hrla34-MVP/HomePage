import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';

class BrianApp extends Component {
  constructor(props) {
    super(props);

  }

  render() {
   return(
     <View>
       <Text style={styles.Tester}>Hello</Text>
     </View>
   )
  }
}

const styles = StyleSheet.create({
  Tester: {
    fontSize: 200
  },
})

export default BrianApp;
