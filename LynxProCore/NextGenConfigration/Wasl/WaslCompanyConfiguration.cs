//using Lynx.Models;
//using Lynx.NextGenConfigration.Wasl.Responses;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//using Newtonsoft.Json.Serialization;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Threading.Tasks;

//namespace Lynx.NextGenConfigration.Wasl
//{
//    public class WaslCompanyConfiguration : IdentityAdapterConfiguration
//    {
//        public async Task<WaslCompanyResponse> GetWaslCompanyAsync(int tenantId)
//        {
//            var requestUri = $"{WaslCompanyBaseUrl}/Companies";
//            try
//            {
//                using (var client = new HttpClient())
//                {
//                    client.Timeout = Timeout;
//                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                    var response = await client.GetAsync(requestUri);
//                    if (!response.IsSuccessStatusCode)
//                    {
//                        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
//                        {
//                            return new WaslCompanyResponse() { LastSyncStatusError = "NotRegister" };
//                        }
//                        return null;
//                    }

//                    var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                    var waslCompanyResponse = JsonConvert.DeserializeObject<WaslCompanyResponse>(result["company"]?.ToString() ?? string.Empty);
//                    return waslCompanyResponse;
//                }
//            }
//            catch
//            {
//                return null;
//            }
//        }

//        public async Task<WaslCompanyResponse> CreateAsync(WaslCompanyViewModel waslCompany)
//        {
//            try
//            {
//                var jObject = new JObject
//                {
//                    ["nameEnglish"] = waslCompany.NameEnglish,
//                    ["nameArabic"] = waslCompany.NameArabic,
//                    ["identityNumber"] = waslCompany.IdentityNumber,
//                    ["activity"] = waslCompany.ActivityType.ToString(),
//                    ["phoneNumber"] = waslCompany.PhoneNumber,
//                    ["email"] = waslCompany.Email,
//                    ["tenantId"] = waslCompany.TenantId,
//                };

//                if (waslCompany.Company != null)
//                {
//                    jObject.Add("company", new JObject
//                    {
//                        ["managerName"] = waslCompany.Company.ManagerName,
//                        ["managerPhoneNumber"] = waslCompany.Company.ManagerPhoneNumber,
//                        ["managerMobileNumber"] = waslCompany.Company.ManagerMobileNumber,
//                        ["commercialRecordNumber"] = waslCompany.Company.CommercialRecordNumber,
//                        ["commercialRecordIssueDateGregorian"] = waslCompany.Company.CommercialRecordIssueDate.ToString("yyyy-MM-dd")
//                    });
//                }
//                else
//                {
//                    jObject.Add("individual", new JObject
//                    {
//                        ["dateOfBirthGregorian"] = waslCompany.Individual.DateOfBirth.ToString("yyyy-MM-dd")
//                    });
//                }

//                using (var client = new HttpClient())
//                {
//                    client.Timeout = Timeout;
//                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);

//                    var response = await client.PostAsync(new System.Uri($"{WaslCompanyBaseUrl}/Companies"), BuildStringContent(jObject));

//                    if (!response.IsSuccessStatusCode)
//                    {
//                        return null;
//                    }

//                    var result = JObject.Parse(await response.Content.ReadAsStringAsync());
//                    var waslCompanyResponse = JsonConvert.DeserializeObject<WaslCompanyResponse>(result.ToString());
//                    return waslCompanyResponse;
//                }
//            }
//            catch
//            {
//                return null;
//            }
//        }

//        public async Task<bool> UpdateAsync(CompanyRegistrationViewModel company, int tenantId)
//        {
//            try
//            {
//                var jObject = new JObject
//                {
//                    ["managerName"] = company.ManagerName,
//                    ["managerPhoneNumber"] = company.ManagerPhoneNumber,
//                    ["managerMobileNumber"] = company.ManagerMobileNumber,
//                };

//                using (var client = new HttpClient())
//                {
//                    client.Timeout = Timeout;
//                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", ApplicationUser.IdentityToken);
//                    var response = await client.PutAsync($"{WaslCompanyBaseUrl}/Companies", BuildStringContent(jObject));
//                    if (!response.IsSuccessStatusCode)
//                    {
//                        return false;
//                    }
//                    return true;
//                }
//            }
//            catch
//            {
//                return false;
//            }
//        }

//        protected static StringContent BuildStringContent(JObject jsonRequest)
//        {
//            return new StringContent(JsonConvert.SerializeObject(jsonRequest, JsonSettings), Encoding.UTF8, "application/json");
//        }

//        private static readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
//        {
//            Formatting = Formatting.None,
//            NullValueHandling = NullValueHandling.Ignore,
//            ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
//        };
//    }
//}