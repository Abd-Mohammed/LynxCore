//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;
//using ActivityType = Lynx.NextGenConfigration.Wasl.Responses.ActivityType;

//namespace Lynx.NextGenConfigration.Wasl.Adapters
//{
//    public class WaslVehicleAdapter : WaslCompanyConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public WaslVehicleAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<WaslVehicleResponse> GetVehicleAsync(string name)
//        {
//            var requestUri = $"{WaslCompanyBaseUrl}/vehicles/name/{name}";
//            var vehicle = new WaslVehicleResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    vehicle.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();
//                    return vehicle;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                var responseJObj = JObject.Parse(responseBody);
//                vehicle = JsonConvert.DeserializeObject<WaslVehicleResponse>(responseJObj["vehicle"]?.ToString() ?? string.Empty);
//                vehicle.IsSuccess = true;

//                return vehicle;
//            }
//            catch
//            {
//                return vehicle;
//            }
//        }

//        public async Task<WaslVehicleSummaryResponse> GetVehiclesAsync(int? pageNumber, int? pageSize, string name,
//            string number, string sequenceNumber, PlateType? plateType, ActivityType? activity, string imeiNumber,
//            bool? registrationSyncStatus, bool? lastSyncStatus, DateTime? lastSyncTime, string sortOrder)
//        {
//            var requestUri =
//                $"{WaslCompanyBaseUrl}/Vehicles?pageNumber={pageNumber}&pageSize={pageSize}&sortOrder={sortOrder}&name={name}&number={number}" +
//                $"&imeiNumber={imeiNumber}&sequenceNumber={sequenceNumber}&plateType={plateType}&activity={activity}" +
//                $"&registrationSyncStatus={registrationSyncStatus}&lastSyncStatus={lastSyncStatus}&lastSyncTime={lastSyncTime}";

//            var waslVehicles = new WaslVehicleSummaryResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslVehicles;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                return JsonConvert.DeserializeObject<WaslVehicleSummaryResponse>(result.ToString());

//            }
//            catch
//            {
//                return waslVehicles;
//            }
//        }

//        public async Task<bool> VehicleRegistrationAsync(int id, string sequenceNumber,
//            string plateNumber, string plateRightLetter, string plateLeftLetter, string plateMiddleLetter,
//            string plateType, bool hasTechnicalRequirements, bool hasSafetyRequirements)
//        {
//            try
//            {
//                var jObject = new JObject
//                {
//                    ["plateType"] = plateType,
//                    ["plateNumber"] = plateNumber,
//                    ["sequenceNumber"] = sequenceNumber,
//                    ["plateLeftLetter"] = plateLeftLetter,
//                    ["plateRightLetter"] = plateRightLetter,
//                    ["plateMiddleLetter"] = plateMiddleLetter,
//                    ["safetyRequirements"] = hasSafetyRequirements,
//                    ["technicalRequirements"] = hasTechnicalRequirements,
//                };
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.PutAsync($"{WaslCompanyBaseUrl}/VehicleRegistration/{id}", BuildStringContent(jObject));
//                if (!response.IsSuccessStatusCode)
//                {
//                    return false;
//                }

//                return true;
//            }
//            catch
//            {
//                return false;
//            }
//        }
//    }
//}