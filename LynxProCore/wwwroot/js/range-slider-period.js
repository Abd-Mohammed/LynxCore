
var format24Hour = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15',
    '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '23:59'];

var format12Hour = ['00:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '01:00 AM', '01:15 AM', '01:30 AM', '01:45 AM', '02:00 AM', '02:15 AM', '02:30 AM', '02:45 AM', '03:00 AM', '03:15 AM', '03:30 AM', '03:45 AM', '04:00 AM', '04:15 AM', '04:30 AM', '04:45 AM', '05:00 AM', '05:15 AM', '05:30 AM', '05:45 AM', '06:00 AM', '06:15 AM', '06:30 AM', '06:45 AM', '07:00 AM', '07:15 AM', '07:30 AM', '07:45 AM', '08:00 AM', '08:15 AM',
    '08:30 AM', '08:45 AM', '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM', '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM', '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
    '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM', '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM', '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM', '08:00 PM', '08:15 PM', '08:30 PM', '08:45 PM', '09:00 PM', '09:15 PM', '09:30 PM', '09:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM', '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM', '11:59 PM'];

var fromIndex = -1;
var toIndex = -1;
var fromValue = '';
var toValue = '';
var values = [];
function RangeSlider(startValue, endValue, devId, minInterval, maxInterval, startInputId, endInputId, Is24TimeFormat,validationCallback) { 

    if (Is24TimeFormat == 'True') {
        values = format24Hour;
    } else {
        values = format12Hour; 
    }

    fromIndex = format24Hour.indexOf(startValue);
    toIndex = format24Hour.indexOf(endValue);

    if (toIndex <= fromIndex) {
        toIndex = format24Hour.lastIndexOf(endValue);
    }

    fromValue = values[fromIndex];
    toValue = values[toIndex];

    var id = $('#range-slider' + devId); 
    id.ionRangeSlider({
        type: 'double',
        values: values,
        from: fromIndex,
        to: toIndex,
        max_interval: maxInterval,
        min_interval: minInterval,
        drag_interval: true,
        grid: true,
        onFinish: function (data) {
            $('#' + startInputId).val(format24Hour[data.from]); 
            $('#' + endInputId).val(format24Hour[data.to] === '23:59' ? '01:00:00:00' : format24Hour[data.to]); 
        },
        onChange: function (data) {
            if (typeof validationCallback === 'function') {
                fromIndex = data.from;
                toIndex = data.to;

                validationCallback();
            }
        }
    });    
    id.data("ionRangeSlider").update({        
        from: fromIndex,
        to: toIndex 
    });

}

 

