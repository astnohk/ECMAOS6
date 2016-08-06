// ----- CALENDAR -----


function
popupCalendar()
{
	if (poppedUpCalendar == 2) {
		document.getElementById("PopupCalendar").closeWindow();
		return;
	} else if (poppedUpCalendar !== 0) {
		return;
	}
	poppedUpCalendar = 1;
	makeCalendar();
	poppedUpCalendar = 2;
}

function
popdownCalendar()
{
	// Reset date
	yearCalendar = time.getFullYear();
	monthCalendar = time.getMonth();
	// Reset flag
	poppedUpCalendar = 0;
}

function
makeCalendar()
{
	var year = yearCalendar; // Temporary
	var month = monthCalendar; // Temporary
	var displayMonth = monthCalendar + 1;
	var tmp = new Date(year, month, 1);
	var dayMonthFirst = tmp.getDay();
	tmp = new Date(year, month + 1, 1);
	var dayNextMonthFirst = tmp.getDay();

	// Search or Create Calendar box
	var win = document.getElementById("PopupCalendar");
	if (win === null) {
		win = createWindow({id: "PopupCalendar", title: "Calendar", closeFunction: popdownCalendar});
		document.body.appendChild(win);
	} else {
		// Remove CalendarTable
		element = document.getElementById("CalendarTable");
		element.parentNode.removeChild(element);
	}
	// Disable closeWindow()
	win.opening = true;
	// Make calendar table
	var calendarArray = new Array(42);
	var i = 0;
	for (i = 0; i < calendarArray.length; i++) {
		calendarArray[i] = 0;
	}
	for (i = 0; i < (month !== 1 ? month % 2 === 0 ? month < 7 ? 31 : 30 : month < 7 ? 30 : 31 : dayMonthFirst == dayNextMonthFirst ? 28 : 29); i++) {
		calendarArray[dayMonthFirst + i] = i + 1;
	}
	var table = document.createElement("span");
	table.id = "CalendarTable";
	var tableHTML = "<table class=\"tableCalendar\"><tbody class=\"tableCalendar\">" +
	    "<tr>" +
	    "<th style=\"cursor: pointer;\" onclick=\"incrementCalendarDate(-1)\">&lt;&lt;</th>" +
	    "<th colspan=\"5\">" + String(year) + "/" + String(displayMonth) + "</th>" +
	    "<th style=\"cursor: pointer;\" onclick=\"incrementCalendarDate(+1)\">&gt;&gt;</th>" +
	    "</tr><tr>" +
	    "<th class=\"tableCalendar\" style=\"background-color: rgba(255, 240, 240, 0.9);\">Sun.</th>" +
	    "<th class=\"tableCalendar\">Mon.</th><th class=\"tableCalendar\">Tue.</th>" +
	    "<th class=\"tableCalendar\">Wed.</th><th class=\"tableCalendar\">Thu.</th>" +
	    "<th class=\"tableCalendar\">Fri.</th><th class=\"tableCalendar\">Sat.</th>" +
	    "</tr>";
	for (var week = 0; week < 6; week++) {
		tableHTML += "<tr>";
		for (var day = 0; day < 7; day++) {
			if (calendarArray[7 * week + day] !== 0) {
				var id = String(year) +
				    ('0' + String(month)).slice(-2) +
				    ('0' + String(calendarArray[7 * week + day])).slice(-2);
				if (day === 0) { // Sunday
					tableHTML += "<td class=\"tableCalendar\" style=\"background-color: rgba(255, 210, 210, 0.9);\"" +
					    " id=\"" + id + "Table" + "\">" +
					    "<span id=\"" + id + "\"" +
					    " style=\"display: inline-flex; justify-content: center; margin-left: 6px; cursor: default;\">" +
					    String(calendarArray[7 * week + day]) + "</span></td>";
				} else {
					tableHTML += "<td class=\"tableCalendar\"" +
					    " id=\"" + id + "Table" + "\">" +
					    "<span id=\"" + id + "\"" +
					    " style=\"display: inline-flex; justify-content: center; margin-left: 6px; cursor: default;\">" +
					    String(calendarArray[7 * week + day]) + "</span></td>";
				}
			} else {
				if (day === 0) {
					tableHTML += "<td class=\"tableCalendar\" style=\"background-color: rgba(255, 210, 210, 0.9);\"></td>";
				} else {
					tableHTML += "<td class=\"tableCalendar\"></td>";
				}
			}
		}
		tableHTML += "</tr>";
	}
	tableHTML += "</tbody></table>";
	table.innerHTML = tableHTML;
	// Add calendar table
	win.appendChild(table);
	// Set minimum size of the window
	var style = window.getComputedStyle(win, "");
	win.style.minHeight = style.height;
	win.style.minWidth = style.width;
	// Mark on Today
	var element = document.getElementById(
	    String(time.getFullYear()) +
	    ('0' + String(time.getMonth())).slice(-2) +
	    ('0' + String(time.getDate())).slice(-2));
	if (element !== null) {
		element.className = "todayMarkOnCalendar";
		element.style.marginLeft = "2px";
	}
	// Set schedule button on calendar
	win.opening = false; // Allow window to close
}

function
incrementCalendarDate(increment)
{
	monthCalendar += increment;
	if (monthCalendar < 0) {
		yearCalendar--;
		monthCalendar = 11;
	} else if (monthCalendar > 11) {
		yearCalendar++;
		monthCalendar = 0;
	}
	makeCalendar();
}

