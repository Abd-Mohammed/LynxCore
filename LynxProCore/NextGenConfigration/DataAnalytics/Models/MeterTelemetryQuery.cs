using System;

namespace Lynx.NextGenConfigration.DataAnalytics.Models
{
    public class MeterTelemetryQuery
    {
        public string VehicleName { get; set; }

        public string PlateNumber { get; set; }

        public DateTime From { get; set; }

        public DateTime To { get; set; }
    }
}