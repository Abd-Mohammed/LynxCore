using Lynx.Models;
using Newtonsoft.Json;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class EtaMultiplierResponse : BaseResponse
    {
        [JsonProperty("value")]
        public double Value { get; set; }
    }
}