
let timerCheck = document.getElementsByTagName('timer-view');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

let getTimeFromSec = (sec) => {
    let time = {
        seconds: sec % 60,
        minutes: Math.floor(sec / 60 % 60),
        hours: Math.floor(sec / 60 / 60 % 60)
    }

    return time;
}

class TimerView extends HTMLElement {

    connectedCallback() {
        const timer = document.createElement('div');
        timer.className = 'timer-body';

        let initialSec = this.getAttribute('seconds');
        let initialFullTime = this.getAttribute('to-time');

        let time;

        if(initialSec) {
            time = getTimeFromSec(initialSec);
            timer.innerHTML = `
                <div class="timer-body-hours">${time.hours? time.hours : '00'}:</div>
                <div class="timer-body-min">${time.minutes? time.minutes : '00'}:</div>
                <div class="timer-body-sec">${time.seconds? time.seconds : '00'}</div>
            `
        } else if(initialFullTime) {
            time = initialFullTime.split(':');
            timer.innerHTML = `
                <div class="timer-body-hours">${time[0]}:</div>
                <div class="timer-body-min">${time[1]}:</div>
                <div class="timer-body-sec">${time[2]}</div>
            `
        }
        
        console.log(time);
        this.prepend(timer);
    }
    
    startTimer() {
            
    }

    pauseTimer() {

    }

    resetTimer() {

    }

}

customElements.define('timer-view', TimerView);
