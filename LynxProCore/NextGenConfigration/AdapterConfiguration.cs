//using System;
//using System.Configuration;

//namespace Lynx.NextGenConfigration
//{
//    public class AdapterConfiguration
//    {
//        protected TimeSpan Timeout { get; private set; } = TimeSpan.FromMinutes(2);

//        protected string WaslCompanyBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.ExternalWasl:BaseUrl"];

//        protected string DynamicMapsBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.ExternalDynamicMaps:BaseUrl"];

//        protected string RidesharingBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Ridesharing:BaseUrl"];

//        protected string BillingBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Billing:BaseUrl"];

//        protected string DataAnalyticsBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.DataAnalytics:BaseUrl"];

//        protected string FraudDetectionBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.FraudDetection:BaseUrl"];

//        protected string TransportBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Transport:BaseUrl"];

//        protected string MaintenanceBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Maintenance:BaseUrl"];

//        protected string DriverMonitoringBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.DriverMonitoring:BaseUrl"];

//        protected string EldBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Eld:BaseUrl"];

//        protected string TripMonitoring { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.TripMonitoring:BaseUrl"];

//        protected string StreamingBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.streaming:BaseUrl"];

//        protected string OptimizationBaseUrl { get; private set; } = ConfigurationManager.AppSettings["lynxEdge.Optimization:BaseUrl"];
//    }
//}