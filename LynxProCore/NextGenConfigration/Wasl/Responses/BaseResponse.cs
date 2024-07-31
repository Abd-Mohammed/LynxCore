using Newtonsoft.Json;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public enum ActivityType
    {
        BusRental = 1,
        EducationalTransport = 2,
        SpecialityTransport = 3
    }

    public enum EligibilityStatus
    {
        Eligibile = 1,
        Pending = 2,
        Ineligible = 3
    }

    public enum VehicleStatus
    {
        ParkedEngineOn = 1,
        ParkedEngineOff = 2,
        Moving = 3,
        DeviceNoSignal = 4,
        DeviceNotWorking = 5,
        Accident = 6
    }

    public class BaseResponse
    {
        [JsonIgnore]
        public bool IsSuccess { get; set; }

        [JsonIgnore]
        public string ResultStatus { get; set; }

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