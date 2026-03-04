import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAkaYc_buQnX3vzxi87wv5Wh2jVlttkIWk",
  authDomain: "js-practice-10f32.firebaseapp.com",
  projectId: "js-practice-10f32",
  storageBucket: "js-practice-10f32.firebasestorage.app",
  messagingSenderId: "395530840033",
  appId: "1:395530840033:web:15a48c0c407ee009d7d4a0",
  measurementId: "G-17KZWZG8S4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  app,
  db,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
};
