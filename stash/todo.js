// The code written in BSD/KNF indent style

var listToDoTask = [
    {group: "you", header: "aaaa", id: "todo1003", name: "you", note: "test note", priority: 2, state: "TODO", tags: ["test", "yeah"], timestamp: 1459942755},
    {group: "you", header: "bbbb", id: "todo2003", name: "you", note: "test note\nyeah.", priority: 2, state: "TODO", tags: ["test", "ok"], timestamp: 1459953133},
    ];
var listToDoGroup = ["you"];
var listToDoTag = ["test", "ok", "yeah"];
var listStateToDo = ["DONE", "TODO", "DOING"];
var listColorStateToDo = ["255, 100, 100", "255, 255, 100", "100, 255, 100"];

var widthLightingToDoList = 150;

var groupTabScroll = 0;
var ToDoElementOffset_y = 0;
var startMousePos_x = 0;
var startMousePos_y = 0;
var initialStateToDo = 0;

var selectedToDoElement = null;
var boxPaddingTop = 5;
var taskHeight = 28;
var taskMarginBottom = 4;




// ----- Add Global Event -----
globalMouseMoveEvent.add(dragToDoList);
globalMouseUpEvent.add(dragToDoList);




// ----- ToDo -----

function
popupToDo()
{
	if (poppedUpToDo === 2) {
		document.getElementById("PopupToDo").closeWindow();
		return;
	} else if (poppedUpToDo !== 0) {
		return;
	}
	// Start popup process
	// Create Window
	var win = createWindow({id: "PopupToDo", title: "To-Do", style: {width: "800px", height: "680px"}, closeFunction: popdownToDo});
	document.body.appendChild(win);
	// Group tab
	var groupTabBox = document.createElement("span");
	groupTabBox.id = "ToDoGroupTabBox";
	groupTabBox.className = "BlackBoard";
	groupTabBox.style.position = "absolute";
	groupTabBox.style.top = "10px";
	groupTabBox.style.left = "10px";
	groupTabBox.style.height = "40px";
	groupTabBox.style.width = "800px";
	groupTabBox.style.borderWidth = "0";
	groupTabBox.style.borderRadius = "0";
	groupTabBox.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	groupTabBox.style.overflow = "hidden";
	win.appendChild(groupTabBox);
	var groupTab = document.createElement("form");
	groupTab.id = "ToDoGroupTab";
	groupTab.style.display = "flex";
	groupTab.style.alignContent = "stretch";
	groupTab.style.flexWrap = "nowrap";
	groupTab.style.position = "absolute";
	groupTab.style.top = "0";
	groupTab.style.left = "30px";
	groupTab.style.height = "100%";
	groupTab.style.transitionProperty = "left";
	groupTab.style.transitionDuration = "0.6s";
	groupTabBox.appendChild(groupTab);
	var scrollTabLeft = document.createElement("span");
	scrollTabLeft.className = "BlackBoard";
	scrollTabLeft.style.position = "absolute";
	scrollTabLeft.style.top = "0px";
	scrollTabLeft.style.left = "0px";
	scrollTabLeft.style.height = "40px";
	scrollTabLeft.style.cursor = "pointer";
	scrollTabLeft.innerHTML = "<";
	scrollTabLeft.addEventListener("click", function ()
	    {
		    if (groupTabScroll < 0) {
			    groupTabScroll++;
			    groupTab.style.left = String(30 + groupTabScroll * 400) + "px";
		    }
	    },
	    false);
	groupTabBox.appendChild(scrollTabLeft);
	var scrollTabRight = document.createElement("span");
	scrollTabRight.className = "BlackBoard";
	scrollTabRight.style.position = "absolute";
	scrollTabRight.style.top = "0px";
	scrollTabRight.style.right = "0px";
	scrollTabRight.style.height = "40px";
	scrollTabRight.style.cursor = "pointer";
	scrollTabRight.innerHTML = ">";
	scrollTabRight.addEventListener("click", function ()
	    {
		    groupTabScroll--;
		    groupTab.style.left = String(30 + groupTabScroll * 400) + "px";
	    },
	    false);
	groupTabBox.appendChild(scrollTabRight);
	// Tag cloud box
	var tagCloudBox = document.createElement("div");
	tagCloudBox.id = "ToDoTagCloudBox";
	tagCloudBox.className = "BlackBoard";
	tagCloudBox.style.position = "absolute";
	tagCloudBox.style.top = "50px";
	tagCloudBox.style.left = "10px";
	tagCloudBox.style.height = "40px";
	tagCloudBox.style.width = "800px";
	tagCloudBox.style.borderWidth = "0";
	tagCloudBox.style.borderRadius = "0";
	tagCloudBox.style.padding = "0";
	tagCloudBox.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	win.appendChild(tagCloudBox);
	var tagCloud = document.createElement("form");
	tagCloud.id = "ToDoTagCloud";
	tagCloud.style.display = "flex";
	tagCloud.style.alignItems = "center";
	tagCloud.style.height = "100%";
	tagCloud.style.width = "100%";
	tagCloud.style.borderWidth = "0";
	tagCloud.style.borderRadius = "0";
	tagCloud.style.padding = "0px 4px";
	tagCloud.style.backgroundColor = "rgba(160, 0, 0, 0.8)";
	tagCloud.style.overflow = "hidden";
	tagCloudBox.appendChild(tagCloud);
	// Main Box
	var box = document.createElement("span");
	box.id = "ToDoBox";
	box.className = "BlackBoard";
	box.style.width = "800px";
	box.style.height = "580px";
	box.style.overflowY = "scroll";
	box.style.position = "absolute";
	box.style.top = "90px";
	box.style.left = "10px";
	box.style.borderRadius = "0";
	// * Add event listener for popdown To-Do details
	box.addEventListener("mousedown", function (event) { event.stopPropagation(); document.getElementById("PopupNoteOnPopupToDoBox").innerHTML = ""; }, false);
	box.addEventListener("touchstart", function (event) { event.stopPropagation(); document.getElementById("PopupNoteOnPopupToDoBox").innerHTML = ""; }, false);
	win.appendChild(box);
	// Add add To-Do task button
	var addToDoTaskButton = makeFunctionButton("classButton", "+", popupAddToDoTask);
	addToDoTaskButton.style.position = "absolute";
	addToDoTaskButton.style.bottom = "0";
	addToDoTaskButton.style.left = "80px";
	addToDoTaskButton.style.padding = "0px 2px";
	addToDoTaskButton.style.fontSize = "24px";
	addToDoTaskButton.style.fontWeight = "bold";
	addToDoTaskButton.style.color = "rgb(255, 64, 64)";
	win.appendChild(addToDoTaskButton);
	// Make block for popup note window
	var popupNote = document.createElement("span");
	popupNote.id = "PopupNoteOnPopupToDoBox";
	win.appendChild(popupNote);
	// Make block for add To-Do dialog
	var popupDialog = document.createElement("span");
	popupDialog.id = "PopupDialogOnPopupToDoBox";
	win.appendChild(popupDialog);
	// Load To-Do data (by CGI)
	loadToDo();
	makeToDoTabs();
	// Set minimum size of the window
	var style = window.getComputedStyle(win, "");
	win.style.minHeight = style.height;
	win.style.minWidth = style.width;
	// Finish popup process
	poppedUpToDo = 2;
}

