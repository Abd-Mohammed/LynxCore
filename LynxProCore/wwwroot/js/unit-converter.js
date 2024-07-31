(function (unitConverter, undefined) {
  
    unitConverter.convertByAbbreviation = function (value, quantityName, fromUnitAbbrev, toUnitAbbrev, decimals) {

        if (quantityName === 'length') {
            return convertLength(parseFloat(value), fromUnitAbbrev, toUnitAbbrev, decimals);
        }
        else if (quantityName === 'speed') {
            return convertSpeed(parseFloat(value), fromUnitAbbrev, toUnitAbbrev, decimals);
        }
        else if (quantityName === 'Temperature') {
            return convertTemperature(parseFloat(value), fromUnitAbbrev, toUnitAbbrev, decimals);
        }
        else {
            throw new Error('Quantity name is not supported')
        }
    }

    function convertLength(value, fromUnitAbbrev, toUnitAbbrev, decimals) {
    
        switch (fromUnitAbbrev) {
            case 'km':
                switch (toUnitAbbrev) {
                    case 'm':
                        return (value * 1000).toFixed(decimals);
                    case 'km':
                        return value.toFixed(decimals);
                    case 'mi':
                        return (value * 0.62137).toFixed(decimals);
                    case 'NM':
                        return (value / 1.852).toFixed(decimals);
                    default:
                        throw new Error('To unit abbreviation is not supported')
                }
            case 'mi':
                switch (toUnitAbbrev) {
                    case 'm':
                        return (value / 0.00062137).toFixed(decimals);
                    case 'km':
                        return (value / 0.62137).toFixed(decimals);
                    case 'mi':
                        return value.toFixed(decimals);
                    case 'NM':
                        return (value / 1.151).toFixed(decimals);
                    default:
                        throw new Error('To unit abbreviation is not supported')
                }
            case 'ft':
                switch (toUnitAbbrev) {
                    case 'm':
                        return (value / 3.2808).toFixed(decimals);
                    case 'ft':
                        return value.toFixed(decimals);
                    case 'NM':
                        return (value / 6076.115).toFixed(decimals);
                    default:
                        throw new Error('To unit abbreviation is not supported')
                }
            case 'm':
                switch (toUnitAbbrev) {
                    case 'm':
                        return value.toFixed(decimals);
                    case 'ft':
                        return (value * 3.2808).toFixed(decimals);
                    case 'NM':
                        return (value / 1852).toFixed(decimals);
                    default:
                        throw new Error('To unit abbreviation is not supported')
                }

            case 'NM':
                switch (toUnitAbbrev) {
                    case 'NM':
                        return value.toFixed(decimals);
                    case 'km':
                        return (value * 1.852).toFixed(decimals);
                    case 'mi':
                        return (value * 1.151).toFixed(decimals);
                    case 'm':
                        return (value * 1852).toFixed(decimals);
                    case 'ft':
                        return (value * 6076.115).toFixed(decimals);
                    default:
                        throw new Error('To unit abbreviation is not supported')
                }
            default:
                throw new Error('From unit abbreviation is not supported')
        }
    }

    function convertSpeed(value, fromUnitAbbrev, toUnitAbbrev, decimals) {
        
        if (fromUnitAbbrev === 'km/h') {

            switch (toUnitAbbrev) {

                case 'km/h':
                    return value.toFixed(0);
                case 'mph':
                    return (value * 0.62137).toFixed(decimals);
                case 'kn':
                    return (value / 1.852).toFixed(decimals);
                default:
                    throw new Error('To unit abbreviation is not supported')
            }
        }
        else if (fromUnitAbbrev === 'mph') {

            switch (toUnitAbbrev) {

                case 'km/h':
                    return (value / 0.62137).toFixed(decimals);
                case 'mph':
                    return value.toFixed(decimals);
                case 'kn':
                    return (value / 1.151).toFixed(decimals);
                default:
                    throw new Error('To unit abbreviation is not supported')
            }
        }
        else if (fromUnitAbbrev === 'kn') {        
            switch (toUnitAbbrev) {

                case 'km/h':
                    return (value * 1.852).toFixed(decimals);
                case 'mph':
                    return (value * 1.151).toFixed(decimals);
                case 'kn':
                    return value.toFixed(decimals);
                default:
                    throw new Error('To unit abbreviation is not supported')
            }
        }
        else {
            throw new Error('From unit abbreviation is not supported')
        }
    }

    function convertTemperature(value, fromUnitAbbrev, toUnitAbbrev, decimals) {

        if (fromUnitAbbrev === '℃') {

            switch (toUnitAbbrev) {

                case '℃':
                    return value.toFixed(0);
                case '℉':
                    return ((value * 1.8) + 32).toFixed(decimals);
                default:
                    throw new Error('To unit abbreviation is not supported')
            }
        }
        else if (fromUnitAbbrev === '℉') {

            switch (toUnitAbbrev) {

                case '℃':
                    return ((value - 32) / 1.8).toFixed(decimals);
                case '℉':
                    return value.toFixed(decimals);
                default:
                    throw new Error('To unit abbreviation is not supported')
            }
        }
        else {
            throw new Error('From unit abbreviation is not supported')
        }
    }

}(window.unitConverter = window.unitConverter || {}));