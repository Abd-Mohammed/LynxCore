﻿using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using LynxProCore.Adapters.Responses;

namespace LynxProCore.Adapters;

public class CityAdapter
{
    private readonly IHttpClientFactory _httpClientFactory;
    private const string RidesharingBaseUrl = "https://qa-lynxedgeapis-ridesharing.azurewebsites.net/v1/";
    private readonly TimeSpan _timeout;

    private const string AccessToken =
        "eyJhbGciOiJSUzUxMiIsImtpZCI6IkE5QTk4RDJCQUREQ0FBMEZGNTdDMTQzQUYxNzI1OEM1IiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL3FhLWlkZW50aXR5Lmx5bnhlZGdlLmFpIiwibmJmIjoxNzIyMzU1MjExLCJpYXQiOjE3MjIzNTUyMTEsImV4cCI6MTcyNzUzOTIxMSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIl0sImNsaWVudF9pZCI6Ikx5bngiLCJzdWIiOiJhYWZiYzIyMS01YmJmLTQyNzgtYjU0OC0zY2NjMjVjNjc4NTEiLCJhdXRoX3RpbWUiOjE3MTgyNTIxOTQsImlkcCI6ImxvY2FsIiwiZ2l2ZW5fbmFtZSI6Ik9tYXIiLCJmYW1pbHlfbmFtZSI6IlNhbGxhbSIsImFjdG9ydCI6IlVzZXIiLCJyb2xlIjoiVGVuYW50T3duZXIiLCJlbWFpbCI6Im8uc2FsbGFtQGFjYWN1c2dyb3VwLmNvbSIsInVuaXF1ZV9uYW1lIjoib21hcl84NTczNzI1NTM1IiwidGlkIjo2MDIsImp0aSI6IkNDMTZBOUUxMTQ5Q0IzMUIwNEI4NDBDRjJDQjdGOTc0In0.bTLaoXK7YeAbpWGm-HrJbCHjWDVnt66b0dCcnNGB6DFljfZcaIhod541S4d4K6WOUSg8RluP2_R7Wf8we7HFD4DxKLPvXbR5o-qZPJwQ5lVU_s6l0_Cn--Xm__TsPKBMRNds5jU1sNGHuLHeMKpj49jZOaMFQoqW_tL9AoFiYou7xwem6zS5ncCZsl4bw7ezdoUsttGOkW8kqkwK7tSbC2b7UIdim129mt9H-irDEhnLvy7DHnO_MvA0ZwppR5c2DsZD4g9-MlH9_ON39i02v9_M2L7T9goNUDXUYCp44yj02DBDv-pi927qx-f862padkNxbCSq2dX9Vx7CyspIuQ";

    public CityAdapter(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
        _timeout = TimeSpan.FromMinutes(2);
    }

    public async Task<CityResponse> GetCitiesAsync(string cityName = null, int? pageNumber = null, int? pageSize = null, string sortOrder = null, CancellationToken cancellationToken = default)
    {
        var requestUri = $"{RidesharingBaseUrl}cities?name={cityName}&pageNumber={pageNumber}&pageSize={pageSize}&sortOrder={sortOrder}";
        var cityResponse = new CityResponse();

        try
        {

            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                cityResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return cityResponse;
            }

            var responceBody = await response.Content.ReadAsStringAsync(cancellationToken);
            cityResponse = JsonConvert.DeserializeObject<CityResponse>(responceBody);
            cityResponse.IsSuccess = true;

            return cityResponse;
        }
        catch
        {
            return cityResponse;
        }
    }

    public async Task<GoCityResponse> GetCityAsync(int id, CancellationToken cancellationToken = default)
    {
        var requestUri = $"{RidesharingBaseUrl}cities/{id}";
        var city = new GoCityResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                city.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return city;
            }

            var responceBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var jCity = JObject.Parse(responceBody);
            city = JsonConvert.DeserializeObject<GoCityResponse>(jCity["city"].ToString());
            city.IsSuccess = true;

            return city;
        }
        catch
        {
            return city;
        }
    }

    public async Task<BaseResponse> UpdateCityAsync(int id, CreateCity city, CancellationToken cancellationToken = default)
    {
        var requestUri = $"{RidesharingBaseUrl}cities/{id}";
        var responseBase = new BaseResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PutAsync(requestUri, new StringContent(JsonConvert.SerializeObject(city), Encoding.UTF8, "application/json"), cancellationToken);
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

    public async Task<BaseResponse> DeleteCityAsync(int id, CancellationToken cancellationToken = default)
    {
        var requestUri = $"{RidesharingBaseUrl}cities/{id}";
        var responseBase = new BaseResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.DeleteAsync(requestUri, cancellationToken);
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

    public async Task<GoCityResponse> CreateCityAsync(CreateCity city, CancellationToken cancellationToken = default)
    {
        var requestUri = $"{RidesharingBaseUrl}cities";
        var createdCity = new GoCityResponse();

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PostAsync(requestUri, new StringContent(JsonConvert.SerializeObject(city), Encoding.UTF8, "application/json"), cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                createdCity.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return createdCity;
            }

            var responceBody = await response.Content.ReadAsStringAsync(cancellationToken);
            createdCity = JsonConvert.DeserializeObject<GoCityResponse>(responceBody);
            createdCity.IsSuccess = true;

            return createdCity;
        }
        catch
        {
            return createdCity;
        }
    }
}
