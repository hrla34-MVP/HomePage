import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';


class ListEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStatus: true,
      showEdit: false,
      modalVisible: false,
      helloImHere: false,
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

  editTodo = () => {
    this.setModalVisible(!this.state.modalVisible);
  }

  deleteTodo = () => {
    this.setModalVisible(!this.state.modalVisible);
  }

  render() {
    // if (this.props.todo.icon === "school") {
    //   this.setState({
    //     helloImHere: true
    //   })
    // }
    return(
      <View>
      {!this.state.modalVisible ? (
        <Swipeable renderRightActions={this.RightAction} renderLeftActions={this.LeftAction}>
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              onPress={this.onPressButton}
              onLongPress={this.onLongPressButton}
              delayLongPress={150}
              underlayColor="white">
              <View>
              {/* this.props.todo.helloImHere  */}
                {this.state.helloImHere && this.state.currentStatus ?
                <MaterialCommunityIcons name={this.props.todo.icon} color={'#1aff1a'} size={70} /> : (
                this.state.currentStatus ?
                <MaterialCommunityIcons name={this.props.todo.icon} color={'white'} size={70} /> :
                <MaterialCommunityIcons name={this.props.todo.icon} color={'#404040'} size={70} /> )}
              </View>
            </TouchableOpacity>
          </View>
        </Swipeable>
      ) : (
        <View>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
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
              {this.state.currentStatus ?
                <MaterialCommunityIcons name={this.props.todo.icon} color={'white'} size={160} /> :
                <MaterialCommunityIcons name={this.props.todo.icon} color={'#404040'} size={160} /> }
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
});

export default ListEntry;

