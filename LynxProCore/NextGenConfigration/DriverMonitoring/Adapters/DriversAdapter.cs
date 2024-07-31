//using Lynx.Models;
//using Lynx.NextGenConfigration.DriverMonitoring.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.DriverMonitoring.Adapters
//{
//    public class DriversAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public DriversAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<DriverResponse> GetAsync(DriverQuery query)
//        {
//            var requestUri = $"{DriverMonitoringBaseUrl}/drivers?{GetQueryString(query)}";
//            var driverResponse = new DriverResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    driverResponse.ResultStatus = response.StatusCode.ToString();
//                    return driverResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                driverResponse = JsonConvert.DeserializeObject<DriverResponse>(responseBody);
//                driverResponse.IsSuccess = true;

//                return driverResponse;
//            }
//            catch
//            {
//                return driverResponse;
//            }
//        }

//        public Task<DriverDetailsResponse> GetValueAsync(string staffId)
//        {
//            return GetValueInternal($"{DriverMonitoringBaseUrl}/drivers/staffId/{staffId}");
//        }

//        public Task<DriverDetailsResponse> GetValueAsync(int id)
//        {
//            return GetValueInternal($"{DriverMonitoringBaseUrl}/drivers/{id}");
//        }

//        private async Task<DriverDetailsResponse> GetValueInternal(string requestUri)
//        {
//            var result = new DriverDetailsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.ResultStatus = response.StatusCode.ToString();
//                    result.Problem = JsonConvert.DeserializeObject<ProblemDetails>(await response.Content.ReadAsStringAsync());
//                    return result;
//                }

//                var json = JObject.Parse(await response.Content.ReadAsStringAsync());
//                result.Driver = json["driver"]?.ToObject<DriverDetails>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                return result;
//            }
//        }

//        private static string GetQueryString(DriverQuery query)
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

//            if (!string.IsNullOrWhiteSpace(query.StaffId))
//            {
//                queryString.Append($"staffId={query.StaffId}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.SmartCardUid))
//            {
//                queryString.Append($"smartCardUid={query.SmartCardUid}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.FirstName))
//            {
//                queryString.Append($"firstName={query.FirstName}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.LastName))
//            {
//                queryString.Append($"lastName={query.LastName}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.PermitId))
//            {
//                queryString.Append($"permitId={query.PermitId}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.LicenseNo))
//            {
//                queryString.Append($"licenseNo={query.LicenseNo}&");
//            }

//            if (!string.IsNullOrWhiteSpace(query.SortOrder))
//            {
//                queryString.Append($"sortOrder={query.SortOrder}&");
//            }

//            if (query.DriverGroupIds?.Count > 0)
//            {
//                queryString.Append(string.Join("&", query.DriverGroupIds.Select(g => $"driverGroupIds={g}")));
//            }

//            if (query.StaffIds?.Count > 0)
//            {
//                queryString.Append(string.Join("&", query.StaffIds.Select(g => $"staffIds={g}")));
//            }

//            return queryString.ToString().TrimEnd('&');
//        }
//    }
//}