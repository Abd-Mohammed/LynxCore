using System.Text.Json.Serialization;

namespace LynxProCore.Adapters.Responses;

public class CityResponse : BaseResponse
{
    [JsonPropertyName("cities")]
    public List<GoCityResponse> Cities { get; set; }
}

public class CreateCity
{

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("borderWkt")]
    public string Border { get; set; }
}

public class GoCityResponse : BaseResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("border")]
    public Border Border { get; set; }
}

public class Border
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("coordinates")]
    public List<List<List<double>>> Coordinates { get; set; }

    [JsonPropertyName("options")]
    public Options Options { get; set; } = new Options();
}

public class Options
{
    [JsonPropertyName("fillColor")]
    public string FillColor { get; set; } = "#000000";

    [JsonPropertyName("strokeColor")]
    public string StrokeColor { get; set; } = "#000000";

    [JsonPropertyName("strokeWeight")]
    public long StrokeWeight { get; set; } = 1;
}