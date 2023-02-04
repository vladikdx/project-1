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
  
  async function updateAction(userID, todayDate) {
  let objUser = { NumOfActions: 1, ActionDataLimit: todayDate };
  let fetchParamsUser = {
    method: "PUT",
    body: JSON.stringify(objUser),
    headers: { "Content-Type": "application/json" },
  };

  let respUser = await fetch("https://localhost:44319/api/user/" + userID, fetchParamsUser);
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
  let resp = await fetch("https://localhost:44319/api/department");
  let data = await resp.json();
  let respEmp = await fetch("https://localhost:44319/api/employeeDepartment/");
  let dataEmp = await respEmp.json();
  let tblObj = document.getElementById("tblObj");
  let pageTitle = document.getElementById("title");
  pageTitle.innerText = `Departments (${data.length})`;

  data.forEach((x) => {
    let trObj = document.createElement("tr");
    let nameTdObj = document.createElement("td");
    let nameLink = document.createElement("a");
    nameLink.innerText = x.Name;
    nameLink.href = "/html/EditDepartment.html?departmentid=" + x.ID;
    nameTdObj.appendChild(nameLink);
    trObj.appendChild(nameTdObj);
    let managerTdObj = document.createElement("td");
    managerTdObj.innerText = `No Manager`;
    managerTdObj.className = "manager empty"
    trObj.appendChild(managerTdObj);
    let buttonsTdObj = document.createElement("td");
    buttonsTdObj.className = "btntd"
    let editLabel = document.createElement("label")
    editLabel.htmlFor = "editbutton"
    let editIcon = document.createElement("img")
    editIcon.src = "/images/014-draft.svg"
    editIcon.width = "25";
    editLabel.appendChild(editIcon);
    editLabel.onclick = () => {
      editDepartmentRedirect(x.ID);
    };
    let editBtn = document.createElement("input");
    editBtn.type = "button";
    editBtn.value = "Edit Department";
    editBtn.id = "editbutton"
    buttonsTdObj.appendChild(editLabel);
    buttonsTdObj.appendChild(editBtn);
    let isDepartmentEmpty = false;
    dataEmp.forEach((j) => {
      if (j.DepartmentID == x.ID) {
        isDepartmentEmpty = true;
      }
       if (j.ID == x.Manager) {
        managerTdObj.innerText = `${j.FirstName} ${j.LastName}`;
        managerTdObj.className = "manager";
      } 
    });
    if (isDepartmentEmpty == false) {
      let deleteLabel = document.createElement("label")
      deleteLabel.htmlFor = "deletebutton"
      let deleteIcon = document.createElement("img")
      deleteIcon.src = "/images/012-delete-red.svg"
      deleteIcon.width = "25";
      deleteLabel.appendChild(deleteIcon);
      deleteLabel.onclick = () => {
        let approvBox = document.querySelector(".approvebackground");
        approvBox.style.display = "block";
        deleteDepartment(x.ID);
      };
      let deleteBtn = document.createElement("input");
      deleteBtn.type = "button";
      deleteBtn.value = "Delete";
      deleteBtn.id = "deletebutton"
      buttonsTdObj.appendChild(deleteLabel);
      buttonsTdObj.appendChild(deleteBtn);
    } 
    trObj.appendChild(buttonsTdObj);
    tblObj.appendChild(trObj);
  });
});

function editDepartmentRedirect(departmentID) {
  window.location.href = "/html/EditDepartment.html?departmentid=" + departmentID;
}

async function deleteDepartment(departmentID) {
  let approvBox = document.querySelector(".approvebackground");
  let deleteBtn = document.querySelector(".delete");
  deleteBtn.onclick = async () => {
    updateAction(userID, todayDate);
    let fetchParams = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    let respDep = await fetch(
      "https://localhost:44319/api/department/" + departmentID,
      fetchParams
    );
    window.location.href = "Departments.html";
  };
  let cancelBtn = document.querySelector(".cancel");
  cancelBtn.onclick = () => {
    approvBox.style.display = "none";
  };
}

let addDepartment = document.getElementById("addDepartment");
addDepartment.addEventListener("click", () => {
  window.location.href = "/html/adddepartment.html";
});

let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
}); 

let searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", () => {
  let searchQuery = document.getElementById("searchQuery");
  window.location.href = "/html/searchresults.html?search=" + searchQuery.value;
});
