class UI {
    constructor() {
        this.container = document.querySelector('.container-card');
        this.card = document.querySelector('.time-card');
        this.navBtns = document.querySelector('.nav-btns');
        this.searchBtn = document.querySelector('#search-btn');
        this.time = document.querySelector('#time');
        this.date = document.querySelector('#date');
        this.searchDiv = document.querySelector('.search-div');
        this.resultsDiv = document.querySelector('.results-div');
        this.clockBtn = document.querySelector('.btn-clock');
        this.alarmBtn = document.querySelector('.btn-alarm');
        this.timerBtn = document.querySelector('.btn-timer');
        this.stopwatchBtn = document.querySelector('.btn-stopwatch');
    }

    // Set current time in UI
    setTime(hour, minutes) {
        let meridiem = 'AM';
        if(hour > 12 && hour < 24) {
            hour-=12;
            meridiem = 'PM';
        } else if(hour === 12) {
            meridiem = 'PM';
        } else if(hour === 24 || hour === 0) {
            hour = 12;
            meridiem = 'AM';
        }
        hour = '0'+hour; minutes = '0'+minutes;
            this.time.innerHTML = `${hour.slice(-2)} : ${minutes.slice(-2)} <span style="font-size: 30px;">${meridiem}</span>`;
        
    }

    setDate(day, date, month) {
        this.date.textContent = `${day}, ${date} ${month}`;
    }

    showLocationDiv() {
        this.searchBtn.style.display = "none";
        this.searchDiv.innerHTML = `
            <div class="input-group mx-auto">
                    <input type="text" class="form-control location-input" placeholder="Enter a Zone..">
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
            // try {
            //     // let [city, continent] = location.split(',');
            //     // city = this.strip(city);
            //     // continent = this.strip(continent);
            //     // return {city, continent};
            // } catch(err) {
            //     this.showAlert('Incorrect zone format (eg: Kolkata, Asia)', 'alert alert-warning')
            // }
        } else {
            this.showAlert('Please enter a zone', 'alert alert-warning');
        }

    }

    clearSearch() {
        document.querySelector('.location-input').value = '';
    }

    showTimeZoneData(data) {
        const time = data.time;
        console.log(time);
        const country = data.country;
        const city = data.city;
        const timeArr = time.split(':');
        let hours = timeArr[0], minutes = timeArr[1];
        let meridiem = 'AM';
        if(hours > 12 && hours < 24) {
            hours-=12;
            meridiem = 'PM';
        } else if(hours === 12) {
            meridiem = 'PM';
        } else if(hours === 24 || hours === 0) {
            hours = 12;
            meridiem = 'AM';
        }

        // Show results
        this.resultsDiv.innerHTML = `
            <div class="bg-dark mt-3 p-2 text-center">
                <h3 id="time" class="text-center mt-3">${hours} : ${minutes} ${meridiem}</h3>
                <h5 id="date" class="text-center text-secondary">${city}, ${country}</h5>
                <button class="text-center close-search btn btn-success mt-2" style="border-radius: 50%"><i class="fas fa-angle-up"></i></button>
            </div>
        `;
        this.clearSearch();
    }

    closeSearch() {
        this.searchDiv.innerHTML = '';
        this.resultsDiv.innerHTML = '';
        this.searchBtn.style.display = "block";
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
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="save-alarm">Set alarm</button>
                </div>
                </div>
            </div>
            </div>
        `;

    }

    showAlarm(time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        let meridiem = 'AM';
        if(hours > 12 && hours < 24) {
            hours-=12;
            meridiem = 'PM';
        } else if(hours === 12) {
            meridiem = 'PM';
        } else if(hours === 24 || hours === 0) {
            hours = 12;
            meridiem = 'AM';
        }
        hours='0'+hours;minutes='0'+minutes;
        const alarmDiv = `
            <div class="bg-dark mt-3 p-2 text-center" id=${time}>
                <div class = "row">
                    <h3 class="col">${hours.slice(-2)} : ${minutes.slice(-2)} ${meridiem}</h3>
                    <button class="btn btn-success btn-sm mr-3 btn-on">ON</button>
                </div>
            </div>
        `
        document.querySelector('.alarms-div').innerHTML += alarmDiv;
    }

    getStopwatchState() {
        // Make stopwatch button active
        this.clockBtn.className = 'btn btn-success btn-clock';
        this.alarmBtn.className = 'btn btn-success btn-alarm';
        this.timerBtn.className = 'btn btn-success btn-timer';
        this.stopwatchBtn.className = 'btn btn-success btn-stopwatch active';

        this.card.innerHTML = `
            <p class="stopwatch text-center" style="font-size: 75px;">00 : 00 : 00</h1>
            
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

    setStopwatch(hh, mm, ss) {
        hh='0'+hh;mm='0'+mm;ss='0'+ss;

        document.querySelector('.stopwatch').textContent = `${hh.slice(-2)} : ${mm.slice(-2)} : ${ss.slice(-2)}`;
        
    }

    showPlayBtn() {
        document.querySelector('.stopwatch-btns').innerHTML = `
            <button class="btn btn-success start-stopwatch-btn mr-3"><i class="fas fa-play"></i></button>
            <button class="btn btn-outline-success reset-stopwatch-btn">Reset</i></button>
        `;
    }

    ringAlarm(time, key) {
        const today = new Date();
        if(time.toString() === today.toString()) {
            clearInterval(key);
            $('#alarmRingModal').modal({backdrop: 'static', keyboard: false});
        }
    }
}