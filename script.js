
class TimerView extends HTMLElement {
    connectedCallback() {
        this._shadow = this.attachShadow({mode: 'closed'});

        const slot = document.createElement('slot');
        slot.setAttribute('name','timer');
        this._shadow.prepend(slot);

        this.initSeconds = 4221;
        this.initToTime;

        const timer = document.createElement('div');
        timer.className = 'timer-body';

        timer.setAttribute('seconds', this.initSeconds? this.initSeconds : '');
        timer.setAttribute('to-time', this.initToTime? this.initToTime : '');
        timer.setAttribute('slot', 'timer');

        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.interval;

        this.initSeconds? this.getTimeBySeconds(this.initSeconds) : this.getTimeToTime(this.initToTime);

        this.observeAttrChanges();

        timer.innerHTML = `
                <div class="timer-body-hours" style="display: ${+this.hours > 0? 'block' : 'none'}">
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
    }
    
    getTimeBySeconds(sec) {
        this.seconds = sec % 60;
        this.minutes = Math.floor(sec / 60 % 60);
        this.hours = Math.floor(sec / 60 / 60 % 60);     
    }

    getTimeToTime(toTime) {
        if(!toTime) return;

        let initialToTime = toTime.split(':');

        let currentTime = new Date().getTime();
        let settedTime = new Date().setHours(initialToTime[0], initialToTime[1], initialToTime[2], 0);

        let timeDif = new Date(settedTime - currentTime).toISOString().slice(11, -5);
        let initTimeDif = timeDif.split(':');
       
        this.seconds = +initTimeDif[2];
        this.minutes = +initTimeDif[1];
        this.hours = +initTimeDif[0];
    }

    updateHTML(updatedPart) {
        let hours = document.querySelector('.timer-body-hours');
        let min = document.querySelector('.timer-body-min');
        let sec = document.querySelector('.timer-body-sec');

        if(updatedPart === 'seconds') {
            sec.innerHTML =  this.seconds < 10? '0' + this.seconds : this.seconds;
        } else if(updatedPart === 'minutes') {
            sec.innerHTML =  this.seconds < 10? '0' + this.seconds : this.seconds;
            min.innerHTML =  this.minutes < 10? '0' + this.minutes + ':' : this.minutes + ':';
        } else if(updatedPart === 'fullTime') {
            hours.innerHTML =  this.hours < 10? '0' + this.hours + ':' : this.hours + ':';
            min.innerHTML =  this.minutes < 10? '0' + this.minutes + ':' : this.minutes + ':';
            sec.innerHTML =  this.seconds < 10? '0' + this.seconds : this.seconds;
        }        
        
        this.hours < 0? hours.style.display = "none" : hours.style.display = "block";
    }

    observeAttrChanges() {
        let target = document.getElementsByTagName('timer-view')[0];

        const config = {
            attributes: true,
            childList: true,
            subtree: true,
        };

        const reset = (mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "attributes") {
                    Array.from(mutation.target.attributes).forEach(attr => {
                        if(attr.name === 'seconds') {
                            this.initSeconds = attr.value;
                        } else if(attr.name === 'to-time') {
                            this.initToTime = attr.value;
                        }
                    })
                    this.resetTimer();
                }
            }    
        }

        const observer = new MutationObserver(reset);

        observer.observe(target, config);
    }

    startTimer() {
        this.interval = setInterval(() => {
            if(this.initSeconds) {
                if(this.seconds > 0) {
                    --this.seconds;
                    this.updateHTML('seconds');
                } else if(this.seconds === 0 && this.minutes !== 0) {
                    this.seconds = 59;
                    --this.minutes;
                    this.updateHTML('minutes');
                } else if(this.minutes === 0 && this.hours !== 0) {
                    this.seconds = 59;
                    this.minutes = 59;
                    --this.hours;
                    this.updateHTML('fullTime');
                } 
            } else {
                this.getTimeToTime(this.initToTime);
                this.updateHTML('fullTime');
            } 
            
            if(this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
                this.stopTimer();
            }
            
        }, 1000);
    }

    pauseTimer() {
        this.interval = clearInterval(this.interval);
    }

    stopTimer() {
        clearInterval(this.interval);
        console.log('end of countdown');
        this.hours =  0;
        this.minutes =  0;
        this.seconds =  0;
    }

    resetTimer() {
        clearInterval(this.interval);
        this.getTimeBySeconds(this.initSeconds);
        this.getTimeToTime(this.initToTime);
        this.updateHTML('fullTime');
    }

}

customElements.define('timer-view', TimerView);

