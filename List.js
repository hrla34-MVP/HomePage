import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListEntry from './ListEntry.js';

class List extends Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return(
      <View>
        {this.props.todos.map((todo, index) => (
          <ListEntry todo={todo} key={index}/>
        ))}
      </View>
    )
  }
}

export default List;