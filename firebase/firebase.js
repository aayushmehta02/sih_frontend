import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-functions.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyAitQUF6D_413pBnp3MwlbwfAwo4h9KEys",
  authDomain: "error-3ea90.firebaseapp.com",
  projectId: "error-3ea90",
  storageBucket: "error-3ea90.appspot.com",
  messagingSenderId: "477757996220",
  appId: "1:477757996220:web:62d31114041a78862724b9",
  measurementId: "G-C3H0D0PWCB"
};

const app = initializeApp(firebaseConfig);

var selectedGender = '';
var selectedUserType = '';

// const genderSelect = document.getElementById('gender');
// const userSelect = document.getElementById('userType');

const createRoom = document.getElementById('createRoom');


function registerUser(email, password, name, gender, userType) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.type = userType;
      user.name = name;
      user.gender = gender
      user.uid = user.uid;
      console.log('user', user);
      addUserToDatabse(user);
    })
    .catch((error) => {
      console.log('error', error);
    });

}


function signInUser(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      getUserDetails(user.uid).then((data) => {
        console.log('data', data);
        var storeData = {
          name: user.name,
          email: user.email,
          type: user.type,
          gender: user.gender,
        }
        window.localStorage.setItem('uid', JSON.stringify(storeData));
        if (data.type === 'user') window.location.href = './userHome.html';
        else window.location.href = './psych_Home.html';
      });
      console.log('user', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function createChatRoom(userUid, docUid) {
  const db = getDatabase();
  set(ref(db, 'chatRooms/' + userUid + '-' + docUid), {
    docUid: docUid,
    userUid: userUid,
  });
}

// write a function to contnuously read data from realtime database
function readChatRoomData(userUid) {
  const db = getDatabase();
  const starCountRef = ref(db, 'chatRooms/' + userUid);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log('data', data);
  });
}

function addMessageToRoom(userUid, docUid, message) {
  const db = getDatabase();
  push(ref(db, 'chatRooms/' + userUid + '-' + docUid + '/messages'), {
    message: message,
    senderId: user.uid,
    timeStampe: new Date().getTime(),
  });
}

function getUserDetails(uid) {
  const db = getFirestore();
  const docRef = doc(db, "users", uid);
  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        return doc.data();
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return null;
    });
}

function addUserToDatabse(user) {
  const db = getFirestore();
  setDoc(doc(db, "users", user.uid), {
    name: user.name,
    email: user.email,
    type: user.type,
    gender: user.gender,
    userType: user.type,
    uid: user.uid,
  })
    .then(() => {
      console.log("Document successfully written!");

      // save user data in user collection adn psych data in psych collection
      setDoc(doc(db, user.type, user.uid), {
        name: user.name,
        email: user.email,
        type: user.type,
        gender: user.gender,
        userType: user.type,
        uid: user.uid,
      }).then(() => { });

      var storeData = {
        name: user.name,
        email: user.email,
        type: user.type,
        gender: user.gender,
      }
      window.localStorage.setItem('uid', JSON.stringify(storeData));

      if (user.type === 'doctor') window.location.href = './doctorHome.html';
      else window.location.href = './userHome.html';
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

}

function getAllUsers() {
  console.log('hello');

  const db = getFirestore();
  const usersCol = collection(db, 'users');
  const usersSnapshot = getDocs(usersCol);
  usersSnapshot.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });
}
if (window.location.href.includes('signup.html')) {

  const genderSelect = document.getElementById('gender');
  const userSelect = document.getElementById('userType');
  genderSelect.addEventListener('change', function () {
    selectedGender = genderSelect.value;
    console.log('Selected Gender:', selectedGender);
  });
  userSelect.addEventListener('change', function () {
    selectedUserType = userSelect.value;
    console.log('Selected User Type:', selectedUserType);
  });

  document.getElementById('register').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('username').value;
    registerUser(email, password, name, selectedGender, selectedUserType);

  });
}


if (window.location.href.includes('login.html')) {
  document.getElementById('login_button').addEventListener('click', function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInUser(email, password);
  });

}

if (window.location.href.includes('userChat.html')) {
  const user = JSON.parse(window.localStorage.getItem('uid'));
  readChatRoomData('doc1-' + user.uid);
  const sendMessage = document.getElementById('sendMessage');
  sendMessage.addEventListener('click', function () {
    const message = document.getElementById('message').value;
    addMessageToRoom('user1', user.uid, message);
  });
}

