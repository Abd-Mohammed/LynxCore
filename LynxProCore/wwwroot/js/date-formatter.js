(function (dateFormatter, undefined) {

    dateFormatter.formatDayMonth = function (obj) {
        var date = kendo.parseDate(obj);
        var time = kendo.toString(date, 't');
        var customDate = kendo.toString(date, 'd');
        var sperator = customDate.replace(/[0-9]/g, '');
        sperator = sperator[0];
        customDate = customDate.replace(date.getFullYear() + sperator, '').replace(sperator + date.getFullYear(), '');
        return customDate;
    };

    dateFormatter.formatDayMonthTime = function (obj) {
        var date = kendo.parseDate(obj);
        var time = kendo.toString(date, 't');
        var customDate = kendo.toString(date, 'd');
        var sperator = customDate.replace(/[0-9]/g, '');
        sperator = sperator[0];
        customDate = customDate.replace(date.getFullYear() + sperator, '').replace(sperator + date.getFullYear(), '');
        return customDate + ' ' + time;
    };

    dateFormatter.formatDateOnly = function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    dateFormatter.toTimeString = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

}(window.dateFormatter = window.dateFormatter || {}));