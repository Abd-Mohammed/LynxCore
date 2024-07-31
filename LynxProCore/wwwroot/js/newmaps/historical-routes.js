class HistoricalRouteManager {
    constructor(map) {
        this.map = map;
        this.alertMarkers = [];
        this.routePolyline = null;
        this.startMarker = null;
        this.endMarker = null;
        this.alertInfoWindow = null;
        this.routeId = null;
        this.lineElements = [];
        this.routeInfoWindow = null;
        this.snapToRoad = true;
        this.tenantId = null;
        this.tableElement = null;
    }

    refresh() {
        if (this.tenantId == null || this.routeId == null || (this.lineElements.length == 0 && !this.tableElement)) {
            return;
        }

        if (this.lineElements.length > 0) {
            this.draw(this.routeId, this.tenantId, this.lineElements);
        } else {
            this.draw(this.routeId, this.tenantId, this.tableElement);
        }
    }

    /**
     * Draw a route including start, end location markers and alert markers
     * for the given route id.
     * 
     * @param {number} actRouteId
     * @param {number} tenantId
     */
    draw(actRouteId, tenantId, element, fitBounds = true) {
        Metronic.blockUI({ target: '#entity-information', animate: true });
        // Make sure to clear the previous route.
        this.clear();
        if (routesViewType == "timeline") {
            this.lineElements = element;
            this.lineElements.style('stroke', '#45d7fe');
        } else {
            this.tableElement = $(element);
            this.tableElement.css('outline', '#546772 solid 4px');
        }

        this.getRouteInfo(actRouteId, tenantId, (route) => {
            var polylinePoints = this.processPoints(route.polyline);

            if (this.snapToRoad) {
                if (polylinePoints.length > 100) {
                    toastBox.show('info', '[[[[Could not snap road, the road will be rendered based on actual data locations.]]]]');
                    this.buildPolyline(polylinePoints, fitBounds);
                } else {
                    this.getSnappedPoints(polylinePoints, (points, isSuccess) => {
                        if (!isSuccess) {
                            toastBox.show('info', '[[[[Could not snap road, the road will be rendered based on actual data locations.]]]]');
                        }

                        this.buildPolyline(points, fitBounds);
                    });
                }
            } else {
                this.buildPolyline(polylinePoints, fitBounds);
            }

            // draw start marker.
            this.startMarker = new google.maps.Marker({
                map: this.map,
                icon: {
                    url: lynxBaseUrl + 'wwwroot/images/map-alerts/start-location.svg',
                    scaledSize: new google.maps.Size(48, 52),
                },
                position: new google.maps.LatLng(route.startLocation.lat, route.startLocation.lng),
            });

            // draw end marker.
            this.endMarker = new google.maps.Marker({
                map: this.map,
                icon: {
                    url: lynxBaseUrl + 'wwwroot/images/map-alerts/end-location.svg',
                    scaledSize: new google.maps.Size(48, 52),
                },
                position: new google.maps.LatLng(route.endLocation.lat, route.endLocation.lng),
            });

            // add route info window.
            this.routeInfoWindow = new google.maps.InfoWindow({
                content: `<div class="alert-info-window">
                                        <div class="alert-info-window-inner narrow-scroll-bar">
                                            <div class="alert-info-window-block">
                                                <div class="alert-info-window-block-body">
                                                    <div class="map-info-box" style="margin-left: 0;">
                                                        <div class="info-box-title" style="margin-left:10px;">[[[[Route Summary]]]]</div>
                                                        <div>
                                                            <dl class="dl-horizontal">
                                                                <dt>
                                                                    [[[[Start Time]]]]
                                                                </dt>
                                                                <dd>
                                                                    ${route.startTime}
                                                                </dd>
                                                                <dt>
                                                                    [[[[End Time]]]]
                                                                </dt>
                                                                <dd>
                                                                    ${route.endTime}
                                                                </dd>
                                                                <dt>
                                                                    [[[[Start Address]]]]
                                                                </dt>
                                                                <dd>
                                                                    ${route.startAddress}
                                                                </dd>
                                                                <dt>
                                                                    [[[[End Address]]]]
                                                                </dt>
                                                                <dd>
                                                                    ${route.endAddress}
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
                                                                    [[[[Incidents Count]]]]
                                                                </dt>
                                                                <dd>
                                                                    ${route.incidentsCount}
                                                                </dd>
                                                            </dl>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`,
            });

            this.routeInfoWindow.open(this.map, this.startMarker);

            // draw alert incident markers.
            route.incidents.forEach(incidentGroup => {
                var elements = incidentGroup.elements;

                var alertMarker = new google.maps.Marker({
                    icon: {
                        url: 'data:image/png;base64,' + incidentGroup.icon,
                        scaledSize: new google.maps.Size(54, 63),
                        labelOrigin: new google.maps.Point(45, 18),
                    },
                    map: this.map,
                    position: new google.maps.LatLng(incidentGroup.location.lat, incidentGroup.location.lng),
                    label: {
                        text: elements.length + '',
                        fontSize: "10px",
                        color: "white"
                    },
                });

                google.maps.event.addListener(alertMarker, "mouseover", _ => {
                    this.clearAlertInfoWindow();

                    this.alertInfoWindow = new google.maps.InfoWindow({
                        content: `<div class="alert-info-window">
                                        <div class="alert-info-window-inner narrow-scroll-bar">
                                            ${elements.map(i => `<div class="alert-info-window-block">
                                                <div class="alert-info-window-block-header">
                                                    <div class="alert-info-window-block-icon">
                                                        <img src="${lynxBaseUrl}wwwroot/images/map-alerts/${i.icon}"/>    
                                                    </div>
                                                    <div class="alert-info-window-block-title">${i.name}</div>
                                                    <div class="alert-info-window-block-time">${i.time}</div>
                                                </div>
                                                <div class="alert-info-window-block-body">
                                                    <div>Justifications:</div>
                                                    <ul>
                                                        ${i.justifications.map(j => `<li>${j}</li>`).join('')}
                                                    </ul>
                                                </div>
                                            </div>`).join('')}
                                        </div>
                                    </div>`,
                    });

                    this.alertInfoWindow.open(this.map, alertMarker);
                });

                this.alertMarkers.push(alertMarker);
            });

            this.routeId = actRouteId;
            this.tenantId = tenantId;

            Metronic.unblockUI('#entity-information');
        });
    }

    /**
     * Clears current displayed route, if exists.
     */
    clear() {
        // clear the polyline path.
        if (this.routePolyline != null) {
            this.routePolyline.setMap(null);
            this.routePolyline = null;
        }

        // clear the alert markers.
        this.alertMarkers.forEach(alertMarker => {
            alertMarker.setMap(null);
        });

        this.alertMarkers = [];

        // clear the route start marker.
        if (this.startMarker != null) {
            this.startMarker.setMap(null);
            this.startMarker = null;
        }

        // clear the route end marker.
        if (this.endMarker != null) {
            this.endMarker.setMap(null);
            this.endMarker = null;
        }

        // Clear route info window.
        if (this.routeInfoWindow != null) {
            this.routeInfoWindow.setMap(null);
            this.routeInfoWindow = null;
        }

        // clear the info window if exists.
        this.clearAlertInfoWindow();

        this.routeId = null;
        this.tenantId = null;

        // Reset the line color.
        if (this.lineElements.length > 0) {
            this.lineElements.style('stroke', '#69b569');
            this.lineElements = [];
        }

        // Reset the table element highlighting.
        if (this.tableElement != null) {
            this.tableElement.css('outline', 'none');
            this.tableElement = null;
        }
    }

    /**
     * Return true if the a historical route tracking is active, otherwise false.
     */
    isEnabled() {
        return this.routeId != null;
    }

    buildPolyline(polylinePoints, fitBounds = true) {
        // draw the route polyline on the map.
        this.routePolyline = new google.maps.Polyline({
            map: this.map,
            path: polylinePoints,
            geodesic: true,
            strokeColor: "#000000",
            strokeOpacity: 0.7,
            strokeWeight: 5
        });

        // register route polyline click event.
        this.routePolyline.addListener('click', (e) => {
            this.routeInfoWindow.setPosition(e.latLng);
            this.routeInfoWindow.open(this.map);
        });


        if (fitBounds) {
            this.fitMapToPolyline();
        }
    }

    getRouteInfo(actRouteId, tenantId, callback) {
        $.get(routesBaseUrl + '/GetHistoricalRoute', {
            routeId: actRouteId,
            tenantId: tenantId
        }).then(res => {
            callback(res);
        });
    }

    processPoints(polylineLocations) {
        var points = [];

        polylineLocations.forEach(location => {
            points.push({ lat: location.lat, lng: location.lng });
        });

        return points;
    }

    fitMapToPolyline() {
        if (this.routePolyline == null) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();
        var points = this.routePolyline.getPath().getArray();
        for (var n = 0; n < points.length; n++) {
            bounds.extend(points[n]);
        }

        this.map.fitBounds(bounds);
    }

    clearAlertInfoWindow() {
        if (this.alertInfoWindow != null) {
            this.alertInfoWindow.close();
            this.alertInfoWindow.setMap(null);
            this.alertInfoWindow = null;
        }
    }

    toggleSnapToRoad() {
        this.snapToRoad = !this.snapToRoad;
    }

    getSnappedPoints(locations, callback) {
        var path = locations.map(l => `${l.lat},${l.lng}`).join('|');
        $.get(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=AIzaSyA9thXarvNAj0azH0DybEg2N7BfSF0GyW8`, response => {
            let snappedCoordinates = [];
            if (response.snappedPoints == null || response.snappedPoints.length < 2) {
                callback(locations, false);
                return;
            }
            for (var i = 0; i < response.snappedPoints.length; i++) {
                var location = response.snappedPoints[i].location;
                snappedCoordinates.push({ lat: location.latitude, lng: location.longitude });
            }
            callback(snappedCoordinates, true);
        });
    }
}