function
loadToDo()
{
	if (poppedUpToDo !== 2) {
		return;
	}
	/* with CGI */
	// Make query string
	var query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&pubkey=" + cryptToClient.getPublicKey();
	var request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/ToDo_load.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var decrypted = decrypt(request.responseText);
				// Parse JSON data
				var data = JSON.parse(decrypted);
				listToDoTask = data.tasks;
				listToDoGroup = data.groups;
				listToDoTag = data.tags;
			} else {
				// Error
				console.log("Error: Cannot load To-Do");
				var win = document.getElementById("PopupToDo");
				win.closeWindow();
				poppedUpToDo = 0;
			}
		}
	    };
	request.send(query);
	/* /with CGI */
}

function
makeToDoTabs()
{
	// Get windows
	var win = document.getElementById("PopupToDo");
	var groupTab = document.getElementById("ToDoGroupTab");
	var tagCloud = document.getElementById("ToDoTagCloud");
	// Set list updating function
	var listUpdate = function () { setToDoList(); sortToDoList(); };
	// Set group buttons
	for (var i = 0; i < listToDoGroup.length; i++) {
		var block = document.createElement("span");
		block.style.height = "100%";
		block.innerHTML =
		    "<input type=\"radio\" class=\"ToDoGroupRadioButton\"" +
		    (i === 0 ? " checked=\"checked\"" : "") +
		    " name=\"formToDoGroupTab\" id=\"ToDoGroupTab" + listToDoGroup[i] + "\">" +
		    "<label style=\"font-weight: bolder;\" for=\"ToDoGroupTab" + listToDoGroup[i] + "\">" + listToDoGroup[i] + "</label>";
		block.addEventListener("change", listUpdate, false);
		// Append the button
		groupTab.appendChild(block);
	}
	// Set tag buttons
	for (var i = 0; i < listToDoTag.length; i++) {
		var block = document.createElement("span");
		block.innerHTML =
		    "<input type=\"checkbox\" class=\"ToDoTagCheckbox\"" +
		    " name=\"formToDoTagCloud\" id=\"ToDoTagCloud" + listToDoTag[i] + "\">" +
		    "<label for=\"ToDoTagCloud" + listToDoTag[i] + "\">" + listToDoTag[i] + "</label>";
		block.addEventListener("change", listUpdate, false);
		// Append the button
		tagCloud.appendChild(block);
	}
	// Add tasks
	setToDoList();
	// Sort To-Do list
	sortToDoList();
}

function
popdownToDo()
{
	if (poppedUpToDo !== 2) {
		// Not popuped up or Already start closing
		return;
	}
	// Reset list of ToDo
	listToDoTask = new Array();
	listToDoGroup = new Array();
	listToDoTag = new Array();
	// Reset flag
	poppedUpToDo = 0;
}

function
setToDoList()
{
	var box = document.getElementById("ToDoBox");
	var selectedGroup = userId;
	var groupTab = document.getElementsByName("formToDoGroupTab");
	for (var i = 0; i < groupTab.length; i++) {
		if (groupTab[i].checked === true) {
			selectedGroup = groupTab[i].id.slice(12);
		}
	}
	var listTagTrue = new Array();
	var tagCloud = document.getElementsByName("formToDoTagCloud");
	for (var i = 0; i < tagCloud.length; i++) {
		if (tagCloud[i].checked === true) {
			listTagTrue.push(tagCloud[i].id.slice(12));
		}
	}
	// Clear the box
	box.innerHTML = "";
	// Set the task block
	for (var i = 0; i < listToDoTask.length; i++) {
		// Group filtering
		if (listToDoTask[i].group === selectedGroup) {
			if (listTagTrue.length < 1) {
				// Add taskElement to box
				var taskBlock = makeToDoTaskBlock(listToDoTask[i]);
				box.appendChild(taskBlock);
			} else {
				// Check whther the task includes the all tags which has been selected or not
				var include = true;
				for (var k = 0; k < listTagTrue.length; k++) {
					if (listToDoTask[i].tags.indexOf(listTagTrue[k]) < 0) {
						include = false;
						break;
					}
				}
				if (include) {
					// Add taskElement to box
					var taskBlock = makeToDoTaskBlock(listToDoTask[i]);
					box.appendChild(taskBlock);
				}
			}
		}
	}
}

