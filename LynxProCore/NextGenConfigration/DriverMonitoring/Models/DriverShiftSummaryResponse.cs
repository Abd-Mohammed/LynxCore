using Lynx.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class DriverShiftSummaryResponse : BaseResponse
    {
        public List<MinimalDriverResponse> Drivers { get; set; } = new List<MinimalDriverResponse>();
    }

    public class MinimalDriverResponse
    {
        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("shifts")]
        public IEnumerable<MinimalDriverShiftSummary> ShiftSummary { get; set; }

    }

    public class MinimalDriverShiftSummary
    {
        [JsonProperty("startTime")]
        public DateTime StartTime { get; set; }

        [JsonProperty("endTime")]
        public DateTime EndTime { get; set; }

        [JsonProperty("distance")]
        public double Distance { get; set; }

        [JsonProperty("duration")]
        public double Duration { get; set; }

    }
}