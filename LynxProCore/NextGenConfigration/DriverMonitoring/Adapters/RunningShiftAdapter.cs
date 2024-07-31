//using Lynx.NextGenConfigration.DriverMonitoring.Responses;
//using Newtonsoft.Json.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Adapters
//{
//    public class RunningShiftAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public RunningShiftAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<RunningShiftDto> GetActShift(string vehicleName)
//        {
//            RunningShiftDto result = null;
//            var uri = $"{DriverMonitoringBaseUrl}/runningShifts/vehicle/{vehicleName}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(uri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return result;
//                }

//                var body = JObject.Parse(await response.Content.ReadAsStringAsync());

//                return body["runningShift"]?.ToObject<RunningShiftDto>();
//            }
//            catch
//            {
//                return result;
//            }
//        }
//    }
//}