function
makeToDoTaskBlock(task)
{
	var taskElement = document.createElement("div");
	taskElement.className = "ToDoList";
	taskElement.id = task.id;
	taskElement.style.height = String(taskHeight) + "px";
	taskElement.style.top = "0px";
	taskElement.style.transitionDuration = "0.3s";
	taskElement.note = task.note;
	// Add Name and Header block
	var element = document.createElement("span");
	element.style.width = "680px";
	element.style.overflow = "hidden";
	element.style.whiteSpace = "nowrap";
	element.innerHTML = task.name + " : " + task.header;
	taskElement.appendChild(element);
	// Add status block
	var blockStateToDo = document.createElement("span");
	blockStateToDo.className = "ToDoState";
	taskElement.appendChild(blockStateToDo);
	for (var k = 0; k < 3; k++) {
		element = document.createElement("span");
		if (listStateToDo[k] === task.state) {
			element.style.color = "rgba(" + listColorStateToDo[k] + ", 1.0)";
		} else {
			element.style.color = "rgba(" + listColorStateToDo[k] + ", 0.0)";
		}
		element.className = "ToDo" + listStateToDo[k];
		element.innerHTML = listStateToDo[k];
		blockStateToDo.appendChild(element);
	}
	// Add gradation lighting box (for Physical UI design)
	element = document.createElement("div");
	element.className = "lightingToDoList";
	element.style.width = String(widthLightingToDoList) + "px";
	element.style.height = String(taskHeight) + "px";
	element.style.left = "0px";
	element.style.display = "none";
	taskElement.appendChild(element);
	// Set event for Popup note window and Drag
	taskElement.addEventListener(
	    "mousedown",
	    function (event) {
		    dragToDoList(event);
		    popupToDoNote(event);
	    },
	    false);
	taskElement.addEventListener(
	    "touchstart",
	    function (event) {
		    dragToDoList(event);
		    popupToDoNote(event);
	    },
	    false);
	return taskElement;
}

function
popupAddToDoTask(event)
{
	if (document.getElementById("PopupAddToDoTask") !== null) {
		return;
	}
	event.stopPropagation(); // Prevent to propagate the event to parent node
	var dialog = createWindow({id: "PopupAddToDoTask", type: "dialog"});
	document.getElementById("PopupToDo").appendChild(dialog);
	// Make content
	var content = document.createElement("div");
	content.className = "BlackBoard";
	content.style.lineHeight = "28px";
	dialog.appendChild(content);
	// Create form
	var form = document.createElement("form");
	form.id = "formAddToDoTask";
	form.action = "#top";
	form.style.display = "block";
	form.style.lineHeight = "28px";
	form.innerHTML =
	    "Name <input type=\"text\" value=\"" + userId + "\" style=\"width: 100px;\" disabled><br>" +
	    "Header<br>" +
	    "<input type=\"text\" id=\"headerAddToDoTask\" style=\"width: 300px;\" autofocus><br>" +
	    "Note<br>" +
	    "<textarea id=\"noteAddToDoTask\" wrap=\"soft\" style=\"width: 300px; height: 200px;\"></textarea>";
	content.appendChild(form);
	// Create group cloud
	var group = document.createElement("div");
	group.innerHTML = "Group";
	content.appendChild(group);
	var groupForm = document.createElement("form");
	groupForm.id = "groupFormAddToDoTask";
	groupForm.action = "#top";
	groupForm.style.display = "block";
	groupForm.style.width = "300px";
	groupForm.style.lineHeight = "28px";
	content.appendChild(groupForm);
	// Check ToDo Group Tab
	var groupTab = document.getElementsByName("formToDoGroupTab");
	for (var i = 0; i < listToDoGroup.length; i++) {
		var blockGroup = document.createElement("span");
		// Make radio button (hidden)
		var input = document.createElement("input");
		input.type = "radio";
		input.name = "groupSelectorAddToDoTask";
		input.id = "groupToDo" + listToDoGroup[i];
		if (groupTab[i].checked) {
			input.checked = true;
		}
		blockGroup.appendChild(input);
		// Make label
		var label = document.createElement("label");
		label.htmlFor = input.id;
		label.innerHTML = listToDoGroup[i];
		blockGroup.appendChild(label);
		// Append the button to form
		groupForm.appendChild(blockGroup);
	}
	// Create tag cloud
	var tagCloud = document.createElement("div");
	tagCloud.innerHTML = "Tag";
	content.appendChild(tagCloud);
	var tagForm = document.createElement("form");
	tagForm.id = "tagFormAddToDoTask";
	tagForm.action = "#top";
	tagForm.style.display = "block";
	tagForm.style.width = "300px";
	tagForm.style.lineHeight = "28px";
	content.appendChild(tagForm);
	for (var i = 0; i < listToDoTag.length; i++) {
		var blockTag = document.createElement("span");
		blockTag.innerHTML =
		    "<input type=\"checkbox\"" +
		    " name=\"tagCloudAddToDoTask\" id=\"tagToDo" + listToDoTag[i] + "\">" +
		    "<label for=\"tagToDo" + listToDoTag[i] + "\">" + listToDoTag[i] + "</label>";
		// Append the button
		tagForm.appendChild(blockTag);
	}
	// New inputted tags
	var tagFormNew = document.createElement("form");
	tagFormNew.id = "tagFormNewAddToDoTask";
	tagFormNew.action = "#top";
	tagFormNew.style.display = "block";
	tagFormNew.style.width = "300px";
	tagFormNew.style.lineHeight = "28px";
	content.appendChild(tagFormNew);
	var tagFormNewInput = document.createElement("input");
	tagFormNewInput.type = "text";
	tagFormNewInput.style.width = "300px";
	tagFormNewInput.addEventListener("input",
	    function () {
		    var listStr = tagFormNewInput.value.toLowerCase().split(/[\s]+/);
		    for (var i = 0; i < listStr.length; i++) {
			    if (listStr[i].length < 1) {
				    listStr.splice(i, 1);
			    }
		    }
		    for (var i = 0; i < listStr.length; i++) {
			    if (i < tagFormNew.children.length) {
				    tagFormNew.children[i].innerHTML =
					"<input type=\"checkbox\" checked" +
					" name=\"tagCloudAddToDoTask\" id=\"tagToDo" + listStr[i] + "\">" +
					"<label for=\"tagToDo" + listStr[i] + "\">" + listStr[i] + "</label>";
			    } else {
				    var blockTag = document.createElement("span");
				    blockTag.innerHTML =
					"<input type=\"checkbox\" checked" +
					" name=\"tagCloudAddToDoTask\" id=\"tagToDo" + listStr[i] + "\">" +
					"<label for=\"tagToDo" + listStr[i] + "\">" + listStr[i] + "</label>";
				    // Append the button
				    tagFormNew.appendChild(blockTag);
			    }
		    }
		    while (listStr.length < tagFormNew.children.length) {
			    tagFormNew.children[tagFormNew.children.length - 1].remove();
		    }
	    },
	    false);
	content.appendChild(tagFormNewInput);
	var submit = document.createElement("input");
	submit.type = "button";
	submit.id = "submitToDoTask";
	submit.value = "Submit";
	submit.onclick = addToDoTask;
	submit.style.position = "absolute";
	submit.style.left = "10px";
	submit.style.bottom = "5px";
	dialog.appendChild(submit);
	// Set minimum size of the window
	var style = window.getComputedStyle(dialog, "");
	dialog.style.minHeight = style.height;
	dialog.style.minWidth = style.width;
}

