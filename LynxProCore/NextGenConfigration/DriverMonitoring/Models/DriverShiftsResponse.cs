using Lynx.Models;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class DriverShiftsResponse : BaseResponse
    {
        public List<DriverShift> DriverShifts { get; set; } = new List<DriverShift>();
    }
}