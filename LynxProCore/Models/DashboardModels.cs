using System;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class KeyValueViewModel
    {
        public string Key { get; set; }
        public int Value { get; set; }
        public string Color { get; set; }
        public int Id { get; internal set; }
    }
    public class ActiveAlertViewModel
    {
        public string TenantName { get; set; }
        public int RepeatCount { get; set; }

        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        public DateTime? ActionDate { get; set; }

        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        public DateTime LastDate { get; set; }
        public AlertRule AlertRule { get; set; }
        public ResolutionState ResolutionState { get; set; }
        public string Entity { get; internal set; }
        public string EntityType { get; internal set; }
    }
}