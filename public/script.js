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
let year = 2025;
let currentMonth = new Date()
let currentMonthIndex = currentMonth.getMonth();
let currentDay = currentMonth.getDate();
let currentMonth2 = currentMonth.getMonth()+1;
let currentYear = currentMonth.getFullYear();
let eventdet = true;
let editbar = true;
  
window.transitionToPage = function(href, id) {
    document.querySelector('body').style.opacity = 0;
    setTimeout(function() { 
      window.location.href = href;
    }, 200);
};



document.addEventListener('DOMContentLoaded', function() {

  const app = firebase.app(); 
  document.querySelector('body').style.opacity = 1;

  checkWrap(true); 

  if (isMobile.any() || window.self != window.top) {
      console.log("Mobile or embedded context detected");
     
       containers = document.querySelectorAll('.centeredtext');
       containers.forEach(container => {
           container.style.width="83%";
       });
       const header = document.getElementById("siteheader-content");
       const drop = document.getElementById("dropdiv");

       if(header && drop) { 
           header.classList.add('no-transition');
           header.style.opacity = "0";
           header.style.pointerEvents = 'none';
           void header.offsetHeight; 
           header.classList.remove('no-transition');
           drop.style.opacity = "1";
           drop.style.pointerEvents = 'auto'; 
       }

       const path = window.location.pathname;
       if (path === "/" || path === "/index.html") {
           const wcenteredtext = document.getElementById("wcenteredtext");
           if (wcenteredtext) { // Add check
               wcenteredtext.style.flexDirection = "column";
           }
       }
      
  }


   if (window.location.pathname.endsWith("schedule.html")){ //
      console.log("On schedule page, creating calendar.");
      createCalendar(); 
   }


  const menuToggleButton = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (menuToggleButton && dropdownMenu) {
     
      function toggleMenu() {

          menuToggleButton.classList.toggle("open");
          dropdownMenu.classList.toggle("is-visible");
      }

      menuToggleButton.addEventListener('click', toggleMenu);

  } else {
      
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
  
      const containers = document.querySelectorAll('.adminonly');
  
      if (!user) {
      
          containers.forEach(container => {
              container.style.display = 'none';
          });
          return; 
      }
  
      const userEmail = user.email;
      db.collection("admin").doc(userEmail).get()
      .then(docSnapshot => {
          const isAdmin = docSnapshot.exists;

          containers.forEach(container => {
              container.style.display = isAdmin ? '' : 'none';
          });
      })
      .catch(error => {
          console.error("Error checking admin status:", error);
          containers.forEach(container => {
              container.style.display = 'none';
          });
      });
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
                if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == "schedule.html"){
 
                  location.reload();
                }
                
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
    // containers = document.querySelectorAll('.c');
        // containers.forEach(container => { 
            
        // });
    loginButtons = document.querySelectorAll('.login');
    if (user) {
        loginButtons.forEach(buttons=>{buttons.innerHTML = "Logout"})
        
    } else {
      
      loginButtons.forEach(buttons=>{buttons.innerHTML = "Login"})
       
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
        document.getElementById("dropdiv").style['pointer-events'] = 'auto';
        if(onload){header.classList.add('no-transition')};
        header.style.opacity = "0";
        void header.offsetHeight;
        if(onload){header.classList.remove('no-transition')};
        drop.style.opacity = "1";
        const path = window.location.pathname;

  
        if (path === "/" || path === "/index.html") {
          document.getElementById("wcenteredtext").style.flexDirection = "column";
        }
       
        // containers = document.querySelectorAll('.c');
        // containers.forEach(container => { 
            
        // });
      
      
    }
    else{
      document.getElementById("siteheader-content").style.opacity = "1";
      document.getElementById("siteheader-content").style['pointer-events'] = 'auto';
      document.getElementById("dropdiv").style['pointer-events'] = 'none';
      document.getElementById("dropdiv").style.opacity = "0";
      if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == "index.html"){
        document.getElementById("wcenteredtext").style.flexDirection = "row";
      }
      

    }
  }


  
  
