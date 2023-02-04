async function updateAction(userID, todayDate) {
  let objUser = { NumOfActions: 1, ActionDataLimit: todayDate };
  let fetchParamsUser = {
    method: "PUT",
    body: JSON.stringify(objUser),
    headers: { "Content-Type": "application/json" },
  };

  let respUser = await fetch("https://localhost:44319/api/user/" + userID, fetchParamsUser);
}

async function checkUserCredit(userID, todayDate, dataUser) {
  if (dataUser.ActionDataLimit.toString().slice(0, 10) != todayDate) {
    let objUser = { NumOfActions: 0, ActionDataLimit: todayDate };
    let fetchParamsUser = {
      method: "PUT",
      body: JSON.stringify(objUser),
      headers: { "Content-Type": "application/json" },
    };

    let updateUser = await fetch("https://localhost:44319/api/user/" + userID, fetchParamsUser);
  } else if (dataUser.NumOfActions >= dataUser.MaxOfAction) {
    alert("sorry you are out of credits");
    window.location.href = "/html/login.html";
  }
}

let userID;
let todayDate;

window.addEventListener("load", async () => {
  userID = sessionStorage["userID"];
  todayDate = sessionStorage["todayDate"];
  let respUser = await fetch("https://localhost:44319/api/user/" + userID);
  let dataUser = await respUser.json();
  let fullName = document.querySelector(".fullname");
  fullName.innerText = `Welcome ${sessionStorage["username"]}, (${dataUser.NumOfActions}/${dataUser.MaxOfAction}) daily actions left.`;
  checkUserCredit(userID, todayDate, dataUser);
  updateAction(userID, todayDate);

  let respShift = await fetch("https://localhost:44319/api/shift");
  let dataShift = await respShift.json();
  let pageTitle = document.getElementById("title");
  pageTitle.innerText = `Shifts: (${dataShift.length})`;
  let respEmp = await fetch("https://localhost:44319/api/employeeDepartment");
  let dataEmp = await respEmp.json();
  let tblObj = document.getElementById("tblObj");
  
  dataShift.forEach((x) => {
    let trObj = document.createElement("tr");
    let dateTdObj = document.createElement("td");
    dateTdObj.innerText = x.Date.slice(0, 10);
    trObj.appendChild(dateTdObj);
    let startTimeTdObj = document.createElement("td");
    startTimeTdObj.innerText = x.StartTime + "am";
    trObj.appendChild(startTimeTdObj);
    let endTimeTdObj = document.createElement("td");
    endTimeTdObj.innerText = x.EndTime + "pm";
    trObj.appendChild(endTimeTdObj);
    tblObj.appendChild(trObj);
    let employeeTdObj = document.createElement("td");
    employeeTdObj.className = "empshifts";
    dataEmp.forEach((j) => {
      j.Shifts.forEach((k) => {
        if (x.ID == k.ID) {
          let employeeLink = document.createElement("a");
          employeeLink.innerText = j.FirstName;
          employeeLink.href = "/html/EditEmployee.html?employeeid=" + j.ID;
          employeeTdObj.appendChild(employeeLink);
        }
      });
      trObj.appendChild(employeeTdObj);
    });
  });
});

let addShift = document.getElementById("addShift");
addShift.addEventListener("click", () => {
  window.location.href = "/html/addshift.html";
});


let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
}); 