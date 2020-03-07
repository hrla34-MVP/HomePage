import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';


class ListEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStatus: this.props.todo.status,
      showEdit: false,
      modalVisible: false,
    }

    this.onPressButton = this.onPressButton.bind(this);
    this.onLongPressButton = this.onLongPressButton.bind(this);
  }

  onPressButton = () => {
    this.setState({
      currentStatus: !this.state.currentStatus
    });
  }

  onLongPressButton = () => {
    this.setState({
      modalVisible: true
    });
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    })
  }

  
  RightAction = () => {
    return(
    <View style={styles.rightAction}>
      <Text style={styles.actionText}>{this.props.todo.name}</Text>
    </View>
    )
  }

  //if I want to add a left action
  LeftAction = () => {
  }


  render() {
    return(
      <View>
      {!this.state.modalVisible ? (
        <Swipeable renderRightActions={this.RightAction} renderLeftActions={this.LeftAction}>
          <View style={styles.buttonStyle}>
            <TouchableOpacity 
              onPress={this.onPressButton}
              onLongPress={this.onLongPressButton}
              delayLongPress={200}
              underlayColor="white">
              <View>
                {this.state.currentStatus ? 
                <MaterialCommunityIcons name={this.props.todo.image} color={'white'} size={70} /> :
                <MaterialCommunityIcons name={this.props.todo.image} color={'grey'} size={70} /> }
              </View> 
            </TouchableOpacity>
          </View>
        </Swipeable>
      ) : ( 
        // style={styles.modalSuperContainer}
        <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   alert('Modal has been closed.');
          // }}
          >
          <View style={styles.modalContainer}>
          <TouchableOpacity
              onPress={this.editTodo}
              style={styles.editButton}>
              <MaterialCommunityIcons name="pencil-circle-outline" color={'green'} size={80} />

            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <MaterialCommunityIcons name={this.props.todo.image} color={'white'} size={160} />
              </TouchableOpacity>
            <TouchableOpacity
              onPress={this.deleteTodo}
              style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle-outline" color={'red'} size={80} />

            </TouchableOpacity>
          </View>
        </Modal>
        </View>
      )}  
      </View> 
    )
  }
}



const styles = StyleSheet.create({
  buttonStyle: {
    alignSelf: "center",
    marginVertical: 20
  },
  rightAction: {
    justifyContent: 'center',
    marginRight: '45%',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    alignSelf:"center",
    marginBottom: 50,
  },
  deleteButton: {
    alignSelf: "center",
    marginTop: 50,
  },
  modalContainer: {
    backgroundColor: '#141414',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // modalSuperContainer: {
  //   justifyContent: "center",
  //   alignContent: "center",
  // }

});

export default ListEntry;
