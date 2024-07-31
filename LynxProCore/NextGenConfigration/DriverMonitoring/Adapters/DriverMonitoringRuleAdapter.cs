//using Lynx.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using Newtonsoft.Json.Serialization;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Adapters
//{
//    public class DriverMonitoringRuleAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public DriverMonitoringRuleAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<DriverRuleResponse> GetRuleSettingsAsync()
//        {
//            var ruleResponse = new DriverRuleResponse();
//            var uri = $"{DriverMonitoringBaseUrl}/Rules";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(uri);
//                if (response.StatusCode == System.Net.HttpStatusCode.NotFound || !response.IsSuccessStatusCode)
//                {
//                    return null;
//                }

//                var body = JObject.Parse(await response.Content.ReadAsStringAsync());
//                ruleResponse = JsonConvert.DeserializeObject<DriverRuleResponse>(body["rule"]?.ToString() ?? string.Empty);
//                return ruleResponse;
//            }
//            catch
//            {
//                return ruleResponse;
//            }
//        }

//        public async Task<bool> UpdateRuleSettingsAsync(DriverRuleSettingsViewModel model, int id)
//        {
//            var uri = $"{DriverMonitoringBaseUrl}/Rules/{id}";

//            try
//            {
//                using (var client = new HttpClient())
//                {
//                    client.Timeout = Timeout;
//                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                    var requestBody = new
//                    {
//                        virtualMode = model.VirtualMode,
//                        swipeCooldownInSeconds = model.SwipeCooldownInSeconds,
//                        vehicleTypes = model.VehicleTypes
//                    };

//                    var settings = new JsonSerializerSettings()
//                    {
//                        Formatting = Formatting.None,
//                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
//                        NullValueHandling = NullValueHandling.Ignore
//                    };

//                    var stringContent = JsonConvert.SerializeObject(requestBody, settings);
//                    var content = new StringContent(stringContent, Encoding.UTF8, "application/json");
//                    var response = await client.PutAsync(uri, content);
//                    return response.IsSuccessStatusCode;
//                }
//            }
//            catch
//            {
//                return false;
//            }
//        }
//    }
//}