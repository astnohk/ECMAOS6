// The code written in BSD/KNF indent style
"use strict";

var RSA_key_length = 1024;
var loginProcessing = false;

// encryption by JSEncrypt
var cryptToServer = new JSEncrypt();
var cryptToClient = new JSEncrypt({default_key_size: RSA_key_length});
// -11 is lead from RSAES-PSCK1-v1_5 standard
// PS consists of pseudo-randomly generated nonzero octets.
// The length of PS is at least 8 octets.
// padding scheme is that the Encoded Message EM = 0x00 || 0x02 || PS || 0x00 || M)
var maxEncryptLength = (RSA_key_length / 8) - 11;


// User ID
var userId = "you";
var onetimepass = "";
var time;




// ----- Login -----

function
popupLoginBox()
{
	var overlay = document.createElement("div");
	overlay.id = "LoginOverlay";
	document.body.appendChild(overlay);
	var element = document.createElement("div");
	element.id = "LoginBox";
	element.innerHTML +=
	    "<div style=\"font-size: 24px; font-weight: bold; letter-spacing: 1px; height: 28px; background-color: #FFFFA0; color: #800080; padding: 2px; padding-left: 4px; padding-right: 4px; margin-bottom: 8px;\">" +
	    "Login</div>" +
	    "<form name=\"login\" action=\"#top\">" +
	    "<span style=\"position: absolute; top: 40px; left: 10px; height: 24px; font-size: 24px;\">name</span>" +
	    "<span style=\"position: absolute; top: 40px; left: 70px;\">" +
	    "<input type=\"text\" id=\"loginName\" style=\"width: 200px;\" autofocus></span><br>" +
	    "<span style=\"position: absolute; top: 70px; left: 10px; height: 24px; font-size: 24px;\">pass</span>" +
	    "<span style=\"position: absolute; top: 70px; left: 70px;\">" +
	    "<input type=\"password\" id=\"loginPass\" style=\"width: 200px;\"></span><br>" +
	    "<input type=\"submit\" id=\"loginLogin\" value=\"Login\" style=\"position: absolute; bottom: 2px; right: 0px;\" onClick=\"loginMain()\">" +
	    "</form>" +
	    "<div id=\"LoginMessage\" style=\"color: #C00000; position: absolute; top: 105px; left: 10px; font-weight: bold;\"></div>";
	document.body.appendChild(element);
}

function
loginMain()
{
	if (loginProcessing === true) {
		return;
	}
	loginProcessing = true;
	document.getElementById("LoginMessage").innerHTML = "Processing...";
	userId = document.getElementById("loginName").value;
	var name = encrypt(userId);
	var pass = encrypt(document.getElementById("loginPass").value);
	var query =
	    "key=" + cryptToClient.getPublicKey() +
	    "&keylength=" + RSA_key_length +
	    "&n=" + name +
	    "&p=" + pass;
	if (typeof mobileMode !== "undefined" && mobileMode) {
		// For mobile browser
		query += "&mobile=true";
	}
	var request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/login.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText.length > 0) {
				if (request.responseText === "NoNameOrPassword") {
					document.getElementById("LoginMessage").innerHTML = "Enter name and pass";
					loginProcessing = false;
					return;
				} else if (request.responseText === "WrongNameOrPassword") {
					document.getElementById("LoginMessage").innerHTML = "Wrong name or pass";
					loginProcessing = false;
					return;
				}
				console.log(request.responseText);
				var decoded = JSON.parse(decrypt(request.responseText));
				console.log(decoded);
				onetimepass = decoded.onetimepass;
				var count = 25;
				var decCounter = setInterval(function () {
					--count;
					if (count < 0) {
						clearInterval(decCounter);
						//dispLogin.innerHTML = "";
						document.body.removeChild(document.getElementById("LoginBox"));
						document.body.removeChild(document.getElementById("LoginOverlay"));
						return;
					}
					document.getElementById("LoginBox").style.opacity = 1.0 / 25.0 * Math.max(count, 0);
					document.getElementById("LoginOverlay").style.opacity = 1.0 / 25.0 * Math.max(count, 0);
				    }, 10);
			} else {
				document.getElementById("LoginMessage").innerHTML = "Wrong name or pass";
				loginProcessing = false;
			}
		}
	    };
	request.send(query);
}




// ----- Save & Load settings -----

function
saveSettings()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/saveSettings.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				console.log(request.responseText);
				if (request.responseText.indexOf("Error:") >= 0) {
					console.log("Error: Wrong ID or one-time password");
				}
				console.log("settings saved successfully");
			} else {
				console.log("Error: Failed to request");
			}
		}
	    };
	let query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&settings=" + encrypt(JSON.stringify(UserSettings));
	request.send(query);
}

function
loadSettings()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/loadSettings.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				if (request.responseText.indexOf("Error:") >= 0) {
					console.log("Error: Wrong ID or one-time password");
				}
				let tmp = JSON.parse(decrypt(request.responseText));
				Object.assign(UserSettings, tmp);
				console.log("settings loaded successfully");
			} else {
				console.log("Error: Failed to request");
			}
		}
	    };
	let query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&pubkey=" + cryptToClient.getPublicKey();
	request.send(query);
}

