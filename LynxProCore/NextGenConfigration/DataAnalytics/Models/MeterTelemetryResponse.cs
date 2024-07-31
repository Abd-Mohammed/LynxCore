using Lynx.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class MeterEventRecord
    {
        public DateTime Timestamp { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Heading { get; set; }
        public string Status { get; set; }
    }

    public class MeterDevice
    {
        public string Id { get; set; }
        public List<MeterEventRecord> Events { get; set; } = new List<MeterEventRecord>();
    }

    public class MeterTelemetryResponse : BaseResponse
    {
        [JsonProperty("meterDevice")]
        public MeterDevice MeterDevice { get; set; }

        public string VehicleName { get; set; }
    }
}