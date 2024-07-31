var trackingEnabled = false;
var trackingPolyline = null;
var trackingCoordinates = [];
var snapToRoadEnabled = false;
var retryTracking = false;

function toggleTracking() {
    if (isTrackingEnabled() || !$('.action-butns-icon-track').hasClass('off')) {
        // stop tracking.
        disableTrackingButton();
        stopTracking();
        toastBox.show('info', '[[[[Route tracking stopped]]]]');
    } else {
        // Restore map markers if a historical route was being tracked.
        if (historicalRoutesManager.isEnabled()) {
            // Stop historical route tracking if enabled.
            clearHistoricalRoute();

            // Restore markers.
            scheduler.execute('map-entities');
        }

        if (drawRoutesManager.isEnabled())
        {
            clearRideRoute();
            scheduler.execute('map-entities');
        }

        // start tracking.
        enableTrackingButton();
        toastBox.show('info', '[[[[Route tracking started]]]]');

        startTracking();
    }
}

/**
 * Start route tracking for the current selected entity marker location.
 */
function startTracking() {

    retryTracking = true;

    if (infowindow.getMap() != null) {
        infowindow.setMap(null);
    }

    let targetMarker = markers.filter(m => m.data.id == selectedEntity.id &&
        m.data.entityType == selectedEntity.type &&
        m.data.tenantId == selectedEntity.tenantId)[0];

    if (targetMarker == null) {
        if (retryTracking) {
            setTimeout(() => {
                startTracking();
            }, 300);
        }
        return;
    }

    retryTracking = false;

    // If there is a previous tracking session opened then clear it.
    if (isTrackingEnabled()) {
        stopTracking();
    }

    trackingEnabled = true;

    enableTrackingButton();

    updateTracking();
}

/**
 * Update the tracking polyline based on the current entity location.
 */
function updateTracking() {
    let targetMarker = markers.filter(m => m.data.id == selectedEntity.id &&
        m.data.entityType == selectedEntity.type &&
        m.data.tenantId == selectedEntity.tenantId)[0];

    if (targetMarker == null) {
        stopTracking();
        return;
    }

    let location = targetMarker.getPosition();

    map.panTo(location);
    map.setZoom(18);
}

/**
 * Stop route tracking and clear the map.
 */
function stopTracking() {
    trackingEnabled = false;
    retryTracking = false;
}

function forceStopTracking(message = null) {
    disableTrackingButton();
    stopTracking();

    if (message != null) {
        toastBox.show('info', message);
    }
}

function isTrackingEnabled() {
    return trackingEnabled;
}

function enableTrackingButton() {
    $('.action-butns-icon-track').addClass('on');
    $('.action-butns-icon-track').removeClass('off');
}

function disableTrackingButton() {
    $('.action-butns-icon-track').removeClass('on');
    $('.action-butns-icon-track').addClass('off');
}