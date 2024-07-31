using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class DriverRuleSettingsViewModel
    {
        [Display(Name = "[[[[Virtual Mode]]]]")]
        public bool VirtualMode { get; set; }

        [Display(Name = "[[[[Swipe Cooldown in Seconds]]]]")]
        [Range(0, 3600)]
        public int SwipeCooldownInSeconds { get; set; }

        [Display(Name = "[[[[Vehicle Types]]]]")]
        public string[] VehicleTypes { get; set; }

        public int RuleId { get; set; }

        public bool NotFound { get; set; } = false;
    }
}