//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Wasl.Adapters
//{
//    public class WaslAvailableVehicleAdapter : WaslCompanyConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public WaslAvailableVehicleAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<List<WaslAvailableVehicleResponse>> GetAvailableVehiclesAsync(string name)
//        {
//            var waslAvailableVehicle = new List<WaslAvailableVehicleResponse>();
//            var requestUri = $"{WaslCompanyBaseUrl}/AvailableVehicles?name={name}";
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslAvailableVehicle;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                waslAvailableVehicle = JsonConvert.DeserializeObject<List<WaslAvailableVehicleResponse>>(result["availableVehicles"]?.ToString() ?? string.Empty);
//                return waslAvailableVehicle;
//            }
//            catch
//            {
//                return waslAvailableVehicle;
//            }
//        }
//    }
//}