// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuMBTEcyS-hVImV4p79xaRI3l0-PYDfVQ",
    authDomain: "social-network-media.firebaseapp.com",
    projectId: "social-network-media",
    storageBucket: "social-network-media.appspot.com",
    messagingSenderId: "792340065687",
    appId: "1:792340065687:web:a44b3051e1d4197ae4e8d2",
    measurementId: "G-MS7GPF96XH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
module.exports = storage;
