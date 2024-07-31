var selectedEntity = {};
var currentTab = 'tab_1_1';
var clusterer;
var mapFiltersSnapshot = {};
var selectedEntityInitialLocation = null;
var entityConditions = [];
var meterStatuses = [];
var entityConditionFlag = 0;
var tenantsWithRidesharing = [];
var userRefreshRate = 0;
var meterStatusFlag = 0;
var selectEntityLoading = false;
var routesWeekOffset = 0;
var ridesWeekOffset = 0;
var showCloseBtn = false;
var routesViewType = "timeline"; // "timeline" or "table"
var ridesViewType = "timeline";
var hasVehicleRideStates = false;
var meterStatusFilterShow = false;

function setEntityCondition(condition) {
    if (entityConditions.indexOf(condition) != -1) {
        // if exists, remove condition.
        entityConditionFlag -= condition;

        entityConditions = entityConditions.filter(c => c != condition);
    } else {
        // if not exists, add it.
        entityConditionFlag += condition;

        entityConditions.push(condition);
    }

    executeSearch();
}

function setMeterStatus(meterStatus) {
    if (meterStatuses.indexOf(meterStatus) != -1) {
        // if exists, remove condition.
        meterStatusFlag -= meterStatus;

        meterStatuses = meterStatuses.filter(c => c != meterStatus);
    } else {
        // if not exists, add it.
        meterStatusFlag += meterStatus;

        meterStatuses.push(meterStatus);
    }
    executeSearch();
}

function executeSearch() {
    $('#search-btn').click();
}

function keepFilter() {
    var obj = {
        option2: $('#option2').is(':checked'),
        option3: $('#option3').is(':checked'),
        option4: $('#option4').is(':checked'),
        option5: $('#option5').is(':checked')
    };
    localStorage.setItem("mapsFilters", JSON.stringify(obj));
}

function searchEntitySelect(e) {
    var data = e.dataItem;
    var entityId = data.Id;
    var tenantId = data.TenantId;
    var entityType = data.Type;
    var entityName = data.Name;

    getMapEntities(entityType, entityName, tenantId);

    clearPoisMarkers();
    $('.map-btns-pois').removeClass('active');
    getPoiEntities(Number(tenantId), entityName);
}

function filterChanged() {
    // Note, don't write direct logic here. separate the login in new methods and call them.
}

function tenantFilterChanged() {
    executeSearch();

    if (tenantsWithRidesharing.indexOf(parseInt(window.$("#tenantId").data("kendoDropDownList").value())) !== -1) {
        window.scheduler.changeInterval(7000, true);

        document.getElementById("refresh-default-value").disabled = false;
        document.getElementById("refresh-default-value").hidden = false;
        document.getElementById("refreshRate-select").selectedIndex = 0;

    } else {
        document.getElementById("refresh-default-value").disabled = true;
        document.getElementById("refresh-default-value").hidden = true;
        document.getElementById("refreshRate-select").selectedIndex = 1;

        window.scheduler.changeInterval(parseInt(userRefreshRate), true);
    }
    // Reload vehicle franchises based on the selected tenant.
    $("#VehicleFranchises").data("kendoDropDownList").dataSource.read();

    $("#operationalStatus").data("kendoDropDownList").dataSource.read();

}

function typeFilterChanged() {
    var entityType = $('#entityType').val();

    // rerender status filter.
    rerenderStatusFilter(hasVehicleRideStates);

    $("#VehicleFranchises").data("kendoDropDownList").value("");
    $("#operationalStatus").data("kendoDropDownList").value("");

    if (entityType == 1) {
        if ($('#VehicleFranchises').data('kendoDropDownList').dataItems().length == 0) {
            $('#VehicleFranchises').parent().hide();
        } else {
            $('#VehicleFranchises').parent().show();
        }
        hideShowOperationalStatus(entityType);

    } else {
        $('#VehicleFranchises').parent().hide();
        $('#operationalStatus').parent().hide();
    }

}

function vehicleFranshiseDataBound(args) {
    var entityType = $('#entityType').val();
    if (!hasTrackedAssets || entityType == 1) {
        if ($('#VehicleFranchises').data('kendoDropDownList').dataItems().length == 0) {
            $('#VehicleFranchises').parent().hide();
        } else {
            $('#VehicleFranchises').parent().show();
        }
    } else {
        $('#VehicleFranchises').parent().hide();
    }

}

function operationalStatusDataBound(args) {
    var entityType = $('#entityType').val();
    hideShowOperationalStatus(entityType);
}

function hideShowOperationalStatus(entityType) {
    if (!hasTrackedAssets || entityType == 1) {
        if ($('#operationalStatus').data('kendoDropDownList').dataItems().length == 0) {
            $('#operationalStatus').parent().hide();
        } else {
            $('#operationalStatus').parent().show();
        }
    } else {
        $('#operationalStatus').parent().hide();
    }
}



function onVehicleNameChange() {
    // On typing only.
}

function getMapEntities(type, entityName, tenantId) {
    // update the filters snapshot.
    mapFiltersSnapshot = {
        type: type,
        entityName: entityName,
        tenantId: tenantId,
        vehicleFranchiseId: $('#VehicleFranchises').val(),
        vehicleConditionId: $('#operationalStatus').val()
    };

    scheduler.unRegister('map-entities');

    forceStopTracking();

    sendMapEntitiesRequest(false);

    // set a refresh handler.
    scheduler.register('map-entities', () => { sendMapEntitiesRequest(true); }, false);
    keepFilter();
}

function sendMapEntitiesRequest(autoRefresh = false) {

    var entityType = mapFiltersSnapshot.type;

    if (hasTrackedAssets == false) {
        entityType = 1;
    }

    if (!autoRefresh) {
        if (parseInt(entityType) === 1 && hasVehicleRideStates) {
            $('#accordion22').show();
            meterStatusFilterShow = true;
        }
        else {
            $('#accordion22').hide();
            meterStatusFilterShow = false;
        }
    }

    $.get(`${mapsBaseUrl}/GetMapEntities`, {
        name: mapFiltersSnapshot.entityName,
        entityStatus: entityConditionFlag,
        entityType: mapFiltersSnapshot.type,
        tenantId: mapFiltersSnapshot.tenantId,
        vehicleFranchiseId: mapFiltersSnapshot.vehicleFranchiseId,
        franchiseColorEnabled: isFranchiseColorEnabled(),
        vehicleConditionId: $('#operationalStatus').val(),
        meterStatus: meterStatusFlag,
        meterDeviceStatuses: meterStatusFlag
    }).done(entities => {
        renderMarkers(entities.entries, autoRefresh);
        calculateVehicleCountByStatus(entities.statuses);
        calculateVehicleCountByMeterStatus(entities.meterStatuses);
    });
}

