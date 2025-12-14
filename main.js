console.log("*");
var doc = window.document,
    _scroller = {},
    _modShift = {},
    _modAbout = {},
    _templates = doc.getElementsByTagName("template").item(0).content,
    _monthTemplate = _templates.querySelector("div.ph-month"),
    _dayPrevTemplate = _templates.querySelector("li.month-prev"),
    _dayCurrTemplate = _templates.querySelector("li.month-curr"),
    _scrollerDiv = doc.querySelector("div.ph-scroller-wrapper"),
    _obfuscator = doc.querySelector("div.mdl-layout__obfuscator"),
    _shift,
    _browserLaunched = true;

const FIRSTDAYOFWEEK = 1;
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _DATE_ZERO = Date.UTC(2005, 9, 10);
const _DEBUG = false;
const _UNKNOWN_SHIFT = "unknown";

//
// utils
function _dateAdd(date, delta) {
    date.setDate(date.getDate() + delta);
}

function _dateDiffInDays2zero(a) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    return Math.floor((utc1 - _DATE_ZERO) / _MS_PER_DAY);
}

//
// MonthScroller
function MonthScroller(date) {
    this.el1st = null;
    const RUN_OFF = 12;

    this.home = () => {
        this.el1st.scrollIntoView();
    };

    this.updateShift = () => {
        _scrollerDiv.childNodes.forEach(monthEl => {
            let date = new Date();
            date.setTime(monthEl.dataset.date);

            monthEl.querySelectorAll(".month-curr").forEach((dayEl, index) => {
                dayEl.classList.forEach(className => {
                    className.startsWith("shift-") && dayEl.classList.remove(className);
                });
                date.setDate(index + 1);
                dayEl.classList.add(this.getClassFromDay(date));
            });
        });
    };

    this.getClassFromDay = (date) => {
        let daysDiff = _dateDiffInDays2zero(date);
        if (daysDiff < 0) return _UNKNOWN_SHIFT;
        let ndShiftsModulo = daysDiff % (7 * 8);
        switch (_shift) {
            case "shift-A": return shift.A[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-B": return shift.B[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-C": return shift.C[ndShiftsModulo] || _UNKNOWN_SHIFT;
            case "shift-D": return shift.D[ndShiftsModulo] || _UNKNOWN_SHIFT;
        }
        return _UNKNOWN_SHIFT;
    };

    this.getDayModulo = (date) => {
        let daysDiff = _dateDiffInDays2zero(date);
        if (daysDiff < 0) return _UNKNOWN_SHIFT;
        let ndShiftsModulo = daysDiff % (7 * 8);
        return "modulo-" + ndShiftsModulo;
    };

    this.getMonthFragment = (month) => {
        const monthEl = _monthTemplate.cloneNode(true);
        monthEl.dataset.date = month.getTime();

        let _getDays = (month) => {
            if (!month || FIRSTDAYOFWEEK === undefined) return;
            let date = new Date(0, 0);
            date.setFullYear(month.getFullYear());
            date.setMonth(month.getMonth());
            date.setDate(1);
            while (date.getDay() !== FIRSTDAYOFWEEK) _dateAdd(date, -1);

            let days = [];
            let startMonth = date.getMonth();
            let targetMonth = month.getMonth();
            while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
                days.push(date.getMonth() === targetMonth ? new Date(date.getTime()) : null);
                _dateAdd(date, 1);
            }
            return days;
        };

        monthEl.getElementsByTagName("header")[0].innerText = month.toLocaleString("default", { month: "long", year: "numeric" });
        const days = _getDays(month);
        const daysTemplate = monthEl.querySelector("ul.day-grid");

        days.forEach((day) => {
            let dayTemplate;
            if (day) {
                dayTemplate = _dayCurrTemplate.cloneNode(true);
                dayTemplate.innerText = day.getDate();
                dayTemplate.classList.add(this.getClassFromDay(day));
                if (_DEBUG) dayTemplate.classList.add(this.getDayModulo(day));
            } else {
                dayTemplate = _dayPrevTemplate.cloneNode(true);
            }
            daysTemplate.appendChild(dayTemplate);
        });

        return monthEl;
    };

    this.initMonthTemplate = () => {
        let date = new Date(_DATE_ZERO);
        let dayNamesNodes = _templates.querySelectorAll("ul.weekdays >li");
        dayNamesNodes.forEach((dayNode) => {
            let dayName = dayNode.children;
            let name = date.toLocaleString("default", { weekday: "long" });
            dayName[2].innerText = name;
            name = date.toLocaleString("default", { weekday: "short" });
            dayName[1].innerText = name;
            dayName[0].innerText = name[0];
            _dateAdd(date, 1);
        });
    };

    this.scrollUpdate = () => {
        let topRect = _scrollerDiv.firstElementChild.getBoundingClientRect();
        let bottomRect = _scrollerDiv.lastElementChild.getBoundingClientRect();
        let contextRect = _scrollerDiv.parentElement.getBoundingClientRect();
        let scrollPosTop = contextRect.top - topRect.top;
        let scrollPosBottom = bottomRect.bottom - contextRect.bottom;
        let elHight = (topRect.height + bottomRect.height) / 2;

        if (scrollPosTop / elHight < RUN_OFF) {
            let date = new Date(_scrollerDiv.firstElementChild.dataset.date);
            let el = this.getMonthFragment(new Date(date.setMonth(date.getMonth() - 1)));
            _scrollerDiv.insertBefore(el, _scrollerDiv.firstElementChild);
        } else if (scrollPosBottom / elHight < RUN_OFF) {
            let date = new Date(_scrollerDiv.lastElementChild.dataset.date);
            let el = this.getMonthFragment(new Date(date.setMonth(date.getMonth() + 1)));
            _scrollerDiv.appendChild(el);
        }
    };

    this.initLayout = (date) => {
        let currDate = date.getDate();
        var date1st = new Date(0, 0);
        date1st.setFullYear(date.getFullYear());
        date1st.setMonth(date.getMonth());
        date1st.setDate(1);

        this.el1st = this.getMonthFragment(date1st);
        _scrollerDiv.appendChild(this.el1st);
        this.el1st.querySelectorAll(".month-curr")[currDate - 1].classList.add("today");

        let monthShift = 0;
        let topRect, bottomRect, scrollInsideHeight;
        let contextRect = _scrollerDiv.parentElement.getBoundingClientRect();
        do {
            monthShift++;
            let el = this.getMonthFragment(new Date(date1st.getFullYear(), date1st.getMonth() + monthShift), 1);
            _scrollerDiv.appendChild(el);
            el = this.getMonthFragment(new Date(date1st.getFullYear(), date1st.getMonth() - monthShift), 1);
            _scrollerDiv.insertBefore(el, _scrollerDiv.firstElementChild);

            topRect = _scrollerDiv.firstElementChild.getBoundingClientRect();
            bottomRect = _scrollerDiv.lastElementChild.getBoundingClientRect();
            scrollInsideHeight = bottomRect.bottom - topRect.top;
        } while ((scrollInsideHeight / contextRect.height) < (2 * RUN_OFF + 1));

        this.el1st.scrollIntoView();
        this._offset = -this.el1st.offsetTop;
    };

    this.resize = () => {
        if (_DEBUG) console.log("Scroller resize");
    };

    this.initMonthTemplate();
    this.initLayout(date);
    _scrollerDiv.parentNode.onscroll = this.scrollUpdate;
}

