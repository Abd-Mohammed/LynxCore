//using Lynx.NextGenConfigration.Optimization.Models;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;
//using BaseResponse = Lynx.Models.BaseResponse;

//namespace Lynx.NextGenConfigration.Optimization.Adapters
//{
//    public class OptimizationAdapter : IdentityAdapterConfiguration
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        private const string ProblemsEndpointName = "Problems";
//        private const string VrpEndPoint = "VehicleRouting";
//        private const string TspEndPoint = "TravelingSalesman";
//        private const string SolverConfigurationsEndpoint = "Solvers";

//        public OptimizationAdapter(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<SolverResponse> GetSolverConfigurationsAsync()
//        {
//            var requestUri = $"{OptimizationBaseUrl}{SolverConfigurationsEndpoint}";
//            var solverResponse = new SolverResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    solverResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();
//                    return solverResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                solverResponse = JsonConvert.DeserializeObject<SolverResponse>(responseBody);
//                solverResponse.IsSuccess = true;

//                return solverResponse;
//            }
//            catch
//            {
//                return solverResponse;
//            }
//        }

//        public async Task<BaseResponse> UpdateVrpAsync(UpdateVrpCommand vrpCommand)
//        {
//            var requestUri = $"{OptimizationBaseUrl}{SolverConfigurationsEndpoint}/{VrpEndPoint}";
//            var responseBase = new BaseResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.PutAsync(requestUri, new StringContent(JsonConvert.SerializeObject(vrpCommand), Encoding.UTF8, "application/json"));
//                if (!response.IsSuccessStatusCode)
//                {
//                    responseBase.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return responseBase;
//                }

//                responseBase.IsSuccess = true;

//                return responseBase;
//            }
//            catch
//            {
//                return responseBase;
//            }
//        }

//        public async Task<BaseResponse> UpdateTspAsync(UpdateTspCommand tspCommand)
//        {
//            var requestUri = $"{OptimizationBaseUrl}{SolverConfigurationsEndpoint}/{TspEndPoint}";
//            var responseBase = new BaseResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.PutAsync(requestUri, new StringContent(JsonConvert.SerializeObject(tspCommand), Encoding.UTF8, "application/json"));
//                if (!response.IsSuccessStatusCode)
//                {
//                    responseBase.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return responseBase;
//                }

//                responseBase.IsSuccess = true;

//                return responseBase;
//            }
//            catch
//            {
//                return responseBase;
//            }
//        }

//        public async Task<DistanceMatrixResponse> GetDistanceMatrixAsync()
//        {
//            var requestUri = $"{OptimizationBaseUrl}distancematrix";
//            var distanceMatrixResponse = new DistanceMatrixResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    distanceMatrixResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return distanceMatrixResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                distanceMatrixResponse = JsonConvert.DeserializeObject<DistanceMatrixResponse>(responseBody);
//                distanceMatrixResponse.IsSuccess = true;

//                return distanceMatrixResponse;
//            }
//            catch
//            {
//                return distanceMatrixResponse;
//            }
//        }

//        public async Task<DistanceMatrixResponse> CalculateDistanceMatrixAsync(CalculateDistanceMatrix distanceMatrix)
//        {
//            var requestUri = $"{OptimizationBaseUrl}distancematrix";
//            var distanceMatrixResponse = new DistanceMatrixResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var stringContent = JsonConvert.SerializeObject(distanceMatrix);
//                var content = new StringContent(stringContent, Encoding.UTF8, "application/json");
//                var response = await client.PostAsync(requestUri, content);

//                if (!response.IsSuccessStatusCode)
//                {
//                    var responseBody = await response.Content.ReadAsStringAsync();
//                    var jObject = JObject.Parse(responseBody);
//                    var errorPoints = jObject["errors"];
//                    distanceMatrixResponse.ResultStatus = jObject["title"]?.ToString();
//                    distanceMatrixResponse.ErrorPoints = errorPoints?.ToObject<string[]>();

//                    return distanceMatrixResponse;
//                }

//                distanceMatrixResponse.IsSuccess = true;

//                return distanceMatrixResponse;
//            }
//            catch
//            {
//                return distanceMatrixResponse;
//            }
//        }

