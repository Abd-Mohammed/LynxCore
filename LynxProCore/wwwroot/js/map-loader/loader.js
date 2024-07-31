

Object.defineProperty(Array.prototype, 'unique', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }
});

const themes = MapThemes.themes;
class MapLoader {
    mapTypes = ['default', 'roadmap', 'daymap', 'satellite', 'hybrid', 'terrain', 'nightmap'];

    mapType = 'default';
    lat = '';
    lng = '';
    map = null;
    canvas = null;
    selectedDefaultTheme = '';
    zoom = 11;
    minZoom = 3;
    maxZoom = 21;
    streetViewControl = true;
    mapTypeControl = true;
    scaleControl = true;
    styles = [];
    constructor(mapType, mapTypes, lat, lng, key, region, selectedDefaultTheme = '', zoom = 11, minZoom = 3, maxZoom = 21, streetViewControl = true, mapTypeControl = true, scaleControl = true) {

        this.mapTypes = this.mapTypes.concat(mapTypes).unique();
        this.mapType = mapType;
        this.lat = lat;
        this.lng = lng;
        window.initMap = this.initMap.bind(this);
        this.injectMap(key, region);
        this.selectedDefaultTheme = selectedDefaultTheme;
        this.zoom = zoom;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.streetViewControl = streetViewControl;
        this.mapTypeControl = mapTypeControl;
        this.scaleControl = scaleControl;
    }
    initMap() {
 
        this.canvas = document.getElementById('map-canvas');
        if (this.selectedDefaultTheme) {
            let selectedTheme = this.selectedDefaultTheme.toLowerCase();
            let element = themes[selectedTheme];
            this.styles = element.theme;
        }
            let mapValue = new google.maps.Map(this.canvas, {
                center: new google.maps.LatLng(parseFloat(this.lat), parseFloat(this.lng)),
                styles:this.styles,
                zoom: this.zoom,
                minZoom: this.minZoom,
                maxZoom: this.maxZoom,
                streetViewControl: this.streetViewControl,
                mapTypeControl: this.mapTypeControl,
                scaleControl: this.scaleControl,
                mapTypeControlOptions: {
                    style: 2,
                    mapTypeIds: this.mapTypes
                }
            });
        if (!this.selectedDefaultTheme) {
            let themesStyles = Object.keys(themes);
            let length = themesStyles.length;
            for (var i = 0; i < length; i++) {
                let element = themes[themesStyles[i]];
                let googleMapSet = new google.maps.StyledMapType(element.theme, { name: element.name });
                mapValue.mapTypes.set(themesStyles[i], googleMapSet);
            }

            mapValue.setMapTypeId(this.mapType.toLowerCase());
            mapValue.data.setStyle(themes[this.mapType.toLowerCase()]);
        }
        
           this.map = mapValue;
    }
    getMap() {
        
        if (this.map === null) {
            return this.rafAsync().then(() => this.getMap());
        } else {
            return Promise.resolve(this.map);
        }
    }
    rafAsync() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve); //faster than set time out
        });
    }

    injectMap(key,region) {
        let script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + key + "&region=" + region +"&libraries=drawing,places,geometry,visualization&callback=initMap";
        script.setAttribute('defer', 'defer');
        script.async = true;
        // Append the 'script' element to 'head'
        document.head.appendChild(script);
    }
   
}