//
// Shift Modal
function ShiftModal() {
    const STATE_CLOSED = 1;
    const STATE_OPEN = 2;
    let currentState = STATE_CLOSED;

    this.open = () => { currentState = STATE_OPEN; this.updateState(); };
    this.close = () => { currentState = STATE_CLOSED; this.updateState(); };

    this.updateState = () => {
        let modal = doc.getElementById("modalShift");
        switch (currentState) {
            case STATE_OPEN:
                inputInit();
                _obfuscator.classList.add("is-visible");
                modal.style.display = "flex";
                break;
            default:
                _obfuscator.classList.remove("is-visible");
                modal.style.display = "none";
                updateShift();
                break;
        }
    };

    this.resize = () => { currentState = STATE_CLOSED; this.updateState(); };

    function inputClick(ev) {
        inputs.forEach(element => {
            if (element !== ev.target) element.parentElement.MaterialCheckbox.uncheck();
        });
        localStorage.setItem("shift", ev.target.id);
    }

    function inputInit() {
        inputs.forEach(element => {
            if (element.id === _shift) element.parentElement.MaterialCheckbox.check();
        });
    }

    let modal = doc.getElementById("modalShift");
    let inputs = modal.querySelectorAll(".settings-list-control input");
    inputs.forEach(element => element.onclick = inputClick);
}