function calculateVehicleCountByMeterStatus(meterStatuses) {

    const labelids = [
        {
            id: 'vacantCount', key: 'Vacant',
        },
        {
            id: 'engagedCount', key: 'Engaged',
        },
        {
            id: 'offlineCount', key: 'Offline',
        },
        {
            id: 'suspendedCount', key: 'Suspended',
        },
        {
            id: 'InactiveCount', key: 'Inactive',
        }
    ];


    const length = labelids.length;

    for (var i = 0; i < length; i++) {
        const label = labelids[i];
        $("#" + label.id).text("(" + meterStatuses[label.key] + ")");
    }
}

function calculateVehicleCountByStatus(statuses) {

    const labelids = [
        {
            id: 'disccountedCount', key: 'NoData'
        },
        {
            id: 'switchedOffCount', key: 'SwitchedOff',
        },
        {
            id: 'stationaryCount', key: 'Stationary',
        },
        {
            id: 'movingCount', key: 'Moving',
        }

    ];

    const length = labelids.length;

    for (var i = 0; i < length; i++) {
        const label = labelids[i];
        $("#" + label.id).text("(" + statuses[label.key] + ")");
    }

}

function clearAllMarkers(stopLiveTracking = false) {
    if (stopLiveTracking) {
        if (isTrackingEnabled()) {
            stopTracking();
        }
    }

    // Remove old markers from the clusterer.
    if (clusterer != null) {
        clusterer.clearMarkers();
        clusterer.setMap(null);
    }

    // clear the old markers.
    markers = [];
}

function deselectEntity() {
    // Hide the clear button
    showCloseBtn = false;
    $('#clearButton').toggleClass('active in');

    // Clear the entity information window wrapper.
    $('#entity-information').html(`<div style=" width: 100%; display: flex; align-items: center; justify-content: center; height: 100%;">
        <span>Please click on a marker to show the details.</span>
    </div>`);

    // Unregister auto-refresh for the vehicle window.
    if (scheduler.isRegistered('info-window')) {
        scheduler.unRegister('info-window');
    }

    // Clear the historical route, if exists and restart the scheduler.
    if (historicalRoutesManager.isEnabled()) {
        historicalRoutesManager.clear();
        scheduler.start(true);
    }

    if (drawRoutesManager.isEnabled()) {
        drawRoutesManager.clear();
        scheduler.start(true);
    }

    // Stop the live tracking, if enabled.
    if (isTrackingEnabled()) {
        stopTracking();
    }

    // Clear the selected entity data.
    selectedEntity = {};

    // Close the information window.
    closeInformationWindow();

    // Fit vehicles to map bounds.
    clusterer.fitMapToMarkers();
}

function meterStatusIcon(fillColor = '#fa0') {
    return `<svg width="35"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29 15"><defs>
        <style>
.j{mask:url(#h);}
.k{fill:#fff;}
.l{mix - blend - mode:multiply;}
.l,.m{opacity:.75;}
.n{mask:url(#f);}
.o{isolation:isolate;}
.p{filter:url(#e);}
.q{fill:#ffb000;}
.r{filter:url(#g);}
.s{mask:url(#d);}
.m{mix - blend - mode:screen;}
</style>
<filter id="e" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feColorMatrix values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0" /></filter>
<mask id="d" x="-2.5" y="-2.5" width="34" height="20" maskUnits="userSpaceOnUse"><g class="p"><use xlink:href="#i" /></g></mask>
<mask id="f" x="-2.5" y="-2.5" width="34" height="20" maskUnits="userSpaceOnUse"><g class="r"><use xlink:href="#i" /></g></mask>
<mask id="h" x="-2.5" y="-2.5" width="34" height="20" maskUnits="userSpaceOnUse"><g class="p"><use xlink:href="#i" /></g></mask>
<image id="i" transform="translate(-2.5 -2.5)" xlink:href="" /></defs><g class="o"><g id="a" /><g id="b"><g id="c"><g><g><path class="q" d="M.84,14.36L3.34,5.31C4.1,2.56,6.62,.64,9.47,.64h10.06c2.85,0,5.37,1.92,6.13,4.66l2.5,9.05H.84Z" /><path class="k" d="M19.53,1.28c2.56,0,4.83,1.72,5.51,4.19l2.28,8.24H1.69L3.96,5.48c.68-2.47,2.95-4.19,5.51-4.19h10.06m0-1.28H9.47C6.32,0,3.56,2.1,2.72,5.14L0,15H29l-2.72-9.86c-.84-3.03-3.6-5.14-6.75-5.14h0Z" /></g><g><g>
<path class="t" fill="${fillColor}" d="M29,15H0L2.72,5.14C3.56,2.1,6.32,0,9.47,0h10.06c3.15,0,5.91,2.1,6.75,5.14l2.72,9.86Z" />
 <g class="s">
<g class="l">
<path d="M29,15H0L2.72,5.14C3.56,2.1,6.32,0,9.47,0h10.06c3.15,0,5.91,2.1,6.75,5.14l2.72,9.86Z" /></g></g></g>
<g class="n">
<g class="m">
<path class="t" d="M29,15H0L2.72,5.14C3.56,2.1,6.32,0,9.47,0h10.06c3.15,0,5.91,2.1,6.75,5.14l2.72,9.86Z" />
                <g class="j">
                    <g class="l"><path class="t" d="M29,15H0L2.72,5.14C3.56,2.1,6.32,0,9.47,0h10.06c3.15,0,5.91,2.1,6.75,5.14l2.72,9.86Z" />
                    </g></g></g></g>
        </g>
            <path class="k" d="M19.53,1.28c2.56,0,4.83,1.72,5.51,4.19l2.28,8.24H1.69L3.96,5.48c.68-2.47,2.95-4.19,5.51-4.19h10.06m0-1.28H9.47C6.32,0,3.56,2.1,2.72,5.14L0,15H29l-2.72-9.86c-.84-3.03-3.6-5.14-6.75-5.14h0Z" /></g>
        </g></g></g></svg>`
}

