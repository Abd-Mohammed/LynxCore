using Lynx.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class TelemetrySummaryResponse : BaseResponse
    {
        [JsonProperty("summary")]
        public VehicleTelemetrySummary Summary { get; set; }
    }

    public class VehicleTelemetrySummary
    {
        public string Name { get; set; }

        public string Polyline { get; set; }

        public List<TelemetrySummaryRecord> Events { get; set; }
    }

    public class TelemetrySummaryRecord
    {
        public string Type { get; set; }

        public DateTime Time { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Heading { get; set; }

        public double Altitude { get; set; }

        public string EngineStatus { get; set; }

        public double Speed { get; set; }

        public long? Odometer { get; set; }

        public string Justification { get; set; }
    }
}