//
// About Modal
function AboutModal() {
    const STATE_CLOSED = 1;
    const STATE_OPEN = 2;
    let currentState = STATE_CLOSED;
    let timer;
    let lblTick = doc.getElementById("lblTick");
    let tickText = lblTick.innerText;
    let tickNr = 0;

    this.open = () => { currentState = STATE_OPEN; this.updateState(); };
    this.close = () => { currentState = STATE_CLOSED; this.updateState(); };

    this.tick = () => {
        switch (tickNr++) {
            case 1: lblTick.style.opacity = 1; lblTick.innerText = tickText; break;
            case 16: lblTick.style.opacity = 0; break;
            case 20: lblTick.style.opacity = 1; lblTick.innerText = `... ${_dateDiffInDays2zero(new Date())} days left`; break;
            case 35: lblTick.style.opacity = 0; break;
            case 39: tickNr = 0; break;
        }
    };

    this.updateState = () => {
        let modal = doc.getElementById("modalAbout");
        switch (currentState) {
            case STATE_OPEN:
                timer = setInterval(this.tick, 100);
                if (_browserLaunched) {
                    if (window._deferredPrompt)
                        doc.getElementById("btnInstall").removeAttribute("disabled");
                    else
                        doc.getElementById("btnInstall").setAttribute("disabled", "");
                } else {
                    doc.getElementById("btnInstall").parentNode.style.display = "none";
                }
                _obfuscator.classList.add("is-visible");
                modal.style.display = "flex";
                break;
            case STATE_CLOSED:
                clearInterval(timer);
                tickNr = 0;
                lblTick.innerText = tickText;
                _obfuscator.classList.remove("is-visible");
                modal.style.display = "none";
                break;
        }
    };

    this.resize = () => { currentState = STATE_CLOSED; this.updateState(); };
}

//
// Update Shift
function updateShift() {
    let shift = localStorage.getItem("shift");
    if (!shift) localStorage.setItem("shift", "shift-C");
    _shift = localStorage.getItem("shift");

    _scroller.updateShift();

    let lblShift = doc.getElementById("btnShift");
    switch (_shift) {
        case "shift-A": lblShift.innerText = "A SHIFT"; break;
        case "shift-B": lblShift.innerText = "B SHIFT"; break;
        case "shift-C": lblShift.innerText = "C SHIFT"; break;
        case "shift-D": lblShift.innerText = "D SHIFT"; break;
    }
}

//
// Install App
function installApp() {
    const promptEvent = window._deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.then(() => { window._deferredPrompt = null; _modAbout.close(); });
}

//
// Init
function init() {
    if (navigator.standalone || matchMedia("(display-mode: standalone)").matches) _browserLaunched = false;

    _scroller = new MonthScroller(new Date());
    doc.getElementById("btnHome").onclick = _scroller.home;

    _modShift = new ShiftModal();
    doc.getElementById("btnShift").onclick = _modShift.open;

    _modAbout = new AboutModal();
    doc.getElementById("btnAbout").onclick = _modAbout.open;

    _obfuscator.onclick = () => { _modShift.close(); _modAbout.close(); };

    doc.getElementById("btnInstall").onclick = installApp;

    updateShift();

    resize();
    window.onresize = resize;
}

function resize() {
    _modShift.resize();
    _modAbout.resize();
    _scroller.resize();
}

window.onload = init;
window.addEventListener("beforeinstallprompt", (e) => { window._deferredPrompt = e; });
