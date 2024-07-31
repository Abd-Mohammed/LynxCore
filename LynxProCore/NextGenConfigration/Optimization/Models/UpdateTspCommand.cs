namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class UpdateTspCommand
    {
        public int? MaxRouteDistance { get; set; }

        public int? MaxRouteDuration { get; set; }

        public int? MaxLegDistance { get; set; }

        public int? MaxLegDuration { get; set; }

        public int MinStopCount { get; set; }

        public int MaxStopCount { get; set; }

        public int DwellTime { get; set; }
    }
}