using Newtonsoft.Json;

namespace Lynx.NextGenConfigration.Wasl.Responses
{
    public class WaslVehicleRegistrationResponse
    {
        [JsonProperty("plateNumber")]
        public string PlateNumber { get; set; }

        [JsonProperty("plateRightLetterEnglish")]
        public char PlateRightLetterEnglish { get; set; }

        [JsonProperty("plateRightLetterArabic")]
        public char PlateRightLetterArabic { get; set; }

        [JsonProperty("plateMiddleLetterEnglish")]
        public char PlateMiddleLetterEnglish { get; set; }

        [JsonProperty("plateMiddleLetterArabic")]
        public char PlateMiddleLetterArabic { get; set; }

        [JsonProperty("plateLeftLetterEnglish")]
        public char PlateLeftLetterEnglish { get; set; }

        [JsonProperty("plateLeftLetterArabic")]
        public char PlateLeftLetterArabic { get; set; }

        [JsonProperty("makeEnglish")]
        public string MakeEnglish { get; set; }

        [JsonProperty("makeArabic")]
        public string MakeArabic { get; set; }

        [JsonProperty("modelEnglish")]
        public string ModelEnglish { get; set; }

        [JsonProperty("modelArabic")]
        public string ModelArabic { get; set; }

        [JsonProperty("year")]
        public int Year { get; set; }

        [JsonProperty("colorEnglish")]
        public string ColorEnglish { get; set; }

        [JsonProperty("colorArabic")]
        public string ColorArabic { get; set; }

        [JsonProperty("licenseExpiryDateHijri")]
        public string LicenseExpiryDateHijri { get; set; }

        [JsonProperty("licenseExpiryDateGregorian")]
        public string LicenseExpiryDateGregorian { get; set; }

        [JsonProperty("rejectionReason")]
        public string RejectionReason { get; set; }

        [JsonProperty("valid")]
        public bool Valid { get; set; }
    }
}