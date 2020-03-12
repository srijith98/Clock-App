class Storage {
    getAlarms() {
        let alarms;
        if(localStorage.getItem('alarms') === null) {
            alarms = [];
        }
        else {
            alarms = JSON.parse(localStorage.getItem('alarms'));
        }
        return alarms;
    }

    storeAlarm(newAlarm) {
        let alarms;
        if(localStorage.getItem('alarms') === null) {
            alarms = [];
        } else {
            alarms = JSON.parse(localStorage.getItem('alarms'));
        }
        alarms.push(newAlarm);
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    changeState(state, index) {
        const alarms = JSON.parse(localStorage.getItem('alarms'));
        alarms.forEach((alarm) => {
            if(alarm.index == index) {
                alarm.state = state;
            }
        });

        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    removeAlarm(index) {
        const alarms = JSON.parse(localStorage.getItem('alarms'));
        alarms.forEach((alarm, i) => {
            if(alarm.index == index) {
                alarms.splice(i, 1);
            }
        });

        localStorage.setItem('alarms', JSON.stringify(alarms));
        // console.log('deleted in ls');
    }
}