function
addToDoTask()
{
	var header = document.getElementById("headerAddToDoTask").value;
	var note = document.getElementById("noteAddToDoTask").value;
	var group = userId;
	var tags = [];
	var groupElements = document.getElementsByName("groupSelectorAddToDoTask");
	for (var i = 0; i < groupElements.length; i++) {
		if (groupElements[i].checked === true) {
			group = groupElements[i].id.slice(9);
			break;
		}
	}
	var tagElements = document.getElementsByName("tagCloudAddToDoTask");
	var listUpdate = function () { setToDoList(); sortToDoList(); };
	for (var i = 0; i < tagElements.length; i++) {
		if (tagElements[i].checked === true) {
			var tag = tagElements[i].id.slice(7);
			tags.push(tag);
			// Check Global tag list and add new tags if they are NOT in the list
			if (listToDoTag.indexOf(tag) < 0) {
				listToDoTag.push(tag);
				var block = document.createElement("span");
				block.innerHTML =
				    "<input type=\"checkbox\" class=\"ToDoTagCheckbox\"" +
				    " name=\"formToDoTagCloud\" id=\"ToDoTagCloud" + tag + "\">" +
				    "<label for=\"ToDoTagCloud" + tag + "\">" + tag + "</label>";
				block.addEventListener("change", listUpdate, false);
				document.getElementById("ToDoTagCloud").appendChild(block);
			}
		}
	}
	// Register new task
	if (registerToDoTask(header, note, group, tags)) {
		// Close dialog
		var win = document.getElementById("PopupAddToDoTask");
		win.closeWindow();
	} else {
		// Enhance header box
		var headerBox = document.getElementById("headerAddToDoTask");
		headerBox.style.outlineWidth = "4px";
		headerBox.style.outlineColor = "#FF0000";
	}
}

function
registerToDoTask(header, note, group, tags)
{
	if (typeof header === "undefined" || header.length < 1) {
		return false;
	}
	// Make JSON instance
	var currentTime = new Date();
	var task = {group: group, header: header, id: "", name: userId, note: note, priority: 0, state: "TODO", tags: tags, timestamp: Math.round(currentTime.getTime() / 1000.0)};
	/* without CGI */
	task.id = "todo" + String(Math.floor(10000 * Math.random()));
	console.log(task.id);
	listToDoTask.push(task);
	var block = makeToDoTaskBlock(task);
	// Append new task's block
	var groupTab = document.getElementsByName("formToDoGroupTab");
	for (var i = 0; i < groupTab.length; i++) {
		if (groupTab[i].id === ("ToDoGroupTab" + group) && groupTab[i].checked) {
			document.getElementById("ToDoBox").appendChild(block);
			break;
		}
	}
	// Sorting
	sortToDoList();
	// Update
	updateToDoList();
	/* with CGI */
	var request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/ToDo_register.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				var response = decrypt(request.responseText);
				if (response === "NoIdPassword" || response === "InvalidIdPassword") {
					console.log("Error: Cannot get correct ID (" + response + ")");
				}
				var registeredTask = JSON.parse(response);
				task.id = registeredTask.id;
				task.priority = registeredTask.priority;
				listToDoTask.push(task);
				var block = makeToDoTaskBlock(task);
				// Append new task's block
				var groupTab = document.getElementsByName("formToDoGroupTab");
				for (var i = 0; i < groupTab.length; i++) {
					if (groupTab[i].id === ("ToDoGroupTab" + group) && groupTab[i].checked) {
						document.getElementById("ToDoBox").appendChild(block);
						break;
					}
				}
				// Sorting
				sortToDoList();
				// Update
				updateToDoList();
			} else {
				console.log("Error: Failed to register new To-Do task");
			}
		}
	    };
	var query =
	    "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&pubkey=" + cryptToClient.getPublicKey() +
	    "&data=" + encrypt(JSON.stringify(task));
	request.send(query);
	/* /with CGI */
	return true;
}

