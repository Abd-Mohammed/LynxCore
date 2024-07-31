namespace Lynx.Models
{
    public class ApplicationSettings
    {
        public Map Map { get; set; }

        public string DefaultPassword { get; set; }

        public string EncryptionPassword { get; set; }

        public Fcm Fcm { get; set; }

        public Api Streaming { get; set; }

        public string OptimizationApi { get; set; }

        public string BillingApi { get; set; }

        public string BillingApiKey { get; set; }
    }

    public class Map
    {
        public string ApiKey { get; set; }

        public string Styles { get; set; }

        public string NightStyles { get; set; }
    }

    public class Fcm
    {
        public string Key { get; set; }
    }

    public class Api
    {
        public string BaseUrl { get; set; }

        public string Key { get; set; }

        public string PortalUrl { get; set; }
    }
}