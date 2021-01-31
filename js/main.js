
let attendees = [];

function compareAttendees(a, b) {
    if (a.fullname < b.fullname) return -1;
    if (a.fullname > b.fullname) return 1;
    // we have equal full names, see company
    if (a.company < b.company) return -1;
    if (a.company > b.company) return 1;

    return 0;
}

function updateAttendee(index) {
    // will make AJAX request instead
    const req = new XMLHttpRequest();
    req.open("POST", "http://127.0.0.1:3000/attendees/PUT", true);
    // set headers
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // callback when the the request is served
    req.onload = () => {
        console.log("Data sent to the server");
        loadFromServer();
    }
    console.log("Updating data to the server");
    req.send("id=" + attendees[index].id + "&fullname=" + attendees[index].fullname + "&company=" + attendees[index].company);
}

function addAttendee() {
    // will make AJAX request instead
    const req = new XMLHttpRequest();
    req.open("POST", "http://127.0.0.1:3000/attendees", true);
    // set headers
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // callback when the the request is served
    req.onload = () => {
        console.log("Data sent to the server");
        loadFromServer();
    }
    console.log("Sendinf data to the server");
    req.send("fullname=" + document.getElementById("attFullName").value + "&company=" + document.getElementById("attCompany").value);

    resetDataEntryFields();
}

function resetDataEntryFields() {
    document.getElementById("attFullName").value = "";
    document.getElementById("attCompany").value = "";
}

function displayAttendees() {
    attendees.sort(compareAttendees);

    const body = document.getElementById("attendeesTableBody");
    body.innerHTML = ""; // remove previous rows

    for (let i = 0; i < attendees.length; i++) {
        const row = document.createElement("tr");

        let cell = document.createElement("td");
        cell.contentEditable = true;
        cell.addEventListener("input", (ev) => {
            attendees[i].fullname = ev.target.innerHTML
        })
        cell.innerHTML = attendees[i].fullname;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.contentEditable = true;
        cell.addEventListener("input", (ev) => {
            attendees[i].company = ev.target.innerHTML
        })
        cell.innerHTML = attendees[i].company;
        row.appendChild(cell);

        cell = document.createElement("td");
        let button = document.createElement("button");
        button.innerHTML = "Delete";
        button.addEventListener(
            "click",
            function (event) {
                deleteOnServer(attendees[i].id);
            }
        )
        cell.appendChild(button)
        button = document.createElement("button");
        button.innerHTML = "Update";
        button.addEventListener(
            "click",
            function (event) {
                updateAttendee(i);
            }
        )
        cell.appendChild(button)
        row.appendChild(cell);


        body.appendChild(row);
    }
}

function loadFromServer() {
    // AJAX request to the server
    const req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:3000/attendees");
    req.onload = function () {
        if (req.status == 200) {
            attendees = JSON.parse(req.response);
            displayAttendees();
        } else {
            attendees = [];
            displayAttendees();
            console.error("Problem loading attendees : " + req.status);
        }
    };
    req.send();
}

function deleteOnServer(id) {
    console.log("Deleting from the server " + id);
    // AJAX request to the server
    var req = new XMLHttpRequest();
    // the DELETE method does not work so ...
    // req.open("DELETE", "http://127.0.0.1:3000/attendees/"+id);
    // ... use the workaround with the GET + the DELETE path
    req.open("GET", "http://127.0.0.1:3000/attendees/DELETE/" + id);
    req.onload = function () {
        if (req.status == 200) {
            loadFromServer();
        } else {
            alert("Could not delete");
            console.error("Problem deleting attendees : " + req.status);
        }
    };
    req.send();
}

function searchOnServer() {
    // AJAX request to the server
    var req = new XMLHttpRequest();
    var filter = document.getElementById("searchOnName").value;
    req.open("GET", "http://127.0.0.1:3000/attendees?name=" + filter);
    req.onload = function () {
        if (req.status == 200) {
            attendees = JSON.parse(req.response);
            displayAttendees();
        } else {
            alert("Error searching");
            attendees = [];
            displayAttendees();
            console.error("Problem loading attendees : " + req.status);
        }
    };
    req.send();
}

