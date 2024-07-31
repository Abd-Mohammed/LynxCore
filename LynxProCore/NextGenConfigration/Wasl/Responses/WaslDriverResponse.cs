using LynxApis.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslDriverResponse : BaseResponse
    {
        public int Id { get; set; }

        public string StaffId { get; set; }

        public string IdentityNumber { get; set; }

        public string MobileNumber { get; set; }

        public int TenantId { get; set; }

        public DateTime DateOfBirth { get; set; }

        public AssignedVehicle AssignedVehicle { get; set; }

        //For List
        public DateTime LastSyncTime { get; set; }

        public string LastSyncStatusError { get; set; }

        public bool LastSyncStatus { get; set; }

        public bool RegistrationSyncStatus { get; set; }

        public string NameEnglish { get; set; }

        public string NameArabic { get; set; }

        public string CriminalRecordStatus { get; set; }

        [RequiredEnum(typeof(ActivityType))]
        public ActivityType Activity { get; set; }

        [RequiredEnum(typeof(EligibilityStatus))]
        public EligibilityStatus EligibilityStatus { get; set; }

        public MinimalWaslCompanyResponse Company { get; set; }
    }

    public class WaslDriverSummaryResponse : BaseResponse
    {
        [JsonProperty("drivers")]
        public List<WaslDriverResponse> Drivers { get; set; }
    }

    public class AssignedVehicle
    {
        public string Name { get; set; }

        public string Number { get; set; }

        public string SequenceNumber { get; set; }

        public string ImeiNumber { get; set; }

        public string PlateNumber { get; set; }
    }

    public class MinimalWaslCompanyResponse
    {
        public string NameEnglish { get; set; }

        public string NameArabic { get; set; }

        public string IdentityNumber { get; set; }
    }
}