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

