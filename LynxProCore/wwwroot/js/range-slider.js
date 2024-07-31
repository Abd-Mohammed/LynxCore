var fromIndex = -1;
var toIndex = -1;
var fromValue = '';
var toValue = '';

function rangeSlider(startValue, endValue, minInterval, maxInterval, format, onFinishCallback, validationCallback) {
    var values;

    if (format === '36') {
        values = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
            '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00',
            '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
            '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
    }
    else if (format === '24') {
        values = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
            '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];
    }

    fromIndex = values.indexOf(startValue);
    toIndex = values.indexOf(endValue);

    if (toIndex <= fromIndex) {
        toIndex = values.lastIndexOf(endValue);
    }

    fromValue = values[fromIndex];
    toValue = values[toIndex];

    $('#range-slider').ionRangeSlider({
        type: 'double',
        values: values,
        from: fromIndex,
        to: toIndex,
        max_interval: maxInterval,
        min_interval: minInterval,
        drag_interval: true,
        grid: true,
        //grid_num: 12,
        //grid_snap: true,
        //keyboard: true,
        //keyboard_step: 2.0,
        //step: 1,
        onFinish: function (data) {
            if (typeof onFinishCallback === 'function') {
                fromValue = data.from_value;
                toValue = data.to_value;

                onFinishCallback();
            }
        },
        onChange: function (data) {
            if (typeof validationCallback === 'function') {
                fromIndex = data.from;
                toIndex = data.to;

                validationCallback();
            }
        }
    });
}

function getFromIndex() {
    return fromIndex;
}

function getToIndex() {
    return toIndex;
}

function getFromValue() {
    return fromValue;
}

function getToValue() {
    return toValue;
}


(function (rangeslider, undefined) {
    var fromIndex = -1;
    var toIndex = -1;
    var fromValue = '';
    var toValue = '';

    rangeslider.init = function (id, startValue, endValue, minInterval, maxInterval, format, Is24TimeFormat, onFinishCallback, validationCallback) {
        var values;

        var format12Hour = ['00:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
            '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '11:59:59 PM'];


        if (format === '36') {
            values = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
                '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00',
                '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
                '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
        }
        else if (format === '24') {
            values = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
                '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '23:59'];
        }

        if (Is24TimeFormat && Is24TimeFormat == 'true') {
            values = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
                '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '23:59:59'];
        } else {
            values = format12Hour;
        }


        fromIndex = values.indexOf(startValue);
        toIndex = values.indexOf(endValue);

        if (toIndex <= fromIndex) {
            toIndex = values.lastIndexOf(endValue);
        }

        fromValue = values[fromIndex];
        toValue = values[toIndex];

        $('#' + id).ionRangeSlider({
            type: 'double',
            values: values,
            from: fromIndex,
            to: toIndex,
            max_interval: maxInterval,
            min_interval: minInterval,
            drag_interval: true,
            grid: true,
            //grid_num: 12,
            //grid_snap: true,
            //keyboard: true,
            //keyboard_step: 2.0,
            //step: 1,
            onFinish: function (data) {
                if (typeof onFinishCallback === 'function') {
                    fromValue = data.from_value;
                    toValue = data.to_value;

                    onFinishCallback();
                }
            },
            onChange: function (data) {
                if (typeof validationCallback === 'function') {
                    fromIndex = data.from;
                    toIndex = data.to;

                    validationCallback();
                }
            }
        });
    };

    rangeslider.getFromIndex = function () {
        return fromIndex;
    };

    rangeslider.getToIndex = function () {
        return toIndex;
    };

    rangeslider.getFromValue = function () {
        return fromValue;
    };

    rangeslider.getToValue = function () {
        return toValue;
    };

}(window.rangeslider = window.rangeslider || {}));