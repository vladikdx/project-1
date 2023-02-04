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
  let respDep = await fetch("https://localhost:44319/api/department/");
  let dataDep = await respDep.json();
});

let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", async () => {
  let departmentName = document.getElementById("depertmentName").value;
  let departmentManager = document.getElementById("depertmentManager").value;
  updateAction(userID, todayDate);
  let obj = { Name: departmentName, Manager: departmentManager };

  let fetchParams = {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  };

  let respDep = await fetch("https://localhost:44319/api/department/", fetchParams);
  window.location.href = "/html/Departments.html";
});


let logOut = document.getElementById("logout");
logOut.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "/html/login.html";
}); 