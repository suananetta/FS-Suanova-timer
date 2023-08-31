
class TimerView extends HTMLElement {

    connectedCallback() {
        this._shadow = this.attachShadow({mode: 'closed'});

        const slot = document.createElement('slot');
        slot.setAttribute('name','timer');
        this._shadow.prepend(slot);

        const timer = document.createElement('div');
        timer.className = 'timer-body';
        timer.setAttribute('slot', 'timer');

        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.interval;

        this.getAttribute('seconds')? this.getTimeBySeconds() : this.getTimeToTime();

        timer.innerHTML = `
                <div class="timer-body-hours" style="display: ${+this.hours? 'block' : 'none'}">
                    ${this.hours < 10? '0' +  this.hours : this.hours}:
                </div>
                <div class="timer-body-min">${this.minutes < 10? '0' + this.minutes : this.minutes}:</div>
                <div class="timer-body-sec">${this.seconds < 10? '0' + this.seconds : this.seconds}</div>
            `
        this.append(timer);

        const timerControls = document.createElement('div');
        timerControls.className = 'timer-buttons';
        timerControls.setAttribute('slot', 'timer');

        timerControls.innerHTML = `
            <button id="play" type="button"><img src="./images/play.svg" alt="play"></button>
            <button id="pause" type="button"><img src="./images/pause.svg" alt="pause"></button>
            <button id="reset" type="button"><img src="./images/reset.svg" alt="reset"></button>
        `
        this.append(timerControls);

        let controlButtons = document.getElementsByTagName('button');

        Array.from(controlButtons).forEach(button => {
            button.addEventListener('click', () => {
                if(button.id === 'play') {
                    this.startTimer();
                } else if(button.id === 'pause') {
                    this.pauseTimer();
                } else if(button.id === 'reset') {
                    this.resetTimer();
                }
            })
        });

        console.log(!this.getAttribute('to-time'));
    }
    
    getTimeBySeconds() {
        let initialSec = this.getAttribute('seconds');

        this.seconds = initialSec % 60;
        this.minutes = Math.floor(initialSec / 60 % 60);
        this.hours = Math.floor(initialSec / 60 / 60 % 60);     
    }

    getTimeToTime() {
        if(!this.getAttribute('to-time')) return;

        let initialToTime = this.getAttribute('to-time').split(':');

        let currentTime = new Date().getTime();
        let settedTime = new Date().setHours(initialToTime[0], initialToTime[1], initialToTime[2], 0);

        let timeDif = new Date(settedTime - currentTime).toISOString().slice(11, -5);
        let initTimeDif = timeDif.split(':');

        this.seconds = +initTimeDif[2];
        this.minutes = +initTimeDif[1];
        this.hours = +initTimeDif[0];
    }

    updateHTML() {
        let hours = document.querySelector('.timer-body-hours');
        let min = document.querySelector('.timer-body-min');
        let sec = document.querySelector('.timer-body-sec');

        hours.innerHTML =  this.hours < 10? '0' + this.hours + ':' : this.hours + ':';
        min.innerHTML =  this.minutes < 10? '0' + this.minutes + ':' : this.minutes + ':';
        sec.innerHTML =  this.seconds < 10? '0' + this.seconds : this.seconds;
    }

    startTimer() {
        this.interval = setInterval(() => {
            if(this.getAttribute('seconds')) {
                if(this.seconds > 0) {
                    --this.seconds;
                    this.updateHTML();
                } else if(this.seconds === 0 && this.minutes !== 0) {
                    this.seconds = 59;
                    --this.minutes;
                    this.updateHTML();
                } else if(this.minutes === 0 && this.hours !== 0) {
                    this.seconds = 59;
                    this.minutes = 59;
                    --this.hours;
                    this.updateHTML();
                } else if(this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
                    this.stopTimer();
                }
            } else {
                this.getTimeToTime();
                this.updateHTML()
            }           
        }, 1000);
    }

    pauseTimer() {
        this.interval = clearInterval(this.interval);
    }

    stopTimer() {
        clearInterval(this.interval);
        this.hours =  0;
        this.minutes =  0;
        this.seconds =  0;
    }

    resetTimer() {
        clearInterval(this.interval);
        this.getAttribute('seconds')? this.getTimeBySeconds() : this.getTimeToTime();
        this.updateHTML()
    }

}

customElements.define('timer-view', TimerView);

