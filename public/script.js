const firebaseConfig = {
    apiKey: "AIzaSyBc9BlHHYH80QFIS9ziJQ3fgLCnMEWiZGY",
    authDomain: "chrysalis-5f39e.firebaseapp.com",
    projectId: "chrysalis-5f39e",
    storageBucket: "chrysalis-5f39e.firebasestorage.app",
    messagingSenderId: "493208059674",
    appId: "1:493208059674:web:148fa9901d9e4ea9e876a3",
    measurementId: "G-R16ZB2LTV7"
};

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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    document.querySelector('body').style.opacity = 1;
    //checkWrap(true);
    if(isMobile){
        const header = document.getElementById("siteheader-content");
        const drop = document.getElementById("dropdiv");
        
        header.classList.add('no-transition');
        header.style.opacity = "0";
        
        // 👇 force reflow so browser applies the no-transition
        void header.offsetHeight;
        
        // 👇 now remove it so future transitions work normally
        header.classList.remove('no-transition');
        
        drop.style.opacity = "1";
    }
    else{
        checkWrap(true);
    }
    
});

window.addEventListener("resize", function(){
    console.log("hi");
    checkWrap(false);
});

function checkWrap(onload) {
    const el = document.getElementById('siteheader-content');
    const firstChild = el.children[0];
    const lastChild = el.children[el.children.length - 1];
  
    const top1 = firstChild.getBoundingClientRect().top;
    const top2 = lastChild.getBoundingClientRect().top;
  
    if (top1 !== top2) {
        const header = document.getElementById("siteheader-content");
        const drop = document.getElementById("dropdiv");
        
        if(onload){header.classList.add('no-transition')};
        header.style.opacity = "0";
        
        // 👇 force reflow so browser applies the no-transition
        void header.offsetHeight;
        
        // 👇 now remove it so future transitions work normally
        if(onload){header.classList.remove('no-transition')};
        
        drop.style.opacity = "1";
        
      
      
    }
    else{
      document.getElementById("siteheader-content").style.opacity = "1";
      document.getElementById("dropdiv").style.opacity = "0";

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
  