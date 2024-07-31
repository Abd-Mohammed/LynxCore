using System;

namespace Lynx.NextGenConfigration.Streaming.Models
{
    public class JobQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string UserId { get; set; }

        public DateTime? FromTime { get; set; }

        public DateTime? ToTime { get; set; }

        public JobType? Type { get; set; }

        public JobStatus? Status { get; set; }

        public bool SameUser { get; set; } = false;
    }
}