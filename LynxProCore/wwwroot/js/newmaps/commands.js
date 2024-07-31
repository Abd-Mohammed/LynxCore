function lockDoor() {
    var vehicle = getCommandSource();
    $.get(`${commandsBaseUrl}/lockdoor`, {
        tenantId: vehicle.tenantId,
        vehicleId: vehicle.id,
    }).then(response => {
        handleResponse(response);
    }, result => {
        if (result.status == 402) {
            toastBox.show('warning', '[[[[Could not send request. Payment is required.]]]]');
        }
    });
}

function unlockDoor() {
    var vehicle = getCommandSource();
    $.get(`${commandsBaseUrl}/unlockdoor`, {
        tenantId: vehicle.tenantId,
        vehicleId: vehicle.id,
    }).then(response => {
        handleResponse(response);
    }, result => {
        if (result.status == 402) {
            toastBox.show('warning', '[[[[Could not send request. Payment is required.]]]]');
        }
    });
}

function switchOn() {
    var vehicle = getCommandSource();
    $.get(`${commandsBaseUrl}/turnonvehicle`, {
        tenantId: vehicle.tenantId,
        vehicleId: vehicle.id,
    }).then(response => {
        handleResponse(response);
    }, result => {
        if (result.status == 402) {
            toastBox.show('warning', '[[[[Could not send request. Payment is required.]]]]');
        }
    });
}

function switchOff() {
    var vehicle = getCommandSource();
    $.get(`${commandsBaseUrl}/turnoffvehicle`, {
        tenantId: vehicle.tenantId,
        vehicleId: vehicle.id,
    }).then(response => {
        handleResponse(response);
    }, result => {
        if (result.status == 402) {
            toastBox.show('warning', '[[[[Could not send request. Payment is required.]]]]');
        }
    });
}

function setCommandSource(fromMarker, popupid) {
    $(`#${popupid}`).appendTo('#map-canvas > div');
    $(`#${popupid}`).modal('show');
    showDialogMode();
    markerSource = fromMarker;
}

function showDialogMode() {
    if ($(map.getDiv()).children().eq(0).height() == window.innerHeight &&
        $(map.getDiv()).children().eq(0).width() == window.innerWidth) {
        $('.modal-backdrop.fade.in').appendTo($('.gm-style'));
    }
}

function getCommandSource() {
    if (markerSource === true) {
        return {
            tenantId: infowindow.tenantId,
            id: infowindow.id
        };
    }

    return {
        tenantId: selectedEntity.tenantId,
        id: selectedEntity.id
    };
}

function handleResponse(response) {
    if (response.result == 1) {
        toastBox.show('success', response.resultMessage);
        $("#toast-container").appendTo($("#map-canvas").children()[0]);
        return;
    }

    toastBox.show('warning', response.resultMessage);
    $("#toast-container").appendTo($("#map-canvas").children()[0]);
}