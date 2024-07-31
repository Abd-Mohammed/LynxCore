using Lynx.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Streaming.Models
{
    public class JobsResponse : BaseResponse
    {
        public List<Job> Jobs { get; set; } = new List<Job>();

    }

    public class Job
    {
        public Guid Id { get; set; }

        public string DeviceId { get; set; }

        public string DeviceName { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public JobStatus Status { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public JobType Type { get; set; }

        public DateTime CreatedAtTime { get; set; }

        public DateTime VideoStartTime { get; set; }

        public DateTime VideoEndTime { get; set; }

        public string BlobUri { get; set; }

        public string UserId { get; set; }
    }

    public enum JobStatus
    {
        Enqueued = 1,
        Running = 2,
        Failed = 3,
        Completed = 4,
        Cancelled = 5,
        Locked = 6
    }

    public enum JobType
    {
        Image = 1,
        Video = 2
    }
}