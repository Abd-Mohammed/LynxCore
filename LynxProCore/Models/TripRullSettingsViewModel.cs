using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class TripRuleSettingsViewModel
    {
        [Display(Name = "[[[[Engine Source Fallback To Speed]]]]")]
        public bool EngineSourceFallbackToSpeed { get; set; }

        [Display(Name = "[[[[Engine Source Enabled]]]]")]
        public bool EngineSourceEnabled { get; set; }

        [Display(Name = "[[[[Engine Source Vehicle Types]]]]")]
        public string[] EngineSourceVehicleTypes { get; set; }

        [Display(Name = "[[[[Location Source Enabled]]]]")]
        public bool LocationSourceEnabled { get; set; }

        [Display(Name = "[[[[Location Source Vehicle Types]]]]")]
        public string[] LocationSourceVehicleTypes { get; set; }

        [Display(Name = "[[[[Event Source Enabled]]]]")]
        public bool EventSourceEnabled { get; set; }

        [Display(Name = "[[[[Event Source Vehicle Types]]]]")]
        public string[] EventSourceVehicleTypes { get; set; }

        [Display(Name = "[[[[Passenger Counter Source Enabled]]]]")]
        public bool PassengerCounterSourceEnabled { get; set; }

        [Display(Name = "[[[[Passenger Counter Source Vehicle Types]]]]")]
        public string[] PassengerCounterVehicleTypes { get; set; }

        [Display(Name = "[[[[Mileage from CAN]]]]")]
        public bool MileageFromCan { get; set; }

        public int RuleId { get; set; }
    }
}