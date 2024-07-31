//using Lynx.NextGenConfigration.Streaming.Models;
//using Newtonsoft.Json.Linq;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Streaming
//{
//    public class JobAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public JobAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<JobsResponse> ListAsync(JobQuery query)
//        {
//            var requestUri = $"{StreamingBaseUrl}/jobs?{GetQueryString(query)}";
//            var result = new JobsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    result.IsSuccess = false;
//                    result.ResultStatus = response.StatusCode.ToString();
//                    return result;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                result.Jobs = JObject.Parse(responseBody)["jobs"]?.ToObject<List<Job>>();
//                result.IsSuccess = true;

//                return result;
//            }
//            catch
//            {
//                result.IsSuccess = false;

//                return result;
//            }
//        }

//        private static string GetQueryString(JobQuery query)
//        {
//            var queryString = new StringBuilder();

//            if (query.PageNumber.HasValue)
//            {
//                queryString.Append($"pageNumber={query.PageNumber}&");
//            }

//            if (query.PageSize.HasValue)
//            {
//                queryString.Append($"pageSize={query.PageSize}&");
//            }

//            if (!string.IsNullOrEmpty(query.UserId))
//            {
//                queryString.Append($"userId={query.UserId}&");
//            }

//            if (query.FromTime.HasValue)
//            {
//                queryString.Append($"fromTime={query.FromTime:s}&");
//            }

//            if (query.ToTime.HasValue)
//            {
//                queryString.Append($"toTime={query.ToTime:s}&");
//            }

//            if (query.Type.HasValue)
//            {
//                queryString.Append($"type={query.Type}&");
//            }

//            if (query.Status.HasValue)
//            {
//                queryString.Append($"status={query.Status}&");
//            }

//            if (query.SameUser)
//            {
//                queryString.Append($"sameUser={query.SameUser}&");
//            }

//            return queryString.ToString().TrimEnd('&');
//        }
//    }
//}