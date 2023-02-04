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
  let respEmp = await fetch("https://localhost:44319/api/employeeDepartment/" + employeeID);
  let dataEmp = await respEmp.json();
  let respDep = await fetch("https://localhost:44319/api/department/");
  let dataDep = await respDep.json();
  let pageTitle = document.getElementById("title");
  pageTitle.innerText = `Edit Employee (${dataEmp.FirstName} ${dataEmp.LastName})`;
  let employeeFirstName = (document.getElementById("employeeFirstName").value = dataEmp.FirstName);
  let employeeLastName = (document.getElementById("employeeLastName").value = dataEmp.LastName);
  let startWorkYear = (document.getElementById("startWorkYear").value = dataEmp.StartWorkYear);
  let employeeDepertment = document.getElementById("employeeDepertment");
  
  dataDep.forEach((x) => {
    let employeeOption = document.createElement("option");
    employeeOption.innerText = x.Name;
    employeeOption.value = x.ID;
    employeeDepertment.appendChild(employeeOption);
  });
});

let saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", async () => {
  let employeeFirstName = document.getElementById("employeeFirstName").value;
  let employeeLastName = document.getElementById("employeeLastName").value;
  let startWorkYear = document.getElementById("startWorkYear").value;
  let employeeDepertment = document.getElementById("employeeDepertment").value;

  updateAction(userID, todayDate);

  let obj = {
    FirstName: employeeFirstName,
    LastName: employeeLastName,
    StartWorkYear: startWorkYear,
    DepartmentID: employeeDepertment,
  };

  let fetchParams = {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  };

  let respDep = await fetch(
    "https://localhost:44319/api/employeeDepartment/" + employeeID,
    fetchParams
  );
  window.location.href = "/html/employees.html";
});

let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
}); 