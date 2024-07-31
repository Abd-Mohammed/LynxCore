using LynxApis.Utils;
using System;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslCompanyResponse
    {
        public string NameEnglish { get; set; }

        public string NameArabic { get; set; }

        public string IdentityNumber { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string LastSyncStatusError { get; set; }

        public bool RegistrationSyncStatus { get; set; }

        [RequiredEnum(typeof(ActivityType))]
        public ActivityType Activity { get; set; }

        public Guid Reference { get; set; }

        public CompanyRegistrationResponse Registration { get; set; }
    }

    public class CompanyRegistrationResponse
    {
        public string CommercialRecordNumber { get; set; }

        public DateTime? CommercialRecordIssueDateHijri { get; set; }

        public DateTime? CommercialRecordIssueDateGregorian { get; set; }

        public DateTime? DateOfBirthHijri { get; set; }

        public DateTime? DateOfBirthGregorian { get; set; }

        public string ManagerName { get; set; }

        public string ManagerPhoneNumber { get; set; }

        public string ManagerMobileNumber { get; set; }
    }
}