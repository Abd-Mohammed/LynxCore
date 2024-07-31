using System;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class ProblemQuery
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public ProblemType? Type { get; set; }

        public SolverStatus? SolverStatus { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? FromTime { get; set; }

        public DateTime? ToTime { get; set; }

        public string SortOrder { get; set; }
    }
}