function
popupToDoNote(event)
{
	event.stopPropagation(); // Prevent to propagate the click event to parent node
	var target;
	if (typeof event.target.id !== "undefined" &&
	    event.target.id.indexOf("todo") >= 0) {
		target = event.target;
	} else if (typeof event.target.parentNode.id !== "undefined" &&
	    event.target.parentNode.id.indexOf("todo") >= 0) {
		target = event.target.parentNode;
	} else {
		return;
	}
	var text = target.note;
	var popup_note_block = document.createElement("div");
	popup_note_block.className = "PopupNoteOnPopupToDo";
	popup_note_block.id = "PopupNoteOn" + target.id;
	var win = document.getElementById("PopupToDo");
	var rectBox = win.getBoundingClientRect();
	var styleWindow = window.getComputedStyle(win, "");
	popup_note_block.style.position = "absolute";
	popup_note_block.style.left = String(event.clientX - rectBox.left - parseInt(styleWindow.paddingLeft, 10)) + "px";
	popup_note_block.style.top = String(event.clientY - rectBox.top - parseInt(styleWindow.paddingTop, 10)) + "px";
	popup_note_block.innerHTML = text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
	var editButton = makeFunctionButton("classButton", "Edit", popupEditToDoTask);
	editButton.id = "editToDoNote" + target.id;
	editButton.style.position = "absolute";
	editButton.style.bottom = "0px";
	editButton.style.left = "0px";
	popup_note_block.appendChild(editButton);
	popup_note_block.addEventListener(
	    "click",
	    function () {
		    document.getElementById("PopupNoteOnPopupToDoBox").innerHTML = "";
	    },
	    false);
	var box = document.getElementById("PopupNoteOnPopupToDoBox");
	box.innerHTML = "";
	box.appendChild(popup_note_block);
}

function
popupEditToDoTask(event)
{
	var taskId = "";
	if (document.getElementById("PopupEditToDoTask") !== null) {
		console.log("already popped-up");
		return;
	}
	if (event.target.id === null) {
		console.log("event.target.id === null");
		return;
	} else {
		taskId = event.target.id.slice(12);
	}
	// Get data from listToDoTask
	var taskNum;
	for (taskNum = 0; taskNum < listToDoTask.length; taskNum++) {
		if (listToDoTask[taskNum].id === taskId) {
			break;
		}
	}
	if (taskNum >= listToDoTask.length) {
		console.log("cannot find data in the list");
		return;
	}
	// Check user ID and The task user
	if (listToDoTask[taskNum].name !== userId) {
		console.log("You are NOT the user who have added the task");
		return;
	}
	// Close Note on To-Do task
	document.getElementById("PopupNoteOnPopupToDoBox").innerHTML = "";
	// Popup edit window
	var dialog = createWindow({id: "PopupEditToDoTask", className: "classDialog"});
	document.getElementById("PopupToDo").appendChild(dialog);
	var content = document.createElement("div");
	content.className = "BlackBoard";
	// Create form
	var form = document.createElement("form");
	form.id = "formEditToDoTask";
	form.action = "#top";
	form.innerHTML =
	    "Header<br>" +
	    "<input type=\"text\" id=\"headerEditToDoTask\" style=\"width: 300px;\" autofocus><br>" +
	    "Note<br>" +
	    "<textarea id=\"noteEditToDoTask\" wrap=\"soft\" style=\"width: 300px; height: 200px;\"></textarea>";
	content.appendChild(form);
	dialog.appendChild(content);
	// Create group tab
	var grouptab = document.createElement("div");
	grouptab.innerHTML = "Group";
	content.appendChild(grouptab);
	var groupForm = document.createElement("form");
	groupForm.id = "groupFormEditToDoTask";
	groupForm.action = "#top";
	groupForm.style.display = "block";
	groupForm.style.width = "300px";
	groupForm.style.lineHeight = "28px";
	content.appendChild(groupForm);
	for (var i = 0; i < listToDoGroup.length; i++) {
		var block = document.createElement("span");
		var input = document.createElement("input");
		input.type = "radio";
		input.name = "groupSelectorEditToDoTask";
		input.id = "groupToDo" + listToDoGroup[i];
		block.appendChild(input);
		var label = document.createElement("label");
		label.htmlFor = "groupToDo" + listToDoGroup[i];
		label.innerHTML = listToDoGroup[i];
		block.appendChild(label);
		// Append the button
		groupForm.appendChild(block);
		// Check if the group is selected in the task
		if (listToDoGroup[i] === listToDoTask[taskNum].group) {
			input.checked = true;
		}
	}
	// Create tag cloud
	var tagCloud = document.createElement("div");
	tagCloud.innerHTML = "Tag";
	content.appendChild(tagCloud);
	var tagForm = document.createElement("form");
	tagForm.id = "tagFormEditToDoTask";
	tagForm.action = "#top";
	tagForm.style.display = "block";
	tagForm.style.width = "300px";
	tagForm.style.lineHeight = "28px";
	content.appendChild(tagForm);
	for (var i = 0; i < listToDoTag.length; i++) {
		var block = document.createElement("span");
		var input = document.createElement("input");
		input.type = "checkbox";
		input.name = "tagCloudEditToDoTask";
		input.id = "tagToDo" + listToDoTag[i];
		block.appendChild(input);
		var label = document.createElement("label");
		label.htmlFor = "tagToDo" + listToDoTag[i];
		label.innerHTML = listToDoTag[i];
		block.appendChild(label);
		// Append the button
		tagForm.appendChild(block);
		// Check if the tag is selected in the task
		for (var k = 0; k < listToDoTask[taskNum].tags.length; k++) {
			if (listToDoTag[i] === listToDoTask[taskNum].tags[k]) {
				input.checked = true;
				break;
			}
		}
	}
	// New inputted tags
	var tagFormNew = document.createElement("form");
	tagFormNew.id = "tagFormNewEditToDoTask";
	tagFormNew.action = "#top";
	tagFormNew.style.display = "block";
	tagFormNew.style.width = "300px";
	tagFormNew.style.lineHeight = "28px";
	content.appendChild(tagFormNew);
	var tagFormNewInput = document.createElement("input");
	tagFormNewInput.type = "text";
	tagFormNewInput.style.width = "300px";
	tagFormNewInput.addEventListener("input",
	    function () {
		    var listStr = tagFormNewInput.value.toLowerCase().split(/[\s]+/);
		    for (var i = 0; i < listStr.length; i++) {
			    if (listStr[i].length < 1) {
				    listStr.splice(i, 1);
			    }
		    }
		    for (var i = 0; i < listStr.length; i++) {
			    if (i < tagFormNew.children.length) {
				    tagFormNew.children[i].innerHTML =
					"<input type=\"checkbox\" checked" +
					" name=\"tagCloudEditToDoTask\" id=\"tagToDo" + listStr[i] + "\">" +
					"<label for=\"tagToDo" + listStr[i] + "\">" + listStr[i] + "</label>";
			    } else {
				    var blockTag = document.createElement("span");
				    blockTag.innerHTML =
					"<input type=\"checkbox\" checked" +
					" name=\"tagCloudEditToDoTask\" id=\"tagToDo" + listStr[i] + "\">" +
					"<label for=\"tagToDo" + listStr[i] + "\">" + listStr[i] + "</label>";
				    // Append the button
				    tagFormNew.appendChild(blockTag);
			    }
		    }
		    while (listStr.length < tagFormNew.children.length) {
			    tagFormNew.children[tagFormNew.children.length - 1].remove();
		    }
	    },
	    false);
	content.appendChild(tagFormNewInput);
	// Create Submit button
	var submit = document.createElement("input");
	submit.type = "button";
	submit.id = "submitToDoTask";
	submit.value = "Submit";
	submit.onclick = function () { editToDoTask(taskNum); };
	submit.style.position = "absolute";
	submit.style.left = "10px";
	submit.style.bottom = "5px";
	dialog.appendChild(submit);
	var submitBox = window.getComputedStyle(submit, "");
	// Create Delete button
	var deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.id = "deleteToDoTask";
	deleteButton.value = "Delete";
	deleteButton.onclick = function () { checkIfDeleteToDoTask(taskNum); };
	deleteButton.style.position = "absolute";
	deleteButton.style.left = String(parseInt(submitBox.width, 10) + 16) + "px";
	deleteButton.style.bottom = "5px";
	dialog.appendChild(deleteButton);
	// Set current data on form
	document.getElementById("headerEditToDoTask").value = listToDoTask[taskNum].header;
	document.getElementById("noteEditToDoTask").value = listToDoTask[taskNum].note;
	// Set minimum size of the window
	var style = window.getComputedStyle(dialog, "");
	dialog.style.minHeight = style.height;
	dialog.style.minWidth = style.width;
}

