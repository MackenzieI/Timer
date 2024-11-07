var clock = document.getElementById("time");
var start_btn = document.getElementById("start-btn");
var pause_btn = document.getElementById("pause-btn");
var stop_btn = document.getElementById("stop-btn");

var port = browser.runtime.connect({ name: "popup" });

/**
 * Sends the action and time to timer-background.js using the port
 * @param {string} action 
 * @param {Number} time 
 */
function sendActionToBackground(action, time) {
    port.postMessage({ action: action, time: time });
}

start_btn.addEventListener("click", function() {
    var time = clock.innerText.split(':');
    var hours = parseInt(time[0], 10);
    var minutes = parseInt(time[1], 10);
    var seconds = parseInt(time[2], 10);

    console.log(`Sending start message with time: ${hours}:${minutes}:${seconds}`);
    sendActionToBackground("start", { hours, minutes, seconds });
}); 

pause_btn.addEventListener("click", function() {
    sendActionToBackground("pause");
}); 

stop_btn.addEventListener("click", function() {
    sendActionToBackground("stop");
});

/**
 * Formats the hours, minutes, and seconds into clock format.
 * @param {Number} hours
 * @param {Number} minutes
 * @param {Number} seconds
 */
function formatTime(hours, minutes, seconds) {
    let time = "";
    if (hours > 9) {
        time = hours + ":"  + (minutes < 10 ? "0" : "") + minutes; // Simplifies nested if-else case
        time += ":";
        time += (seconds < 10 ? '0' : '') + seconds; 
    } else {
        time = "0" + hours + ":";
        time += (minutes < 10 ? "0" : "") + minutes; // Simplifies nested if-else case
        time += ":";
        time += (seconds < 10 ? '0' : '') + seconds; 
    } 
    return time;
}

port.onMessage.addListener((msg) => {
    console.log('Message received in popup:', msg);
    if (msg.action === 'updateTimer') {
        console.log(`Updating timer in popup: ${msg.hours}:${msg.minutes}:${msg.seconds}`);
        clock.innerHTML = formatTime(msg.hours, msg.minutes, msg.seconds);
    }
});
