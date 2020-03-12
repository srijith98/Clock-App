// INstantiate Storage
const ls = new Storage();

// Page load event listeners
document.addEventListener('DOMContentLoaded', getTime);

document.addEventListener('DOMContentLoaded', getStoredAlarms);

// Search btn event listener
document.querySelector('.card').addEventListener('click', searchLocationClicked);

// Search div event listener
document.querySelector('.card').addEventListener('click', searchLocationTime);

// Back btn event listener
document.querySelector('.card').addEventListener('click', backBtnClicked);

// Alarm btn event listener
document.querySelector('.btn-alarm').addEventListener('click', alarmBtnClicked);

// Add alarm event listener
document.querySelector('.card').addEventListener('click', saveAlarmBtnClicked);

// Clock btn event listener
document.querySelector('.btn-clock').addEventListener('click', clockBtnClicked);

// Stopwatch btn event listener
document.querySelector('.btn-stopwatch').addEventListener('click', stopwatchBtnClicked);

// Timer btn event listener
document.querySelector('.btn-timer').addEventListener('click', timerBtnClicked);

// Stopwatch start btn event listener
document.querySelector('.card').addEventListener('click', startStopwatchClicked);

// Alarm dismiss btn event listener
document.querySelector('.dismiss').addEventListener('click', dismissAlarmClicked);

// Alarm on-off btn event listener
document.querySelector('.card').addEventListener('click', alarmOnOffClicked);

// Snooze btn event listener
document.querySelector('.snooze').addEventListener('click', snoozeClicked);

// Timer start btn event listener
document.querySelector('.card').addEventListener('click', startTimerClicked);

// Timer keydown event listener
document.querySelector('.card').addEventListener('keyup', setTimerFields);

// Global timeout key
let timeKey;

function getTime() {
    // Get current time
    let currentTime = time.getCurrentTime();
    // Set current time in ui
    ui.setTime(currentTime.currentHour, currentTime.currentMinutes);
    const date = time.getCurrentDate();
    // Set current date in ui
    ui.setDate(date.day, date.currentDate, date.month);
    // Get time every second
    timeKey = setTimeout(getTime, 1000);

    
}

function searchLocationClicked(e) {
    
    if(e.target.id === 'search-btn') {
        // Show input field
        ui.showLocationDiv();
    }

    e.preventDefault();
}

let locationKey;
function searchLocationTime(e) {
    if(e.target.id === 'search-submit-btn' || e.target.id === 'search-icon') {
        clearInterval(locationKey);
        // Get location input
        const location = ui.getLocation();
        if(location) {
            // Get timezone data from api
            time.getTimeZoneData(location)
                .then(data => {
                    if(data.time) {
                        ui.showTimeZoneData(data, false);
                        locationKey = setInterval(() => {
                            ui.showTimeZoneData(data, true);
                        }, 60000)
                    }
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
        clearInterval(locationKey);
        ui.closeSearch();
    }
}

function alarmBtnClicked(e) {
    clearTimeout(timeKey);
    ui.getAlarmState();
    // Get stored alarms
    const storedAlarms = ls.getAlarms();
    storedAlarms.forEach((alarm) => {
        ui.showAlarm(alarm.time, alarm.index, alarm.state);
    });
    e.preventDefault();
}

let alarms = [];
let index = 0;
function saveAlarmBtnClicked(e) {
    if(e.target.id === "save-alarm") {
        
        const alarmTime = document.querySelector('#alarm-time').value;
        alarms[index] = new Alarm(alarmTime, 'ON');
        ls.storeAlarm({time: alarmTime, state: 'ON', index: index});
        document.getElementById('alarm-time').value='';
        $('#alarmModal').modal('hide');
        ui.showAlarm(alarmTime, index, 'ON');
        alarms[index].setAlarm();
        index++;
    }
}

function getStoredAlarms() {
    // Get stored alarms
    const storedAlarms = ls.getAlarms();
    // console.log(storedAlarms);
    storedAlarms.forEach((alarm) => {
        index=alarm.index;
        // console.log(index);
        alarms[index] = new Alarm(alarm.time);
        // console.log(alarm.index);
        if(alarm.state === 'ON') {
            alarms[alarm.index].setAlarm();
        }
    });
}

function dismissAlarmClicked() {
    const date = new Date();
    const timeArr = date.toString().match(/\d\d:\d\d/);
    if(document.getElementById(timeArr[0])) {
        document.getElementById(timeArr[0]).firstElementChild.children[2].textContent = 'OFF';
        document.getElementById(timeArr[0]).firstElementChild.children[2].className = 'btn btn-outline-success btn-sm mr-3 btn-off';
        const id = parseInt(document.getElementById(timeArr[0]).dataset.id);
        alarms[id].changeState('OFF');
        ls.changeState('OFF', id);
    }
    
}

function alarmOnOffClicked(e) {
    let id;
    if(e.target.classList.contains('btn-on')) {
        id = e.target.parentElement.parentElement.dataset.id;
        e.target.className = 'btn btn-outline-success btn-sm mr-3 btn-off';
        e.target.textContent = 'OFF';
        alarms[id].changeState('OFF');
        ls.changeState('OFF', id);
    } else if(e.target.classList.contains('btn-off')) {
        id = e.target.parentElement.parentElement.dataset.id;
        e.target.className = 'btn btn-success btn-sm mr-3 btn-on';
        e.target.textContent = 'ON';
        alarms[id].changeState('ON');
    } else if(e.target.classList.contains('delete-alarm')) {
        id = e.target.parentElement.parentElement.dataset.id;
        ls.removeAlarm(id);
        e.target.parentElement.parentElement.remove();
    }
}

function snoozeClicked(e) {
    ui.clearAlarm();
    const date = new Date();
    let hours = date.getHours(), minutes = date.getMinutes();
    minutes += 10;
    if(minutes > 59) {
        hours++;
        minutes-=60;
    }
    
    let alarmFullDate = time.setAlarm(`${hours}:${minutes}`);
    alarmKey = setInterval(()=> {
        ui.ringAlarm(alarmFullDate, alarmKey);
    }, 1000);


    e.preventDefault();
}


function clockBtnClicked(e) {
    // window.location.reload();
    ui.getClockState();
    getTime();

    e.preventDefault();
}



function stopwatchBtnClicked(e) {
    clearTimeout(timeKey);
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
        }, 10);
    } else if(e.target.classList.contains('pause-stopwatch-btn') || e.target.parentElement.classList.contains('pause-stopwatch-btn')) {
        clearInterval(intervalKey);
        ui.showPlayBtn();
    } else if(e.target.classList.contains('reset-stopwatch-btn')) {

        clearInterval(intervalKey);
        ui.getStopwatchState();
        hh=0;mm=0;ss=0;cs=0;
    }

    e.preventDefault();
}

