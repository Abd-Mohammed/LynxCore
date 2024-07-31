window.toastQueue = [];

(function (toastBox, undefined) {

    toastBox.show = function (type, message) {

        toastr.options = {
            'closeButton': true,
            'debug': false,
            'positionClass': 'toast-top-center',
            'onclick': null,
            'showDuration': '1000',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };

        toastr[type](message, getTitle(type));
    }

    toastBox.showAlways = function (type, message) {

        toastr.options = {
            'closeButton': true,
            'debug': false,
            'positionClass': 'toast-top-right',
            'onclick': null,
            'showDuration': '1000',
            'hideDuration': '1000',
            'timeOut': '0',
            'extendedTimeOut': '0',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };

        toastr[type](message, getTitle(type));
    }

    toastBox.showFirst = function () {
        // base case.
        if (toastQueue.length == 0) {
            return;
        }

        var info = toastQueue[0];

        toastr.options = {
            'closeButton': true,
            'debug': false,
            'positionClass': 'toast-top-right',
            'onclick': null,
            'showDuration': '1000',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };

        toastr.options.onHidden = function () {
            // remove the first element from the queue (also works as a lock when calling the enqueue).
            toastQueue.shift();

            // recursive call
            toastBox.showFirst();
        }

        toastr[info.type](info.message, getTitle(info.type))
    }

    toastBox.enqueue = function (type, message) {
        toastQueue.push({
            type: type,
            message: message,
        });

        if (toastQueue.length > 3) {
            toastr.remove();
            toastQueue.shift();
        }

        // fire the notification directly if this is the first notification message.
        if (toastQueue.length == 1) {
            toastBox.showFirst();
        }
    }

    function getTitle(t) {

        switch (t) {
            case 'success':
                return '[[[[Success]]]]';
            case 'warning':
                return '[[[[Warning]]]]';
            case 'error':
                return '[[[[Error]]]]';
            case 'info':
            default:
                return '[[[[Info]]]]';
        }
    }

}(window.toastBox = window.toastBox || {}));