using Newtonsoft.Json;

namespace Lynx.Models
{
    public class BaseResponse
    {
        [JsonIgnore]
        public bool IsSuccess { get; set; }

        [JsonIgnore]
        public string ResultStatus { get; set; }

        [JsonProperty("pagination")]
        public Pagination Pagination { get; set; }
    }

    public class Pagination
    {
        [JsonProperty("pageNumber")]
        public int PageNumber { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("pageCount")]
        public int PageCount { get; set; }

        [JsonProperty("totalItemCount")]
        public int TotalItemCount { get; set; }

        [JsonProperty("firstPage")]
        public bool FirstPage { get; set; }

        [JsonProperty("lastPage")]
        public bool LastPage { get; set; }
    }

}