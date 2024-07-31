using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslVehicleResponse : BaseResponse
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("number")]
        public string Number { get; set; }

        [JsonProperty("sequenceNumber")]
        public string SequenceNumber { get; set; }

        [JsonProperty("imeiNumber")]
        public string ImeiNumber { get; set; }

        [JsonProperty("plateType")]
        public PlateType PlateType { get; set; }

        [JsonProperty("reference")]
        public Guid Reference { get; set; }

        [JsonProperty("hasTechnicalRequirements")]
        public bool HasTechnicalRequirements { get; set; }

        [JsonProperty("hasSafetyRequirements")]
        public bool HasSafetyRequirements { get; set; }

        [JsonProperty("activity")]
        public string Activity { get; set; }

        [JsonProperty("registration")]
        public WaslVehicleRegistrationResponse Registration { get; set; }

        [JsonProperty("registrationSyncStatus")]
        public bool RegistrationSyncStatus { get; set; }

        [JsonProperty("lastSyncStatus")]
        public bool LastSyncStatus { get; set; }

        [JsonProperty("lastSyncStatusError")]
        public string LastSyncStatusError { get; set; }

        [JsonProperty("lastSyncTime")]
        public DateTime LastSyncTime { get; set; }

        [JsonProperty("companyId")]
        public int CompanyId { get; set; }

        [JsonProperty("tenantId")]
        public int TenantId { get; set; }

        [JsonProperty("deleted")]
        public bool Deleted { get; set; }

        public MinimalWaslCompanyResponse Company { get; set; }
    }

    public class WaslVehicleSummaryResponse : BaseResponse
    {
        [JsonProperty("vehicles")]
        public List<WaslVehicleResponse> Vehicles { get; set; } = new List<WaslVehicleResponse>();
    }

    public enum PlateType
    {
        [Display(Name = "[[[[Private Car]]]]")]
        PrivateCar = 1,

        [Display(Name = "[[[[Public Transport]]]]")]
        PublicTransport = 2,

        [Display(Name = "[[[[Private Transport]]]]")]
        PrivateTransport = 3,

        [Display(Name = "[[[[Public Minibus]]]]")]
        PublicMinibus = 4,

        [Display(Name = "[[[[Private Minibus]]]]")]
        PrivateMinibus = 5,

        Taxi = 6,

        [Display(Name = "[[[[Heavy Equipment]]]]")]
        HeavyEquipment = 7,

        Export = 8,

        Diplomatic = 9,

        Motorcycle = 10,

        Temporary = 11
    }

    public enum SaudiPlateLetter
    {
        [Display(Name = "[[[[ا - A]]]]")]
        A = 1,

        [Display(Name = "[[[[ب - B]]]]")]
        B,

        [Display(Name = "[[[[ح - J]]]]")]
        J,

        [Display(Name = "[[[[د - D]]]]")]
        D,

        [Display(Name = "[[[[ر - R]]]]")]
        R,

        [Display(Name = "[[[[س - S]]]]")]
        S,

        [Display(Name = "[[[[ص - X]]]]")]
        X,

        [Display(Name = "[[[[ط - T]]]]")]
        T,

        [Display(Name = "[[[[ع - E]]]]")]
        E,

        [Display(Name = "[[[[ق - G]]]]")]
        G,

        [Display(Name = "[[[[ك - K]]]]")]
        K,

        [Display(Name = "[[[[ل - L]]]]")]
        L,

        [Display(Name = "[[[[م - Z]]]]")]
        Z,

        [Display(Name = "[[[[ن - N]]]]")]
        N,

        [Display(Name = "[[[[ه - H]]]]")]
        H,

        [Display(Name = "[[[[و - U]]]]")]
        U,

        [Display(Name = "[[[[ى - V]]]]")]
        V
    }
}