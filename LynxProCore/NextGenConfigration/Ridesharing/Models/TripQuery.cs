using System;

namespace Lynx.NextGenConfigration.Ridesharing.Models
{
    public class TripQuery
    {
        public string ShiftNumbers { get; set; }

        public string Franchises { get; set; }

        public DateTime? FromRequestedTime { get; set; }

        public DateTime? ToRequestedTime { get; set; }

        public string DriverStaffId { get; set; }

        public string SortOrder { get; set; }
    }
}