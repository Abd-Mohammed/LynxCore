//using Humanizer;
//using Newtonsoft.Json;
//using System.Collections.Generic;

//namespace Lynx.Models
//{
//    public enum UiConfigurationOption
//    {
//        Array = 1,
//        Boolean = 2
//    }

//    public class JobCronViewModel
//    {
//        public JobCronViewModel()
//        {
//            JobCrons = new List<JobCron>();
//        }

//        public JobCronViewModel(List<JobCron> jobCrons)
//        {
//            JobCrons = jobCrons;
//        }

//        public List<JobCron> JobCrons { get; set; }
//    }

//    public class JobCron
//    {
//        public JobCron()
//        {
//            UiConfigurations = new List<UiConfiguration>();
//        }

//        public int TenantJobId { get; set; }

//        public string JobCronId { get; set; }

//        public string TenantJobName { get; set; }

//        public string InvocationData { get; set; }

//        public List<UiConfiguration> UiConfigurations { get; set; }
//    }

//    public class UiConfiguration
//    {
//        public UiConfiguration()
//        {
//            List = new List<string>();
//        }

//        public string Name { get; set; }

//        public UiConfigurationOption Option { get; set; }

//        public bool IsEnabled { get; set; }

//        public List<string> List { get; set; }
//    }

//    public class Variables
//    {
//        [JsonProperty("name")]
//        public string Name { get; set; }

//        [JsonProperty("type")]
//        public string Type { get; set; }
//    }

//    public static class KeyHumanize
//    {
//        public static string Humanize(string key)
//        {
//            switch (key.ToLower())
//            {
//                case "emails":
//                    return "[[[[Emails]]]]";
//                case "notify":
//                    return "[[[[Enable]]]]";
//                default:
//                    return key.Humanize(LetterCasing.Title);
//            }
//        }
//    }
//}