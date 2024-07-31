using System;

namespace Lynx.NextGenConfigration.DriverMonitoring.Responses
{
    public class RunningShiftDto
    {
        public string Number { get; set; }

        public DateTime Time { get; set; }

        public RunningShiftDriverDto Driver { get; set; }

        public VehicleDto Vehicle { get; set; }

        public class RunningShiftDriverDto
        {
            public string StaffId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }

        public class VehicleDto
        {
            public string Name { get; set; }
            public string Number { get; set; }
            public string PlateNo { get; set; }
            public string DeviceNumericId { get; set; }
        };
    }
}