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
let employeeID;

window.addEventListener("load", async () => {
  userID = sessionStorage["userID"];
  todayDate = sessionStorage["todayDate"];
  let respUser = await fetch("https://localhost:44319/api/user/" + userID);
  let dataUser = await respUser.json();
  let fullName = document.querySelector(".fullname");
  fullName.innerText = `Welcome ${sessionStorage["username"]}, (${dataUser.NumOfActions}/${dataUser.MaxOfAction}) daily actions left.`;
  checkUserCredit(userID, todayDate, dataUser);

  const urlParams = new URLSearchParams(window.location.search);
  employeeID = urlParams.get("employeeid");
  let respShift = await fetch("https://localhost:44319/api/shift");
  let dataShift = await respShift.json();
  let respEmp = await fetch("https://localhost:44319/api/employeeDepartment/" + employeeID);
  let dataEmp = await respEmp.json();
  let pageTitle = document.getElementById("title");
  pageTitle.innerText = `Add Shift To (${dataEmp.FirstName} ${dataEmp.LastName})`;
  let shiftSelect = document.getElementById("shiftSelect");
  
  dataShift.forEach((x) => {
    let shiftOption = document.createElement("option");
    shiftOption.innerText = `${x.Date} Start time: ${x.StartTime} End Time: ${x.EndTime} `;
    shiftOption.value = x.ID;
    shiftSelect.appendChild(shiftOption);
  });
});

let saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", async () => {
  let shiftSelect = document.getElementById("shiftSelect").value;
  updateAction(userID, todayDate);
  let obj = { ID: employeeID, Shifts: [{ ID: shiftSelect }] };
  let fetchParams = {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  };

  let respDep = await fetch("https://localhost:44319/api/employeeDepartment", fetchParams);
  window.location.href = "/html/employees.html";
});

let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
});
