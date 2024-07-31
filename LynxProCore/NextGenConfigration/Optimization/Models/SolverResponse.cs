//using JetBrains.Annotations;
//using Lynx.Models;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;

//namespace Lynx.NextGenConfigration.Optimization.Models
//{
//    public class SolverResponse : BaseResponse
//    {
//        public Solver Solver { get; set; }
//    }

//    public class Solver
//    {
//        [JsonProperty("id")]
//        public int Id { get; set; }

//        [CanBeNull]
//        [JsonProperty("vehicleRouting")]
//        public SolverVehicleRouting VehicleRouting { get; set; }
//    }

//    public class SolverVehicleRouting
//    {
//        [JsonProperty("dutyStartTime")]
//        public string DutyStartTime { get; set; }

//        [JsonProperty("dutyEndTime")]
//        public string DutyEndTime { get; set; }

//        [JsonProperty("maxPickupTimeWindow")]
//        public int? MaxPickupTimeWindow { get; set; }

//        [JsonProperty("minDeliveryTimeWindow")]
//        public int? MinDeliveryTimeWindow { get; set; }

//        [JsonProperty("minInterTripTime")]
//        public int MinInterTripTime { get; set; }

//        [JsonProperty("maxTravelTime")]
//        public int? MaxTravelTime { get; set; }

//        [JsonProperty("droppedPercent")]
//        public double DroppedPercent { get; set; }

//        [JsonProperty("serviceTime")]
//        public int ServiceTime { get; set; }

//        [JsonProperty("extraCustomerServiceTime")]
//        public int? ExtraCustomerServiceTime { get; set; }

//        [JsonProperty("maxRouteDistance")]
//        public int? MaxRouteDistance { get; set; }

//        [JsonProperty("maxRouteDuration")]
//        public int? MaxRouteDuration { get; set; }

//        [JsonProperty("maxLegDistance")]
//        public int? MaxLegDistance { get; set; }

//        [JsonProperty("maxLegDuration")]
//        public int? MaxLegDuration { get; set; }

//        [JsonProperty("dwellTime")]
//        public int DwellTime { get; set; }

//        [JsonProperty("minStopCount")]
//        public int MinStopCount { get; set; }

//        [JsonProperty("maxStopCount")]
//        public int MaxStopCount { get; set; }

//        [JsonProperty("timeLimit")]
//        public int TimeLimit { get; set; }

//        [JsonProperty("etaMultipliers")]
//        public List<EtaMultiplier> EtaMultipliers { get; set; } = new List<EtaMultiplier>();
//    }

//    public class EtaMultiplier
//    {
//        [JsonProperty("time")]
//        public TimeOnly? Time { get; set; }

//        [JsonProperty("value")]
//        public double Value { get; set; }
//    }
//}