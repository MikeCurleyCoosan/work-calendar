/* =========================================================
   Work Calendar – Safe Main
   Prevents double execution + global redeclaration
   ========================================================= */

(function () {
    "use strict";

    // 🛑 Prevent double execution (PWA / SW / reload protection)
    if (window.__WORK_CALENDAR_MAIN_LOADED__) {
        console.warn("main.js already loaded – skipping");
        return;
    }
    window.__WORK_CALENDAR_MAIN_LOADED__ = true;

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

    // ✅ use vars (safe on re-run)
    var FIRSTDAYOFWEEK = 1;
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var _DATE_ZERO = Date.UTC(2005, 9, 10);
    var _DEBUG = false;
    var _UNKNOWN_SHIFT = "unknown";

    /* =========================
       Utils
       ========================= */

    function _dateAdd(date, delta) {
        date.setDate(date.getDate() + delta);
    }

    function _dateDiffInDays2zero(a) {
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        return Math.floor((utc1 - _DATE_ZERO) / _MS_PER_DAY);
    }

    /* =========================
       MonthScroller
       ========================= */

    function MonthScroller(date) {
        this.el1st = null;
        var RUN_OFF = 12;

        this.home = () => this.el1st.scrollIntoView();

        this.updateShift = () => {
            _scrollerDiv.childNodes.forEach(monthEl => {
                var d = new Date(+monthEl.dataset.date);
                monthEl.querySelectorAll(".month-curr").forEach((dayEl, i) => {
                    dayEl.className = dayEl.className.replace(/shift-\S+/g, "");
                    d.setDate(i + 1);
                    dayEl.classList.add(this.getClassFromDay(d));
                });
            });
        };

        this.getClassFromDay = (date) => {
            var daysDiff = _dateDiffInDays2zero(date);
            if (daysDiff < 0) return _UNKNOWN_SHIFT;
            var mod = daysDiff % 56;
            switch (_shift) {
                case "shift-A": return shift.A[mod] || _UNKNOWN_SHIFT;
                case "shift-B": return shift.B[mod] || _UNKNOWN_SHIFT;
                case "shift-C": return shift.C[mod] || _UNKNOWN_SHIFT;
                case "shift-D": return shift.D[mod] || _UNKNOWN_SHIFT;
                default: return _UNKNOWN_SHIFT;
            }
        };

        this.getMonthFragment = (month) => {
            var monthEl = _monthTemplate.cloneNode(true);
            monthEl.dataset.date = month.getTime();

            var date = new Date(month.getFullYear(), month.getMonth(), 1);
            while (date.getDay() !== FIRSTDAYOFWEEK) _dateAdd(date, -1);

            var days = [];
            var startMonth = date.getMonth();
            var targetMonth = month.getMonth();

            while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
                days.push(date.getMonth() === targetMonth ? new Date(date) : null);
                _dateAdd(date, 1);
            }

            monthEl.querySelector("header").innerText =
                month.toLocaleString("default", { month: "long", year: "numeric" });

            var daysTemplate = monthEl.querySelector("ul.day-grid");

            days.forEach(day => {
                var el;
                if (day) {
                    el = _dayCurrTemplate.cloneNode(true);
                    el.innerText = day.getDate();
                    el.classList.add(this.getClassFromDay(day));
                } else {
                    el = _dayPrevTemplate.cloneNode(true);
                }
                daysTemplate.appendChild(el);
            });

            return monthEl;
        };

        this.initLayout = (date) => {
            var date1st = new Date(date.getFullYear(), date.getMonth(), 1);
            this.el1st = this.getMonthFragment(date1st);
            _scrollerDiv.appendChild(this.el1st);
            this.el1st.querySelectorAll(".month-curr")[date.getDate() - 1]
                .classList.add("today");
        };

        this.initLayout(date);
        _scrollerDiv.parentNode.onscroll = () => {};
    }

    /* =========================
       Modals
       ========================= */

    function ShiftModal() {
        var modal = doc.getElementById("modalShift");
        var inputs = modal.querySelectorAll("input");

        inputs.forEach(el => {
            el.onclick = e => localStorage.setItem("shift", e.target.id);
        });

        this.open = () => modal.style.display = "flex";
        this.close = () => modal.style.display = "none";
        this.resize = this.close;
    }

    function AboutModal() {
        var modal = doc.getElementById("modalAbout");
        this.open = () => modal.style.display = "flex";
        this.close = () => modal.style.display = "none";
        this.resize = this.close;
    }

    /* =========================
       Shift
       ========================= */

    function updateShift() {
        _shift = localStorage.getItem("shift") || "shift-C";
        localStorage.setItem("shift", _shift);
        _scroller.updateShift();

        var lbl = doc.getElementById("btnShift");
        lbl.innerText = _shift.replace("shift-", "") + " SHIFT";
    }

    /* =========================
       Init
       ========================= */

    function init() {
        _scroller = new MonthScroller(new Date());
        _modShift = new ShiftModal();
        _modAbout = new AboutModal();

        doc.getElementById("btnShift").onclick = _modShift.open;
        doc.getElementById("btnAbout").onclick = _modAbout.open;
        doc.getElementById("btnHome").onclick = () => _scroller.home();

        updateShift();
    }

    window.addEventListener("load", init);

})();