function renderMarkers(mapEntities, autoRefresh) {
    clearAllMarkers(!autoRefresh);
    
    clearHistoricalRoute();
    clearRideRoute();

    mapEntities.forEach((entity, i) => {
        var marker = new markerWithLabel.MarkerWithLabel({
            position: { lat: entity.Lat, lng: entity.Lng },
            visible: false,
            labelContent: `
                <div class="marker-direction" style="pointer-events: none;">
                ${(entity.MeterStatus || entity.MeterStatusValue) && meterStatusFilterShow ? `<div>${meterStatusIcon(entity.MeterStatusColor)}</div >` : ''}
                    <div class="marker-label flex-container" style="background-color: #f2f2f2;pointer-events: none;">
                        <div class="marker-label-icon" style="pointer-events: none;background-color: ${entity.FranshiseColor};mask-image: url(../wwwroot/images/vehicle-types-new/${getIconName(entity.IconName, entity.EntityType)});-webkit-mask-image: url(../wwwroot/images/vehicle-types-new/${getIconName(entity.IconName, entity.EntityType)});"></div>
                        <div class="marker-label-text" style="pointer-events: none;color: #333333;">
                            <div class="font-wait-semi-b" style="pointer-events: none;">${entity.Name}</div>
                            <div style="pointer-events: none;">${getDriverName(entity.DriverName)}</div>
                        </div>
                        <span style="background-color:#f2f2f2;pointer-events: none;"></span>
                    </div>
                </div>`,
            labelAnchor: new google.maps.Point(-84, 5),
            data: {
                tenantId: entity.TenantId,
                id: entity.Id,
                name: entity.Name,
                entityType: entity.EntityType,
                iconName: entity.IconName,
                color: entity.Color,
                franchiseColor: entity.FranshiseColor,
                angle: entity.Angle,
                OpenCriticalAlertsCount: entity.OpenCriticalAlertsCount,
                OpenWarningAlertsCount: entity.OpenWarningAlertsCount,
                OpenInformationAlertsCount: entity.OpenInformationAlertsCount
            }
        });

        markers.push(marker);

        google.maps.event.addListener(marker, "click", () => {
            var marker = markers[i];

            map.panTo(marker.getPosition());

            if (scheduler.isRegistered('info-window')) {
                scheduler.unRegister('info-window');
            }

            selectEntity(marker.data.id, marker.data.entityType, marker.data.tenantId, marker);

            scheduler.register('info-window', () => {
                selectEntity(marker.data.id, marker.data.entityType, marker.data.tenantId, marker, true);
            }, false);

            // Make sure to clear stop the previous tracking session if exists.
            stopTracking();
        });

        google.maps.event.addListener(marker, "mouseover", function (e) {
            // If live tracking is enabled, disable marker hovering.
            if (isTrackingEnabled() ||
                ($('.action-butns-icon-track').length && !$('.action-butns-icon-track').hasClass('off'))) {
                return;
            }

            // If infowindow is already opened then return.
            if (infowindow.id === marker.data.id && infowindow.map != null) {
                return;
            }

            infowindow.tenantId = marker.data.tenantId;
            infowindow.id = marker.data.id;

            // Get infowindow data.
            getEntitySummary(marker.data.id, marker.data.entityType, marker.data.tenantId, (response) => {

                // Check if another marker was hovered
                if (infowindow.id !== marker.data.id) {
                    return;
                }

                let streamingIcon;
                let infowindowContent;
                let alertsTags = '';
                if (marker.data.entityType === 1) {
                    streamingIcon = '';
                    if (response.HasStreamingCapabilities && response.HasStreamingAccess) {
                        streamingIcon = `<div class="h-b-btn-video" onClick="tryNavigateToStreaming('${response.TenantId}','${response.SerialNo}','${response.VehicleName}','${response.VideoDefaultChannel}','${response.VideoAutoPlay}')"></div>`
                    }
                  
                    if (response.ActiveAlerts.length !== 0) {
                        response.ActiveAlerts.forEach(element => {
                            let image = element.Image;
                            alertsTags = alertsTags + `<div class="margin-x-20 hover-alerts-icons-circle"><img src="/wwwroot/images/alerts/${image}" class="hover-alerts-icons" width="28" height="28" alt=""></div>`;
                        })
                        if (response.HasCommandSenderResolve || (response.HasStreamingCapabilities && response.HasStreamingAccess)) {
                            let commandsContent = ``;
                            if (response.HasCommandSenderResolve) {
                                commandsContent = `<div class="h-b-btn-unblug" onClick="setCommandSource(${true},'turnOff-modal')" title="[[[[Turn Off]]]]"></div>
                                       <div class="h-b-btn-blug" onClick="setCommandSource(${true},'turnOn-modal')" title="[[[[Turn On]]]]"></div>
                                       <div class="h-b-btn-lock" onClick="setCommandSource(${true},'lockDoor-modal')" title="[[[[Lock]]]]"></div>
                                       <div class="h-b-btn-unlock" onClick="setCommandSource(${true},'unlockDoor-modal')" title="[[[[unLock]]]]"></div>`;
                            }
                            infowindowContent = `
                        <div class="marker-stat-gray balloon-slider-container">
                            <div class="marker-hover-balloon">
                                <div class="hover-balloon-header"  style="background-color: ${entity.Color};">${response.Name}</div>
                                <div class="hover-balloon-body">
                                    <div class="text-color-dark"> <br> ${response.TenantName}</div>
                                    <div>${response.DriverName}</div>
                                    <div class="hover-balloon-body-center"><p id="geocode-text">(${response.Latlng})</p></div>
                                    <div>Last Updated : ${response.Timestamp}</div>
                                    <div><span class="text-color-dark">${response.Speed}</span> ${response.SpeedUnit}</div>
    
                                    <div class="hover-balloon-footer flex-container">
                                        ${alertsTags}
                                    </div>
                                    
                                    <div class="hover-balloon-footer flex-container">
                                       ${streamingIcon}
                                       ${commandsContent}
                                    </div>
                                </div>
                            </div>
                        </div>`
                        }
                        else {
                            infowindowContent = `
                        <div class="marker-stat-gray balloon-slider-container">
                            <div class="marker-hover-balloon">
                                <div class="hover-balloon-header"  style="background-color: ${entity.Color};">${response.Name}</div>
                                <div class="hover-balloon-body">
                                    <div class="text-color-dark"> <br> ${response.TenantName}</div>
                                    <div>${response.DriverName}</div>
                                    <div class="hover-balloon-body-center"><p id="geocode-text">(${response.Latlng})</p></div>
                                    <div>Last Updated : ${response.Timestamp}</div>
                                    <div><span class="text-color-dark">${response.Speed}</span> ${response.SpeedUnit}</div>
    
                                    <div class="hover-balloon-footer flex-container">
                                        ${alertsTags}
                                    </div>
                                </div>
                            </div>
                        </div>`
                        }
                    }
                    else {
                        if (response.HasCommandSenderResolve || (response.HasStreamingCapabilities && response.HasStreamingAccess)) {
                            let commandsContent = ``;
                            if (response.HasCommandSenderResolve) {
                                commandsContent = `<div class="h-b-btn-unblug" onClick="setCommandSource(${true},'turnOff-modal')" title="[[[[Turn Off]]]]"></div>
                                       <div class="h-b-btn-blug" onClick="setCommandSource(${true},'turnOn-modal')" title="[[[[Turn On]]]]"></div>
                                       <div class="h-b-btn-lock" onClick="setCommandSource(${true},'lockDoor-modal')" title="[[[[Lock]]]]"></div>
                                       <div class="h-b-btn-unlock" onClick="setCommandSource(${true},'unlockDoor-modal')" title="[[[[unLock]]]]"></div>`;
                            }
                            infowindowContent = `
                        <div class="marker-stat-gray balloon-slider-container">
                            <div class="marker-hover-balloon">
                                <div class="hover-balloon-header"  style="background-color: ${entity.Color};">${response.Name}</div>
                                <div class="hover-balloon-body">
                                    <div class="text-color-dark"> <br> ${response.TenantName}</div>
                                    <div>${response.DriverName}</div>
                                    <div class="hover-balloon-body-center"><p id="geocode-text">(${response.Latlng})</p></div>
                                    <div>Last Updated : ${response.Timestamp}</div>
                                    <div><span class="text-color-dark">${response.Speed}</span> ${response.SpeedUnit}</div>
                                    <div class="hover-balloon-footer flex-container">
                                       ${streamingIcon}
                                        ${commandsContent}
                                    </div>
                                </div>
                            </div>
                        </div>`
                        }
                        else {
                            infowindowContent = `
                        <div class="marker-stat-gray balloon-slider-container">
                            <div class="marker-hover-balloon">
                                <div class="hover-balloon-header"  style="background-color: ${entity.Color};">${response.Name}</div>
                                <div class="hover-balloon-body">
                                    <div class="text-color-dark"> <br> ${response.TenantName}</div>
                                    <div>${response.DriverName}</div>
                                    <div class="hover-balloon-body-center"><p id="geocode-text">(${response.Latlng})</p></div>
                                    <div>Last Updated : ${response.Timestamp}</div>
                                    <div><span class="text-color-dark">${response.Speed}</span> ${response.SpeedUnit}</div>
                                </div>
                            </div>
                        </div>`
                        }
                    }
                }
                else {
                    infowindowContent = `
                        <div class="marker-stat-gray balloon-slider-container">
                            <div class="marker-hover-balloon">
                                <div class="hover-balloon-header" style="background-color: ${entity.Color};">${response.Name}</div>
                                <div class="hover-balloon-body">
                                    <div class="text-color-dark">${response.TenantName}</div>
                                    <div class="hover-balloon-body-center"><p id="geocode-text">(${response.Latlng})</p></div>
                                    <div>Last Updated : ${response.Timestamp}</div>
                                </div>
                            </div>
                        </div>`;
                }

                geocoder.geocode(parseFloat(response.Lat), parseFloat(response.Lng), function (address) {
                    $('#geocode-text').html(address + " (" + response.Latlng + ")");
                });

                infowindow.setContent(infowindowContent);
                infowindow.setPosition({ lat: entity.Lat, lng: entity.Lng })
                infowindow.open(map, marker);
            });
        });
    });

    clusterer = new MarkerClusterer(map, markers, {
        imagePath: clustererIcon,
        maxZoom: 19
    });

    // This could is a workaround to load huge amount of markers on the map.
    google.maps.event.addListener(clusterer, "clusteringend", () => {
        markers.forEach((marker) => {
            if (marker.getMap() != null) {
                var svgImage = "";
                if (marker.data.OpenCriticalAlertsCount > 0 && $('#option3').is(':checked') == true) {
                    svgImage = `<svg id="eOteMnr4JwH1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 42 42" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"> <style><![CDATA[ #eOteMnr4JwH3_ts {animation: eOteMnr4JwH3_ts__ts 1000ms linear infinite normal forwards}@keyframes eOteMnr4JwH3_ts__ts { 0% {transform: translate(21px,21px) scale(1.000001,1.000001)} 2% {transform: translate(21px,21px) scale(0.984869,0.980953)} 90% {transform: translate(21px,21px) scale(0.319047,0.142859)} 100% {transform: translate(21px,21px) scale(0.319047,0.142859)}} ]]></style> <defs><radialGradient id="eOteMnr4JwH3-fill" cx="0" cy="0" r="21" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 0)"><stop id="eOteMnr4JwH3-fill-0" offset="75%" stop-color="#c70000"/><stop id="eOteMnr4JwH3-fill-1" offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle r="21" transform="translate(21 21)" opacity="0.44" fill="#fff"/><g id="eOteMnr4JwH3_ts" transform="translate(21,21) scale(1.000001,1.000001)"><circle r="21" transform="translate(0,0)" fill="url(#eOteMnr4JwH3-fill)"/></g><g transform="rotate(${marker.data.angle} 21 21)"><circle r="14" transform="translate(21 21)"/><circle r="13" transform="translate(21 21)" fill="${marker.data.color}"/><path d="M21,23l-7,3.6l7-13.2l7,13.2Z" fill="${marker.data.franshiseColor}"/><path d="M21,14.5l5.8,11-5.8-3-5.8,3l5.8-11m0-2.1L20.1,14L14.3,25l-1.5,2.8l2.8-1.5l5.3-2.8l5.4,2.8l2.8,1.5L27.7,25L21.9,14L21,12.4Z" fill="#b3b3b3"/><path d="M21,15.2l5,9.5-5-2.6-5,2.6l5-9.5m0-1.4l-.6,1.1-5.1,9.5-1,1.8l1.8-.9l4.8-2.4l4.8,2.4l1.8.9-.9-1.8-5-9.5-.6-1.1Z" fill="#f3f3f3"/><path d="M25.3,24l-4-7.6v5.5Z" fill="#a2a2a2"/></g></svg>`;
                }
                else if (marker.data.OpenWarningAlertsCount > 0 && $('#option4').is(':checked') == true) {
                    svgImage = `<svg id="eOteMnr4JwH1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 42 42" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"> <style><![CDATA[ #eOteMnr4JwH3_ts {animation: eOteMnr4JwH3_ts__ts 1000ms linear infinite normal forwards}@keyframes eOteMnr4JwH3_ts__ts { 0% {transform: translate(21px,21px) scale(1.000001,1.000001)} 2% {transform: translate(21px,21px) scale(0.984869,0.980953)} 90% {transform: translate(21px,21px) scale(0.319047,0.142859)} 100% {transform: translate(21px,21px) scale(0.319047,0.142859)}} ]]></style> <defs><radialGradient id="eOteMnr4JwH3-fill" cx="0" cy="0" r="21" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 0)"><stop id="eOteMnr4JwH3-fill-0" offset="75%" stop-color="#f57d12"/><stop id="eOteMnr4JwH3-fill-1" offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle r="21" transform="translate(21 21)" opacity="0.44" fill="#fff"/><g id="eOteMnr4JwH3_ts" transform="translate(21,21) scale(1.000001,1.000001)"><circle r="21" transform="translate(0,0)" fill="url(#eOteMnr4JwH3-fill)"/></g><g transform="rotate(${marker.data.angle} 21 21)"><circle r="14" transform="translate(21 21)"/><circle r="13" transform="translate(21 21)" fill="${marker.data.color}"/><path d="M21,23l-7,3.6l7-13.2l7,13.2Z" fill="${marker.data.franshiseColor}"/><path d="M21,14.5l5.8,11-5.8-3-5.8,3l5.8-11m0-2.1L20.1,14L14.3,25l-1.5,2.8l2.8-1.5l5.3-2.8l5.4,2.8l2.8,1.5L27.7,25L21.9,14L21,12.4Z" fill="#b3b3b3"/><path d="M21,15.2l5,9.5-5-2.6-5,2.6l5-9.5m0-1.4l-.6,1.1-5.1,9.5-1,1.8l1.8-.9l4.8-2.4l4.8,2.4l1.8.9-.9-1.8-5-9.5-.6-1.1Z" fill="#f3f3f3"/><path d="M25.3,24l-4-7.6v5.5Z" fill="#a2a2a2"/></g></svg>`;
                }
                else if (marker.data.OpenInformationAlertsCount > 0 && $('#option5').is(':checked') == true) {
                    svgImage = `<svg id="eOteMnr4JwH1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 42 42" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"> <style><![CDATA[ #eOteMnr4JwH3_ts {animation: eOteMnr4JwH3_ts__ts 1000ms linear infinite normal forwards}@keyframes eOteMnr4JwH3_ts__ts { 0% {transform: translate(21px,21px) scale(1.000001,1.000001)} 2% {transform: translate(21px,21px) scale(0.984869,0.980953)} 90% {transform: translate(21px,21px) scale(0.319047,0.142859)} 100% {transform: translate(21px,21px) scale(0.319047,0.142859)}} ]]></style> <defs><radialGradient id="eOteMnr4JwH3-fill" cx="0" cy="0" r="21" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 0)"><stop id="eOteMnr4JwH3-fill-0" offset="75%" stop-color="#1372d1"/><stop id="eOteMnr4JwH3-fill-1" offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle r="21" transform="translate(21 21)" opacity="0.44" fill="#fff"/><g id="eOteMnr4JwH3_ts" transform="translate(21,21) scale(1.000001,1.000001)"><circle r="21" transform="translate(0,0)" fill="url(#eOteMnr4JwH3-fill)"/></g><g transform="rotate(${marker.data.angle} 21 21)"><circle r="14" transform="translate(21 21)"/><circle r="13" transform="translate(21 21)" fill="${marker.data.color}"/><path d="M21,23l-7,3.6l7-13.2l7,13.2Z" fill="${marker.data.franshiseColor}"/><path d="M21,14.5l5.8,11-5.8-3-5.8,3l5.8-11m0-2.1L20.1,14L14.3,25l-1.5,2.8l2.8-1.5l5.3-2.8l5.4,2.8l2.8,1.5L27.7,25L21.9,14L21,12.4Z" fill="#b3b3b3"/><path d="M21,15.2l5,9.5-5-2.6-5,2.6l5-9.5m0-1.4l-.6,1.1-5.1,9.5-1,1.8l1.8-.9l4.8-2.4l4.8,2.4l1.8.9-.9-1.8-5-9.5-.6-1.1Z" fill="#f3f3f3"/><path d="M25.3,24l-4-7.6v5.5Z" fill="#a2a2a2"/></g></svg>`;
                }
                else {
                    svgImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><circle cx="21" cy="21" r="21" opacity=".44" fill="#fff"/><radialGradient id="a" cx="21" cy="-253" r="21" gradientTransform="matrix(1 0 0 -1 0 -232)" gradientUnits="userSpaceOnUse"><stop offset=".15"/><stop offset="1" stop-opacity="0"/></radialGradient><circle cx="21" cy="21" r="21" fill="url(#a)"/><g transform="rotate(${marker.data.angle} 21 21)"><circle cx="21" cy="21" r="14" fill="${marker.data.franshiseColor}"/><circle cx="21" cy="21" r="13" fill="${marker.data.color}"/><path fill="#1c1c1c" d="M21 23l-7 3.6 7-13.2 7 13.2z"/><path d="M21 14.5l5.8 11-5.8-3-5.8 3 5.8-11m0-2.1l-.9 1.6-5.8 11-1.5 2.8 2.8-1.5 5.3-2.8 5.4 2.8 2.8 1.5-1.4-2.8-5.8-11-.9-1.6z" fill="#b3b3b3"/><path d="M21 15.2l5 9.5-5-2.6-5 2.6 5-9.5m0-1.4l-.6 1.1-5.1 9.5-1 1.8 1.8-.9 4.8-2.4 4.8 2.4 1.8.9-.9-1.8-5-9.5-.6-1.1z" fill="#f3f3f3"/><path fill="#a2a2a2" d="M25.3 24l-4-7.6v5.5z"/></g></svg>`;
                }

                var iconData = {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgImage),
                    scaledSize: new google.maps.Size(50, 50),
                    labelOrigin: new google.maps.Point(24, 60),
                };
                marker.setIcon(iconData);
                marker.setVisible(true);
            } else {
                marker.setIcon(null);
                marker.setVisible(false);
            }
        });
    });

    if (!autoRefresh) {
        // if there is no markers then fit the map to user settings location.
        if (clusterer.getMarkers().length == 0) {
            map.panTo(userDefaultLocation);
            map.setZoom(10);
        } else if (clusterer.getMarkers().length == 1) {
            clusterer.fitMapToMarkers();
            map.setZoom(20);
        } else if (clusterer.getMarkers().length > 1) {
            clusterer.fitMapToMarkers();
        }
    }

    if (isTrackingEnabled()) {
        updateTracking();
    }

    if (infowindow.id != null) {
        var filtered_markers = markers.filter(x => x.data.id == infowindow.id);
        var current_marker = filtered_markers[0];
        infowindow.close();
        google.maps.event.trigger(current_marker, 'mouseover');
    }
}

function refreshSelectedEntity() {
    if (selectedEntity.id == null) {
        return;
    }

    selectEntity(selectedEntity.id, selectedEntity.type, selectedEntity.tenantId, selectedEntity.marker);


}

function selectEntity(id, type, tenantId, marker, isAutoRefresh = false) {

    var sameEntity = selectedEntity.id != null ?
        (selectedEntity.id == id && selectedEntity.tenantId == tenantId && selectedEntity.type == type) : false;

    // concurency lock.
    if (selectEntityLoading && sameEntity) {
        return;
    }

    if (selectedEntity.id && !sameEntity) {
        sessionStorage.removeItem(selectedEntity.id.toString())
    }

    showCloseBtn = false;

    selectEntityLoading = true;

    // If the refresh is for the same entity and the streaming tab is opened then block the request.
    if (sameEntity && currentTab == "tab_1_4") {
        return;
    }

    const pbiFrame = document.querySelector(`#${currentTab} iframe#biFrame`);

    // If the current tab contains a power bi frame then block the request and post a message to the frame to refresh the data.
    if (pbiFrame) {
        Metronic.blockUI({ target: '#entity-information', animate: true });

        $.get(`${mapsBaseUrl}/GetAssetTrackingReportFilters`, { id: id, tenantId: tenantId })
            .done(data => {
                if (!data.filters)
                    return;

                // Post a message with the new filter values
                pbiFrame.contentWindow.postMessage({ filters: data.filters }, '*');
            }).always(() => {
                selectEntityLoading = false;
                Metronic.unblockUI('#entity-information');
            });

        return;
    }

    if (!sameEntity) {
        routesWeekOffset = 0;
    }

    $("#message_text_input").addClass("message-text-box-disable");


    $("#message_text_input").prop('disabled', true);

    Metronic.blockUI({ target: '#entity-information', animate: true });

    // set the marker as unClickable to prevent multiple calls
    marker.setOptions({ clickable: false });

    $.get(`${mapsBaseUrl}/GetEntityInformation`, {
        id: id,
        type: type,
        tenantId: tenantId,
        franchiseColorEnabled: isFranchiseColorEnabled(),
        entityStatus: entityConditionFlag,
    }).then((response) => {
        selectedEntity = {
            tenantId: tenantId,
            type: type,
            id: id,
            marker: marker,
        };

        if (!isAutoRefresh) {
            startTracking();
        }

        var wrapper = $('#entity-information');
        wrapper.html(response);

        if (!isAutoRefresh) {
            showCloseBtn = true;
            openInformationWindow();
        }

        // return to the latest active tab in case the same entity is selected.
        if (sameEntity) {
            triggerTab(currentTab);
        } else {
            currentTab = 'tab_1_1';
        }

        if (isTrackingEnabled()) {
            enableTrackingButton();
        }
    }).done(() => {
        marker.setOptions({ clickable: true });

        Metronic.unblockUI('#entity-information');
        // reset map-height
        const intViewportHeight = window.innerHeight;
        selectEntityLoading = false;

        $('#message_text_input').val(sessionStorage.getItem(selectedEntity.id.toString()));

        $("#message_text_input").prop('disabled', false);
        $("#message_text_input").removeClass("message-text-box-disable");

    });

}

function getEntitySummary(id, type, tenantId, callback) {
    $.get(`${mapsBaseUrl}/GetEntitySummary`, {
        id: id,
        entityType: type,
        tenantId: tenantId
    }).then((response) => {
        return callback(response);
    });
}

function openInformationWindow() {
    if (!$('#clearButton').hasClass('active in')) {
        $('#clearButton').toggleClass('active in');
    }

    var button = $(".mbs-slide-button");

    if (button.hasClass('opened')) {
        return;
    }

    button.toggleClass('opened');

    var intViewportHeight = window.innerHeight;

    $("#map-canvas").animate({
        height: intViewportHeight - 412 + 'px',
    }, 300);
    $(".map-bottom-slider").slideToggle(300).toggleClass("opened");
}

function closeInformationWindow() {
    var button = $(".mbs-slide-button");
    const clearButton = $('#clearButton');

    if (!button.hasClass('opened')) {
        return;
    }

    button.toggleClass('opened');


    clearButton.toggleClass('active in');

    var intViewportHeight = window.innerHeight;

    $("#map-canvas").animate({
        height: intViewportHeight - 110 + 'px',
    }, 300);
    $(".map-bottom-slider").removeClass("opened").slideToggle(300);
}

function onAdditionalData() {
    if ($("#search-input").val() == '') {
        entityName = null;
        entityTypeId = null;
        entityType = '';
    }

    return {
        text: $("#search-input").val().trim(),
        entityType: $('#entityType').val(),
        tenantId: $('#tenantId').val(),
        vehicleFranchiseId: $('#VehicleFranchises').val(),
        vehicleConditionId: $('#operationalStatus').val(),
        entityConditionFlag: entityConditionFlag,
        meterStatus: meterStatusFlag
    }
}

function operationalStatusAdditionalData() {
    return {
        tenantId: $('#tenantId').val()
    }
}

function vehicleFranchisesAdditionalData() {
    return {
        tenantId: $('#tenantId').val()
    }
}

function updateCurrentTab(tabId) {

    let fromTab = currentTab;
    let toTab = tabId;
    currentTab = tabId;

    // If the user is trying to navigate to the same tab ingore the logic.
    if (fromTab == toTab) {
        return;
    }

    // If the user is navigating out of trips tab
    if (fromTab == 'tab_1_5') {
        // Clear the historical route and start live tracking session.
        if (historicalRoutesManager.isEnabled()) {
            scheduler.start(true);
            clearHistoricalRoute();
            startTracking();
        }
    }

    if (fromTab == 'tab_1_6') {
        // Clear the historical route and start live tracking session.
        if (drawRoutesManager.isEnabled()) {
            scheduler.start(true);
            clearRideRoute();
            startTracking();
        }
    }

    if (toTab === 'tab_1_7') {
        setTimeout(() => {
            const messageContainerElemId = '#maps_messaging_body';
            const parentElem = $(messageContainerElemId);
            parentElem.animate({ scrollTop: parentElem.prop("scrollHeight") }, 150);
        }, 800);
    }

    const streamingFrameContainer = document.getElementById('streaming-iframe');

    // If the user is navigating to streaming tab then trigger autoplay.
    if (streamingFrameContainer != null) {
        var streamingFrame = streamingFrameContainer.contentWindow;

        if (toTab == 'tab_1_4') {
            // load the source of the streaming in iframe only on first click
            // remove the if to reload the iframe when leaving the tab
            if (!streamingFrameContainer.hasAttribute('src')) {
                Metronic.blockUI({ target: '#tab_1_4', animate: true });
                streamingFrameContainer.setAttribute("src", streamingUrl.replaceAll("amp;", ""));
                addUserAction(tenantId, vehicleName, 'Live streaming for vehicle "' + vehicleName + '"', 'Media');
            }
            streamingFrame.postMessage({ action: 'play' }, "*");
        }

        // If the user is navigating out of the streaming tab then trigger stop all players.
        if (fromTab == 'tab_1_4') {
            streamingFrame.postMessage({ action: 'stop' }, "*");
        }
    }
}

function resetEntityInfo() {
    currentTab = 'tab_1_1';
    closeInformationWindow();
    scheduler.unRegister('info-window');

    $(".map-bottom-slider").html('<div style=" width: 100%; display: flex; align-items: center; justify-content: center; height: 100%;"> <span>[[[[Please click on an marker to show the details]]]]</span> </div>')
}

function exportToSVG() {
    infowindow.close(map);
    isOpened = false;
    var date = new Date();
    var imgName = 'maps_' + date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + date.getSeconds().toString().padStart(2, '0') + '.svg';
    kendo.drawing.drawDOM($("#map-canvas"), {
        paperSize: "auto",
    })
        .then(function (group) {
            // Render the result as a PNG image
            return kendo.drawing.exportSVG(group, {
                paperSize: "auto"
            });
        })
        .done(function (data) {
            // Save the image file
            kendo.saveAs({
                dataURI: data,
                fileName: imgName,
                proxyURL: `${mapsBaseUrl}/GetEntityInformSaveExportImageation`,
            });
        });
}

function getDriverName(driverName) {
    if (driverName != null && driverName != ' ') {
        return driverName;
    }

    return '&nbsp';
}

function getIconName(iconName, entityType) {
    if (iconName == null) {
        if (entityType == 1)
            return 'car.svg';
        else
            return 'map-marker-case.svg';
    }

    return iconName;
}

function clearGeofence() {
    if (overlays.length > 0) {
        drawingManager.setDrawingMode(null);
        overlays.forEach(function (overlay) {
            overlay.setMap(null);
        });
    }
}

function displayGeofence() {
    $.get(`${mapsBaseUrl}/GetAreas`).then((response) => {
        if (response != null) {
            response.areas.forEach(function (el) {
                var defaultOptions = { draggable: true, editable: true, fillColor: el.FillColor, strokeColor: el.StrokeColor, strokeWeight: parseInt(el.StrokeWeight) };
                drawingManager = new google.maps.drawing.DrawingManager({
                    drawingControl: false,
                    circleOptions: defaultOptions,
                    polygonOptions: defaultOptions,
                    rectangleOptions: defaultOptions,
                    map: map
                });

                var overlay = overlayIO.out(JSON.parse(el.Overlay), map);
                overlay.setDraggable(false);
                overlay.setEditable(false);
                overlays.push(overlay);
            });
        }
    });
}

function setInfoColor(color) {
    $('.veh-status-blue .mbs-side-header, .veh-status-blue .mbs-unit-header').css('background-color', color);
}

function setInfoIcon(iconName, color) {
    let iconContainer = $($($('.speedo-mtr-icon').children()[0]).children()[0]);
    iconContainer.css('mask-image', `url(../wwwroot/images/vehicle-types-new/${iconName})`);
    iconContainer.css('-webkit-mask-image', `url(../wwwroot/images/vehicle-types-new/${iconName})`);
    iconContainer.css('background-color', color);
}

function tryNavigateToStreaming(tenantId, serialNo, vehicleName, defaultChannel, streamingAutoPlay) {
    $.ajax({
        url: streamingCheckStatusLink,
        type: "GET",
        data: {
            serialNo: serialNo,
        }
    }).done(function (data) {
        if (data.status === "OK") {
            navigateToStreaming(tenantId, serialNo, defaultChannel, streamingAutoPlay);
            addUserAction(tenantId, vehicleName, 'Live streaming for vehicle "' + vehicleName + '"', 'Media');
        } else if (data.status === "DISCONNECTED_DEVICE") {
            toastBox.show('info', '[[[[Device is not connected.]]]]');
        } else if (data.status === "METADATA_NOTFOUND") {
            toastBox.show('info', '[[[[Device is not connected.]]]]');
        } else if (data.status === "CONNECTION_ERROR") {
            toastBox.show('error', '[[[[Connection error.]]]]');
        }
    }).error(function (error) {
        toastBox.show('error', '[[[[Unkown error happened.]]]]');
    });
}

function navigateToStreaming(tenantId, serialNo, defaultChannel, streamingAutoPlay) {
    // stop streaming iframe playback
    const streamingFrameContainer = document.getElementById('streaming-iframe');
    if (streamingFrameContainer !== null) {
        streamingFrameContainer.contentWindow.postMessage({ action: 'stop' }, "*");
    }

    const url = `${streamingPortal}/live?deviceId=${serialNo}&channelId=${defaultChannel}&autoplay=${streamingAutoPlay}&tenantId=${tenantId}&timezone=${timeZoneId}`;
    const windowVideo = window.open(url);
    if (!windowVideo) {
        toastBox.show('info', '[[[[You must allow popups for this map to work.]]]]');
        onBoundsChanged();
    }
}

function triggerTab(name) {
    var tabTriggerButton = $(`#${name}_trigger`);

    // If the button does not exists then ignore the action.
    if (tabTriggerButton.length == 0) {
        return;
    }

    tabTriggerButton.click();
}

function resetStatusFilter() {
    let buttons = $('.toggle-rad-button-container .toggle-rad-button-element');

    // reset the flag.
    entityConditionFlag = 0;
    entityConditions = [];

    meterStatusFlag = 0;
    meterStatusCondition = [];


    for (var i = 0; i < buttons.length; i++) {
        //remove classes from the buttons.
        $(buttons[i]).removeClass('active');
    }
}

function rerenderStatusFilter(showMeterStatus) {
    hasVehicleRideStates = typeof showMeterStatus == "boolean" ? showMeterStatus : showMeterStatus.toLowerCase() === 'true';
    // reset the filter and flags.
    resetStatusFilter();

    let entityType = parseInt($('#entityType').val());

    if (!hasTrackedAssets) {
        entityType = 1;
    }

    // If no entity type is selected then completely hide the filter.
    if (entityType == 0) {
        $('#accordion21').hide();
        $('#accordion22').hide();
        meterStatusFilterShow = false;
        return;
    }

    $('#accordion21').show();
    if (entityType == 1 && hasVehicleRideStates) {
        $('#accordion22').show();
        meterStatusFilterShow = true;
    }

    if (entityType == 2) {
        $('#accordion22').hide();
    }

    let buttons = $('.toggle-rad-button-container .toggle-rad-button-element');

    // render allowed buttons for the entity type.
    for (var i = 0; i < buttons.length; i++) {
        var button = $(buttons[i]);
        var buttonAllowedEntities = button.attr('data-allowed-entities').split(',').map(i => parseInt(i));

        if (buttonAllowedEntities.indexOf(entityType) != -1) {
            button.show();
        } else {
            button.hide();
        }
    }
}

function isFranchiseColorEnabled() {
    return $('#option2').is(':checked');
}

/**
 * This will get called by streaming project once the iframe is loaded.
 * */
function streamingLoaded() {
    const streamingIframe = document.getElementById('streaming-iframe');
    // if the user is navigating out of the streaming tab then trigger stop all players.
    if (currentTab == 'tab_1_4' && streamingIframe != null) {
        Metronic.unblockUI('#tab_1_4');
        streamingIframe.contentWindow.postMessage({ action: 'play' }, "*");
    }
}

function trackHistoricalRoute(routeId, tenantId, line) {
    // Auto stop live tracking before drawing the historical route.
    if (!$('.action-butns-icon-track').hasClass('off') || isTrackingEnabled()) {
        forceStopTracking('[[[[Live tracking stopped to view historical route.]]]]');
    }

    // if the same route clicked then just clear it.
    if (historicalRoutesManager.routeId == routeId) {
        clearHistoricalRoute();
        scheduler.start(true);
    } else {
        clearAllMarkers();
        scheduler.stop();
        historicalRoutesManager.draw(routeId, tenantId, line, true);
    }
}

function clearHistoricalRoute() {
    historicalRoutesManager.clear();
}

function clearRideRoute() {
    drawRoutesManager.clear();
}

function rideRouteInfoWindowTemplate(route) {
    return `<div class="alert-info-window">
        <div class="alert-info-window-inner narrow-scroll-bar">
            <div class="alert-info-window-block">
                <div class="alert-info-window-block-body">
                    <div class="map-info-box" style="margin-left: 0;">
                        <div class="info-box-title" style="margin-left:10px;">[[[[Ride Summary]]]]</div>
                        <div>
                            <dl class="dl-horizontal">
                                <dt>
                                    [[[[Driver]]]]
                                </dt>
                                <dd>
                                    ${route.driverName}
                                </dd>
                                <dt>
                                    [[[[Source]]]]
                                </dt>
                                <dd>
                                    ${route.source}
                                </dd>
                                <dt>
                                    [[[[Pick-up Time]]]]
                                </dt>
                                <dd>
                                    ${route.pickupTime}
                                </dd>
                                 <dt>
                                    [[[[Pick-up Address]]]]
                                </dt>
                                <dd>
                                    ${route.pickupAddress}
                                </dd>
                                <dt>
                                    [[[[Drop-off Time]]]]
                                </dt>
                                <dd>
                                    ${route.dropoffTime}
                                </dd>
                            
                                <dt>
                                    [[[[Drop-off Address]]]]
                                </dt>
                                <dd>
                                    ${route.dropoffAddress}
                                </dd>
                                <dt>
                                    [[[[Distance]]]]
                                </dt>
                                <dd>
                                    ${route.distance}
                                </dd>
                                <dt>
                                    [[[[Duration]]]]
                                </dt>
                                <dd>
                                    ${route.duration}
                                </dd>
                                <dt>
                                    [[[[Total Fare]]]]
                                </dt>
                                <dd>
                                    ${route.totalFare}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}


$(window).on('beforeunload', function () {
    if (selectedEntity && selectedEntity.id) {
        sessionStorage.removeItem(selectedEntity.id.toString());
    }
});