"use strict";

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("init");

  // TODO: Load JSON, create clones, build list, add event listeners, show modal, find images, and other stuff ...

}
"use strict";
document.addEventListener("DOMContentLoaded", init);
const Student = {
  fullname: "-student fullname-",
  firstname: "-student firstname-",
  lastname: "-student lastname-",
  imagename: "-student imagename-",
  house: "-student house-",
  expelled: "-student expelled-",
  bloodstatus: "-student bloodstatus-",
  inquisitorialsquad: "-student inquisitorialsquad-",
  setJSONdata(studentData) {
    this.fullname = studentData.fullname;
    const parts = studentData.fullname.split(" ");
    this.firstname = parts[0];
    this.lastname = parts[parts.length - 1];
    this.house = studentData.house;
    const lastNameLower = parts[parts.length - 1].toLowerCase();
    const firstLetterLower = parts[0].substring(0, 1).toLowerCase();
    this.imagename = `images/${lastNameLower}_${firstLetterLower}.png`;
  }
};
const studentlist = [];
let expelledList = [];
const destination = document.querySelector("#dest");
let houseFilter = "all";
let sortFilter = "";
let houseColor;
let bloodList;
function init() {
  console.log("init");
  document.querySelector("#grid").addEventListener("click", clickPage);
  destination.addEventListener("click", clickList);
  getJSON();
}
async function getJSON() {
  console.log("getJSON");
  const dataJson = await fetch(
    "https://petlatkea.dk/2019/hogwarts/students.json"
  );
  const myJSON = await dataJson.json();
  const moreJson = await fetch(
    "https://petlatkea.dk/2019/hogwarts/families.json"
  );
  bloodList = await moreJson.json();
  console.log(bloodList);
  prepareObjects(myJSON);
}
function prepareObjects(myJSON) {
  console.log("prepareObjects");
  myJSON.forEach(studentData => {
    const newStudent = Object.create(Student);
    newStudent.setJSONdata(studentData);
    studentlist.push(newStudent);
  });
  studentlist.forEach(student => {
    student.id = uuidv4();
  });
  console.log(studentlist);
  // countStudents();
  checkNames();
}
function checkNames() {
  console.log("checkNames");
  studentlist.forEach(student => {
    bloodList.half.forEach(name => {
      if (name === student.lastname) {
        student.bloodstatus = "half-blood";
        console.log("der sker noget");
      }
    });
    bloodList.pure.forEach(name => {
      if (
        name === student.lastname &&
        student.bloodstatus === "-student bloodstatus-"
      ) {
        student.bloodstatus = "pure-blood";
        console.log("der sker noget igen");
      }
    });
    if (student.bloodstatus === "-student bloodstatus-") {
      student.bloodstatus = "muggle-blood";
      console.log("der er mugglere på hogwarts");
    }
  });
  countStudents();
}
function countStudents() {
  console.log("countStudents");
  // update counters
  const counts = {
    Gryffindor: 0,
    Slytherin: 0,
    Hufflepuff: 0,
    Ravenclaw: 0
  };
  studentlist.forEach(student => {
    counts[student.house]++;
  });
  document.querySelector(".hufflepuff_amount").innerHTML =
    counts.Hufflepuff + " Hufflepuff-students";
  document.querySelector(".gryffindor_amount").innerHTML =
    counts.Gryffindor + " Gryffindor-students";
  document.querySelector(".slytherin_amount").innerHTML =
    counts.Slytherin + " Slytherin-students";
  document.querySelector(".ravenclaw_amount").innerHTML =
    counts.Ravenclaw + " Ravenclaw-students";
  document.querySelector(".expelled_amount").innerHTML =
    expelledList.length + " Expelled students";
  document.querySelector(".total_amount").innerHTML =
    studentlist.length + " Students";
  filterList(houseFilter);
}
function clickPage(event) {
  console.log("clickPage");
  const action = event.target.dataset.action;
  console.log(action);
  if (
    action === "firstname" ||
    action === "lastname" ||
    action === "house"
  ) {
    event.preventDefault();
    sortFilter = action;
    filterList(houseFilter);
  }
  if (
    action === "all" ||
    action === "Gryffindor" ||
    action === "Ravenclaw" ||
    action === "Hufflepuff" ||
    action === "Slytherin"
  ) {
    event.preventDefault();
    houseFilter = action;
    filterList(houseFilter);
  }
  if (
    action === "add_inquisitorial" ||
    action === "remove_inquisitorial"
  ) {
    event.preventDefault();
    clickedInquisitorial(event, action);
  }
  if (action === "close_modal") {
    event.preventDefault();
    hideModal();
  }
  if (action === "close_denied_box") {
    event.preventDefault();
    hideModal();
    hideDenied();
  }
}
function clickList(event) {
  console.log("clickList");
  const action = event.target.dataset.action;
  if (action === "expell") {
    event.preventDefault();
    clickRemove(event);
  }
}
function clickRemove(event) {
  console.log("clickRemove");
  const uniqueId = event.target.dataset.id;
  const studentIndex = studentlist.findIndex(obj => obj.id === uniqueId);
  const clickedStudent = studentlist.find(obj => obj.id === uniqueId);
  expelledList.push(clickedStudent);
  // TODO: Splice that element from the array
  studentlist.splice(studentIndex, 1);
  // Re-display the list
  countStudents();
}
function filterList(houseFilter) {
  console.log("filterList");
  if (houseFilter === "all") {
    sortList(sortFilter, studentlist);
  } else {
    const filtered = filterByHouse(houseFilter, studentlist);
    sortList(sortFilter, filtered);
  }
}
function filterByHouse(house, list) {
  console.log("filterByHouse");
  function filterHouse(student) {
    return student.house === house;
  }
  return list.filter(filterHouse);
}
function sortList(sortFilter, list) {
  console.log("sortList");
  let sorted;
  if (sortFilter === "") {
    sorted = list;
  }
  if (sortFilter === "firstname") {
    sorted = list.sort(firstnameSort);
  }
  if (sortFilter === "lastname") {
    sorted = list.sort(lastnameSort);
  }
  if (sortFilter === "house") {
    sorted = list.sort(houseSort);
  }
  displayStudentlist(sorted);
}
function firstnameSort(a, b) {
  if (a.firstname < b.firstname) {
    return -1;
  } else {
    return 1;
  }
}
function lastnameSort(a, b) {
  if (a.lastname < b.lastname) {
    return -1;
  } else {
    return 1;
  }
}
function houseSort(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}
function displayStudentlist(list) {
  console.log("displayStudentlist");
  destination.innerHTML = "";
  list.forEach(displayStudent, list);
  console.log(list);
}
function displayStudent(student, list) {
  const clone = document.querySelector(".temp").cloneNode(true).content;
  clone.querySelector(".data-firstname").textContent = student.firstname;
  clone.querySelector(".data-lastname").textContent = student.lastname;
  clone.querySelector("h2").addEventListener("click", () => {
    showModal(student);
  });
  clone.querySelector(".data-house").textContent = student.house;
  clone.querySelector(".expell_button").dataset.id = student.id;
  destination.appendChild(clone);
}
function showModal(studenten) {
  console.log("showModal");
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".close");
  document.querySelector(".inquisitorial_button").style.backgroundColor =
    "white";
  document.querySelector(".inquisitorial_button").innerHTML =
    "Add to inquisitorial squad!";
  document.querySelector(".inquisitorial_button").dataset.action =
    "add_inquisitorial";
  modal.classList.add("show");
  document.querySelector("body").classList.add("modal_open");
  houseColor = studenten.house.toLowerCase();
  document.querySelector(".modal_content").classList.add(houseColor);
  modal.querySelector(".student_picture").src = studenten.imagename;
  if (studenten.firstname === "Justin") {
    console.log("det er fletchly");
    modal.querySelector(".student_picture").src =
      "images/fletchley_j.png";
  }
  if (studenten.lastname === "-unknown-") {
    modal.querySelector(".student_picture").src = "images/unknown.png";
  }
  modal.querySelector(".student_picture").alt = `Picture of ${
    studenten.fullname
    }`;
  modal.querySelector(".firstname").innerHTML =
    "Firstname: " + studenten.firstname;
  modal.querySelector(".lastname").innerHTML =
    "Lastname: " + studenten.lastname;
  modal.querySelector(".bloodstatus").innerHTML =
    "Bloodstatus: " + studenten.bloodstatus;
  modal.querySelector(".crest").src =
    "images/" + studenten.house + ".png";
  modal.querySelector(".crest").alt =
    "Picture of " + studenten.house + "s crest.";
  modal.querySelector(".inquisitorial_button").dataset.id = studenten.id;
  if (studenten.inquisitorialsquad === "Yes") {
    document.querySelector(
      ".inquisitorial_button"
    ).style.backgroundColor = "red";
    document.querySelector(".inquisitorial_button").innerHTML =
      "Remove from inquisitorial squad";
    document.querySelector(".inquisitorial_button").dataset.action =
      "remove_inquisitorial";
  }
}
function hideModal() {
  console.log("hideModal");
  document.querySelector(".modal").classList.remove("show");
  document.querySelector("body").classList.remove("modal_open");
  document.querySelector(".modal_content").classList.remove(houseColor);
}
function clickedInquisitorial(event, action) {
  const uniqueId = event.target.dataset.id;
  const clickedStudent = studentlist.find(obj => obj.id === uniqueId);
  if (action === "add_inquisitorial") {
    if (
      clickedStudent.bloodstatus === "pure-blood" ||
      clickedStudent.house === "Slytherin"
    ) {
      console.log("må gerne");
      clickedStudent.inquisitorialsquad = "Yes";
      event.target.style.backgroundColor = "red";
      event.target.innerHTML = "Remove from inquisitorial squad";
      event.target.dataset.action = "remove_inquisitorial";
      filterList(houseFilter);
    } else {
      console.log("rend og hop");
      showDenied();
    }
  }
  if (action === "remove_inquisitorial") {
    clickedStudent.inquisitorialsquad = "-student inquisitorialsquad-";
    event.target.style.backgroundColor = "white";
    event.target.innerHTML = "Add to inquisitorial squad";
    event.target.dataset.action = "add_inquisitorial";
    filterList(houseFilter);
  }
}
function showDenied() {
  console.log("showDenied");
  document.querySelector(".denied_box").classList.add("show");
}
function hideDenied() {
  console.log("hideDenied");
  document.querySelector(".denied_box").classList.remove("show");
}
// creates a unique id
// copyed from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}