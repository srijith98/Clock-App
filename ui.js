class UI {
    constructor() {
        this.container = document.querySelector('.container-card');
        this.card = document.querySelector('.time-card');
        this.navBtns = document.querySelector('.nav-btns');
        this.clockBtn = document.querySelector('.btn-clock');
        this.alarmBtn = document.querySelector('.btn-alarm');
        this.timerBtn = document.querySelector('.btn-timer');
        this.stopwatchBtn = document.querySelector('.btn-stopwatch');
        this.alarmKey;
    }

    getClockState() {
        this.clockBtn.className = 'btn btn-success btn-clock active';
        this.alarmBtn.className = 'btn btn-success btn-alarm';
        this.timerBtn.className = 'btn btn-success btn-timer';
        this.stopwatchBtn.className = 'btn btn-success btn-stopwatch';

        this.card.innerHTML = `
        <p id="time" class="text-center mb-0" style="font-size: 75px;">04:30 <span style="font-size: 30px;">PM</span></p>
        <p id="date" class="text-center text-secondary" style="font-size: 30px;">Tue, 3 March</p>
        <br>
        <button class="btn btn-success btn-lg w-75 mx-auto" id="search-btn"><i class="fas fa-globe pr-1"></i>Search any City</button>
        <div class="search-div"></div>
        <div class="results-div"></div>
        `;
    }

    // Set current time in UI
    setTime(hour, minutes) {
        let meridiem = 'AM';
        if(hour > 12 && hour < 24) {
            hour-=12;
            meridiem = 'PM';
        } else if(hour == 12) {
            meridiem = 'PM';
        } else if(hour == 24 || hour == 0) {
            hour = 12;
            meridiem = 'AM';
        }
        hour = '0'+hour; minutes = '0'+minutes;
        document.querySelector('#time').innerHTML = `${hour.slice(-2)} : ${minutes.slice(-2)} <span style="font-size: 30px;">${meridiem}</span>`;
        
    }

    setDate(day, date, month) {
        document.querySelector('#date').textContent = `${day}, ${date} ${month}`;
    }

    showLocationDiv() {
        document.querySelector('#search-btn').style.display = "none";
        document.querySelector('.search-div').innerHTML = `
            <div class="input-group mx-auto">
                    <input type="text" class="form-control location-input" placeholder="Enter any city..">
                    <div class="input-group-prepend">
                    <button class="input-group-text" id="search-submit-btn"><i class="fas fa-search" id="search-icon"></i></button>
                </div>
            </div>`;
    }

    showAlert(message, classes) {
        this.clearAlert();
        const alertDiv = document.createElement('div');
        alertDiv.className = classes;
        alertDiv.textContent = message;
        this.container.insertBefore(alertDiv, this.card);
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }

    strip(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    clearAlert() {
        const alertDiv = document.querySelector('.alert');
        if(alertDiv) {
            alertDiv.remove();
        }
    }

    getLocation() {
        const location = document.querySelector('.location-input').value;
        this.clearSearch();
        if(location !== '') {
            return location;
            
        } else {
            this.showAlert('Please enter a zone', 'alert alert-warning');
        }

    }

    clearSearch() {
        document.querySelector('.location-input').value = '';
    }

    showTimeZoneData(data, repeat) {
        console.log('showing');
        const time = data.time;
        const country = data.country;
        const city = data.city;
        const timeArr = time.split(':');
        let hours = timeArr[0], minutes = timeArr[1];
        if(repeat) {
            console.log('repeat');
            minutes++;
            if(minutes > 59) {
                hours++;
                minutes='00';
            }
        }
        let meridiem = 'AM';
        if(hours > 12 && hours < 24) {
            hours-=12;
            meridiem = 'PM';
        } else if(hours == 12) {
            meridiem = 'PM';
        } else if(hours == 24 || hours == 0) {
            hours = 12;
            meridiem = 'AM';
        }

        // Show results
        document.querySelector('.results-div').innerHTML = `
            <div class="bg-dark mt-3 p-2 text-center">
                <h3 id="time" class="text-center mt-3">${hours} : ${minutes} ${meridiem}</h3>
                <h5 id="date" class="text-center text-secondary">${city}, ${country}</h5>
                <button class="text-center close-search btn btn-success mt-2" style="border-radius: 50%"><i class="fas fa-angle-up"></i></button>
            </div>
        `;
        this.clearSearch();
    }

    closeSearch() {
        document.querySelector('.search-div').innerHTML = '';
        document.querySelector('.results-div').innerHTML = '';
        document.querySelector('#search-btn').style.display = "block";
    }

    getAlarmState() {
        this.clockBtn.className = 'btn btn-success btn-clock';
        this.alarmBtn.className = 'btn btn-success btn-alarm active';
        this.timerBtn.className = 'btn btn-success btn-timer';
        this.stopwatchBtn.className = 'btn btn-success btn-stopwatch';

        this.card.innerHTML = `
            <p class="mx-auto" style="font-size: 75px;">Alarm</p>
            <button class="btn btn-success w-75 mx-auto mt-3 btn-add-alarm" data-toggle="modal" data-target="#alarmModal"><i class="fas fa-plus pr-1"></i>Set new alarm</button>
            <div class="alarms-div"></div>
            <div class="modal fade" id="alarmModal" tabindex="-1" role="dialog" aria-labelledby="alarmModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="alarmModalTitle">Set alarm time</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="time" class="form-control" id="alarm-time">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-success" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="save-alarm">Set alarm</button>
                </div>
                </div>
            </div>
            </div>
        `;

    }

    showAlarm(time, index, state) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        let meridiem = 'AM';
        if(hours > 12 && hours < 24) {
            hours-=12;
            meridiem = 'PM';
        } else if(hours == 12) {
            meridiem = 'PM';
        } else if(hours == 24 || hours == 0) {
            hours = 12;
            meridiem = 'AM';
        }
        hours='0'+hours;minutes='0'+minutes;
        let alarmDiv;
        if(state === 'ON') {
        alarmDiv = `
            <div class="bg-dark mt-3 p-2 text-center" id=${time} data-id = ${index}>
                <div class = "row">
                    <h3 class="col">${hours.slice(-2)} : ${minutes.slice(-2)} ${meridiem}</h3>
                    <a class="btn btn-warning delete-alarm mr-1"><i class="far fa-trash-alt"></i></a>
                    <button class="btn btn-success btn-sm mr-3 btn-on">${state}</button>
                </div>
            </div>
        `;
        } else {
            alarmDiv = `
            <div class="bg-dark mt-3 p-2 text-center" id=${time} data-id = ${index}>
                <div class = "row">
                    <h3 class="col">${hours.slice(-2)} : ${minutes.slice(-2)} ${meridiem}</h3>
                    <a class="btn btn-warning delete-alarm mr-1"><i class="far fa-trash-alt"></i></a>
                    <button class="btn btn-outline-success btn-sm mr-3 btn-off">${state}</button>
                </div>
            </div>
        `;
        }
        document.querySelector('.alarms-div').innerHTML += alarmDiv;
    }


    // Ring the alarm
    ringAlarm(time, key) {
        const today = new Date();
        if(time.toString() === today.toString()) {
            clearInterval(key);
            const alarmRingTone = document.getElementById('alarm-clock');
            alarmRingTone.loop = true;
            alarmRingTone.play();
            $('#alarmRingModal').modal({backdrop: 'static', keyboard: false});
            setTimeout(() => {
                alarmRingTone.loop = false;
                alarmRingTone.load();
                this.clearAlarm();
            }, 60000);
        }

    }

    clearAlarm() {
        
        
        $('#alarmRingModal').modal('hide');
        
        const date = new Date();
        const timeArr = date.toString().match(/\d\d:\d\d/);
        if(document.getElementById(timeArr[0])) {
            if(document.getElementById(timeArr[0]).firstElementChild.children[2].textContent === 'ON') {
                document.getElementById(timeArr[0]).firstElementChild.children[2].textContent = 'OFF';
                document.getElementById(timeArr[0]).firstElementChild.children[2].className = 'btn btn-outline-success btn-sm mr-3 btn-off';
            }
        }
    }

    getStopwatchState() {
        // Make stopwatch button active
        this.clockBtn.className = 'btn btn-success btn-clock';
        this.alarmBtn.className = 'btn btn-success btn-alarm';
        this.timerBtn.className = 'btn btn-success btn-timer';
        this.stopwatchBtn.className = 'btn btn-success btn-stopwatch active';

        this.card.innerHTML = `
            <p class="stopwatch text-center" style="font-size: 75px;">00 : 00 : 00 <span style="font-size: 30px;">00</span></h1>
            
            <div class="stopwatch-btns mx-auto">
                <button class="btn btn-success btn-lg start-stopwatch-btn"><i class="fas fa-play"></i></button>
            </div>
        `;
    }

    getStartStopwatchState() {
        document.querySelector('.stopwatch-btns').innerHTML = `
            <button class="btn btn-success pause-stopwatch-btn mr-3"><i class="fas fa-pause"></i></button>
            <button class="btn btn-outline-success reset-stopwatch-btn">Reset</i></button>
        `;
    }

    setStopwatch(hh, mm, ss, cs) {
        hh='0'+hh;mm='0'+mm;ss='0'+ss;cs='0'+cs;

        document.querySelector('.stopwatch').innerHTML = `${hh.slice(-2)} : ${mm.slice(-2)} : ${ss.slice(-2)} <span style="font-size: 30px;">${cs.slice(-2)}</span>`;
        
    }

    showPlayBtn() {
        document.querySelector('.stopwatch-btns').innerHTML = `
            <button class="btn btn-success start-stopwatch-btn mr-3"><i class="fas fa-play"></i></button>
            <button class="btn btn-outline-success reset-stopwatch-btn">Reset</i></button>
        `;
    }


    getTimerState() {
        this.clockBtn.className = 'btn btn-success btn-clock';
        this.alarmBtn.className = 'btn btn-success btn-alarm';
        this.timerBtn.className = 'btn btn-success btn-timer active';
        this.stopwatchBtn.className = 'btn btn-success btn-stopwatch';

        this.card.innerHTML = `
            <p class="mx-auto timer" style="font-size: 75px;">Timer</p>
            <div class="input-group timer-inputs">
                <input type="number" class="form-control" id="timer-hours" placeholder="Hours">
                <input type="number" class="form-control" id="timer-minutes" max="59" placeholder="Minutes">
                <input type="number" class="form-control" id="timer-seconds" max="59" placeholder="Seconds">
            </div>
            <div class="timer-btns mx-auto mt-3">
                <button class="btn btn-success btn-lg start-timer-btn"><i class="fas fa-play"></i></button>
            </div>
        `;

        document.getElementById('timer-seconds').focus();
        document.getElementById('timer-minutes').disabled = true;
        document.getElementById('timer-hours').disabled = true;
    }

    getTimerInput() {
        let hours = document.querySelector('#timer-hours').value;
        let minutes = document.querySelector('#timer-minutes').value;
        let seconds = document.querySelector('#timer-seconds').value;

        if(seconds >= 60) {
            minutes++;
            seconds-=60;
        }
        if(minutes >= 60) {
            hours++;
            minutes-=60;
        }
        if(hours > 99) {
            this.showAlert('Timer limit exceeded', 'alert alert-warning')
            this.getTimerState();
            return;
        }
        return {hours, minutes, seconds};
    }


    getStartTimerState(hh, mm, ss) {
        hh='00'+hh;mm='00'+mm;ss='00'+ss;
        if(document.querySelector('.timer-inputs')) {
            document.querySelector('.timer-inputs').remove();
        }
        document.querySelector('.timer').textContent = `${hh.slice(-2)} : ${mm.slice(-2)} : ${ss.slice(-2)}`;
        
        document.querySelector('.timer-btns').innerHTML = `
            <button class="btn btn-success pause-timer-btn mr-3"><i class="fas fa-pause"></i></button>
            <button class="btn btn-outline-success reset-timer-btn">Reset</i></button>
        `;
    }

    setTimer(hh, mm, ss) {
        hh='00'+hh;mm='00'+mm;ss='00'+ss;
        document.querySelector('.timer').textContent = `${hh.slice(-2)} : ${mm.slice(-2)} : ${ss.slice(-2)}`;
    }

    getPauseTimerState() {
        document.querySelector('.timer-btns').innerHTML = `
            <button class="btn btn-success start-timer-btn mr-3"><i class="fas fa-play"></i></button>
            <button class="btn btn-outline-success reset-timer-btn">Reset</i></button>
        `;
    }

    getPauseTimerInput() {
        const pauseTime = document.querySelector('.timer').textContent;
        const timeArr = pauseTime.split(':')
        timeArr.forEach((timeVal, index) => {
            timeArr[index]= this.strip(timeVal);
        });

        return {
            hours : timeArr[0],
            minutes : timeArr[1],
            seconds : timeArr[2]
        }
    }

}