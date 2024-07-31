//using Lynx.NextGenConfigration.Ridesharing.Models;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Ridesharing.Adapters
//{
//    public class TripsAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public TripsAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<TripsResponse> ListAsync(TripQuery query, CancellationToken cancellationToken = default)
//        {
//            var requestUri = $"{RidesharingBaseUrl}trips?{GetQueryString(query)}";
//            var result = new TripsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri, cancellationToken);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.IsSuccess = false;
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                result.Trips = JObject.Parse(responseBody)["trips"]?.ToObject<List<Trip>>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                result.IsSuccess = false;
//                return result;
//            }
//        }

//        private static string GetQueryString(TripQuery query)
//        {
//            var queryString = new StringBuilder();

//            if (!string.IsNullOrEmpty(query.ShiftNumbers))
//            {
//                queryString.Append($"shiftNumbers={query.ShiftNumbers}&");
//            }

//            if (!string.IsNullOrEmpty(query.Franchises))
//            {
//                queryString.Append($"franchises={query.Franchises}&");
//            }

//            if (!string.IsNullOrEmpty(query.DriverStaffId))
//            {
//                queryString.Append($"driverStaffId={query.DriverStaffId}&");
//            }

//            if (query.FromRequestedTime.HasValue)
//            {
//                queryString.Append($"FromRequestedTime={query.FromRequestedTime:s}&");
//            }

//            if (query.ToRequestedTime.HasValue)
//            {
//                queryString.Append($"ToRequestedTime={query.ToRequestedTime:s}&");
//            }

//            if (!string.IsNullOrEmpty(query.SortOrder))
//            {
//                queryString.Append($"sortOrder={query.SortOrder}&");
//            }

//            return queryString.ToString().TrimEnd('&');
//        }
//    }
//}