using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class DeviceSettingViewModel
    {
        public int TenentSettingId { get; set; }

        [Required(ErrorMessage = "[[[[The field Device Time Zone is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Device Time Zone must be a string or array type with a maximum length of '{1}'.]]]]")]
        [Display(Name = "[[[[Device Time Zone]]]]")]
        public string DeviceTimeZoneId { get; set; }
    }
}