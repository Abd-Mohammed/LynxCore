using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lynx.Models
{
    public class FranchiseResponse : BaseResponse
    {
        [JsonProperty("franchises")]
        public List<Franchise> Franchises { get; set; } = new List<Franchise>();
    }
    public class Franchise
    {
        [JsonProperty("id")]
        public int FranchiseId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

}