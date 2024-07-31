(function (alertBox, undefined) {

    alertBox.show = function (type, title, message, container) {

        showAlert(type, message, container);
    }

    alertBox.showMany = function (type, title, messages, container) {

        var length = messages.length;
        var needScroll = length > 5;

        var html = title;
        html += '<div class="scroller" style="max-height:100px;">';
        html += '<ul>'
        for (var i = 0; i < length; i++) {
            html += '<li>' + messages[i] + '</li>'
        }
        html += '</ul>'
        html += '</div>'

        showAlert(type, html, container);
    }

    function showAlert(type, message, container) {

        Metronic.alert({
            container: container || '.portlet-body',
            place: 'prepend',
            type: getType(type),
            message: message,
            close: true,
            reset: true,
            focus: false,
            closeInSeconds: 0,
            icon: getIcon(type)
        });
    }

    function getType(t) {

        switch (t) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'danger';
            case 'info':
            default:
                return 'info';
        }
    }

    function getIcon(type) {

        switch (type) {
            case 'success':
                return 'check';
            case 'warning':
                return 'exclamation';
            case 'error':
                return 'times';
            case 'info':
            default:
                return 'info';
        }
    }

}(window.alertBox = window.alertBox || {}));