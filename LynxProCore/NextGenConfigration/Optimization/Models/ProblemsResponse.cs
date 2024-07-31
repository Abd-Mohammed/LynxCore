using Lynx.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class ProblemsResponse : BaseResponse
    {
        public List<MinimalProblem> Problems { get; set; } = new List<MinimalProblem>();
    }

    public class MinimalProblem
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public SolverStatus SolverStatus { get; set; }

        public int ProcessingTime { get; set; }
    }
}