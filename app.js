// Instantiate UI
const ui = new UI();

// Instantiate Time
const time = new Time();

// Page load event listener
document.addEventListener('DOMContentLoaded', getTime);

// Search btn event listener
document.querySelector('#search-btn').addEventListener('click', searchLocationClicked);

// Search div event listener
document.querySelector('.search-div').addEventListener('click', searchLocationTime);

// Back btn event listener
document.querySelector('.results-div').addEventListener('click', backBtnClicked);

// Alarm btn event listener
document.querySelector('.btn-alarm').addEventListener('click', alarmBtnClicked);

// Add alarm event listener
document.querySelector('.card').addEventListener('click', saveAlarmBtnClicked);

// Clock btn event listener
document.querySelector('.btn-clock').addEventListener('click', clockBtnClicked);

// Stopwatch btn event listener
document.querySelector('.btn-stopwatch').addEventListener('click', stopwatchBtnClicked);

// Stopwatch start btn event listener
document.querySelector('.card').addEventListener('click', startStopwatchClicked);

// Alarm dismiss btn event listener
document.querySelector('.dismiss').addEventListener('click', dismissAlarmClicked);

// Alarm on-off btn event listener
document.querySelector('.card').addEventListener('click', alarmOnOffClicked);


function getTime() {
    // Get current time
    let currentTime = time.getCurrentTime();
    // Set current time in ui
    ui.setTime(currentTime.currentHour, currentTime.currentMinutes);
    const date = time.getCurrentDate();
    // Set current date in ui
    ui.setDate(date.day, date.currentDate, date.month);
    // Get time every second
    setTimeout(getTime, 1000);
}

function searchLocationClicked(e) {
    // Show input field
    ui.showLocationDiv();

    e.preventDefault();
}

function searchLocationTime(e) {
    if(e.target.id === 'search-submit-btn' || e.target.id === 'search-icon') {
        // Get location input
        const location = ui.getLocation();
        if(location) {
            // Get timezone data from api
            time.getTimeZoneData(location)
                .then(data => {
                    if(data.time)
                        ui.showTimeZoneData(data);
                    else
                        ui.showAlert('Zone not found', 'alert alert-warning');
                })
                .catch(err => console.log(err));
            
        }
        e.preventDefault();
    }
}

function backBtnClicked(e) {
    if(e.target.parentElement.classList.contains('close-search') || e.target.classList.contains('close-search')) {
        ui.closeSearch();
    }
}

function alarmBtnClicked(e) {
    ui.getAlarmState();

    e.preventDefault();
}

let alarmKey;
function saveAlarmBtnClicked(e) {
    if(e.target.id === "save-alarm") {
        const alarmTime = document.querySelector('#alarm-time').value;
        $('#alarmModal').modal('hide');
        ui.showAlarm(alarmTime);
        alarmFullDate = time.setAlarm(alarmTime);
        alarmKey = setInterval(()=> {
            ui.ringAlarm(alarmFullDate, alarmKey);
        }, 1000);
    }
}

function dismissAlarmClicked() {
    const date = new Date();
    const timeArr = date.toString().match(/\d\d:\d\d/);
    if(document.getElementById(timeArr[0])) {
        document.getElementById(timeArr[0]).firstElementChild.children[1].textContent = 'OFF';
        document.getElementById(timeArr[0]).firstElementChild.children[1].className = 'btn btn-outline-success btn-sm mr-3 btn-off';
    }
}

function alarmOnOffClicked(e) {
    if(e.target.classList.contains('btn-on')) {
        console.log('OFF')
        e.target.className = 'btn btn-outline-success btn-sm mr-3 btn-off';
        e.target.textContent = 'OFF';
        clearInterval(alarmKey);
    } else if(e.target.classList.contains('btn-off')) {
        console.log('ON')
        e.target.className = 'btn btn-success btn-sm mr-3 btn-on';
        e.target.textContent = 'ON';
    }
}



function clockBtnClicked(e) {
    window.location.reload();

    e.preventDefault();
}

function stopwatchBtnClicked(e) {
    // Show stop watch state
    ui.getStopwatchState();

    e.preventDefault();
}

// stores setinterval key id globally
let intervalKey;


function startStopwatchClicked(e) {
    if(e.target.classList.contains('start-stopwatch-btn') || e.target.parentElement.classList.contains('start-stopwatch-btn')) {
        ui.getStartStopwatchState();
        startStopwatch();
        intervalKey = setInterval(()=> {
            startStopwatch();
        }, 1000);
    } else if(e.target.classList.contains('pause-stopwatch-btn') || e.target.parentElement.classList.contains('pause-stopwatch-btn')) {
        clearInterval(intervalKey);
        ui.showPlayBtn();
    } else if(e.target.classList.contains('reset-stopwatch-btn')) {

        clearInterval(intervalKey);
        ui.getStopwatchState();
        hh=0;mm=0;ss=0;
    }

    e.preventDefault();
}

let hh=0, mm=0, ss=0;
function startStopwatch() {
    
    if(ss !== 59) {
        ss++;
    } else if(mm!==59 && ss===59) {
        mm++;
        ss=0;
    } else {
        hh++;
        ss=0;
        mm=0;
    }
    ui.setStopwatch(hh, mm, ss);
}

