//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Wasl.Adapters
//{
//    public class WaslDriverAdapter : WaslCompanyConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public WaslDriverAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }
//        public async Task<WaslDriverResponse> GetDriverAsync(string staffId)
//        {
//            var waslDriver = new WaslDriverResponse();
//            var requestUri = $"{WaslCompanyBaseUrl}/Drivers/staffId/{staffId}";
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslDriver;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                waslDriver = JsonConvert.DeserializeObject<WaslDriverResponse>(result["driver"]?.ToString() ?? string.Empty);
//                waslDriver.IsSuccess = true;

//                return waslDriver;
//            }
//            catch
//            {
//                return waslDriver;
//            }
//        }

//        public async Task<WaslDriverSummaryResponse> GetDriversAsync(int pageNumber, int pageSize, string staffId,
//            string identityNumber, string mobileNumber, ActivityType? activity, bool? lastSyncStatus,
//            bool? registrationSyncStatus, string sortOrder)
//        {
//            var waslDrivers = new WaslDriverSummaryResponse();
//            var requestUri = $"{WaslCompanyBaseUrl}/Drivers?pageNumber={pageNumber}&pageSize={pageSize}&staffId={staffId}&identityNumber={identityNumber}" +
//                $"&mobileNumber={mobileNumber}&activity={activity}&lastSyncStatus={lastSyncStatus}&registrationSyncStatus={registrationSyncStatus}&sortOrder={sortOrder}";
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return waslDrivers;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                waslDrivers = JsonConvert.DeserializeObject<WaslDriverSummaryResponse>(result.ToString());
//                return waslDrivers;
//            }
//            catch
//            {
//                return waslDrivers;
//            }
//        }

//        public async Task<bool> DriverRegistrationAsync(int id, string identityNumber, string phoneNumber, DateTime dateOfBirth)
//        {
//            try
//            {
//                var jObject = new JObject
//                {
//                    ["dateOfBirth"] = dateOfBirth.ToString("yyyy-MM-dd"),
//                    ["identityNumber"] = identityNumber,
//                    ["phoneNumber"] = phoneNumber
//                };
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                var response = await client.PutAsync($"{WaslCompanyBaseUrl}/DriverRegistration/{id}", BuildStringContent(jObject));
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