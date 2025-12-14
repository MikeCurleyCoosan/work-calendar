// https://developers.google.com/s/results/web/fundamentals?q=full%20screen
(function () {

if (window.__WORK_CALENDAR_MAIN_LOADED__) {
    console.warn("main.js already loaded, skipping duplicate execution");
    return;
}
window.__WORK_CALENDAR_MAIN_LOADED__ = true;

console.log("*");
var doc = window.document,
    _scroller = {},
    _modShift = {},
    _modAbout = {},
    _modNote = {},
    _templates = doc.getElementsByTagName("template").item(0).content,
    _monthTemplate = _templates.querySelector("div.ph-month"),
    _dayPrevTemplate = _templates.querySelector("li.month-prev"),
    _dayCurrTemplate = _templates.querySelector("li.month-curr"),
    _scrollerDiv = doc.querySelector("div.ph-scroller-wrapper"),
    _obfuscator = doc.querySelector("div.mdl-layout__obfuscator"),
    _shift,
    _browserLaunched = true;

var FIRSTDAYOFWEEK = 1;
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
var _DATE_ZERO = Date.UTC(2005, 9, 10);
var _DEBUG = false;
var _UNKNOWN_SHIFT = "shift-unknown";

//
//
// utils:
function _dateAdd(date, delta) {
    date.setDate(date.getDate() + delta);
}

//
//
// a and b are javascript Date objects
function _dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

//
//
// a and b are javascript Date objects
function _dateDiffInDays2zero (a) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    return Math.floor((utc1 - _DATE_ZERO) / _MS_PER_DAY);
}

//
//
//
function MonthScroller(date) {

    this.el1st = null;

    // const
    const RUN_OFF = 12;

    //
    //
    //
    this.home = () => {
        this.el1st.scrollIntoView();
    };

    //
    //
    //
    this.updateShift = () => {
        _scrollerDiv.childNodes.forEach(monthEl => {
            let date = new Date();
            date.setTime(monthEl.dataset.date);

            monthEl.querySelectorAll(".month-curr").forEach((dayEl, index) => {

                // first remove old
                dayEl.classList.forEach(className => {
                    className.startsWith("shift-") && dayEl.classList.remove(className);
                });

                date.setDate(index + 1);

                // update with current shift class
                dayEl.classList.add(this.getClassFromDay(date));
            });
        });
    };

    //
    //
    //
    this.getClassFromDay = (date) => {

        let daysDiff = _dateDiffInDays2zero(date);
        if (daysDiff < 0) {
            return _UNKNOWN_SHIFT;
        }

        // shifts modulo pattern index
        let ndShiftsModulo = daysDiff % (7 * 8);

        switch (_shift) {
            case "shift-A":
                return shift.A[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-B":
                return shift.B[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-C":
                return shift.C[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-D":
                return shift.D[ndShiftsModulo] || _UNKNOWN_SHIFT;
        }

        return _UNKNOWN_SHIFT;
    };

    //
    //
    // Only for info purpose
    this.getDayModulo = (date) => {

        let daysDiff = _dateDiffInDays2zero(date);
        if (daysDiff < 0) {
            return _UNKNOWN_SHIFT;
        }

        // is it days or nights
        let ndShiftsModulo = daysDiff % (7 * 8);
        return "modulo-" + ndShiftsModulo;
    };

    //
    //
    //
    this.getMonthFragment = (month) => {

        const monthEl = _monthTemplate.cloneNode(true);
        monthEl.dataset.date = month.getTime();

        let _getDays = (month) => {
            if (month === undefined || FIRSTDAYOFWEEK === undefined) {
                return;
            }
            // First day of the month (at midnight).
            var date = new Date(0, 0);
            date.setFullYear(month.getFullYear());
            date.setMonth(month.getMonth());
            date.setDate(1);

            // Rewind to first day of the week.
            while (date.getDay() !== FIRSTDAYOFWEEK) {
                _dateAdd(date, -1);
            }

            var days = [];
            var startMonth = date.getMonth();
            var targetMonth = month.getMonth();
            while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
                days.push(date.getMonth() === targetMonth ? new Date(date.getTime()) : null);

                // Advance to next day.
                _dateAdd(date, 1);
            }
            return days;
        };

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
        const yearAndMonth = month.toLocaleString("default", { month: "long", year: "numeric" });
        monthEl.getElementsByTagName("header")[0].innerText = yearAndMonth;

        const days = _getDays(month);
        const daysTemplate = monthEl.querySelector("ul.day-grid");

        let dayTemplate;
        days.forEach((day) => {
            if (day) {
                dayTemplate = _dayCurrTemplate.cloneNode(true);
                dayTemplate.innerText = day.getDate();
                dayTemplate.classList.add(this.getClassFromDay(day));
                // Store date as data attribute for note/holiday tracking
                dayTemplate.dataset.date = day.toISOString().split('T')[0];
                if (_DEBUG) {
                    dayTemplate.classList.add(this.getDayModulo(day));
                }
            } else {
                dayTemplate = _dayPrevTemplate.cloneNode(true);
            }
            daysTemplate.appendChild(dayTemplate);
        });

        return monthEl;
    };

    //
    //
    //
    this.initMonthTemplate = () => {

        var date = new Date(_DATE_ZERO);

        let dayNamesNodes = _templates.querySelectorAll("ul.weekdays >li");

        let name = "";
        dayNamesNodes.forEach((dayNode) => {
            let dayName = dayNode.children;
            name = date.toLocaleString("default", { weekday: "long" });
            dayName[2].innerText = name;
            name = date.toLocaleString("default", { weekday: "short" });
            dayName[1].innerText = name;
            dayName[0].innerText = name[0];
            _dateAdd(date, 1);
        });
    };

    //
    //
    //
    this.scrollUpdate = () => {

        let topRect = _scrollerDiv.firstElementChild.getBoundingClientRect();
        let bottomRect = _scrollerDiv.lastElementChild.getBoundingClientRect();
        let contextRect = _scrollerDiv.parentElement.getBoundingClientRect();
        let scrollPosTop = contextRect.top - topRect.top;
        let scrollPosBottom = bottomRect.bottom - contextRect.bottom;
        let elHight = (topRect.height + bottomRect.height) / 2;

        // add element
        if (scrollPosTop / elHight < RUN_OFF) {

            let date = new Date();
            date.setTime(_scrollerDiv.firstElementChild.dataset.date);

            let el = this.getMonthFragment(new Date(date.setMonth(date.getMonth() - 1)));
            _scrollerDiv.insertBefore(el, _scrollerDiv.firstElementChild);
            
            // Restore notes and holidays for new month
            restoreDayData();

        } else if (scrollPosBottom / elHight < RUN_OFF) {

            let date = new Date();
            date.setTime(_scrollerDiv.lastElementChild.dataset.date);

            let el = this.getMonthFragment(new Date(date.setMonth(date.getMonth() + 1)));
            _scrollerDiv.appendChild(el);
            
            // Restore notes and holidays for new month
            restoreDayData();
        }

        // this.scrollUpdateDebounce();
    };

    //
    //
    //
    this.initLayout = (date) => {

        let currDate = date.getDate();

        // First day of the month (at midnight).
        // some strange things can happen if we stuck with 31 day of the month
        var date1st = new Date(0, 0);
        date1st.setFullYear(date.getFullYear());
        date1st.setMonth(date.getMonth());
        date1st.setDate(1);

        // starting element
        this.el1st = this.getMonthFragment(date1st);
        _scrollerDiv.appendChild(this.el1st);
        // set current day
        this.el1st.querySelectorAll(".month-curr")[currDate - 1].classList.add("today");

        // now add elements in both side
        let topRect, bottomRect, scrollInsideHeight;
        let contextRect = _scrollerDiv.parentElement.getBoundingClientRect();
        let monthShift = 0;
        do {
            monthShift++;
            let el = this.getMonthFragment(new Date(date1st.getFullYear(), date1st.getMonth() + monthShift), 1);
            _scrollerDiv.appendChild(el);
            el = this.getMonthFragment(new Date(date1st.getFullYear(), date1st.getMonth() - monthShift), 1);
            _scrollerDiv.insertBefore(el, _scrollerDiv.firstElementChild);

            topRect = _scrollerDiv.firstElementChild.getBoundingClientRect();
            bottomRect = _scrollerDiv.lastElementChild.getBoundingClientRect();
            scrollInsideHeight = bottomRect.bottom - topRect.top;
        }
        while ((scrollInsideHeight / contextRect.height) < (2 * RUN_OFF + 1));

        // move to date to center
        this.el1st.scrollIntoView();

        // save offset
        this._offset = -this.el1st.offsetTop;
    };

    // On resize
    this.resize = () => {
        if (_DEBUG)
            console.log("Scroller resize");
    };

    // init month template with week days
    this.initMonthTemplate();

    // init layout
    this.initLayout(date);

    // scroll events
    _scrollerDiv.parentNode.onscroll = this.scrollUpdate;
}

//
//
//
function ShiftModal() {

    // Gloabl state variables
    const STATE_CLOSED = 1;
    const STATE_OPEN = 2;
    let currentState = STATE_CLOSED;

    this.open = () => {
        currentState = STATE_OPEN;
        this.updateState();
    };

    this.close = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    this.updateState = () => {
        switch (currentState) {
            case STATE_OPEN:

                // update with curren shift
                inputInit();

                // open modal
                _obfuscator.classList.add("is-visible");
                modal.style.display = "flex";
                break;
            default:

                // close modal
                _obfuscator.classList.remove("is-visible");
                modal.style.display = "none";

                // and update shift pattern
                updateShift();
                break;
        }
    };

    this.resize = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    function inputClick(ev) {
        // Only allow checking, not unchecking
        if (!ev.target.checked) {
            // Prevent unchecking - keep it checked
            ev.target.parentElement.MaterialCheckbox.check();
            return;
        }
        
        // Uncheck all other inputs
        inputs.forEach(element => {
            if (element !== ev.target) {
                element.parentElement.MaterialCheckbox.uncheck();
            }
        });
        
        // Save selection and update shift pattern
        localStorage.setItem("shift", ev.target.id);
        _shift = ev.target.id;
        
        // Close modal after selection
        _modShift.close();
    }

    function inputInit() {
        inputs.forEach(element => {
            if (element.id === _shift) {
                element.parentElement.MaterialCheckbox.check();
            }
        });
    }

    // modal
    let modal = doc.getElementById("modalShift");
    // inputs
    let inputs = modal.querySelectorAll(".settings-list-control input");
    inputs.forEach(element => {
        // Use onchange for checkboxes as it's more reliable
        element.onchange = inputClick;
    });
}


//
//
//
function AboutModal() {

    // Gloabl state variables
    const STATE_CLOSED = 1;
    const STATE_OPEN = 2;
    let currentState = STATE_CLOSED;
    let timer;
    let lblTick = doc.getElementById("lblTick");
    let tickText = lblTick.innerText;
    let tickNr = 0;

    this.open = () => {
        currentState = STATE_OPEN;
        this.updateState();
    };

    this.close = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    this.tick = () => {
        switch (tickNr++) {
            case 1:
                lblTick.style.opacity = 1;
                lblTick.innerText = tickText;
                break;
            case 16:
                lblTick.style.opacity = 0;
                break;
            case 20:
                lblTick.style.opacity = 1;
                lblTick.innerText = `... ${_dateDiffInDays(new Date(), new Date(2024, 3, 1))} days left`;
                break;
            case 35:
                lblTick.style.opacity = 0;
                break;
            case 39:
                tickNr = 0;
                break;
        }
    };


    this.updateState = () => {
        switch (currentState) {
            case STATE_OPEN:

                // start timer
                timer = setInterval(this.tick, 100);

                if (_browserLaunched) {
                    // enable/disable install button
                    if (window._deferredPrompt)
                        doc.getElementById("btnInstall").removeAttribute("disabled");
                    else
                        doc.getElementById("btnInstall").setAttribute("disabled", "");
                } else {
                    // hide if we are launch as app
                    doc.getElementById("btnInstall").parentNode.style.display = "none";
                }

                // open modal
                _obfuscator.classList.add("is-visible");
                modal.style.display = "flex";
                break;

            case STATE_CLOSED:

                // restore to "zero" state
                clearInterval(timer);
                tickNr = 0;
                lblTick.innerText = tickText;

                // close modal
                _obfuscator.classList.remove("is-visible");
                modal.style.display = "none";
                break;
        }
    };

    this.resize = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    // modal
    let modal = doc.getElementById("modalAbout");
}

//
//
//
function NoteModal() {

    // Global state variables
    const STATE_CLOSED = 1;
    const STATE_OPEN = 2;
    let currentState = STATE_CLOSED;
    let selectedDay = null;
    let selectedDate = null;

    this.open = (dayEl, date) => {
        selectedDay = dayEl;
        selectedDate = date;
        currentState = STATE_OPEN;
        this.updateState();
    };

    this.close = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    this.updateState = () => {
        switch (currentState) {
            case STATE_OPEN:
                // Load existing data
                const dateStr = selectedDate.toISOString().split('T')[0];
                const notes = JSON.parse(localStorage.getItem("dayNotes") || "{}");
                const holidays = JSON.parse(localStorage.getItem("dayHolidays") || "{}");
                
                noteInput.value = notes[dateStr] || "";
                if (holidays[dateStr]) {
                    holidayCheckbox.parentElement.MaterialCheckbox.check();
                } else {
                    holidayCheckbox.parentElement.MaterialCheckbox.uncheck();
                }

                // open modal
                _obfuscator.classList.add("is-visible");
                modal.style.display = "flex";
                break;

            case STATE_CLOSED:
                // close modal
                _obfuscator.classList.remove("is-visible");
                modal.style.display = "none";
                break;
        }
    };

    this.save = () => {
        if (!selectedDay || !selectedDate) return;

        const dateStr = selectedDate.toISOString().split('T')[0];
        const notes = JSON.parse(localStorage.getItem("dayNotes") || "{}");
        const holidays = JSON.parse(localStorage.getItem("dayHolidays") || "{}");
        
        const noteVal = noteInput.value.trim();
        const isHoliday = holidayCheckbox.checked;

        // Save or remove note
        if (noteVal) {
            notes[dateStr] = noteVal;
        } else {
            delete notes[dateStr];
        }

        // Save or remove holiday
        if (isHoliday) {
            holidays[dateStr] = true;
        } else {
            delete holidays[dateStr];
        }

        localStorage.setItem("dayNotes", JSON.stringify(notes));
        localStorage.setItem("dayHolidays", JSON.stringify(holidays));

        // Update UI for the selected day
        updateDayDisplay(selectedDay, dateStr, noteVal, isHoliday);

        this.close();
    };

    this.resize = () => {
        currentState = STATE_CLOSED;
        this.updateState();
    };

    // modal elements
    let modal = doc.getElementById("modalNote");
    let noteInput = doc.getElementById("noteInput");
    let holidayCheckbox = doc.getElementById("holidayCheckbox");
    let saveBtn = doc.getElementById("saveNoteBtn");
    let closeBtn = doc.getElementById("closeNoteBtn");

    saveBtn.onclick = () => this.save();
    closeBtn.onclick = () => this.close();
}

//
//
// Update day display with note and holiday indicators
function updateDayDisplay(dayEl, dateStr, noteText, isHoliday) {
    // Update note indicator
    if (noteText) {
        dayEl.classList.add("has-note");
        dayEl.title = noteText;
    } else {
        dayEl.classList.remove("has-note");
        dayEl.title = "";
    }

    // Update holiday indicator
    if (isHoliday) {
        dayEl.classList.add("is-holiday");
    } else {
        dayEl.classList.remove("is-holiday");
    }
}

//
//
// Restore notes and holidays for all visible days
function restoreDayData() {
    const notes = JSON.parse(localStorage.getItem("dayNotes") || "{}");
    const holidays = JSON.parse(localStorage.getItem("dayHolidays") || "{}");

    doc.querySelectorAll(".month-curr").forEach(dayEl => {
        const dateStr = dayEl.dataset.date;
        if (dateStr) {
            updateDayDisplay(dayEl, dateStr, notes[dateStr], holidays[dateStr]);
        }
    });
}

//
//
//
function attachDayClickHandlers() {
    // Use event delegation for better performance
    // Handle both click and touch events for iOS compatibility
    let touchHandled = false;
    
    const handleDayInteraction = (e) => {
        const dayEl = e.target.closest('.month-curr');
        if (dayEl && dayEl.dataset.date) {
            // Prevent double-firing: touchend fires first, then click
            if (e.type === 'touchend') {
                touchHandled = true;
                e.preventDefault(); // Only prevent default for touch events
                setTimeout(() => { touchHandled = false; }, 500);
            } else if (e.type === 'click' && touchHandled) {
                return; // Skip click if touch was just handled
            }
            
            // Parse date avoiding timezone issues
            const [year, month, day] = dayEl.dataset.date.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            _modNote.open(dayEl, date);
        }
    };
    
    // Add both click and touchend for better iOS support
    _scrollerDiv.addEventListener('click', handleDayInteraction);
    _scrollerDiv.addEventListener('touchend', handleDayInteraction);
}

//
//
//
function updateShift() {
    // init shift
    let shift = localStorage.getItem("shift");
    if (!shift) {
        localStorage.setItem("shift", "shift-C");
    }
    _shift = localStorage.getItem("shift");

    // update scrollet with current shift
    _scroller.updateShift();

    // update shift label 
    let lblShift = doc.getElementById("btnShift");
    switch (_shift) {
        case "shift-A":
            lblShift.innerText = "A SHIFT";
            break;
        case "shift-B":
            lblShift.innerText = "B SHIFT";
            break;
        case "shift-C":
            lblShift.innerText = "C SHIFT";
            break;
        case "shift-D":
            lblShift.innerText = "D SHIFT";
            break;
    }

    // Restore notes and holidays after shift update
    restoreDayData();
}

//
// https://web.dev/codelab-make-installable/
// https://web.dev/customize-install/#detect-mode
function installApp() {
    
    const promptEvent = window._deferredPrompt;
    if (!promptEvent) {
        // The deferred prompt isn't available.
        return;
    }
    
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    promptEvent.userChoice.then(() => {

        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        window._deferredPrompt = null;

        // Hide the modal
        _modAbout.close();
    });
}

//
//
//
function init() {

    // check for launch from desktop
    if (navigator.standalone) {
        _browserLaunched = false;
        console.log("Launched: Installed (iOS)");
    } else if (matchMedia("(display-mode: standalone)").matches) {
        _browserLaunched = false;
        console.log("Launched: Installed");
    }

    // init callendar
    _scroller = new MonthScroller(new Date());
    doc.getElementById("btnHome").onclick = _scroller.home;

    // init shifts modal
    _modShift = new ShiftModal();
    doc.getElementById("btnShift").onclick = _modShift.open;

    // init about modal
    _modAbout = new AboutModal();
    doc.getElementById("btnAbout").onclick = _modAbout.open;

    // init note modal
    _modNote = new NoteModal();

    // click on obfuscator to close modals
    _obfuscator.onclick = () => {
        _modShift.close();
        _modAbout.close();
        _modNote.close();
    };

    // install app
    doc.getElementById("btnInstall").onclick = installApp;

    // update app with current settings
    updateShift();

    // attach click handlers to days
    attachDayClickHandlers();

    resize();
    window.onresize = resize;
}

//
//
//
function resize() {
    _modShift.resize();
    _modAbout.resize();
    _modNote.resize();
    _scroller.resize();
}

window.onload = init;

window.addEventListener("beforeinstallprompt", (e) => {
    // Stash the event so it can be triggered later.
    window._deferredPrompt = e;
});

})();