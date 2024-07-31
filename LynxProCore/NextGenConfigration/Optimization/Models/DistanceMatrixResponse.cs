using Lynx.Models;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class DistanceMatrixResponse : BaseResponse
    {
        [JsonProperty("distanceMatrix")]
        public DistanceMatrixRowContainer DistanceMatrixResult { get; set; } = new DistanceMatrixRowContainer();

        [JsonIgnore]
        public string[] ErrorPoints { get; set; }
    }

    public class DistanceMatrixRowContainer
    {
        [JsonProperty("rows")]
        public List<DistanceMatrixRow> Rows { get; set; } = new List<DistanceMatrixRow>();
    }

    public class DistanceMatrixRow
    {
        [JsonProperty("origin")]
        public string Origin { get; set; }

        [JsonProperty("elements")]
        public List<DistanceMatrixElement> Elements { get; set; } = new List<DistanceMatrixElement>();
    }

    public class DistanceMatrixElement
    {
        [JsonProperty("destination")]
        public string Destination { get; set; }

        [JsonProperty("distance")]
        public int Distance { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }
    }
}