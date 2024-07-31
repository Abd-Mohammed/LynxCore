(function (mapstyles, undefined) {
    
    mapstyles.initStyles = function (map, mapStyles) {

        var mapTypesIds = [];
        var stylesLength = mapStyles.length;
        for (var i = 0; i < stylesLength; i++) {
            mapTypesIds.push(mapStyles[i].Id);
        }
        mapTypesIds.push('satellite');
        mapTypesIds.push('roadmap');

        map.setOptions({
            mapTypeControlOptions: {
                mapTypeIds: mapTypesIds
            }
        });

       // var stylesLength = mapStyles.length;
        for ( i = 0; i < stylesLength; i++) {
            var styleType = new google.maps.StyledMapType(JSON.parse(mapStyles[i].Style), { name: mapStyles[i].Name });
            map.mapTypes.set(mapStyles[i].Id, styleType);
            if (mapStyles[i].IsDefult) {
                map.setMapTypeId(mapStyles[i].Id);
            }
        }
       
    }

}(window.mapstyles = window.mapstyles || {}));