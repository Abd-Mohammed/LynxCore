//using Lynx.Models;
//using Lynx.NextGenConfigration.DataAnalytics.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DataAnalytics.Adapters
//{
//    public class VehicleTelemetryAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public VehicleTelemetryAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<TelemetryEventsResponse> GetTelemetryEventsAsync(TelemetryEventQuery query)
//        {
//            var telemetryResult = new TelemetryEventsResponse();
//            var requestUri = $"{DataAnalyticsBaseUrl}/telematics/telemetryevents?vehicleName={query.VehicleName}&from={query.From:o}&to={query.To:o}&pageNumber={query.PageNumber}&pageSize={query.PageSize}&sortOrder={query.SortOrder}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                telemetryResult.ResultStatus = response.StatusCode.ToString();

//                if (!response.IsSuccessStatusCode)
//                {
//                    return telemetryResult;
//                }

//                var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                telemetryResult.TelemetryEvents = result["telemetryEvents"]?.ToObject<List<TelemetryEventRecord>>();
//                telemetryResult.Pagination = result["pagination"]?.ToObject<Pagination>();
//                telemetryResult.IsSuccess = true;

//                return telemetryResult;
//            }
//            catch
//            {
//                return telemetryResult;
//            }
//        }

//        public async Task<TelemetrySummaryResponse> GetTelemetrySummaryAsync(TelemetrySummaryQuery query)
//        {
//            var telemetryResult = new TelemetrySummaryResponse();
//            var requestUri = $"{DataAnalyticsBaseUrl}/telematics/telemetryanalytics/summary?vehicleName={query.VehicleName}&from={query.From:o}&to={query.To:o}&includeAlerts={query.IncludeAlerts}&snapToRoad={query.SnapToRoad}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                telemetryResult.ResultStatus = response.StatusCode.ToString();

//                if (!response.IsSuccessStatusCode)
//                {
//                    return telemetryResult;
//                }

//                var result = await response.Content.ReadAsStringAsync();
//                telemetryResult = JsonConvert.DeserializeObject<TelemetrySummaryResponse>(result);
//                telemetryResult.IsSuccess = true;

//                return telemetryResult;
//            }
//            catch
//            {
//                return telemetryResult;
//            }
//        }
//    }
//}