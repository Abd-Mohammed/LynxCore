using Lynx.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Ridesharing.Models
{
    public class TripsResponse : BaseResponse
    {
        public List<Trip> Trips { get; set; } = new List<Trip>();
    }

    public class Trip
    {
        public int Id { get; set; }

        public int RideId { get; set; }

        public string Number { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RideSource Source { get; set; }

        public DateTime RequestedTime { get; set; }

        public DateTime? AcceptedTime { get; set; }

        public string RideType { get; set; }

        public string CreatedBy { get; set; }

        public string PromoCode { get; set; }

        public DateTime PickupTime { get; set; }

        public DateTime DropOffTime { get; set; }

        public double Distance { get; set; }

        public double Duration { get; set; }

        public string ShiftNo { get; set; }

        public double WaitTime { get; set; }

        public decimal Discount { get; set; }

        public decimal TotalFare { get; set; }

        public double DistanceToCustomer { get; set; }

        public double AverageSpeed { get; set; }

        public double MaxSpeed { get; set; }

        public double PaidWaitTime { get; set; }

        public bool RoadSpeedLimitExceeded { get; set; }

        public LatLngResponse Reach { get; set; }

        public LatLngResponse Pickup { get; set; }

        public LatLngResponse DropOff { get; set; }

        public TripCostResponse Cost { get; set; }

        public RideDriverResponse Driver { get; set; }

        public RideCustomerResponse Customer { get; set; }

        public MinimalFareResponse Fare { get; set; }
    }

    public class MinimalFareResponse
    {
        public string City { get; set; }

        public decimal BookingFee { get; set; }

        public decimal BaseFare { get; set; }
    }

    public class RideCustomerResponse
    {
        public string Name { get; set; }

        public string PhoneNumber { get; set; }
    }

    public class RideDriverResponse
    {
        public string Name { get; set; }

        public string StaffId { get; set; }

        public string ShiftNo { get; set; }

        public int DriverId { get; set; }

        public string CarName { get; set; }

        public string CarPlateNo { get; set; }

        public int CarId { get; set; }

        public int FranchiseId { get; set; }
    }

    public class TripCostResponse
    {
        public decimal DurationFee { get; set; }

        public decimal DistanceFee { get; set; }

        public decimal WaitTimeFee { get; set; }

        public decimal Fare { get; set; }

        public decimal TotalFare { get; set; }

        public decimal FuelSurCharge { get; set; }

        public TripCrossChargeResponse[] TollCharges { get; set; } = Array.Empty<TripCrossChargeResponse>();

        public TripCrossChargeResponse[] TransitCharges { get; set; } = Array.Empty<TripCrossChargeResponse>();

        public ExtraChargeResponse[] ExtraCharges { get; set; } = Array.Empty<ExtraChargeResponse>();
    }

    public class TripCrossChargeResponse
    {
        public string Name { get; set; }

        public decimal Fee { get; set; }
    }

    public class ExtraChargeResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Fee { get; set; }
    }

    public class LatLngResponse
    {
        public DateTime Time { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }
    }

    public enum RideSource
    {
        Web = 1,
        TenantWeb = 2,
        Mobile = 3,
        TenantMobile = 4,
        Roadside = 5,
        External = 6,
        QR = 7,
        Legacy = 8,
    }
}