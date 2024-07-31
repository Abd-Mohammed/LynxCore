using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class DriverQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string StaffId { get; set; }

        public string SmartCardUid { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PermitId { get; set; }

        public string LicenseNo { get; set; }

        public string SortOrder { get; set; }

        public List<int> DriverGroupIds { get; set; }

        public List<string> StaffIds { get; set; }
    }
}