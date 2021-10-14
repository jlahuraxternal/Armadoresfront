import React from 'react';
//import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
const Loader = (props) => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <div >
        <div >
          <Spinner 
            animating="border"
            color="#000000"
            size="large"
            
          />
        </div>
      </div>
    </Modal>
  );
};

export default Loader;
/*
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});*/