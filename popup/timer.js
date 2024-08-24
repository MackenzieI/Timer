var selectedTimeHours = 10; 
var selectedTimeMinutes = 1; 
var clock = document.getElementById("time"); // Define the clock globally to quickly access it

/**
 * Inserts the time into the HTML element with ID "time"
 * @todo make the time selectable by the user and count down
 */
function setTimer() {
    let time = formatTime(selectedTimeHours, selectedTimeMinutes)

    clock.innerHTML = time;
}

/**
 * Formats the hours and minutes into clock format.
 * @param {Number} hours 
 * @param {Number} minutes 
 */
function formatTime(hours, minutes) {
    let time = "";
    if (hours > 9) {
        time = hours + ":";
        if (minutes > 9) {
            time += minutes;
        } else {
            time += "0" + minutes;
        }
    } else {
        time = "0" + hours + ":";
        if (minutes > 9) {
            time += minutes;
        } else {
            time += "0" + minutes;
        }
    }
    return time;
}

setTimer();
