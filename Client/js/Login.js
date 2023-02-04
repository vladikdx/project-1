async function checkUserCredit(userID, todayDate, dataUser) {
  if (dataUser.ActionDataLimit.toString().slice(0, 10) != todayDate) {
    let objUser = { NumOfActions: 0, ActionDataLimit: todayDate };
    let fetchParamsUser = {
      method: "PUT",
      body: JSON.stringify(objUser),
      headers: { "Content-Type": "application/json" },
    };
    let updateUser = await fetch("https://localhost:44319/api/user/" + userID, fetchParamsUser);
    return false;
  } else if (dataUser.NumOfActions >= dataUser.MaxOfAction) {
    return true;
  } else {
    return false;
  }
}

let result;
let userStatus = false;
let loginBtn = document.getElementById("login");

loginBtn.addEventListener("click", async () => {
  let username = document.getElementById("user").value;
  let password = document.getElementById("pass").value;
  let resp = await fetch("https://localhost:44319/api/user");
  let data = await resp.json();

  data.forEach(async (x) => {
    if (x.UserName == username && x.Password == password) {
      userStatus = true;
      sessionStorage["username"] = x.FullName;
      sessionStorage["userID"] = x.ID;
      let userID = sessionStorage["userID"];
      let todayDate = new Date().toISOString().slice(0, 10);
      sessionStorage["todayDate"] = todayDate;
      let respUser = await fetch("https://localhost:44319/api/user/" + userID);
      let dataUser = await respUser.json();
      result = await checkUserCredit(userID, todayDate, dataUser);

      if (result == false) {
        let message = document.querySelector(".message");
        message.className = "message succses";
        message.style.display = "block";
        message.innerText = `Welcome ${sessionStorage["username"]}, You have logged in successfully`;
        setInterval(() => {
          window.location.href = "/html/homepage.html";
        }, 1500);
      }
    }
  });
  errorMsg(true);
});

function errorMsg(status) {
  let message = document.querySelector(".message");
  if (userStatus == false) {
    message.style.display = "block";
    message.innerText = "Sorry, account not exist try again.";
  } else if (status == true) {
    message.style.display = "block";
    message.innerText = "You are out of actions, try again tomorrow";
  }
}
