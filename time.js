class Time {
    constructor() {
        this.key = '';
    }

    getCurrentTime() {
        const date = new Date();
        const currentHour = date.getHours();
        const currentMinutes = date.getMinutes();
        return {currentHour,currentMinutes};
    }

    getCurrentDate() {
        const months = {0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'};
        const days = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
        const date = new Date();
        // Get month value
        const monthValue = date.getMonth();
        // convert it to month
        const month = months[monthValue];
        const currentDate = date.getDate();
        const dayValue = date.getDay();
        const day = days[dayValue];
        
        return {day, currentDate, month};
    }

    async getTimeZoneData(location) {
        const http = new EasyHTTP();
        let time, city, country;
        // const city = location.city, continent = location.continent;
        await http.get(`http://api.weatherstack.com/current?access_key=${this.key}&query=${location}`)
            .then(data => {
                // console.log(data.location.localtime.match(/\d\d:\d\d/));
                const timeArr = data.location.localtime.match(/\d\d:\d\d/);
                time = timeArr[0];
                city = data.location.name;
                country = data.location.country;
            })
            .catch(err => console.log(err));
        return {time, city, country};
    }

    getIncrement(hh, mm, ss) {
        if(hh === undefined && mm === undefined && ss === undefined) {
            hh=0, mm=0, ss=0;
        }
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

        return [hh,mm,ss];
    }

    setAlarm(time) {
        let [hours, minutes] = time.split(':');
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth() + 1;
        const todayYear = today.getFullYear();
        const alarmTime = new Date(`${todayMonth}-${todayDate}-${todayYear} ${hours}:${minutes}:00`);
        return alarmTime;
    }

    
}
