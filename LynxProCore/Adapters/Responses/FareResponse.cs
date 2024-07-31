using System.Text.Json.Serialization;
using Lynx.Models;
using LynxProCore.Models;

namespace LynxProCore.Adapters.Responses;

public class FareResponse : BaseResponse
{
    [JsonPropertyName("fares")]
    public List<GoFareResponse> Fares { get; set; }
}

public class GoFareResponse : BaseResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("baseFare")]
    public decimal BaseFare { get; set; }

    [JsonPropertyName("costPerMinute")]
    public decimal CostPerMinute { get; set; }

    [JsonPropertyName("costPerDistance")]
    public decimal CostPerDistance { get; set; }

    [JsonPropertyName("lengthUnit")]
    public FareDistanceUnit LengthUnit { get; set; }

    [JsonPropertyName("minimumFare")]
    public decimal MinimumFare { get; set; }

    [JsonPropertyName("bookingFee")]
    public decimal BookingFee { get; set; }

    [JsonPropertyName("waitTimeChargePerMinute")]
    public decimal WaitTimeChargePerMinute { get; set; }

    [JsonPropertyName("waitTimeThreshold")]
    public int WaitTimeThreshold { get; set; }

    [JsonPropertyName("city")]
    public MinimalCityResponse City { get; set; }

    [JsonPropertyName("rideType")]
    public MinimalRideTypeResponse RideType { get; set; }

    [JsonPropertyName("settings")]
    public Settings Settings { get; set; }

    [JsonPropertyName("transitCharges")]
    public List<TransitChargeResponse> TransitCharges { get; set; }

    [JsonPropertyName("extraCharges")]
    public List<ExtraChargeResponse> ExtraCharges { get; set; }
}

public class CreateFareRequest
{
    [JsonPropertyName("baseFare")]
    public decimal BaseFare { get; set; }

    [JsonPropertyName("costPerMinute")]
    public decimal CostPerMinute { get; set; }

    [JsonPropertyName("costPerDistance")]
    public decimal CostPerDistance { get; set; }

    [JsonPropertyName("lengthUnit")]
    public FareDistanceUnitViewModel LengthUnit { get; set; }

    [JsonPropertyName("minimumFare")]
    public decimal MinimumFare { get; set; }

    [JsonPropertyName("bookingFee")]
    public decimal BookingFee { get; set; }

    [JsonPropertyName("waitTimeChargePerMinute")]
    public decimal WaitTimeChargePerMinute { get; set; }

    [JsonPropertyName("waitTimeThreshold")]
    public int WaitTimeThreshold { get; set; }

    [JsonPropertyName("settings")]
    public Settings Settings { get; set; }

    [JsonPropertyName("cityId")]
    public int CityId { get; set; }

    [JsonPropertyName("rideTypeId")]
    public int RideTypeId { get; set; }

    [JsonPropertyName("transitCharges")]
    public List<TransitChargeRequest> TransitCharges { get; set; }

    [JsonPropertyName("extraCharges")]
    public List<ExtraChargeResponse> ExtraCharges { get; set; }
}

public class TransitChargeRequest
{
    public int? CityId { get; set; }

    public decimal Fee { get; set; }
}

public class ExtraChargeResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("fee")]
    public decimal Fee { get; set; }
}

public class TransitChargeResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("Fee")]
    public decimal Fee { get; set; }

    [JsonPropertyName("city")]
    public MinimalCityResponse City { get; set; }
}

public class MinimalRideTypeResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class MinimalCityResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class Settings
{
    [JsonPropertyName("color")]
    public string Color { get; set; }

    [JsonPropertyName("schedules")]
    public List<FareScheduleResponse> Schedules { get; set; }
}

public class FareScheduleResponse
{
    public System.DayOfWeek DayOfWeek { get; set; }

    public string From { get; set; }

    public string To { get; set; }
}