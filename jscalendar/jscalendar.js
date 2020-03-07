var PrevMonth = {};
var NextMonth = {};


var Cal = function (divId, events) {

    //Store div id
    this.divId = divId;
    this.events = events;

    // Days of week, starting on Sunday
    this.DaysOfWeek = [
        'ПН',
        'ВТ',
        'СР',
        'ЧТ',
        'ПТ',
        'СБ',
        'ВС'
    ];

    // Months, stating on January
    this.Months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    // Set the current month, year
    var d = new Date();

    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();

};

// Goes to next month
Cal.prototype.nextMonth = function () {
    if (this.currMonth == 11) {
        this.currMonth = 0;
        this.currYear = this.currYear + 1;
    }
    else {
        this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
};

// Goes to previous month
Cal.prototype.previousMonth = function () {
    if (this.currMonth == 0) {
        this.currMonth = 11;
        this.currYear = this.currYear - 1;
    }
    else {
        this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
};

// Show current month
Cal.prototype.showcurr = function () {
    this.showMonth(this.currYear, this.currMonth, this.events);
};

// Show month (year, month)
Cal.prototype.showMonth = function (year, month, eventsJSON) {

    const events = (eventsJSON !== null && eventsJSON !== undefined && eventsJSON.includes('{')) ? JSON.parse(eventsJSON) : {};

    var html = '<table>';

    // Write selected month and year
    html += '<thead><tr>';
    html += `<td><button id="btnPrev" type="button" onclick="PrevMonth()"><</button></td>`;
    html += `<td colspan="5">${this.Months[month]} ${year}</td>`;
    html += `<td><button id="btnNext" type="button" onclick="NextMonth()">></button></td>`;
    html += '</tr></thead>';


    // Write the header of the days of the week
    html += '<tr class="days">';

    this.DaysOfWeek.forEach((day) => {
        html+= `<td>${day}</td>`;
    });
    
    html += '</tr>';

    /*
    1. определим день недели первого дня текущего месяца
    0 - ВС
    1 - ПН
    ...
    6 - СБ

    2. определим сколько дней прошлого месяца в текущей неделе перед настоящим месяцем
    3. заполним все настоящим месяцем
    4. добьем до конца датами нового месяца
    */
    const firstDayOfRealMonth = (new Date(year, month, 1).getDay() > 0) ? new Date(year, month, 1).getDay() : 7;
    const totalDaysInRealMonth = new Date(year, month + 1, 0).getDate();

    const daysFromPreviosMonth = (firstDayOfRealMonth > 1) ? firstDayOfRealMonth - 1 : 0; // сколько дней старого месяца
    const daiysInPreviosMonth = new Date(year, month, 0).getDate(); // сколько вообще дней в старом месяце

    let weekCounter = firstDayOfRealMonth;

    html += '<tr>'; // начинаем строку заполнения
    for(let oldDay = daiysInPreviosMonth - daysFromPreviosMonth + 1; oldDay <= daiysInPreviosMonth; oldDay++) {
        html += '<td class="not-current">' + oldDay + '</td>';
    }

    // начинаем заполнение настоящего  месяца
    for(let presentDay = 1; presentDay <= totalDaysInRealMonth; presentDay++) {
        let tdID = '';
        let href = '';

        for (let event in events) {
            const event_date_start = new Date(events[event].date_start).getDate();
            const event_date_end = new Date(events[event].date_end).getDate();

            if(month == new Date(events[event].date_start).getMonth() && year == new Date(events[event].date_start).getFullYear()) {
                if(presentDay <= event_date_end && presentDay >= event_date_start) {
                    tdID = 'id="dataWithEvent"';
                    href = `href="${events[event].url}"`;
                }
            }
        }

        if(weekCounter == 1) html += '<tr>';

        if (presentDay == this.currDay && this.currMonth == new Date().getMonth() && this.currYear == new Date().getFullYear()) {
            html += (href.length > 4) ? `<td class="today" ${tdID}><a class="calendar-link" ${href}>${presentDay}</a></td>` : `<td class="today" ${tdID}>${presentDay}</td>`;
        } else {
            html += (href.length > 4) ? `<td class="normal" ${tdID}><a class="calendar-link" ${href}>${presentDay}</a></td>` : `<td class="normal" ${tdID}>${presentDay}</td>`;
        }
        // If Saturday, closes the row
        if (weekCounter == 7) html += '</tr>';
        
        if(weekCounter < 7) weekCounter++;
        else weekCounter = 1;
    }

    // заполним остатками
    for(let futureDay = 1; weekCounter <= 7; futureDay++, weekCounter++) {
        html += '<td class="not-current">' + futureDay + '</td>';
    }
    html += '</tr>';
    // Closes table
    html += '</table>';
    
    // Write HTML to the div
    document.getElementById(this.divId).innerHTML = html;
};

// On Load of the window
var CalendarStart= function (events) {

    //let eventList = getId("calEventSorce").innerHTML;
    // Start calendar
    var c = new Cal("divCal", events);
    PrevMonth = function() {c.previousMonth()};
    NextMonth = function() {c.nextMonth()};
    c.showcurr();
}

// Get element by id
function getId(id) {
    return document.getElementById(id);
}