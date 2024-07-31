using System;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class DriverShiftQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string SortOrder { get; set; }

        public string StaffId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string VehicleName { get; set; }

        public string ShiftNumbers { get; set; }

        public string FranchiseNames { get; set; }

        public DateTime? FromStartTime { get; set; }

        public DateTime? ToStartTime { get; set; }

        public DateTime? FromEndTime { get; set; }

        public DateTime? ToEndTime { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
    }

    public class DriverShiftSummaryQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string SortOrder { get; set; }

        public DateTime? FromStartTime { get; set; }

        public DateTime? ToStartTime { get; set; }
    }
}