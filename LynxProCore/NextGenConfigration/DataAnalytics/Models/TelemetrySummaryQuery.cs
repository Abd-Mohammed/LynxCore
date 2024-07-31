using System;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class TelemetrySummaryQuery
    {
        public string VehicleName { get; set; }

        public DateTime From { get; set; }

        public DateTime To { get; set; }

        public bool IncludeAlerts { get; set; }

        public bool SnapToRoad { get; set; } = true;
    }
}