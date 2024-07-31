//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Wasl.Adapters
//{
//    public class WaslVehicleHistoricalLocationAdapter : WaslCompanyConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public WaslVehicleHistoricalLocationAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }
//        public async Task<WaslVehicleHistoricalLocationResponse> GetGeolocationsAsync(int pageNumber, int pageSize,
//            string staffId, string identityNumber, string name, string number, string sequenceNumber,
//            VehicleStatus? status, DateTime from, DateTime to, string sortOrder)
//        {
//            var waslGeolocations = new WaslVehicleHistoricalLocationResponse();
//            var requestUri =
//                $"{WaslCompanyBaseUrl}/Geolocations?pageNumber={pageNumber}&pageSize={pageSize}&staffId={staffId}&identityNumber={identityNumber}" +
//                $"&name={name}&number={number}&sequenceNumber={sequenceNumber}&status={status}&from={from:s}&to={to:s}&sortOrder={sortOrder}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslGeolocations;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                waslGeolocations = JsonConvert.DeserializeObject<WaslVehicleHistoricalLocationResponse>(result.ToString());
//                return waslGeolocations;
//            }
//            catch
//            {
//                return waslGeolocations;
//            }
//        }
//    }
//}