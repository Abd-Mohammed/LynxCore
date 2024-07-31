(function (kendoCulture, undefined) {

    kendoCulture.pattern = function (type) {
        var culture = kendo.getCulture();
        if (type === 'G') {
            return culture.calendars.standard.patterns.G;
        }
        if (type === 'g') {
            return culture.calendars.standard.patterns.g;
        }
        else {
            throw new Error("Type is not supported");
        }
    };
}(window.kendoCulture = window.kendoCulture || {}));