function
editToDoTask(taskNum)
{
	var Header = document.getElementById("headerEditToDoTask").value;
	if (Header.length < 1) {
		var headerBox = document.getElementById("headerEditToDoTask");
		headerBox.value = listToDoTask[taskNum].header;
		headerBox.style.outlineWidth = "4px";
		headerBox.style.outlineColor = "#FF0000";
		return;
	}
	// Update To-Do data
	listToDoTask[taskNum].header = Header;
	listToDoTask[taskNum].note = document.getElementById("noteEditToDoTask").value;
	listToDoTask[taskNum].tags = new Array();
	var groupElements = document.getElementsByName("groupSelectorEditToDoTask");
	for (var i = 0; i < groupElements.length; i++) {
		if (groupElements[i].checked === true) {
			listToDoTask[taskNum].group = groupElements[i].id.slice(9); // eliminate 'groupToDo'
			break;
		}
	}
	var tagElements = document.getElementsByName("tagCloudEditToDoTask");
	var listUpdate = function () { setToDoList(); sortToDoList(); };
	for (var i = 0; i < tagElements.length; i++) {
		if (tagElements[i].checked === true) {
			var tag = tagElements[i].id.slice(7); // eliminate 'tagToDo'
			if (listToDoTask[taskNum].tags.indexOf(tag) < 0) {
				listToDoTask[taskNum].tags.push(tag);
			}
			// Check Global tag list and add new tags if they are NOT in the list
			if (listToDoTag.indexOf(tag) < 0) {
				listToDoTag.push(tag);
				var block = document.createElement("span");
				block.innerHTML =
				    "<input type=\"checkbox\" class=\"ToDoTagCheckbox\"" +
				    " name=\"formToDoTagCloud\" id=\"ToDoTagCloud" + tag + "\">" +
				    "<label for=\"ToDoTagCloud" + tag + "\">" + tag + "</label>";
				block.addEventListener("change", listUpdate, false);
				document.getElementById("ToDoTagCloud").appendChild(block);
			}
		}
	}
	// Update timestamp
	var currentTime = new Date();
	listToDoTask[taskNum].timestamp = Math.round(currentTime.getTime() / 1000.0);
	// Re-write To-Do list
	setToDoList();
	// Sort To-Do list
	sortToDoList();
	// Update To-Do data on the Server
	updateToDoList();
	// Close edit window
	var win = document.getElementById("PopupEditToDoTask");
	win.closeWindow();
}