//        public async Task<BaseResponse> UpsertEtaMultiplierAsync(UpsertEtaMultiplier etaMultiplier)
//        {
//            var requestUri = $"{OptimizationBaseUrl}etamultipliers";
//            var baseResponse = new BaseResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var stringContent = JsonConvert.SerializeObject(etaMultiplier);
//                var content = new StringContent(stringContent, Encoding.UTF8, "application/json");
//                var response = await client.PutAsync(requestUri, content);

//                if (!response.IsSuccessStatusCode)
//                {
//                    baseResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return baseResponse;
//                }
//                baseResponse.IsSuccess = true;

//                return baseResponse;
//            }
//            catch
//            {
//                return baseResponse;
//            }
//        }

//        public async Task<BaseResponse> DeleteEtaMultiplierAsync()
//        {
//            var requestUri = $"{OptimizationBaseUrl}etamultipliers";
//            var baseResponse = new BaseResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.DeleteAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    baseResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return baseResponse;
//                }
//                baseResponse.IsSuccess = true;

//                return baseResponse;
//            }
//            catch
//            {
//                return baseResponse;
//            }
//        }

//        public async Task<EtaMultiplierResponse> GetEtaMultiplierAsync()
//        {
//            var requestUri = $"{OptimizationBaseUrl}etamultipliers";
//            var etaMultiplierResponse = new EtaMultiplierResponse();
//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);

//                if (!response.IsSuccessStatusCode)
//                {
//                    etaMultiplierResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return etaMultiplierResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                etaMultiplierResponse = JsonConvert.DeserializeObject<EtaMultiplierResponse>(responseBody);
//                etaMultiplierResponse.IsSuccess = true;

//                return etaMultiplierResponse;
//            }
//            catch
//            {
//                return etaMultiplierResponse;
//            }
//        }

//        public async Task<ProblemsResponse> GetProblemsAsync(ProblemQuery query)
//        {
//            var requestUri = $"{OptimizationBaseUrl}{ProblemsEndpointName}?{GetQueryString(query)}";
//            var problemsResponse = new ProblemsResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    problemsResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return problemsResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                problemsResponse = JsonConvert.DeserializeObject<ProblemsResponse>(responseBody);
//                problemsResponse.IsSuccess = true;

//                return problemsResponse;
//            }
//            catch
//            {
//                return problemsResponse;
//            }
//        }

//        public async Task<ProblemResponse> GetProblemByNameAsync(string name)
//        {
//            var requestUri = $"{OptimizationBaseUrl}{ProblemsEndpointName}/name/{name}";
//            var problemResponse = new ProblemResponse();

//            try
//            {
//                var client = _httpClientFactory.CreateClient();
//                client.Timeout = Timeout;
//                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                var response = await client.GetAsync(requestUri);
//                if (!response.IsSuccessStatusCode)
//                {
//                    problemResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"]?.ToString();

//                    return problemResponse;
//                }

//                var responseBody = await response.Content.ReadAsStringAsync();
//                problemResponse = JsonConvert.DeserializeObject<ProblemResponse>(responseBody);
//                problemResponse.IsSuccess = true;

//                return problemResponse;
//            }
//            catch
//            {
//                return problemResponse;
//            }
//        }

//        private static string GetQueryString(ProblemQuery query)
//        {
//            var queryBuilder = new StringBuilder();

//            if (query.PageNumber.HasValue)
//            {
//                queryBuilder.Append($"pageNumber={query.PageNumber}&");
//            }

//            if (query.PageSize.HasValue)
//            {
//                queryBuilder.Append($"pageSize={query.PageSize}&");
//            }

//            if (query.FromTime.HasValue)
//            {
//                queryBuilder.Append($"fromTime={query.FromTime}&");
//            }

//            if (query.ToTime.HasValue)
//            {
//                queryBuilder.Append($"toTime={query.ToTime}&");
//            }

//            if (query.SolverStatus.HasValue)
//            {
//                queryBuilder.Append($"solverStatus={query.SolverStatus}&");
//            }

//            if (query.Type.HasValue)
//            {
//                queryBuilder.Append($"type={query.Type}&");
//            }

//            if (!string.IsNullOrEmpty(query.CreatedBy))
//            {
//                queryBuilder.Append($"createdBy={query.CreatedBy}&");
//            }

//            if (!string.IsNullOrEmpty(query.SortOrder))
//            {
//                queryBuilder.Append($"sortOrder={query.SortOrder}&");
//            }

//            return queryBuilder.ToString().TrimEnd('&');
//        }
//    }
//}