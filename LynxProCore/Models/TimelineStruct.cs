using Newtonsoft.Json;
using System;

namespace Lynx.Models
{
    public struct TimelineStruct
    {
        [JsonProperty("timestamp")]
        public DateTime Timestamp;

        [JsonProperty("lat")]
        public double Latitude;

        [JsonProperty("lng")]
        public double Longitude;

        [JsonProperty("incident")]
        public bool? IsIncident;
    }
}