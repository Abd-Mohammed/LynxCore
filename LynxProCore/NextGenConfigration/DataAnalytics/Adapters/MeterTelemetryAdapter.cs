//using Lynx.DataAccess;
//using Lynx.NextGenConfigration.DataAnalytics.Models;
//using Newtonsoft.Json;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DataAnalytics.Adapters
//{
//    public class MeterTelemetryAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public MeterTelemetryAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<MeterTelemetryResponse> GetMeterEventsAsync(int tenantId, MeterTelemetryQuery meterEventsQuery)
//        {
//            string vehicleName;
//            if (!string.IsNullOrEmpty(meterEventsQuery.PlateNumber))
//            {
//                using (var unitOfWork = new UnitOfWork(tenantId))
//                {
//                    var vehicle = await unitOfWork.VehicleRepository.GetAsNoTrackingSingleAsync(x => x.PlateNo == meterEventsQuery.PlateNumber);
//                    vehicleName = vehicle?.Name;
//                }
//            }
//            else
//            {
//                vehicleName = meterEventsQuery.VehicleName;
//            }

//            var requestUri = $"{DataAnalyticsBaseUrl}/rideshare/meterevents?deviceId={vehicleName}&from={meterEventsQuery.From:o}&to={meterEventsQuery.To:o}";
//            var meterEventsResponse = new MeterTelemetryResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    meterEventsResponse.ResultStatus = response.StatusCode.ToString();
//                    return meterEventsResponse;
//                }

//                var result = await response.Content.ReadAsStringAsync();
//                meterEventsResponse = JsonConvert.DeserializeObject<MeterTelemetryResponse>(result);
//                meterEventsResponse.VehicleName = vehicleName;
//                meterEventsResponse.IsSuccess = true;

//                return meterEventsResponse;
//            }
//            catch
//            {
//                return meterEventsResponse;
//            }
//        }
//    }
//}