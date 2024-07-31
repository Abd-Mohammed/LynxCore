using Lynx.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.ComponentModel.DataAnnotations;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class ProblemResponse : BaseResponse
    {
        public Problem Problem { get; set; }
    }

    public class Problem
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ProblemType Type { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public SolverStatus SolverStatus { get; set; }

        public int ProcessingTime { get; set; }

        public VehicleRoutingModel VehicleRouting { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public class VehicleRoutingModel
    {
        public Service[] Services { get; set; }

        public VehicleRoutingSolution Solution = null;
    }

    public class VehicleRoutingSolution
    {
        public int Distance { get; set; }

        public int Duration { get; set; }

        public int MaxOperationTime { get; set; }

        public int ServiceDuration { get; set; }

        public int UnassignedCount { get; set; }

        public Route[] Routes { get; set; }
    }

    public class Route
    {
        public string VehicleId { get; set; }

        public int Distance { get; set; }

        public int Duration { get; set; }

        public int ServiceDuration { get; set; }

        public Activity[] Activities { get; set; }
    }

    public class Activity
    {
        public string Id { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ActivityType Type { get; set; }

        public Location Location { get; set; }

        public DateTime? ArrDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }

        public int Distance { get; set; }

        public int[] LoadBefore { get; set; }

        public int[] LoadAfter { get; set; }
    }

    public class Service
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public Location Location { get; set; }

        public int Duration { get; set; }
    }

    public class Location
    {
        public string Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }

    public enum ProblemType
    {
        VehicleRouting = 1
    }

    public enum SolverStatus
    {
        [Display(Name = "[[[[None]]]]")]
        None = 0,

        [Display(Name = "[[[[Running]]]]")]
        Running = 1,

        [Display(Name = "[[[[Succeeded]]]]")]
        Success = 2,

        [Display(Name = "[[[[Partial Succeeded]]]]")]
        PartialSuccess = 3,

        [Display(Name = "[[[[Failed]]]]")]
        Fail = 4,

        [Display(Name = "[[[[Infeasible]]]]")]
        Infeasible = 5,

        [Display(Name = "[[[[Cancelled]]]]")]
        Cancelled = 6
    }

    public enum ActivityType
    {
        Start = 1,
        End = 2,
        Service = 3,
        PickupShipment = 4,
        DeliverShipment = 5,
        Pickup = 6,
        Delivery = 7,
        Break = 8
    }
}