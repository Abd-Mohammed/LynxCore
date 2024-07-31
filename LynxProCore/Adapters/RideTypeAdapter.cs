using LynxProCore.Adapters.Responses;
using LynxProCore.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Text;

namespace LynxProCore.Adapters;

public class RideTypeAdapter
{
    private readonly IHttpClientFactory _httpClientFactory;
    private const string RidesharingBaseUrl = "https://qa-lynxedgeapis-ridesharing.azurewebsites.net/v1/";
    private readonly TimeSpan _timeout;


    private const string AccessToken =
        "eyJhbGciOiJSUzUxMiIsImtpZCI6IkE5QTk4RDJCQUREQ0FBMEZGNTdDMTQzQUYxNzI1OEM1IiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwczovL3FhLWlkZW50aXR5Lmx5bnhlZGdlLmFpIiwibmJmIjoxNzIyMzU1MjExLCJpYXQiOjE3MjIzNTUyMTEsImV4cCI6MTcyNzUzOTIxMSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIl0sImNsaWVudF9pZCI6Ikx5bngiLCJzdWIiOiJhYWZiYzIyMS01YmJmLTQyNzgtYjU0OC0zY2NjMjVjNjc4NTEiLCJhdXRoX3RpbWUiOjE3MTgyNTIxOTQsImlkcCI6ImxvY2FsIiwiZ2l2ZW5fbmFtZSI6Ik9tYXIiLCJmYW1pbHlfbmFtZSI6IlNhbGxhbSIsImFjdG9ydCI6IlVzZXIiLCJyb2xlIjoiVGVuYW50T3duZXIiLCJlbWFpbCI6Im8uc2FsbGFtQGFjYWN1c2dyb3VwLmNvbSIsInVuaXF1ZV9uYW1lIjoib21hcl84NTczNzI1NTM1IiwidGlkIjo2MDIsImp0aSI6IkNDMTZBOUUxMTQ5Q0IzMUIwNEI4NDBDRjJDQjdGOTc0In0.bTLaoXK7YeAbpWGm-HrJbCHjWDVnt66b0dCcnNGB6DFljfZcaIhod541S4d4K6WOUSg8RluP2_R7Wf8we7HFD4DxKLPvXbR5o-qZPJwQ5lVU_s6l0_Cn--Xm__TsPKBMRNds5jU1sNGHuLHeMKpj49jZOaMFQoqW_tL9AoFiYou7xwem6zS5ncCZsl4bw7ezdoUsttGOkW8kqkwK7tSbC2b7UIdim129mt9H-irDEhnLvy7DHnO_MvA0ZwppR5c2DsZD4g9-MlH9_ON39i02v9_M2L7T9goNUDXUYCp44yj02DBDv-pi927qx-f862padkNxbCSq2dX9Vx7CyspIuQ";


    public RideTypeAdapter(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
        _timeout = TimeSpan.FromMinutes(2);
    }


    public async Task<RideTypeResponse> GetRideTypesAsync(int? pageNumber = null, int? pageSize = null, string sortOrder = null, string name = null)
    {
        var requestUri = $"{RidesharingBaseUrl}ridetypes?pageNumber={pageNumber}&pageSize={pageSize}&sortOrder={sortOrder}&name={name}";
        var rideTypeResponse = new RideTypeResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                rideTypeResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return rideTypeResponse;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            rideTypeResponse = JsonConvert.DeserializeObject<RideTypeResponse>(responceBody);
            rideTypeResponse.IsSuccess = true;

            return rideTypeResponse;
        }
        catch
        {
            return rideTypeResponse;
        }
    }

    public async Task<BaseResponse> CreateAsync(RideTypeViewModel rideTypeViewModel)
    {
        var requestUri = $"{RidesharingBaseUrl}RideTypes";
        var responseBase = new BaseResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PostAsync(requestUri, new StringContent(JsonConvert.SerializeObject(new
            {
                Name = rideTypeViewModel.Name,
                Description = rideTypeViewModel.Description,
                Settings = new
                {
                    NoFare = rideTypeViewModel.NoFare,
                    // When enabling this UI option "Receive Requests When Vacant Only", this means no back to back
                    BackToBackTrip = !rideTypeViewModel.BackToBackTrip,
                    VehicleTypes = rideTypeViewModel.VehicleTypes,
                    FuelCost = rideTypeViewModel.FuelCost,
                },
                PassengerCount = rideTypeViewModel.PassengerCount
            }), Encoding.UTF8, "application/json"));

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

    public async Task<BaseResponse> UpdateAsync(RideTypeViewModel rideTypeViewModel)
    {
        var requestUri = $"{RidesharingBaseUrl}RideTypes/{rideTypeViewModel.RideTypeId}";
        var responseBase = new BaseResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.PutAsync(requestUri, new StringContent(JsonConvert.SerializeObject(new
            {
                Name = rideTypeViewModel.Name,
                Description = rideTypeViewModel.Description,
                Settings = new
                {
                    NoFare = rideTypeViewModel.NoFare,
                    BackToBackTrip = !rideTypeViewModel.BackToBackTrip,
                    VehicleTypes = rideTypeViewModel.VehicleTypes,
                    FuelCost = rideTypeViewModel.FuelCost,
                },
                PassengerCount = rideTypeViewModel.PassengerCount
            }), Encoding.UTF8, "application/json"));

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

    public async Task<RideTypeResponse> GetAsync(string sortOrder = null, string name = null, int? pageNumber = 1, int? pageSize = 10)
    {
        var requestUri = $"{RidesharingBaseUrl}RideTypes?pageNumber={pageNumber}&pageSize={pageSize}&name={name}&sortOrder={sortOrder}";
        var rideTypesResponse = new RideTypeResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                rideTypesResponse.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return rideTypesResponse;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            rideTypesResponse = JsonConvert.DeserializeObject<RideTypeResponse>(responceBody);
            rideTypesResponse.IsSuccess = true;

            return rideTypesResponse;

        }
        catch
        {
            return rideTypesResponse;
        }
    }

    public async Task<GoRideTypeResponse> GetById(int id)
    {
        var requestUri = $"{RidesharingBaseUrl}RideTypes/{id}";
        var rideType = new GoRideTypeResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

            var response = await client.GetAsync(requestUri);
            if (!response.IsSuccessStatusCode)
            {
                rideType.ResultStatus = JObject.Parse(await response.Content.ReadAsStringAsync())["title"].ToString();
                return rideType;
            }

            var responceBody = await response.Content.ReadAsStringAsync();
            var jObject = JObject.Parse(responceBody);
            rideType = JsonConvert.DeserializeObject<GoRideTypeResponse>(jObject["rideType"].ToString());
            rideType.IsSuccess = true;
            return rideType;

        }
        catch
        {
            return rideType;
        }
    }

    public async Task<BaseResponse> Delete(int id)
    {
        var requestUri = $"{RidesharingBaseUrl}RideTypes/{id}";
        var responseBase = new BaseResponse();
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = _timeout;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", AccessToken);

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
}