function
checkIfDeleteToDoTask(taskNum)
{
	var parent = document.getElementById("PopupEditToDoTask");
	// Popup edit window
	var dialog = createWindow({id: "PopupCheckIfDeleteToDoTask", className: "classDialog", style: {width: "96px"}, noCloseButton: true});
	parent.appendChild(dialog);
	// Create Check box
	var Check = document.createElement("div");
	Check.innerHTML =
	    "<input type=\"checkbox\" id=\"checkboxIfDeleteToDoTask\">" +
	    "<label for=\"checkboxIfDeleteToDoTask\">Delete</label>";
	dialog.appendChild(Check);
	// Create OK button
	var OK = document.createElement("input");
	OK.type = "button";
	OK.id = "deleteToDoTask";
	OK.value = "OK";
	OK.addEventListener("click",
	    function () {
		if (document.getElementById("checkboxIfDeleteToDoTask").checked === true) {
			deleteToDoTask(taskNum);
		}
		dialog.parentNode.removeChild(dialog);
	    },
	    false);
	OK.style.position = "absolute";
	OK.style.left = "10px";
	OK.style.bottom = "5px";
	dialog.appendChild(OK);
	// Create Cancel button
	var Cancel = document.createElement("input");
	Cancel.type = "button";
	Cancel.id = "deleteToDoTask";
	Cancel.value = "Cancel";
	Cancel.addEventListener("click", function () { dialog.parentNode.removeChild(dialog); }, false);
	Cancel.style.position = "absolute";
	Cancel.style.left = "50px";
	Cancel.style.bottom = "5px";
	dialog.appendChild(Cancel);
}

function
deleteToDoTask(taskNum)
{
	/* without CGI */
	/*
	// Get deleting task ID
	var deleteTaskId = listToDoTask[taskNum].id;
	// Delete the task
	listToDoTask.splice(taskNum, 1);
	taskNum = -1;
	// Re-write To-Do list
	document.getElementById("ToDoBox").removeChild(document.getElementById(deleteTaskId));
	// Sort To-Do list
	sortToDoList();
	// Update To-Do data on the Server
	updateToDoList();
	// Close edit window
	var win = document.getElementById("PopupEditToDoTask");
	win.closeWindow();
	*/
	/* /without CGI */
	/* with CGI */
	var request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/ToDo_delete.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange =
	    function () {
		    if (request.readyState == 4) {
			    if (request.status == 200) {
				    console.log(request.responseText);
				    // Get deleting task ID
				    var deleteTaskId = listToDoTask[taskNum].id;
				    // Delete the task
				    listToDoTask.splice(taskNum, 1);
				    taskNum = -1;
				    // Re-write To-Do list
				    document.getElementById("ToDoBox").removeChild(document.getElementById(deleteTaskId));
				    // Sort To-Do list
				    sortToDoList();
				    // Update To-Do data on the Server
				    updateToDoList();
				    // Close edit window
				    var win = document.getElementById("PopupEditToDoTask");
				    win.closeWindow();
			    }
		    }
	    };
	var query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&deleteId=" + encrypt(listToDoTask[taskNum].id);
	request.send(query);
	/* /with CGI */
}


function
dragToDoList(event)
{
	event.stopPropagation(); // Prevent to propagate the event to parent node
	// Get correct mouse or touch event object
	var clientX = 0;
	var clientY = 0;
	if (event.type === "touchstart" || event.type === "touchmove" || event.type === "touchend") {
		console.log(event);
		clientX = event.touches[0].clientX; // Use 1st touch event
		clientY = event.touches[0].clientY;
	} else {
		clientX = event.clientX;
		clientY = event.clientY;
	}
	if (event.type === "mousedown" || event.type === "touchstart") {
		// Search the top of ToDoList DOM tree
		if (event.target.className === "ToDoList") {
			selectedToDoElement = event.target;
		} else if (event.target.parentNode.className === "ToDoList") {
			selectedToDoElement = event.target.parentNode;
		} else if (event.target.parentNode.parentNode.className === "ToDoList") {
			selectedToDoElement = event.target.parentNode.parentNode;
		} else {
			selectedToDoElement = null;
			return;
		}
		// Get bounding
		var rectBox = document.getElementById("ToDoBox").getBoundingClientRect();
		ToDoElementOffset_y = clientY - parseInt(selectedToDoElement.style.top, 10) - rectBox.top;
		startMousePos_x = clientX;
		startMousePos_y = clientY;
		// Get initial state of selectedToDoElement
		var num = 0;
		for (num = 0; num < listToDoTask.length; num++) {
			if (listToDoTask[num].id === selectedToDoElement.id) {
				break;
			}
		}
		for (var i = 0; i < listStateToDo.length; i++) {
			if (listStateToDo[i] === listToDoTask[num].state) {
				// Compute state at clicked
				initialStateToDo = i;
				break;
			}
		}
		selectedToDoElement.parentNode.insertBefore(selectedToDoElement, null);
		selectedToDoElement.style.transitionDuration = "0s";
	} else if (selectedToDoElement === null) {
		return;
	} else if (event.type === "mouseup" || event.type === "touchend") {
		// Restore opacity
		selectedToDoElement.style.opacity = 1.0;
		// Align the tasks in order to the renewed order
		sortToDoList();
		// Update task in file
		updateToDoList();
		// Set lighting opacity to 0
		for (var i = 0; i < selectedToDoElement.childNodes.length; i++) { // Search lighting box
			if (selectedToDoElement.childNodes[i].className === "lightingToDoList"){
				selectedToDoElement.childNodes[i].style.display = "none";
				break;
			}
		}
		// Clear selected variable
		selectedToDoElement.style.transitionDuration = "0.3s";
		selectedToDoElement = null;
		ToDoElementOffset_y = 0;
		return;
	} else if (event.type === "mousemove" || event.type === "touchmove") {
		// Close popup note if the mouse position change get over the threshold
		if (Math.abs(clientX - startMousePos_x) > 10 || Math.abs(clientY - startMousePos_y) > 10) {
			document.getElementById("PopupNoteOnPopupToDoBox").innerHTML = "";
		}
	}
	event.preventDefault();

	// move Task block on Y-axis
	var box = document.getElementById("ToDoBox");
	var rectBox = box.getBoundingClientRect();
	var rect = selectedToDoElement.getBoundingClientRect();
	var y = clientY - rectBox.top + box.scrollTop - ToDoElementOffset_y;
	var x = clientX - rect.left;
	selectedToDoElement.style.top = String(Math.min(Math.max(y, box.scrollTop), parseInt(box.style.height, 10) + box.scrollTop - taskHeight)) + "px";
	// Change lighting
	for (var i = 0; i < selectedToDoElement.childNodes.length; i++) { // Search lighting box
		if (selectedToDoElement.childNodes[i].className === "lightingToDoList") {
			selectedToDoElement.childNodes[i].style.display = "block";
			selectedToDoElement.childNodes[i].style.left = String(x - Math.round(widthLightingToDoList / 2)) + "px";
			break;
		}
	}
	// Transparent while drag
	selectedToDoElement.style.opacity = "0.8";
	// Change To-Do state
	var x_diff = clientX - startMousePos_x;
	// Compute new state
	var stateToDo = (initialStateToDo + Math.floor(Math.abs(x_diff) / 200)) % listStateToDo.length; // (TODO: 0, DOING: 1, DONE: 2) mod 3
	// Update list's state
	for (var n = 0; n < listToDoTask.length; n++) {
		if (listToDoTask[n].id === selectedToDoElement.id) {
			// Set new state
			listToDoTask[n].state = listStateToDo[stateToDo];
			listToDoTask[n].timestamp = Math.round(time.getTime() / 1000.0);
			break;
		}
	}
	// Change To-Do state display
	var blockToDoState = null;
	for (var i = 0; i < selectedToDoElement.childNodes.length; i++) {
		// Search ToDoState element
		if (selectedToDoElement.childNodes[i].className === "ToDoState") {
			blockToDoState = selectedToDoElement.childNodes[i];
			break;
		}
	}
	if (blockToDoState !== null) {
		blockToDoState.childNodes[0].style.color = "rgba(255, 100, 100, " + (stateToDo === 0 ? "1.0" : "0.0") + ")";
		blockToDoState.childNodes[1].style.color = "rgba(255, 255, 100, " + (stateToDo === 1 ? "1.0" : "0.0") + ")";
		blockToDoState.childNodes[2].style.color = "rgba(100, 255, 100, " + (stateToDo === 2 ? "1.0" : "0.0") + ")";
	}
	// Move other tasks
	sortToDoListByPosition(selectedToDoElement.id);
}

