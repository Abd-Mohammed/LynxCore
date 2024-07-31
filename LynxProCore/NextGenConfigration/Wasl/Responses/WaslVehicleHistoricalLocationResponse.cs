using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslVehicleHistoricalLocationResponse : BaseResponse
    {
        [JsonProperty("geolocations")]
        public List<WaslVehicleHistoricalLocation> Geolocations { get; set; }
    }

    public class WaslVehicleHistoricalLocation
    {
        public DateTime Timestamp { get; set; }

        public ActivityType Activity { get; set; }

        public VehicleStatus Status { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }

        public bool SyncStatus { get; set; }

        public MinimalWaslDriverResponse Driver { get; set; }

        public MinimalWaslVehicleResponse Vehicle { get; set; }
    }

    public class MinimalWaslDriverResponse
    {
        public string StaffId { get; set; }

        public string IdentityNumber { get; set; }
    }

    public class MinimalWaslVehicleResponse
    {
        public string Name { get; set; }

        public string Number { get; set; }

        public string SequenceNumber { get; set; }

        public string PlateNumber { get; set; }
    }
}