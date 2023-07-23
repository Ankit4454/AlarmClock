window.onload = function () {
  clock();
};

//Clock face function for current(local) time
function clock() {
  let now = new Date();
  let TwentyFourHour = now.getHours();
  let hour = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  let mid = "pm";
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (min < 10) {
    min = "0" + min;
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (hour == 0) {
    hour = 12;
  }
  if (TwentyFourHour < 12) {
    mid = "am";
  }
  document.getElementById("clockFaceDiv").innerHTML =
    hour + " : " + min + " : " + sec + " " + mid;
  setTimeout(clock, 1000);
}

let alarmList = [];  //Alarm list containing all active alarms

let alarmBtn = document.getElementById("setAlarmBtn");

alarmBtn.addEventListener("keypress", function (event) {
  debugger;
  if (event.keyCode === 13) {
    setAlarm(event);
  }
});

//setAlarm function which takes user input and validates
function setAlarm(event) {
  event.preventDefault();
  let hr = document.getElementById("hour");
  let min = document.getElementById("min");
  let sec = document.getElementById("sec");
  let meridiem = document.getElementById("meridiem");

  if (validateInput(hr, min, sec)) {
    addAlarm(hr.value, min.value, sec.value, meridiem.value);
  }
}

//Basic validation
function validateInput(hr, min, sec) {
  if (hr.value == "" || min.value == "" || sec.value == "") {
    alert("Please fill all mandatory fields!");
    if (hr.value == "") {
      hr.focus();
    }
    if (min.value == "") {
      min.focus();
    }
    if (sec.value == "") {
      sec.focus();
    }
    return false;
  }
  return true;
}

function addAlarm(hr, min, sec, meridiem) {
  resetInput();
  addInList(hr, min, sec, meridiem);
  showAlarmList();
}

function resetInput() {
  document.getElementById("hour").value = "";
  document.getElementById("min").value = "";
  document.getElementById("sec").value = "";
}

//addInList function which creates date object containg user input time (hh:mm:ss) and push it to alarmList
function addInList(hr, min, sec, meridiem) {
  let currentDate = new Date();

  if (meridiem == "pm" && parseInt(hr) < 12) {
    hr = parseInt(hr) + 12;
  }

  if (meridiem == "am" && parseInt(hr) == 12) {
    hr = parseInt(hr) - 12;
  }

  min = parseInt(min);
  sec = parseInt(sec);

  let time = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDay(),
    hr,
    min,
    sec,
    currentDate.getMilliseconds()
  );
  alarmList.push(time);
}

//showAlarmList function which renders list of active alarms on screen 
function showAlarmList() {
  let listDiv = document.getElementById("alarmListDiv");
  listDiv.innerHTML = "";
  alarmList.sort();
  clearAllInterval();
  clock();
  for (let i in alarmList) {
    let hr = alarmList[i].getHours();
    let min = alarmList[i].getMinutes();
    let sec = alarmList[i].getSeconds();
    let meridiem = "am";

    if (hr > 12) {
      hr = hr - 12;
      meridiem = "pm";
    }
    if (hr == 0) {
      hr = hr + 12;
    }

    hr = padDigit(hr);
    min = padDigit(min);
    sec = padDigit(sec);
    let alarmTime = hr + ":" + min + ":" + sec + " " + meridiem;

    let newDiv = document.createElement("div");
    newDiv.className = "alarmItem";
    newDiv.innerHTML = `<div>
        ${alarmTime}
        </div>  
        <i class="fa-solid fa-trash deleteBtn" onclick="deleteAlarm('${alarmTime}');"></i>`;

    listDiv.appendChild(newDiv);
    createAlarm(alarmTime);
  }
  hoverAnimation();
}

//createAlarm function which goes of on user's input time
function createAlarm(alarmTime) {
  setInterval(function () {
    let currentDate = new Date();
    let hr = currentDate.getHours();
    let min = currentDate.getMinutes();
    let sec = currentDate.getSeconds();
    let meridiem = "am";

    if (hr > 12) {
      hr = hr - 12;
      meridiem = "pm";
    }
    if (hr == 0) {
      hr = hr + 12;
    }

    hr = padDigit(hr);
    min = padDigit(min);
    sec = padDigit(sec);
    let currentTime = hr + ":" + min + ":" + sec + " " + meridiem;

    if (alarmTime == currentTime) {
      alert(alarmTime);
    }
  }, 1000);
}

//deleteAlarm function which finds the alarm index from alarmList and splice it
function deleteAlarm(time) {
  let alarmIndex = -1;
  for (let i in alarmList) {
    let hr = alarmList[i].getHours();
    let min = alarmList[i].getMinutes();
    let sec = alarmList[i].getSeconds();
    let meridiem = "am";

    if (hr > 12) {
      hr = hr - 12;
      meridiem = "pm";
    }
    if (hr == 0) {
      hr = hr + 12;
    }

    hr = padDigit(hr);
    min = padDigit(min);
    sec = padDigit(sec);
    let str = hr + ":" + min + ":" + sec + " " + meridiem;
    if (str == time) {
      alarmIndex = i;
    }
  }

  if (alarmIndex != -1) {
    alarmList.splice(alarmIndex, 1);
    showAlarmList();
  }
}

function checkLength(obj) {
  if (obj.value.length > obj.maxLength) {
    obj.value = obj.value.slice(0, obj.maxLength);
  }
}

function checkDigit(obj) {
  if (parseInt(obj.value, 10) < 10) {
    if (obj.value.length == 1) {
      obj.value = "0" + obj.value;
    }
  }

  if (obj.id == "hour" && (obj.value < 1 || obj.value > 12)) {
    obj.value = "";
  } else if (obj.value < 0 || obj.value > 59) {
    obj.value = "";
  }
}

function padDigit(digit) {
  if (parseInt(digit, 10) < 10) {
    if (digit.toString().length == 1) {
      digit = "0" + digit;
    }
  }
  return digit;
}

//clearAllInterval function which clears all active interval before initializing new ones
function clearAllInterval() {
  for (let i = 0; i <= 99999; i++) {
    window.clearInterval(i);
  }
}

function hoverAnimation() {
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.onmouseover = function () {
      btn.classList.add("fa-bounce");
    };

    btn.onmouseout = function () {
      btn.classList.remove("fa-bounce");
    };
  });
}
