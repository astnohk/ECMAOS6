// The code written in BSD/KNF indent style
"use strict";


// Date
var time = new Date();
// Calendar
var poppedUpCalendar = 0; // 0: not popuped, 1: start popup, 2: popup finished
var yearCalendar = time.getFullYear();
var monthCalendar = time.getMonth();
// To-Do
var poppedUpToDo = 0; // 0: not popuped, 1: start popup, 2: popup finished

//Initialize
window.onload = Init;



// ----- INITIALIZE -----
function
Init()
{
	// Clock
	var timeClock = setInterval(updateClock, 1000);
	// Initial displaying
	updateClock();
	// Set event on Readme button
	setReadmeButton();
	// Encryption
	initEncryptionToServer();
	initEncryptionToClient();
	popupLoginBox();
}



// ----- README -----
function
setReadmeButton()
{
	var doc = document.getElementById("Readme");
	doc.addEventListener("mousedown", openReadme, false);
	doc.addEventListener("touchstart", openReadme, false);
}

function
openReadme()
{
	if (document.getElementById("ReadmeDocument") !== null) {
		return;
	}
	var doc = document.createElement("div");
	doc.className = "BlackBoard";
	doc.id = "ReadmeDocument";
	doc.style.top = "18px";
	doc.style.left = "40%";
	doc.style.width = "300px";
	doc.style.fontSize = "16px";
	doc.innerHTML =
	    "This is the demonstration of the window system by ECMAScript 6." +
	    "<br><br>This User Interfaces are designed for both desktop or tablet PC." +
	    "The system needs CGI to provide entire the service but here the system serves only client UIs." +
	    "<br>Each windows could be moved by dragging." +
	    "Windows are managed by list." +
	    "You'll see the list on the left 'Window Scroller.'" +
	    "The system cycles the mostfront window when click on titles or scroll mouse wheels on the scroller.";
	doc.addEventListener("click", function () { doc.parentNode.removeChild(doc); }, false);
	document.body.appendChild(doc);
}



// ----- REALTIME -----
function
updateClock()
{
	var element = document.getElementById("ClockBox");
	element.innerHTML =
	    "Date: " +
	    time.getFullYear() + "/" +
	    ('0' + (time.getMonth() + 1)).slice(-2)  + "/" +
	    ('0' + time.getDate()).slice(-2)  + " " +
	    ('0' + time.getHours()).slice(-2) + ":" +
	    ('0' + time.getMinutes()).slice(-2) + ":" +
	    ('0' + time.getSeconds()).slice(-2);
}

