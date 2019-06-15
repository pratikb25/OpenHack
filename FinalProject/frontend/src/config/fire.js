import firebase from 'firebase';

  // Initialize Firebase
const config = {
    apiKey: "AIzaSyCi3JYLWPtBMR6kxxRF-D8MisQVqEVu1DY",
    authDomain: "zhang-a2fe9.firebaseapp.com",
    databaseURL: "https://zhang-a2fe9.firebaseio.com",
    projectId: "zhang-a2fe9",
    storageBucket: "zhang-a2fe9.appspot.com",
    messagingSenderId: "122985196639"
  };

const fire=firebase.initializeApp(config);
export default fire;