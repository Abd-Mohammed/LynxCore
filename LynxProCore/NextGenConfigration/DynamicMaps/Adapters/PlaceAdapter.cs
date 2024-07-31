//using Lynx.Models;
//using Lynx.NextGenConfigration.DynamicMaps.Adapters.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DynamicMaps.Adapters
//{
//    public class PlaceAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public PlaceAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<PlaceResponse> GetAsync(string keyword)
//        {
//            var requestUri = $"{DynamicMapsBaseUrl}Places/NearbySearch?keyword={keyword}";
//            var placesResponse = new PlaceResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    placesResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
//                    return placesResponse;
//                }

//                var responceBody = await response.Content.ReadAsStringAsync();
//                placesResponse = JsonConvert.DeserializeObject<PlaceResponse>(responceBody);
//                placesResponse.IsSuccess = true;

//                return placesResponse;
//            }
//            catch
//            {
//                return placesResponse;
//            }
//        }
//    }
//}