let hh=0, mm=0, ss=0, cs=0;
function startStopwatch() {
    
    if(cs!=99) {
        cs++;
    } else if(cs === 99 && ss!=59) {
        cs=0;
        ss++;
    }else if(cs === 99 && ss === 59 && mm!==59) {
        mm++;
        cs=0;
        ss=0;
    } else {
        hh++;
        ss=0;
        mm=0;
        cs=0;
    }
    ui.setStopwatch(hh, mm, ss, cs);
}


function timerBtnClicked(e) {
    clearTimeout(timeKey);
    ui.getTimerState();

    e.preventDefault();
}

function setTimerFields(e) {
    let val;
    if(e.target.id === 'timer-seconds') {
        val = document.getElementById('timer-seconds').value;
        if(val.length == 2) {
            document.getElementById('timer-minutes').disabled = false;
            document.getElementById('timer-minutes').focus();
        }
    } else if(e.target.id === 'timer-minutes') {
        val = document.getElementById('timer-minutes').value;
        if(val.length == 2) {
            document.getElementById('timer-hours').disabled = false;
            document.getElementById('timer-hours').focus();
        }
    }
}


function startTimerClicked(e) {
    if(e.target.classList.contains('start-timer-btn') || e.target.parentElement.classList.contains('start-timer-btn')) {
        let time; 
        if(document.querySelector('.timer-btns').childElementCount === 1) {
            time = ui.getTimerInput();
        } else {
            time = ui.getPauseTimerInput();
        }
        if(time) {
            let hh = time.hours, mm = time.minutes, ss = time.seconds;
            ui.getStartTimerState(hh, mm, ss);
            setTimeout(()=> {
                startTimer(hh, mm, ss);
            }, 1000);
        }
    } else if(e.target.classList.contains('pause-timer-btn') || e.target.parentElement.classList.contains('pause-timer-btn')) {
        pauseTimer();
        ui.getPauseTimerState();

    } else if(e.target.classList.contains('reset-timer-btn')) {
        pauseTimer();
        ui.getTimerState();
    }

    e.preventDefault();
}

let timerKey;
function startTimer(hh, mm, ss) {
    
    if(ss != 0) {
        ss--;
    } else if(ss == 0 && mm != 0) {
        mm--;
        ss=59;
    } else if(ss == 0 && mm == 0 && hh != 0) {
        hh--;
        mm=59;
        ss=59;
    } else if(ss == 0 && mm == 0 && hh == 0) {
        clearTimeout(timerKey);
        return;
    }
    ui.setTimer(hh, mm, ss);
    timerKey = setTimeout(()=> {
        startTimer(hh, mm, ss);
    }, 1000);
}

function pauseTimer() {
    clearTimeout(timerKey);
}