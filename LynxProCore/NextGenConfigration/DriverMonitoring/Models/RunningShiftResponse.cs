//using Lynx.Models;
//using System;
//using System.Collections.Generic;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Models
//{
//    public class RunningShiftsResponse : BaseResponse
//    {
//        public List<RunningShift> RunningShifts { get; set; } = new List<RunningShift>();
//    }

//    public class RunningShiftResponse : BaseResponse
//    {
//        public RunningShift RunningShift { get; set; }

//        public ProblemDetails Problem { get; set; }
//    }

//    public class RunningShift
//    {
//        public string Number { get; set; }

//        public DriverShiftSource? Source { get; set; }

//        public DateTime Time { get; set; }

//        public RunningShiftDriver Driver { get; set; }

//        public RunningShiftVehicle Vehicle { get; set; }
//    }

//    public class RunningShiftDriver
//    {
//        public string StaffId { get; set; }
//        public string FirstName { get; set; }
//        public string LastName { get; set; }
//        public string DriverName => $"{FirstName} {LastName}";
//    }

//    public class RunningShiftVehicle
//    {
//        public string Name { get; set; }
//        public string Number { get; set; }
//        public string FranchiseName { get; set; }
//        public string PlateNo { get; set; }
//        public string DeviceNumericId { get; set; }
//    }
//}