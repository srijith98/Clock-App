const time = new Time();
const ui = new UI();

class Alarm {

    constructor(alarmTime, alarmState) {
        this.alarmState = alarmState;
        this.alarmKey;
        this.alarmTime = alarmTime;
    }

    setAlarm() {
        let alarmFullDate = time.setAlarm(this.alarmTime);
        this.alarmKey = setInterval(()=> {
            ui.ringAlarm(alarmFullDate, this.alarmKey);
        }, 1000);
    }

    changeState(state) {
        this.alarmState = state;
        if(state === 'ON') {
            this.setAlarm();
        } else {
            clearInterval(this.alarmKey);
        }
    }

}