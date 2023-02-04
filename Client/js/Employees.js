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
  let resp = await fetch("https://localhost:44319/api/employeedepartment");
  let data = await resp.json();
  let tblObj = document.getElementById("tblObj");
  let pageTitle = document.getElementById("title");
  pageTitle.innerText = `Employees (${data.length})`;

  data.forEach((x) => {
    let trObj = document.createElement("tr");
    let fullNameTdObj = document.createElement("td");
    let employeeLink = document.createElement("a");

    employeeLink.innerText = `${x.FirstName} ${x.LastName}`;
    employeeLink.href = "/html/EditEmployee.html?employeeid=" + x.ID;
    fullNameTdObj.appendChild(employeeLink);
    trObj.appendChild(fullNameTdObj);

    let startWorkYearTdObj = document.createElement("td");
    startWorkYearTdObj.innerText = x.StartWorkYear;
    trObj.appendChild(startWorkYearTdObj);

    let departmentNameTdObj = document.createElement("td");
    departmentNameTdObj.innerText = x.DepartmentName;
    trObj.appendChild(departmentNameTdObj);

    if (x.Manager != null) {
      let managerTdObj = document.createElement("td");
      managerTdObj.innerText = `Manager of ${x.Manager}`;
      trObj.appendChild(managerTdObj);
    } else {
      let managerTdObj = document.createElement("td");
      managerTdObj.innerText = "Not a manager";
      managerTdObj.className = "notmanager";
      trObj.appendChild(managerTdObj);
    }

    let shiftsTdObj = document.createElement("td");
    let shiftsList = document.createElement("ul");
    
    if (x.Shifts.length > 0) {
      x.Shifts.forEach((j) => {
        let shiftsItem = document.createElement("li");
        shiftsItem.innerText =  `${j.Date.slice(0, 10)} / ${j.StartTime}am-${j.EndTime}pm   `;
        shiftsList.appendChild(shiftsItem);
      });
      shiftsTdObj.appendChild(shiftsList);
      trObj.appendChild(shiftsTdObj);
    } else {
      shiftsList.innerText = "No Shifts";
      shiftsList.className = "noshifts";
      shiftsTdObj.appendChild(shiftsList);
      trObj.appendChild(shiftsTdObj);
    }

    let buttonsTdObj = document.createElement("td");
    buttonsTdObj.className = "btntd"
    let editLabel = document.createElement("label")
    editLabel.htmlFor = "editbutton"
    let editIcon = document.createElement("img")
    editIcon.src = "/images/014-draft.svg"
    editIcon.width = "25";
    editLabel.appendChild(editIcon);
    editLabel.onclick = () => {
      editEmployeeRedirect(x.ID);
    };
    let editBtn = document.createElement("input");
    editBtn.type = "button";
    editBtn.value = "Edit Employee";
    editBtn.id = "editbutton"
    let deleteLabel = document.createElement("label")
    deleteLabel.htmlFor = "deletebutton"
    let deleteIcon = document.createElement("img")
    deleteIcon.src = "/images/012-delete-red.svg"
    deleteIcon.width = "25";
    deleteLabel.appendChild(deleteIcon);
    deleteLabel.onclick = () => {
      let approvBox = document.querySelector(".approvebackground");
      approvBox.style.display = "block";
      deleteEmployeeRedirect(x.ID);
    };
    let deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "Delete Employee";
    deleteBtn.id = "deletebutton"
    let shiftLabel = document.createElement("label")
    shiftLabel.htmlFor = "shiftbutton"
    let shiftIcon = document.createElement("img")
    shiftIcon.src = "/images/002-add.svg"
    shiftIcon.width = "25";
    shiftLabel.appendChild(shiftIcon);
    shiftLabel.onclick = () => {
      addShiftToEmployeeRedirect(x.ID);
    };
    let addShiftBtn = document.createElement("input");
    addShiftBtn.type = "button";
    addShiftBtn.value = "Add Shift";
    addShiftBtn.id = "shiftbutton"

    buttonsTdObj.appendChild(editLabel);
    buttonsTdObj.appendChild(editBtn);
    buttonsTdObj.appendChild(deleteLabel);
    buttonsTdObj.appendChild(deleteBtn);
    buttonsTdObj.appendChild(shiftLabel);
    buttonsTdObj.appendChild(addShiftBtn);
    trObj.appendChild(buttonsTdObj);

    tblObj.appendChild(trObj);
  });
});

function editEmployeeRedirect(employeeID) {
  window.location.href = "/html/EditEmployee.html?employeeid=" + employeeID;
}

async function deleteEmployeeRedirect(employeeID) {
  let approvBox = document.querySelector(".approvebackground");
  let deleteBtn = document.querySelector(".delete");
  deleteBtn.onclick = async () => {
    updateAction(userID, todayDate);
    let fetchParams = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    let respDep = await fetch(
      "https://localhost:44319/api/employeeDepartment/" + employeeID,
      fetchParams
    );
    window.location.href = "employees.html";
  };
  let cancelBtn = document.querySelector(".cancel");
  cancelBtn.onclick = () => {
    approvBox.style.display = "none";
  };
}

async function addShiftToEmployeeRedirect(employeeID) {
  window.location.href = "/html/AddShiftToEmployee.html?employeeid=" + employeeID;
}

let searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", () => {
  let searchQuery = document.getElementById("searchQuery");
  window.location.href = "/html/searchresults.html?search=" + searchQuery.value;
});

let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
});
