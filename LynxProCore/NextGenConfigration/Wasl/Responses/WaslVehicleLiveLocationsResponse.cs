using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslVehicleLiveLocationsResponse : BaseResponse
    {
        [JsonProperty("vehicleGeolocations")]
        public List<WaslVehicleLiveLocations> WaslVehicleLiveLocations { get; set; }
    }

    public class WaslVehicleLiveLocations
    {
        public DateTime Timestamp { get; set; }

        public string Status { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }

        public bool LastSyncStatus { get; set; }

        public MinimalWaslDriverResponse Driver { get; set; }

        public MinimalWaslVehicleResponse Vehicle { get; set; }
    }
}