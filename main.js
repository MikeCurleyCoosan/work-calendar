// 🛑 prevent double execution (PWA / cache safe)
if (window.__WORK_CALENDAR_MAIN__) {
    console.warn("main.js already loaded");
} else {
window.__WORK_CALENDAR_MAIN__ = true;

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

// 🔧 changed from const → var
var FIRSTDAYOFWEEK = 1;
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
var _DATE_ZERO = Date.UTC(2005, 9, 10);
var _DEBUG = false;
var _UNKNOWN_SHIFT = "unknown";

function _dateAdd(date, delta) {
    date.setDate(date.getDate() + delta);
}

function _dateDiffInDays2zero(a) {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    return Math.floor((utc1 - _DATE_ZERO) / _MS_PER_DAY);
}

function MonthScroller(date) {
    this.el1st = null;

    this.home = () => this.el1st.scrollIntoView();

    this.getClassFromDay = (date) => {
        var daysDiff = _dateDiffInDays2zero(date);
        if (daysDiff < 0) return _UNKNOWN_SHIFT;
        var mod = daysDiff % 56;
        return shift[_shift.replace("shift-", "")][mod] || _UNKNOWN_SHIFT;
    };

    this.getMonthFragment = (month) => {
        var el = _monthTemplate.cloneNode(true);
        el.dataset.date = month.getTime();
        el.querySelector("header").innerText =
            month.toLocaleString("default", { month: "long", year: "numeric" });

        var ul = el.querySelector(".day-grid");
        var d = new Date(month.getFullYear(), month.getMonth(), 1);

        while (d.getDay() !== FIRSTDAYOFWEEK) _dateAdd(d, -1);

        for (let i = 0; i < 42; i++) {
            var li;
            if (d.getMonth() === month.getMonth()) {
                li = _dayCurrTemplate.cloneNode(true);
                li.innerText = d.getDate();
                li.classList.add(this.getClassFromDay(d));
            } else {
                li = _dayPrevTemplate.cloneNode(true);
            }
            ul.appendChild(li);
            _dateAdd(d, 1);
        }
        return el;
    };

    this.init = () => {
        var today = new Date();
        this.el1st = this.getMonthFragment(today);
        _scrollerDiv.appendChild(this.el1st);
    };

    this.init();
}

function updateShift() {
    _shift = localStorage.getItem("shift") || "shift-C";
    localStorage.setItem("shift", _shift);
    document.getElementById("btnShift").innerText = _shift.toUpperCase();
}

function init() {
    _scroller = new MonthScroller(new Date());
    document.getElementById("btnHome").onclick = _scroller.home;
    updateShift();
}

window.onload = init;
}
