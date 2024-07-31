//using Lynx.JsonConverters;
//using Lynx.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Converters;
//using System;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Models
//{
//    public class DriverShiftResponse : BaseResponse
//    {
//        public DriverShift DriverShift { get; set; }
//    }

//    public class DriverShift
//    {
//        public int Id { get; set; }

//        public string Number { get; set; }

//        [JsonConverter(typeof(StringEnumConverter))]
//        public DriverShiftSource Source { get; set; }

//        public DateTime StartTime { get; set; }

//        public double StartLatitude { get; set; }

//        public double StartLongitude { get; set; }

//        public string StartAddress { get; set; }

//        public DateTime EndTime { get; set; }

//        public double EndLatitude { get; set; }

//        public double EndLongitude { get; set; }

//        public string EndAddress { get; set; }

//        public int Duration { get; set; }

//        public int Distance { get; set; }

//        public int TenantId { get; set; }

//        public DriverShiftDriverRecord Driver { get; set; }

//        public DriverShiftVehicleRecord Vehicle { get; set; }

//        public ShiftSummaryRecord ShiftSummary { get; set; }
//    }

//    public class ShiftSummaryRecord
//    {
//        public string Name { get; set; }

//        [JsonConverter(typeof(TimeOnlyConverter))]
//        public TimeOnly StartTime { get; set; }

//        [JsonConverter(typeof(TimeOnlyConverter))]
//        public TimeOnly EndTime { get; set; }
//    }

//    public class DriverShiftDriverRecord
//    {
//        public string StaffId { get; set; }

//        public string FirstName { get; set; }

//        public string LastName { get; set; }
//    }

//    public class DriverShiftVehicleRecord
//    {
//        public string Name { get; set; }
//    }

//    public enum DriverShiftSource
//    {
//        /// <summary>
//        /// RFID card swipes.
//        /// </summary>
//        Swipe = 1,
//        /// <summary>
//        /// Internal subsystems or 3rd party providers.
//        /// </summary>
//        App = 2,
//        /// <summary>
//        /// Automated virtual shifts based on assignment rules.
//        /// </summary>
//        Virtual = 3
//    }
//}