function
sortToDoList(preclusiveID)
{
	listToDoTask.sort(
	    function (a, b) {
		    if (a.state === b.state) {
			    return b.priority - a.priority;
		    } else {
			    var na = 0;
			    var nb = 0;
			    for (na = 0; na < listStateToDo.length; na++) {
				    if (listStateToDo[na] === a.state) {
					    break;
				    }
			    }
			    for (nb = 0; nb < listStateToDo.length; nb++) {
				    if (listStateToDo[nb] === b.state) {
					    break;
				    }
			    }
			    return nb - na;
		    }
	    });
	for (var i = 0; i < listToDoTask.length; i++) {
		listToDoTask[i].priority = listToDoTask.length - i;
	}
	// Set task in order
	var positionTop = 0;
	for (var i = 0; i < listToDoTask.length; i++) {
		var element = document.getElementById(listToDoTask[i].id);
		if (element === null) {
			continue;
		}
		element.style.top = String(boxPaddingTop + positionTop) + "px";
		// Increment position top
		positionTop += taskHeight + taskMarginBottom;
	}
}

function
sortToDoListByPosition(preclusiveID)
{
	var box = document.getElementById("ToDoBox");
	var list = new Array();
	for (var i = 0; i < box.childNodes.length; i++) {
		list.push(box.childNodes[i]);
	}
	list.sort(function (a, b) { return parseInt(a.style.top, 10) - parseInt(b.style.top, 10); });
	// Search list and get list of priority of only displaying
	var listIndices_DOING = new Array();
	var listIndices_TODO = new Array();
	var listIndices_DONE = new Array();
	for (var i = 0; i < list.length; i++) {
		if (list[i].id !== preclusiveID) {
			// Align list
			list[i].style.top = String(boxPaddingTop + (taskHeight + taskMarginBottom) * i) + "px";
		}
		// Re-write priority in listToDoTask[]
		for (var k = 0; k < listToDoTask.length; k++) {
			if (listToDoTask[k].id === list[i].id) {
				if (listToDoTask[k].state === "DOING") {
					listIndices_DOING.push(k);
				} else if (listToDoTask[k].state === "TODO") {
					listIndices_TODO.push(k);
				} else if (listToDoTask[k].state === "DONE") {
					listIndices_DONE.push(k);
				}
				break;
			}
		}
	}
	for (var i = 0; i < listIndices_DOING.length; i++) {
		listToDoTask[listIndices_DOING[i]].priority = listIndices_DOING.length - i;
		listToDoTask[listIndices_DOING[i]].timestamp = Math.round(time.getTime() / 1000.0);
	}
	for (var i = 0; i < listIndices_TODO.length; i++) {
		listToDoTask[listIndices_TODO[i]].priority = listIndices_TODO.length - i;
		listToDoTask[listIndices_TODO[i]].timestamp = Math.round(time.getTime() / 1000.0);
	}
	for (var i = 0; i < listIndices_DONE.length; i++) {
		listToDoTask[listIndices_DONE[i]].priority = listIndices_DONE.length - i;
		listToDoTask[listIndices_DONE[i]].timestamp = Math.round(time.getTime() / 1000.0);
	}
}

function
updateToDoList()
{
	if (listToDoTask.length < 1) {
		return;
	}
	/* with CGI */
	var request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/ToDo_update.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange =
	    function () {
		    if (request.readyState == 4) {
			    if (request.status == 200) {
				    console.log(request.responseText);
			    } else {
				    console.log("Error: Cannot update To-Do list");
			    }
		    }
	    };
	var query = "id=" + encrypt(userId) +
		"&onetimepass=" + encrypt(onetimepass);
	for (var i = 0; i < listToDoTask.length; i++) {
		query += "&data=" + encrypt(JSON.stringify(listToDoTask[i]));
	}
	request.send(query);
	/* /with CGI */
}

