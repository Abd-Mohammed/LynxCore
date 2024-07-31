using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class RunningShiftQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string SortOrder { get; set; }

        public string Number { get; set; }

        public string DriverStaffId { get; set; }

        public List<string> DriverStaffIds { get; set; }

        public string DriverFirstName { get; set; }

        public string DriverLastName { get; set; }

        public string VehicleNames { get; set; }

        public string FranchiseNames { get; set; }
    }
}