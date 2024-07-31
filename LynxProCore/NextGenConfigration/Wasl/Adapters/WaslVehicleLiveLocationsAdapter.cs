//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Wasl.Adapters
//{
//    public class WaslVehicleLiveLocationsAdapter : WaslCompanyConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public WaslVehicleLiveLocationsAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }


//        public async Task<WaslVehicleLiveLocationsResponse> GetVehiclesLiveLocationsAsync(int pageNumber, int pageSize, string vehicleName
//            , string vehicleNumber, string vehicleSequenceNumber, string driverStaffId, string driverIdentityNumber, DateTime? timestamp
//            , VehicleStatus? status, string address, DateTime from, DateTime to, bool? lastSyncStatus, string orderBy)
//        {
//            var requestUri =
//                $"{WaslCompanyBaseUrl}/vehicleGeolocations?" +
//                $"pageNumber={pageNumber}&pageSize={pageSize}&sortOrder={orderBy}" +
//                $"&VehicleName={vehicleName}&VehicleNumber={vehicleNumber}&VehicleSequenceNumber={vehicleSequenceNumber}" +
//                $"&DriverStaffId={driverStaffId}&DriverIdentityNumber={driverIdentityNumber}" +
//                $"&Timestamp={timestamp}&Status={status}&Address={address}" +
//                $"&From={from:s}&To={to:s}&LastSyncStatus={lastSyncStatus}";

//            var waslVehicleLiveLocations = new WaslVehicleLiveLocationsResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();

//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslVehicleLiveLocations;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                return JsonConvert.DeserializeObject<WaslVehicleLiveLocationsResponse>(result.ToString());
//            }
//            catch
//            {
//                return waslVehicleLiveLocations;
//            }
//        }
//    }
//}