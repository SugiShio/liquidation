import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAYSG3RjbdhqiQyE0sNnKUUigmryi_z07Y',
    authDomain: 'liquieation.firebaseapp.com',
    databaseURL: 'https://liquieation.firebaseio.com',
    projectId: 'liquieation',
    storageBucket: 'liquieation.appspot.com',
    messagingSenderId: '45004106445',
    appId: '1:45004106445:web:0e7c99a9ba4407597b9784'
  })
}

export default firebase
