//using Lynx.NextGenConfigration.DynamicMaps.Adapters.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DynamicMaps.Adapters
//{
//    public class MapAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public MapAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<GeocodeResponse> GetAsync(string location)
//        {
//            var requestUri = $"{DynamicMapsBaseUrl}Maps/Geocode?location={location}";
//            var GeocodeResponse = new GeocodeResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    GeocodeResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
//                    return GeocodeResponse;
//                }

//                var responceBody = await response.Content.ReadAsStringAsync();
//                GeocodeResponse = JsonConvert.DeserializeObject<GeocodeResponse>(responceBody);
//                GeocodeResponse.IsSuccess = true;

//                return GeocodeResponse;
//            }
//            catch
//            {
//                return GeocodeResponse;
//            }
//        }
//    }
//}