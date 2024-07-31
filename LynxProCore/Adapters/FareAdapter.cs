using LynxProCore.Adapters.Responses;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using Lynx.Models;
using BaseResponse = LynxProCore.Adapters.Responses.BaseResponse;

namespace LynxProCore.Adapters;

public class FareAdapter
{
    private readonly IHttpClientFactory _httpClientFactory;

    private const string RidesharingBaseUrl = "https://qa-lynxedgeapis-ridesharing.azurewebsites.net/v1/";
    private readonly TimeSpan _timeout;

    private const string AccessToken =
        "eyJhbGciOiJSUzUxMiIsImtpZCI6IkE5QTk4RDJCQUREQ0FBMEZGNTdDMTQzQUYxNzI1OEM1IiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL3FhLWlkZW50aXR5Lmx5bnhlZGdlLmFpIiwibmJmIjoxNzIyMzU1MjExLCJpYXQiOjE3MjIzNTUyMTEsImV4cCI6MTcyNzUzOTIxMSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIl0sImNsaWVudF9pZCI6Ikx5bngiLCJzdWIiOiJhYWZiYzIyMS01YmJmLTQyNzgtYjU0OC0zY2NjMjVjNjc4NTEiLCJhdXRoX3RpbWUiOjE3MTgyNTIxOTQsImlkcCI6ImxvY2FsIiwiZ2l2ZW5fbmFtZSI6Ik9tYXIiLCJmYW1pbHlfbmFtZSI6IlNhbGxhbSIsImFjdG9ydCI6IlVzZXIiLCJyb2xlIjoiVGVuYW50T3duZXIiLCJlbWFpbCI6Im8uc2FsbGFtQGFjYWN1c2dyb3VwLmNvbSIsInVuaXF1ZV9uYW1lIjoib21hcl84NTczNzI1NTM1IiwidGlkIjo2MDIsImp0aSI6IkNDMTZBOUUxMTQ5Q0IzMUIwNEI4NDBDRjJDQjdGOTc0In0.bTLaoXK7YeAbpWGm-HrJbCHjWDVnt66b0dCcnNGB6DFljfZcaIhod541S4d4K6WOUSg8RluP2_R7Wf8we7HFD4DxKLPvXbR5o-qZPJwQ5lVU_s6l0_Cn--Xm__TsPKBMRNds5jU1sNGHuLHeMKpj49jZOaMFQoqW_tL9AoFiYou7xwem6zS5ncCZsl4bw7ezdoUsttGOkW8kqkwK7tSbC2b7UIdim129mt9H-irDEhnLvy7DHnO_MvA0ZwppR5c2DsZD4g9-MlH9_ON39i02v9_M2L7T9goNUDXUYCp44yj02DBDv-pi927qx-f862padkNxbCSq2dX9Vx7CyspIuQ";

    public FareAdapter(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
        _timeout = TimeSpan.FromMinutes(2);
    }

    public async Task<FareResponse> GetFaresAsync(string cityName, int? pageNumber = null, int? pageSize = null, string sortOrder = null)
    {
        var requestUri = $"{RidesharingBaseUrl}fares?cityName={cityName}&pageNumber={pageNumber}&pageSize={pageSize}&sortOrder={sortOrder}";
        var fareResponse = new FareResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                fareResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();

                return null;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            fareResponse = JsonConvert.DeserializeObject<FareResponse>(responceBody);

            fareResponse.IsSuccess = true;

            return fareResponse;
        }
        catch
        {
            return fareResponse;
        }
    }

    public async Task<GoFareResponse> GetFareAsync(int id)
    {
        var requestUri = $"{RidesharingBaseUrl}fares/{id}";
        var fare = new GoFareResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                fare.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();

                return fare;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            var jCity = JObject.Parse(responceBody);
            fare = JsonConvert.DeserializeObject<GoFareResponse>(jCity["fare"].ToString());
            fare.IsSuccess = true;

            return fare;
        }
        catch
        {
            return fare;
        }
    }

    public async Task<BaseResponse> DeleteFareAsync(int id)
    {
        var requestUri = $"{RidesharingBaseUrl}fares/{id}";
        var responseBase = new BaseResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.DeleteAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                responseBase.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["detail"].ToString();
                return responseBase;
            }

            responseBase.IsSuccess = true;
            return responseBase;
        }
        catch
        {
            return responseBase;
        }
    }

    public async Task<GoFareResponse> CreateFareAsync(CreateFareRequest fare)
    {
        var requestUri = $"{RidesharingBaseUrl}fares";
        var fareResponse = new GoFareResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PostAsync(requestUri,
                new StringContent(JsonConvert.SerializeObject(fare), Encoding.UTF8, "application/json"));
            if (!response.IsSuccessStatusCode)
            {
                fareResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return fareResponse;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            fareResponse = JsonConvert.DeserializeObject<GoFareResponse>(responceBody);
            fareResponse.IsSuccess = true;

            return fareResponse;
        }
        catch
        {
            return fareResponse;
        }
    }

    public async Task<BaseResponse> UpdateFareAsync(int id, CreateFareRequest fare)
    {
        var requestUri = $"{RidesharingBaseUrl}fares/{id}";
        var responseBase = new BaseResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PutAsync(requestUri, new StringContent(JsonConvert.SerializeObject(fare), Encoding.UTF8, "application/json"));
            if (!response.IsSuccessStatusCode)
            {
                responseBase.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return responseBase;
            }

            responseBase.IsSuccess = true;
            return responseBase;
        }
        catch
        {
            return responseBase;
        }
    }
}
