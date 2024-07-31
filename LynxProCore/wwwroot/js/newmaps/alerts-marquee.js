var isPaused = false;

$(document).ready(() => {
    startAlertMarquee();
});

function toggleAlertMarquee() {
    if (isPaused) {
        startAlertMarquee();
    } else {
        stopAlertMarquee();
    }

    isPaused = !isPaused;
}

function startAlertMarquee() {
    scheduler.register('marquee', () => {
        getMarqueeAlerts();
    });
}

function stopAlertMarquee() {
    scheduler.unRegister('marquee');
}

function getMarqueeAlerts() {
    $.get(`${mapsBaseUrl}/GetMarqueeAlerts`).done((response) => {
        var container = $('.marquee-body');
        var template = `<li><div><i class="fa fa-warning"></i> <b>$name$:</b> <span>$description$</span></div></li>`
        var items = '';

        response.forEach(alert => {
            items += template.replace('$name$', alert.EntityName).replace('$description$', alert.Description);
        });

        container.html(items);
    });
}