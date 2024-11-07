var selectedTimeHours = 0;
var selectedTimeMinutes = 0;
var selectedTimeSeconds = 0;
var timerInterval = null;
var popupPort = null; 

/**
 * Initializes the timer state from local storage
 */
function loadTimerState() {
    browser.storage.local.get(['selectedTimeHours', 'selectedTimeMinutes', 'selectedTimeSeconds'])
        .then(result => {
            selectedTimeHours = result.selectedTimeHours || 0;
            selectedTimeMinutes = result.selectedTimeMinutes || 0;
            selectedTimeSeconds = result.selectedTimeSeconds || 0;
            sendTimerUpdateToPopup(); 
        })
        .catch(error => console.error('Error loading timer state:', error));
}

/**
 * Checks if popup is open then sends timer state to the popup
 */
function sendTimerUpdateToPopup() {
    if (popupPort) {
        popupPort.postMessage({
            action: 'updateTimer',
            hours: selectedTimeHours,
            minutes: selectedTimeMinutes,
            seconds: selectedTimeSeconds            
        }); 
    } else {
        browser.storage.local.set({
            selectedTimeHours,
            selectedTimeMinutes,
            selectedTimeSeconds
        }).then(() => {
            console.log('Timer state saved for popup to read later');
        }).catch((error) => {
            console.log('Error saving state when popup not open', error);
        });
    }
}

browser.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        console.log("Popup connected!");
        popupPort = port; 

        popupPort.onDisconnect.addListener(() => {
            console.log("Popup disconnected");
            popupPort = null; 
        });

        sendTimerUpdateToPopup(); 
    }
});

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
 * Clears the timerInterval if null, then sets it to the time
 * Stops the timer if it goes to zero, otherwise it counts down 
 * Saves the timer state then sends the changes to the popup
 */
function countdown() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
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

        saveTimerState();
        sendTimerUpdateToPopup(); 
    }, 1000);
}

/**
 * Pauses the timer
 */
function Pause() {
    clearInterval(timerInterval);
    sendTimerUpdateToPopup();  
}

/**
 * Clears interval and stops the timer
 */
function Stop() {
    clearInterval(timerInterval);
    resetTimerState();
    sendTimerUpdateToPopup();
}

/**
 * Sets hours, minutes, and seconds to 0 
 */
function resetTimerState() {
    selectedTimeHours = 0;
    selectedTimeMinutes = 0;
    selectedTimeSeconds = 0;
    saveTimerState();
}

/**
 * Sets hours, minutes, and seconds to their values in local storage
 */
function saveTimerState() {
    browser.storage.local.set({
        selectedTimeHours,
        selectedTimeMinutes,
        selectedTimeSeconds
    }).then(() => {
        console.log('Timer state saved:', selectedTimeHours, selectedTimeMinutes, selectedTimeSeconds)
    }).catch(error => {
        console.error('Error saving timer state:', error)
    });
}

browser.runtime.onMessage.addListener((msg) => {
    console.log('Received action:', msg.action);
    switch (msg.action) {
        case 'start':
            if (message.time) {
                selectedTimeHours = msg.time.hours;
                selectedTimeMinutes = msg.time.minutes;
                selectedTimeSeconds = msg.time.seconds;
            }
            console.log(`Starting timer with: ${selectedTimeHours}:${selectedTimeMinutes}:${selectedTimeSeconds}`);
            countdown();
            break;
        case 'pause':
            Pause();
            break;
        case 'stop':
            Stop();
            break;
    }
});

loadTimerState();
