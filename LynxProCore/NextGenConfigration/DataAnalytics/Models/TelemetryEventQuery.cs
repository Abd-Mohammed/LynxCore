using System;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class TelemetryEventQuery
    {
        public string VehicleName { get; set; }

        public DateTime From { get; set; }

        public DateTime To { get; set; }

        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string SortOrder { get; set; }
    }
}