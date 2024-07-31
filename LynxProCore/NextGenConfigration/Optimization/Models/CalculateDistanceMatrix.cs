using Lynx.Models;
using System.Collections.Generic;

namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class CalculateDistanceMatrix
    {
        public List<CreateDistanceMatrix> Locations { get; set; }

        public DistanceMatrixTransportMode TransportMode { get; set; }
    }

    public class CreateDistanceMatrix
    {
        public string Name { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}