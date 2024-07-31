//using Lynx.Models;
//using Lynx.NextGenConfigration.DriverMonitoring.Models;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Adapters
//{
//    public class RunningShiftsAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public RunningShiftsAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<RunningShiftsResponse> ListAsync(RunningShiftQuery query, int? tenantId = null)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/runningShifts?{GetQueryString(query)}";
//            var result = new RunningShiftsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                if (tenantId.HasValue)
//                {
//                    client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.ToString());
//                }

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.RunningShifts = json["runningShifts"]?.ToObject<List<RunningShift>>();
//                result.Pagination = json["pagination"]?.ToObject<Pagination>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<RunningShiftResponse> GetByVehicleAsync(string vehicleName, int? tenantId = null)
//        {
//            var result = new RunningShiftResponse();
//            var uri = $"{DriverMonitoringBaseUrl}/runningShifts/vehicle/{vehicleName}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                if (tenantId.HasValue)
//                {
//                    client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.ToString());
//                }

//                var response = await client.GetAsync(uri);
//                result.ResultStatus = response.StatusCode.ToString();

//                var body = JObject.Parse(await response.Content.ReadAsStringAsync());
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.Problem = body.ToObject<ProblemDetails>();
//                    return result;
//                }

//                result.RunningShift = body["runningShift"]?.ToObject<RunningShift>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<RunningShiftResponse> GetByDriverAsync(string driverStaffId, int? tenantId = null)
//        {
//            var result = new RunningShiftResponse();
//            var uri = $"{DriverMonitoringBaseUrl}/runningShifts/driver/staffId/{driverStaffId}";

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                if (tenantId.HasValue)
//                {
//                    client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.ToString());
//                }

//                var response = await client.GetAsync(uri);
//                result.ResultStatus = response.StatusCode.ToString();

//                var body = JObject.Parse(await response.Content.ReadAsStringAsync());
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.Problem = body.ToObject<ProblemDetails>();
//                    return result;
//                }

//                result.RunningShift = body["runningShift"]?.ToObject<RunningShift>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<int> GetActiveShiftsCountAsync(int? tenantId = null)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/RunningShifts/Count";
//            var client = _httpClientFactory.CreateClient();
//            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//            client.Timeout = Timeout;

//            if (tenantId.HasValue)
//            {
//                client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.ToString());
//            }

//            try
//            {
//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    return 0;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                return json["count"]?.ToObject<int>() ?? 0;
//            }
//            catch
//            {
//                return 0;
//            }
//        }

//        private static string GetQueryString(RunningShiftQuery query)
//        {
//            var queryString = new StringBuilder();

//            if (query.PageNumber.HasValue)
//            {
//                queryString.Append($"pageNumber={query.PageNumber.Value}&");
//            }

//            if (query.PageSize.HasValue)
//            {
//                queryString.Append($"pageSize={query.PageSize.Value}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.SortOrder))
//            {
//                queryString.Append($"sortOrder={query.SortOrder}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.DriverStaffId))
//            {
//                queryString.Append($"driverStaffId={query.DriverStaffId}&");
//            }

//            if (!string.IsNullOrEmpty(query.Number))
//            {
//                queryString.Append($"Number={query.Number}&");
//            }

//            if (query.DriverStaffIds?.Count > 0)
//            {
//                queryString.Append(string.Join("&", query.DriverStaffIds.Select(g => $"driverStaffIds={g}")));
//            }

//            if (!string.IsNullOrWhiteSpace(query.DriverFirstName))
//            {
//                queryString.Append($"driverFirstName={query.DriverFirstName}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.DriverLastName))
//            {
//                queryString.Append($"driverLastName={query.DriverLastName}&");
//            }

//            if (!string.IsNullOrEmpty(query.FranchiseNames))
//            {
//                queryString.Append($"franchiseNames={query.FranchiseNames}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.VehicleNames))
//            {
//                queryString.Append($"vehicleNames={query.VehicleNames}&");
//            }

//            return queryString.ToString().TrimEnd('&');
//        }
//    }
//}