if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == "contact.html"){
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
}
  

  function createEvent1() {  
    document.getElementById("myDropdown").classList.toggle("show");
  }
  

function createCalendar() {
    console.log("creation");
    calendarGrid = document.getElementById('calendarGrid');
    monthElement = document.getElementById('month');
    calendarGrid.innerHTML = '';
    currentMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    

    monthElement.textContent = currentMonths[currentMonthIndex] + " " + year;

    const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('calendar-day');
      const eventDate = `${year}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      dayDiv.innerHTML = `<span>${currentMonths[currentMonthIndex]} ${day}, ${year}</span><br>`;
      dayDiv.setAttribute('data-date', eventDate);
      calendarGrid.appendChild(dayDiv);

      if ((year > currentYear) || 
          (year === currentYear && currentMonthIndex+1 > currentMonth2) || 
          (year === currentYear && currentMonthIndex+1 === currentMonth2 && day >= currentDay)) {
          //avaliablebutton(dayDiv, currentMonthIndex+1, day, year);
      }
      if (year == currentYear && currentMonthIndex+1 == currentMonth2 && day == currentDay) {
        dayDiv.style.backgroundColor = "rgb(230, 230, 250)";
      }
    
  }
  const userTasksRef = db.collection("events");

  userTasksRef.get()
    .then(snapshot => {
      const fetchSubcollections = [];
  
      if (snapshot.empty) {
        console.log("No documents found in 'events' collection.");
      }
      snapshot.forEach(doc => {
     
        const eventDate = doc.id;
  
        const subRef = db.collection("events")
                         .doc(eventDate)
                         .collection("eventsthatday");
  
        fetchSubcollections.push(
          subRef.get().then(subSnap => {
           
  
            subSnap.forEach(eventDoc => {
              const data = eventDoc.data();
              const title = data.title;
              const location = data.location;
              const description = data.description;
              const link = data.link;
              //alert(link);
  
              const docId = eventDoc.id;
              console.log(docId);  
             addEvent2(title, eventDate, location, description, link, docId);
             
            });
          })
        );
      });
  
      return Promise.all(fetchSubcollections);
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
    });
  
 
}

async function fetchEvents() {
    const userTasksRef = db.collection("events");

    try {
            } catch (error) {
        console.error("Error fetching events:", error);
    }
}


function changeMonth(direction) {
    currentMonthIndex += direction;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        year = year - 1;
    } else if (currentMonthIndex > 11) {
        currentMonthIndex = 0;  
        year = year + 1
    }
  createCalendar();

}

document.body.addEventListener('click', function (event) {

    if (!event.target.closest('.dropbtn') && !event.target.closest('.dropdown-content')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
    if (!event.target.closest('.event-details-panel') && document.getElementById("eventDetailsPanel").classList.contains("show-panel") && eventdet == false && editbar == true && !event.target.closest('.event')){
      
       eventdet = true;
       closeEventDetails();
    }
    // if (!event.target.closest('.event-details-panel2') && infobar == false && !event.target.closest('.joinedpple')){
    //   infobar = true;
    //   closeEventDetails2();
    // }
    if (!event.target.closest('.event-details-panel2') && editbar == false){
      editbar = true;
      document.getElementById('editDetails').classList.remove("show-panel2");
    }

    
  });

  function addEvent2(eventTitle, eventDate, eventplace,eventDescription, eventLink, docId){
    //alert("hi");
    var year = parseInt(eventDate.split('-')[0],10);
    var month = parseInt(eventDate.split('-')[1],10);
    var day = parseInt(eventDate.split('-')[2],10);
    let red = false;
    if (year < currentYear) {
        red = true;
    }

    else if (year === currentYear && month < currentMonth2) {
        red = true;
    }

    else if (year === currentYear && month === currentMonth2 && day < currentDay) {
        red = true;
    }

    const dayDiv = document.querySelector(`.calendar-day[data-date='${eventDate}']`);

    if (dayDiv) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = eventTitle;
        if (red){
          eventElement.style.backgroundColor = "orangered";
          eventElement.style.color = "black";
        }
        eventElement.addEventListener('click', function () {
            
            showEventDetails(eventTitle, eventDate, eventplace, eventDescription, eventLink, docId);
        });
        dayDiv.appendChild(eventElement);

    } else {
       console.log("Invalid date selected.");
    }
  }

  function addEvent() {


    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventplace = document.getElementById('eventLocation').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventLink = document.getElementById("eventLink").value;

    var year = parseInt(eventDate.split('-')[0],10);
    var month = parseInt(eventDate.split('-')[1],10);
    var day = parseInt(eventDate.split('-')[2],10);
    const user = auth.currentUser;
    const eventRef = db.collection("events").doc(eventDate);

    let docId;
    eventRef.set({}, { merge: true }).then(() => {
      eventRef.collection("eventsthatday").add({
        title: eventTitle,
        location: eventplace,
        description: eventDescription,
        link: eventLink
      })
      .then((docRef) => {
        docId = docRef.id;
        console.log(docId);
        console.log("Event saved successfully!");
       
      })
      .catch((error) => {
        console.error("Error saving event:", error.message);
        
      });
    });

    let red = false;
    if (year < currentYear) {
        red = true;
    }

    else if (year === currentYear && month < currentMonth2) {
        red = true;
    }

    else if (year === currentYear && month === currentMonth2 && day < currentDay) {
        red = true;
    }

    const dayDiv = document.querySelector(`.calendar-day[data-date='${eventDate}']`);

    if (dayDiv) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = eventTitle;
        if (red){
          eventElement.style.backgroundColor = "orangered";
          eventElement.style.color = "black";
        }
        eventElement.addEventListener('click', function () {
            showEventDetails(eventTitle, eventDate, eventplace, eventDescription, eventLink, docId);
        });
        dayDiv.appendChild(eventElement);

    } else {
       console.log("Invalid date selected.");
    }

    document.getElementById('eventTitle').value = "";
    document.getElementById('eventDate').value = "";
    document.getElementById('eventLink').value="";
}

function addEvent3(eventTitle, eventDate, eventPlace, eventDescription, eventLink) {

  const user = auth.currentUser;
  const eventRef = db.collection("events").doc(eventDate);

  eventRef.set({}, { merge: true }).then(() => {
    eventRef.collection("eventsthatday").add({
      title: eventTitle,
      location: eventPlace,
      description: eventDescription,
      link: eventLink
    })
    .then(() => {

      //console.log(docId);
      console.log("Event saved successfully!");
      location.reload();
     
    })
    .catch((error) => {
      console.error("Error saving event:", error.message);
      
    });
  });

  
}

async function saveEvent(title, date, place, description) {
  const oldDate = document.getElementById('eventDateDisplay').textContent.trim(); // or `.value` if it's an <input>
  const docId = document.getElementById('eventDetailsPanel').ID;
  console.log(document.getElementById('eventDetailsPanel').ID)
  const todayDocRef = db.collection("events").doc(oldDate).collection("eventsthatday").doc(docId);

  try {
    // If you meant to delete the whole document:
    await todayDocRef.delete();
    console.log(`Event with ID "${docId}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting event:", error);
  }

  // Get new input values
  const titleEl = document.getElementById('editTitle').value;
  const dateEl = document.getElementById('editDate').value;
  const placeEl = document.getElementById('editLocation').value;
  const descEl = document.getElementById('editDescription').value;
  const linkEl = document.getElementById('editLink').value;


  // Add updated event (or however you're handling new data)
  addEvent3(titleEl, dateEl, placeEl, descEl, linkEl);
  
}
async function deleteevent() {
  const oldDate = document.getElementById('eventDateDisplay').textContent.trim(); // or `.value` if it's an <input>
  const docId = document.getElementById('eventDetailsPanel').ID;
  console.log(document.getElementById('eventDetailsPanel').ID)
  const todayDocRef = db.collection("events").doc(oldDate).collection("eventsthatday").doc(docId);

  try {
    await todayDocRef.delete();
    location.reload();
    console.log(`Event with ID "${docId}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting event:", error);
  }

  
}


function showEventDetails(title, date, place, description, link, docId) {
    //("Title display element:", document.getElementById('eventTitleDisplay'));

    const titleEl = document.getElementById('eventTitleDisplay');
    const dateEl = document.getElementById('eventDateDisplay');
    const placeEl = document.getElementById('eventPlaceDisplay');
    const descEl = document.getElementById('eventDescriptionDisplay');
    const linkEl = document.getElementById('eventLinkDisplay')
    var panel = document.getElementById('eventDetailsPanel');
    panel.ID = docId;
    console.log(panel.ID);

    
    if (titleEl && dateEl && placeEl && descEl) {
        titleEl.innerHTML = title;
        dateEl.innerHTML = date;
        placeEl.innerHTML = "Location: " +place;
        descEl.innerHTML = "Info: " + description;
        if (!link.startsWith("http")) {
          link = "https://" + link;
      }
      linkEl.href = link;
      //alert(linkEl.href);
      
    } else {
        alert("One or more event display elements not found.");
    }

    //const panel = document.getElementById('eventDetailsPanel');
    if (panel) {
        panel.classList.add('show-panel');
        setTimeout(() => { eventdet = false }, 450);
    }
}

function closeEventDetails() {
    const panel = document.getElementById('eventDetailsPanel');
    panel.classList.remove('show-panel');
  }

  function editevent(){
    //open edit tnhing
    if (document.getElementById('editDetails').classList.contains("show-panel2")){
        document.getElementById('editDetails').classList.remove("show-panel2");
      editbar = true;
    }
    else{
        document.getElementById('editDetails').classList.add("show-panel2");
        console.log(document.getElementById('eventDetailsPanel').ID)
      setTimeout(function(){editbar=false},450);
    }
    
  }

  function renderEventColumns() {
    console.log("rendering");
    const container = document.querySelector('.event-list');
    const userTasksRef = db.collection("events");
  
    userTasksRef.get()
      .then(snapshot => {
        const fetchSubcollections = [];
  
        if (snapshot.empty) {
          console.log("No documents found in 'events' collection.");
          return;
        }
  
        let i = 0;
        snapshot.forEach(doc => {
          const eventDate = doc.id;
          const year = eventDate.split('-')[0];
  
          // Ensure year header + columns exist
          let column1 = document.getElementById(`column1-${year}`);
          let column2 = document.getElementById(`column2-${year}`);
  
          if (!document.querySelector('.year-' + year)) {
            // Create title
            const title = document.createElement('h1');
            title.className = 'title year-' + year;
            title.textContent = `${year} Events`;
            container.appendChild(title);
  
            // Create two columns
            column1 = document.createElement('div');
            column1.className = 'event-column';
            column1.id = `column1-${year}`;
  
            column2 = document.createElement('div');
            column2.className = 'event-column';
            column2.id = `column2-${year}`;
  
            let hello = document.createElement('div');
            hello.className='hello';
            hello.appendChild(column1);
            hello.appendChild(column2);
            container.appendChild(hello);
           
          }
  
          const subRef = db.collection("events").doc(eventDate).collection("eventsthatday");
  
          fetchSubcollections.push(
            
            subRef.get().then(subSnap => {
              
              subSnap.forEach(eventDoc => {
                const data = eventDoc.data();
                const p = document.createElement('p');
                p.textContent = `${eventDate} — ${data.title || 'Untitled Event'}, ${data.location || 'Location not provided'}`;
  
  
                const col1 = document.getElementById(`column1-${year}`);
                const col2 = document.getElementById(`column2-${year}`);
  
                if (col1 && col2) {
                  if (i % 2 == 0) {
                    col1.appendChild(p);
                  } 
                  if(i % 2==1) {
                   
                    col2.appendChild(p);
                  }
                } else {
                  console.warn(`Could not find columns for year ${year}`);
                }
                i++;
              });
            })
          );
        });
  
        return Promise.all(fetchSubcollections);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  }
  
  
  
