var selectedTimeHours; 
var selectedTimeMinutes; 
var selectedTimeSeconds; 
if (selectedTimeHours == null) {selectedTimeHours = 0};
if (selectedTimeMinutes == null) {selectedTimeMinutes = 0};
if (selectedTimeSeconds == null) {selectedTimeSeconds = 0};
var clock = document.getElementById("time"); // Define the clock globally to quickly access it
var timerInterval; 

/**
 * Inserts the time into the HTML element with ID "time"
 */
function setTimer() {
    let time = formatTime(selectedTimeHours, selectedTimeMinutes, selectedTimeSeconds);

    clock.innerHTML = time;
}

/**
 * Parses the time from the clock's innerHTML
 */
function parseTimeInput() {
    const timeParts = clock.innerHTML.trim().split(':');
    if (timeParts.length === 3) {
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = parseInt(timeParts[2]) || 0;

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            return false; 
        }

        selectedTimeHours = hours;
        selectedTimeMinutes = minutes;
        selectedTimeSeconds = seconds;
        return true; 
    }
    return false; 
}

/**
 * Clock counts down when user clicks start 
 */
function countDown() {
    parseTimeInput(); 

    function updateClock() {
        if (selectedTimeSeconds === 0) {
            if (selectedTimeMinutes === 0) {
                if (selectedTimeHours === 0) {
                    Stop();
                    return;
                } else {
                    selectedTimeHours--;
                    selectedTimeMinutes = 59;
                    selectedTimeSeconds = 59;
                }
            } else {
                selectedTimeMinutes--;
                selectedTimeSeconds = 59;
            }
        } else {
            selectedTimeSeconds--;
        }
        clock.innerHTML = formatTime(selectedTimeHours, selectedTimeMinutes, selectedTimeSeconds);
        saveTimerValue(); 
    }
    timerInterval = setInterval(updateClock, 1000); 
}

/**
 * Pauses the timer
 */
function Pause() {
    clearInterval(timerInterval);
    selectedTimeHours = selectedTimeHours;
    selectedTimeMinutes = selectedTimeMinutes;
    selectedTimeSeconds = selectedTimeSeconds;
    saveTimerValue(); 
    setTimer();
}

/**
 * Stops and clears the timer 
 */
function Stop() {
    clearInterval(timerInterval);
    selectedTimeHours = 0; 
    selectedTimeMinutes = 0; 
    selectedTimeSeconds = 0; 
    setTimer(); 
    saveTimerValue(); 
}

/**
 * Formats the hours and minutes into clock format.
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

// Create variables for the buttons and then 
// add their corresponding event listeners to them
var start_btn = document.getElementById("start-btn");
var pause_btn = document.getElementById("pause-btn");
var stop_btn = document.getElementById("stop-btn");
start_btn.addEventListener("click", function() {
    if(parseTimeInput()) {
        countDown(); 
    }
}); 
pause_btn.addEventListener("click", function() {
    if(parseTimeInput()) {
        Pause(); 
    }
}); 
stop_btn.addEventListener("click", function() {
    if(parseTimeInput()) {
        Stop(); 
    }
}); 

document.addEventListener('DOMContentLoaded', function() {
    loadTimerValue();
});

/**
 * Saves the current timer value to browser storage
 */
function saveTimerValue() {
    const time = clock.innerHTML.trim();
    browser.storage.sync.set({ timerValue: time }).then(() => {
        console.log('Timer value saved:', time);
    }).catch((error) => {
        console.error('Error saving timer value:', error);
    });
}

/**
 * Load the saved timer value from browser storage
 */
function loadTimerValue() {
    browser.storage.sync.get('timerValue').then((result) => {
        if (result.timerValue) {
            console.log('Loaded timer value:', result.timerValue);
            clock.innerHTML = result.timerValue;
            parseTimeInput();
        }
    }).catch((error) => {
        console.error('Error loading timer value:', error);
    });
}
