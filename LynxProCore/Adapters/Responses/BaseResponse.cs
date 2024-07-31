using System.Text.Json.Serialization;

namespace LynxProCore.Adapters.Responses;

public class BaseResponse
{
    [JsonIgnore]
    public bool IsSuccess { get; set; }

    [JsonIgnore]
    public string ResultStatus { get; set; }

    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; }

    [JsonPropertyName("createdDate")]
    public DateTime CreatedDate { get; set; }

    [JsonPropertyName("modifiedBy")]
    public string ModifiedBy { get; set; }

    [JsonPropertyName("modifiedDate")]
    public DateTime ModifiedDate { get; set; }

    [JsonPropertyName("pagination")]
    public Pagination Pagination { get; set; }
}

public class Pagination
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("pageCount")]
    public int PageCount { get; set; }

    [JsonPropertyName("totalItemCount")]
    public int TotalItemCount { get; set; }

    [JsonPropertyName("firstPage")]
    public bool FirstPage { get; set; }

    [JsonPropertyName("lastPage")]
    public bool LastPage { get; set; }
}
