using Lynx.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using BaseResponse = Lynx.Models.BaseResponse;

namespace Lynx.NextGenConfigration.DriverMonitoring.Models
{
    public class DriverResponse : BaseResponse
    {
        [JsonProperty("drivers")]
        public List<GoDriverResponse> Drivers { get; set; }
    }

    public class GoDriverResponse
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("staffId")]
        public string StaffId { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("phoneNumber")]
        public string PhoneNumber { get; set; }

        [JsonProperty("gender")]
        public Gender? Gender { get; set; }

        [JsonProperty("smartCardUid")]
        public string SmartCardUid { get; set; }

        [JsonProperty("pin")]
        public string Pin { get; set; }

        [JsonProperty("licenseNumber")]
        public string LicenseNumber { get; set; }

        [JsonProperty("permitId")]
        public string PermitId { get; set; }

        [JsonProperty("nationality")]
        public string Nationality { get; set; }

        [JsonProperty("profilePicture")]
        public string ProfilePicture { get; set; }

        [JsonProperty("available")]
        public bool Available { get; set; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("modifiedBy")]
        public string ModifiedBy { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        [JsonProperty("tenantId")]
        public int TenantId { get; set; }
    }

    public class DriverAssignedVehicle
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("shiftName")]
        public string ShiftName { get; set; }
    }
}