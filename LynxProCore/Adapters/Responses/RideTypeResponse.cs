using System.Text.Json.Serialization;

namespace LynxProCore.Adapters.Responses;

public class RideTypeResponse : BaseResponse
{
    [JsonPropertyName("rideTypes")]
    public List<GoRideTypeResponse> RideTypes { get; set; }
}

public class GoRideTypeResponse : BaseResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("passengerCount")]
    public int PassengerCount { get; set; }

    [JsonPropertyName("noFare")]
    public bool NoFare { get; set; }

    [JsonPropertyName("backToBackTrip")]
    public bool BackToBackTrip { get; set; }

    [JsonPropertyName("vehicleTypes")]
    public List<string> VehicleTypes { get; set; }

    [JsonPropertyName("fuelCost")]
    public decimal FuelCost { get; set; }

    [JsonPropertyName("tenant")]
    public Tenant Tenant { get; set; }
}

public class Tenant
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}
