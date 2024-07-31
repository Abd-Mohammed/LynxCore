namespace Lynx.NextGenConfigration.Optimization.Models
{
    public class UpdateVrpCommand
    {
        public string DutyStartTime { get; set; }

        public string DutyEndTime { get; set; }

        public int? MaxPickupTimeWindow { get; set; }

        public int? MinDeliveryTimeWindow { get; set; }

        public int MinInterTripTime { get; set; }

        public int? MaxTravelTime { get; set; }

        public double DroppedPercent { get; set; }

        public int ServiceTime { get; set; }

        public int? ExtraCustomerServiceTime { get; set; }

        public int TimeLimit { get; set; }
    }
}