namespace Lynx.Models
{
    public class TripRuleResponse : BaseResponse
    {
        public int Id { get; set; }

        public TripRuleSettingsResponse Settings { get; set; }

        public int TenantId { get; set; }
    }

    public class TripRuleSettingsResponse
    {
        public string EnterpriseName { get; set; }

        public TripEngineCalculationSourceResponse EngineSource { get; set; }

        public TripCalculationSourceResponse LocationSource { get; set; }

        public TripCalculationSourceResponse EventSource { get; set; }

        public TripCalculationSourceResponse PassengerCounterSource { get; set; }

        public bool MileageFromCan { get; set; }
    }

    public class TripEngineCalculationSourceResponse : TripCalculationSourceResponse
    {
        public bool FallbackToSpeed { get; set; }
    }

    public class TripCalculationSourceResponse
    {
        public bool Enabled { get; set; }

        public string[] VehicleTypes { get; set; }
    }
}