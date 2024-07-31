

// This is a new version of the overlay library which addresses the lat, lng order issue.
(function (overlayIO, undefined) {
    // shape: google.maps.Overlay
    // encoded: boolean indicating whether pathes should be stored encoded
    // Returns storable google.maps.Overlay-definition
    overlayIO.in = function (shape, encoded) {
        var temp = { type: this.t_(shape.type) };

        switch (temp.type) {
            case 'CIRCLE':
                temp.radius = shape.getRadius();
                temp.geometry = this.p_(shape.getCenter());
                temp.options = {
                    fillColor: shape.get('fillColor'),
                    strokeColor: shape.get('strokeColor'),
                    strokeWeight: shape.get('strokeWeight')
                };
                break;
            case 'MARKER':
                temp.geometry = this.p_(shape.getPosition());
                break;
            case 'RECTANGLE':
                temp.geometry = this.b_(shape.getBounds());
                temp.options = {
                    fillColor: shape.get('fillColor'),
                    strokeColor: shape.get('strokeColor'),
                    strokeWeight: shape.get('strokeWeight')
                };
                break;
            case 'POLYLINE':
                temp.geometry = this.l_(shape.getPath(), encoded);
                break;
            case 'POLYGON':
                temp.geometry = this.m_(shape.getPaths(), encoded);
                temp.options = {
                    fillColor: shape.get('fillColor'),
                    strokeColor: shape.get('strokeColor'),
                    strokeWeight: shape.get('strokeWeight')
                };
                break;
        }

        return temp;
    }

    // shape: google.maps.Overlay
    // map: map where to draw the shapes
    // Returns google.maps.Overlay
    overlayIO.out = function (shape, map) {

        var temp = null;

        switch (shape.type) {
            case 'CIRCLE':
                temp = new google.maps.Circle({ radius: Number(shape.radius), center: this.pp_.apply(this, shape.geometry) });
                temp.set('fillColor', shape.options.fillColor);
                temp.set('strokeColor', shape.options.strokeColor);
                temp.set('strokeWeight', shape.options.strokeWeight);
                break;
            case 'MARKER':
                if (typeof shape.withLabel !== 'undefined' && shape.withLabel === true) {
                    temp = new markerWithLabel.MarkerWithLabel({
                        position: this.pp_.apply(this, shape.geometry),
                        icon: shape.icon,
                        labelContent: shape.labelContent,
                        labelAnchor: shape.labelAnchor,
                        labelClass: shape.labelClass,
                        labelStyle: shape.labelStyle,
                        labelVisible: shape.labelVisible
                    });
                }
                else {
                    temp = new google.maps.Marker({ position: this.pp_.apply(this, shape.geometry), icon: shape.icon });
                }
                break;
            case 'RECTANGLE':
                temp = new google.maps.Rectangle({ bounds: this.bb_.apply(this, shape.geometry) });
                temp.set('fillColor', shape.options.fillColor);
                temp.set('strokeColor', shape.options.strokeColor);
                temp.set('strokeWeight', shape.options.strokeWeight);
                break;
            case 'POLYLINE':
                temp = new google.maps.Polyline({ path: this.ll_(shape.geometry) });
                break;
            case 'POLYGON':
                temp = new google.maps.Polygon({ paths: this.mm_(shape.geometry) });
                temp.set('fillColor', shape.options.fillColor);
                temp.set('strokeColor', shape.options.strokeColor);
                temp.set('strokeWeight', shape.options.strokeWeight);
                break;
        }

        temp.type = this.tt_(shape.type);
        if (typeof map !== 'undefined') {
            temp.setValues({ map: map })
        }

        return temp;
    }

    overlayIO.l_ = function (path, e) {
        path = (path.getArray) ? path.getArray() : path;
        if (e) {
            return google.maps.geometry.encoding.encodePath(path);
        } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
                r.push(this.p_(path[i]));
            }
            return r;
        }
    }

    overlayIO.ll_ = function (path) {
        if (typeof path === 'string') {
            return google.maps.geometry.encoding.decodePath(path);
        }
        else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
                r.push(this.pp_.apply(this, path[i]));
            }
            return r;
        }
    }

    overlayIO.m_ = function (paths, e) {
        var r = [];
        paths = (paths.getArray) ? paths.getArray() : paths;
        for (var i = 0; i < paths.length; ++i) {
            r.push(this.l_(paths[i], e));
        }
        return r;
    }

    overlayIO.mm_ = function (paths) {
        var r = [];
        for (var i = 0; i < paths.length; ++i) {
            r.push(this.ll_.call(this, paths[i]));
        }
        return r;
    }

    overlayIO.p_ = function (latLng) {
        return ([latLng.lat(), latLng.lng()]);
    }

    overlayIO.pp_ = function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    }

    overlayIO.b_ = function (bounds) {
        return ([this.p_(bounds.getSouthWest()),
        this.p_(bounds.getNorthEast())]);
    }

    overlayIO.bb_ = function (sw, ne) {
        return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
            this.pp_.apply(this, ne));
    }

    overlayIO.t_ = function (s) {
        var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
        for (var i = 0; i < t.length; ++i) {
            if (s === google.maps.drawing.OverlayType[t[i]]) {
                return t[i];
            }
        }
    }

    overlayIO.tt_ = function (t) {
        return google.maps.drawing.OverlayType[t];
    }
}(window.overlayIO = window.overlayIO || {}));