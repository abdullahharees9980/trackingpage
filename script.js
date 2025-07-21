// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBmZAMmxmHL6riRAOqDJC-f5P0fVtjhmqE",
  authDomain: "fuel-app-756ae.firebaseapp.com",
  projectId: "fuel-app-756ae",
  storageBucket: "fuel-app-756ae.firebasestorage.app",
  messagingSenderId: "1075562726618",
  appId: "1:1075562726618:web:d2443d0589b697925251e3",
  measurementId: "G-E8WZYL0C1Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let map, driverMarker, dropoffMarker;

// Parse orderId from URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

if (!orderId) {
  alert("Missing order ID in URL");
}

// Initialize Google Map
function initMap(lat = 6.9, lng = 79.8) {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat, lng }
  });
}

// Listen to Firestore document
function listenToOrder() {
  db.collection("orders").doc(orderId).onSnapshot((doc) => {
    if (!doc.exists) return;

    const data = doc.data();
    const driver = data.driverLocation;
    const drop = data.location;

    if (driver) {
      const driverLatLng = { lat: driver.latitude, lng: driver.longitude };

      if (!driverMarker) {
        driverMarker = new google.maps.Marker({
          position: driverLatLng,
          map,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          title: "Driver"
        });
      } else {
        driverMarker.setPosition(driverLatLng);
      }

      map.setCenter(driverLatLng);
    }

    if (drop) {
      const dropLatLng = { lat: drop.latitude, lng: drop.longitude };
      if (!dropoffMarker) {
        dropoffMarker = new google.maps.Marker({
          position: dropLatLng,
          map,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          title: "Drop-off"
        });
      }
    }
  });
}

initMap();
listenToOrder();
