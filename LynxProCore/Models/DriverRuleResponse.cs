namespace Lynx.Models
{
    public class DriverRuleResponse
    {
        public int Id { get; set; }

        public DriverRuleSettingsResponse Settings { get; set; }

        public int TenantId { get; set; }
    }

    public class DriverRuleSettingsResponse
    {
        public bool VirtualMode { get; set; }

        public int SwipeCooldownInSeconds { get; set; }

        public string[] VehicleTypes { get; set; }
    }
}