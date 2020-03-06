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
            {/* {this.state.showEdit ? 
            <TouchableOpacity style={styles.editButton}>
              <Text>Edit</Text>
            </TouchableOpacity>: null} */}
            <TouchableOpacity 
              onPress={this.onPressButton}
              onLongPress={this.onLongPressButton}
              delayLongPress={200}
              underlayColor="white">
              <View>
                {this.state.currentStatus ? 
                <MaterialCommunityIcons name="circle-outline" color={'white'} size={70} /> :
                <MaterialCommunityIcons name="circle-outline" color={'grey'} size={70} /> }
                 {/* <Image 
              source={require('./assets/circle_v2.png')}
                 style={{ width: 50, height: 50, borderColor: 'blue'}}/> :
               <Image 
                 source={require('./assets/circle_v2.png')}
                 style={{ width: 50, height: 50, borderColor: 'red'}}/> } */}
              </View> 
            </TouchableOpacity>
            {/* {this.state.showEdit ? 
            <TouchableOpacity style={styles.deleteButton}>
              <Text>Delete</Text>
            </TouchableOpacity>: null} */}
          </View>
        </Swipeable>
      ) : ( 
        <View>
        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   alert('Modal has been closed.');
          // }}
          >
          <View style={styles.modalContainer}>
          <TouchableOpacity
              onPress={this.editTodo}
              style={styles.editButton}>
              <MaterialCommunityIcons name="pencil-circle-outline" color={'green'} size={50} />

            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <MaterialCommunityIcons name="circle-outline" color={'white'} size={100} />
              </TouchableOpacity>
            <TouchableOpacity
              onPress={this.deleteTodo}
              style={styles.deleteButton}>
              <MaterialCommunityIcons name="minus-circle-outline" color={'red'} size={50} />

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
    backgroundColor: 'grey',
    justifyContent: 'center',
    flex: 1
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
    padding: 20
  },
  leftAction: {
    backgroundColor: 'orange',
  },
  editButton: {
    alignSelf:"center",
    paddingTop: 200,
    marginBottom: "10%"
  },
  deleteButton: {
    alignSelf: "center",
    marginTop: "10%",
    paddingBottom: 200
  },
  modalContainer: {
    backgroundColor: '#141414',
    justifyContent: "center",
    alignContent: "center"
  }

});

export default ListEntry;
