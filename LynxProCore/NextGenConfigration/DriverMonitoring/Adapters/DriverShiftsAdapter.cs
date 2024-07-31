//using Lynx.Models;
//using Lynx.NextGenConfigration.DriverMonitoring.Models;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;
//using DriverShift = Lynx.NextGenConfigration.DriverMonitoring.Models.DriverShift;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Adapters
//{
//    public class DriverShiftsAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public DriverShiftsAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<DriverShiftsResponse> ListAsync(DriverShiftQuery query, int? tenantId = null, CancellationToken cancellationToken = default)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/drivershifts?{GetQueryString(query)}";
//            var result = new DriverShiftsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                if (tenantId.HasValue)
//                {
//                    client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.Value.ToString());
//                }

//                var response = await client.GetAsync(requestUri, cancellationToken);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.DriverShifts = json["driverShifts"]?.ToObject<List<DriverShift>>();
//                result.Pagination = json["pagination"]?.ToObject<Pagination>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<DriverShiftSummaryResponse> SummaryAsync(DriverShiftSummaryQuery query, int? tenantId = null, CancellationToken cancellationToken = default)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/DriverShiftsSummary?{GetQueryString(query)}";
//            var result = new DriverShiftSummaryResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                if (tenantId.HasValue)
//                {
//                    client.DefaultRequestHeaders.Add("x-tenant-id", tenantId.Value.ToString());
//                }

//                var response = await client.GetAsync(requestUri, cancellationToken: cancellationToken);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.Drivers = json["shiftsSummary"]?.ToObject<List<MinimalDriverResponse>>();
//                result.Pagination = json["pagination"]?.ToObject<Pagination>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<DriverShiftResponse> GetById(int id)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/drivershifts/{id}";
//            var result = new DriverShiftResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.DriverShift = json["driverShift"]?.ToObject<DriverShift>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<DriverShiftResponse> GetByNumberAsync(string number, CancellationToken cancellationToken = default)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/drivershifts/number/{number}";
//            var result = new DriverShiftResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                var response = await client.GetAsync(requestUri, cancellationToken);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.DriverShift = json["driverShift"]?.ToObject<DriverShift>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        public async Task<DriverShiftsResponse> GetActiveShifts(DriverShiftQuery query, int? tenantId = null)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/drivershifts?{GetQueryString(query)}";
//            var result = new DriverShiftsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                client.Timeout = Timeout;

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.DriverShifts = json["driverShifts"]?.ToObject<List<DriverShift>>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        private static string GetQueryString(DriverShiftQuery query)
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

//            if (!string.IsNullOrEmpty(query.SortOrder))
//            {
//                queryString.Append($"sortOrder={query.SortOrder}&");
//            }

//            if (!string.IsNullOrEmpty(query.StaffId))
//            {
//                queryString.Append($"staffId={query.StaffId}&");
//            }

//            if (!string.IsNullOrEmpty(query.FirstName))
//            {
//                queryString.Append($"firstName={query.FirstName}&");
//            }

//            if (!string.IsNullOrEmpty(query.LastName))
//            {
//                queryString.Append($"lastName={query.LastName}&");
//            }

//            if (!string.IsNullOrEmpty(query.VehicleName))
//            {
//                queryString.Append($"vehicleName={query.VehicleName}&");
//            }

//            if (!string.IsNullOrEmpty(query.ShiftNumbers))
//            {
//                queryString.Append($"shiftNumbers={query.ShiftNumbers}&");
//            }

//            if (!string.IsNullOrEmpty(query.FranchiseNames))
//            {
//                queryString.Append($"franchiseNames={query.FranchiseNames}&");
//            }

//            if (query.FromStartTime.HasValue)
//            {
//                queryString.Append($"fromStartTime={query.FromStartTime.Value:s}&");
//            }

//            if (query.ToStartTime.HasValue)
//            {
//                queryString.Append($"toStartTime={query.ToStartTime.Value:s}&");
//            }

//            if (query.FromEndTime.HasValue)
//            {
//                queryString.Append($"fromEndTime={query.FromEndTime.Value:s}&");
//            }

//            if (query.ToEndTime.HasValue)
//            {
//                queryString.Append($"toEndTime={query.ToEndTime.Value:s}&");
//            }

//            if (query.StartTime.HasValue)
//            {
//                queryString.Append($"startTime={query.StartTime.Value:s}&");
//            }

//            if (query.EndTime.HasValue)
//            {
//                queryString.Append($"endTime={query.EndTime.Value:s}&");
//            }

//            return queryString.ToString().TrimEnd('&');
//        }

//        private static string GetQueryString(DriverShiftSummaryQuery query)
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

//            if (!string.IsNullOrEmpty(query.SortOrder))
//            {
//                queryString.Append($"sortOrder={query.SortOrder}&");
//            }

//            if (query.FromStartTime.HasValue)
//            {
//                queryString.Append($"fromStartTime={query.FromStartTime.Value:s}&");
//            }

//            if (query.ToStartTime.HasValue)
//            {
//                queryString.Append($"toStartTime={query.ToStartTime.Value:s}&");
//            }

//            return queryString.ToString().TrimEnd('&');
//        }
//    }
//}