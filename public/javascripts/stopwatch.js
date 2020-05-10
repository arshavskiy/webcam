stopWatch = ()=>{};

stopWatch.running = 0;ß
stopWatch.time = 0;
stopWatch.hour = 0;
stopWatch.min = 0;
stopWatch.sec = 0;
stopWatch.millisec = 0;

stopWatch.startCounter = ()=> {
    stopWatch.started = window.setInterval(stopWatch.clockRunning, 1000);
};

stopWatch.stopCounter = ()=>{
    stopWatch.running = 0;
    stopWatch.time = 0;
    stopWatch.hour = 0;
    stopWatch.min = 0;
    stopWatch.sec = 0;
    stopWatch.millisec = 0;
    window.clearInterval(stopWatch.started);
};

stopWatch.clockRunning = ()=>{
    // stopWatch.millisec++;
    // if (stopWatch.millisec % 1000 === 0) {
        // stopWatch.millisec = 0;
        stopWatch.sec++;
        stopWatch.time++;
        if (stopWatch.sec == 60) {
            stopWatch.min += 1;
            stopWatch.sec = 0;
            if (stopWatch.min == 60) {
                stopWatch.hour += 1;
                stopWatch.min = 0;
            }
    
        }
    // }

    // stopWatch.millisec = stopWatch.millisec < 10 ? stopWatch.millisec = '00' + stopWatch.millisec: stopWatch.millisec;
    // stopWatch.millisec = stopWatch.millisec > 10 && stopWatch.millisec < 100 ? stopWatch.millisec = '0' + stopWatch.millisec: stopWatch.millisec;
    stopWatch.time = (stopWatch.hour ? (stopWatch.hour > 9 ? stopWatch.hour : "0" + stopWatch.hour) : "00") +
        ":" + (stopWatch.min ? (stopWatch.min > 9 ? stopWatch.min : "0" + stopWatch.min) : "00") + ":" + (stopWatch.sec > 9 ? stopWatch.sec : "0" +
        stopWatch.sec);

    document.querySelector('#time').innerHTML = stopWatch.time;
};