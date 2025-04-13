const firebaseConfig = {
    apiKey: "AIzaSyBc9BlHHYH80QFIS9ziJQ3fgLCnMEWiZGY",
    authDomain: "chrysalis-5f39e.firebaseapp.com",
    projectId: "chrysalis-5f39e",
    storageBucket: "chrysalis-5f39e.appspot.com",
    messagingSenderId: "493208059674",
    appId: "1:493208059674:web:148fa9901d9e4ea9e876a3",
    measurementId: "G-R16ZB2LTV7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
  
window.transitionToPage = function(href, id) {
    document.querySelector('body').style.opacity = 0;
    setTimeout(function() { 
      window.location.href = href;
    }, 200);
};



document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    document.querySelector('body').style.opacity = 1;
    checkWrap(true);
    if(isMobile.any() || window.self != window.top){

        const header = document.getElementById("siteheader-content");

        const drop = document.getElementById("dropdiv");
        
        header.classList.add('no-transition');
        header.style.opacity = "0";
        document.getElementById("siteheader-content").style['pointer-events'] = 'none';
        void header.offsetHeight
        header.classList.remove('no-transition');
        
        drop.style.opacity = "1";
        if (window.location.href == "index.html"){
            document.getElementById("wcenteredtext").style.flexDirection = "column";
        }
        
    }
    
    
});

window.addEventListener("resize", function(){
    console.log("hi");
    checkWrap(false);
});

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("Auth state persistence set to LOCAL."))
    .catch(error => console.error("Error setting persistence:", error));

auth.onAuthStateChanged(user => {
    console.log("Auth state changed:", user);
    updateUI(user);

});

function handleAuth() {
    const user = auth.currentUser;

    if (user) {
        auth.signOut().then(() => {
            console.log("User logged out.");
           
        }).catch(error => console.error("Logout Error:", error));
    } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                console.log("User signed in:", result.user);
                saveUserToFirestore(result.user);
            })
            .catch(error => alert(`Error: ${error.message}`));
    }
}

function saveUserToFirestore(user) {
   
    const userRef = db.collection("users").doc(user.uid);

    userRef.set({
        email: user.email,
        name: user.displayName
    }, { merge: true }) 

}

function updateUI(user) {
    const loginButton = document.getElementById("login");
    if (user) {
        loginButton.innerHTML = "Logout";
        
    } else {
        loginButton.innerHTML = "Login";
       
    }
    

}

function checkWrap(onload) {
    const el = document.getElementById('siteheader-content');
    const firstChild = el.children[0];
    const lastChild = el.children[el.children.length - 1];
  
    const top1 = firstChild.getBoundingClientRect().top;
    const top2 = lastChild.getBoundingClientRect().top;
  
    if (top1 !== top2) {
        const header = document.getElementById("siteheader-content");
        const drop = document.getElementById("dropdiv");
        document.getElementById("siteheader-content").style['pointer-events'] = 'none';
        if(onload){header.classList.add('no-transition')};
        header.style.opacity = "0";
        void header.offsetHeight;
        if(onload){header.classList.remove('no-transition')};
        drop.style.opacity = "1";
        if (window.location.href == "index.html"){
            document.getElementById("wcenteredtext").style.flexDirection = "column";
        }
       
        // containers = document.querySelectorAll('.c');
        // containers.forEach(container => { 
            
        // });
      
      
    }
    else{
      document.getElementById("siteheader-content").style.opacity = "1";
      document.getElementById("siteheader-content").style['pointer-events'] = 'auto';
      document.getElementById("dropdiv").style.opacity = "0";
      if (window.location.href == "index.html"){
        document.getElementById("wcenteredtext").style.flexDirection = "row";
      }
      

    }
  }

  function toggleMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("dropdown-menu");
  
    toggle.classList.toggle("open");
  
    if (menu.style.display === "flex") {
      menu.style.display = "none";
    } else {
      menu.style.display = "flex";
    }
  }
  

  document.getElementById("myform").addEventListener("submit", function (e) {
    const user = auth.currentUser;
    if (user){
        e.preventDefault(); // prevent page reload

    const form = e.target;
    const formData = new URLSearchParams();
    formData.append("name", form.name.value);
    formData.append("email", form.email.value);
    formData.append("message", form.message.value);
    formData.append("remail", user.email);
    formData.append("rname", user.displayName);

    console.log([...formData.entries()]);

    fetch("https://script.google.com/macros/s/AKfycbz9704M7IVi_voY9tb2iwNHkRcr7-eMkTV6_jeVSAK2Low3Bx-IbWMiqnByzKqQkB9j/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString(),
  
    })
    .then(() => {
      // Clear form fields after successful submission
      form.reset();
      // Optional: Show a quick message
      console.log("Form submitted successfully");
    })
    .catch(error => {
      console.error("Form submission error:", error);
    });
    }
    else{
        e.preventDefault();
        const input = document.getElementById("nameform");

        input.value = "Please login to ensure you are a real person.";
        input.classList.add("shakeit");
      
        // Remove the shake class after 0.5s so it can be triggered again
        setTimeout(() => {
          input.classList.remove("shakeit");
        }, 500);
    }
    
  });