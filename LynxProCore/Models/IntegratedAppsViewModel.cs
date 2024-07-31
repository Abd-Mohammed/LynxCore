using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public enum MobileDeviceAccessnTypeViewModel
    {
        [Display(Name = "[[[[Allow]]]]")]
        Allow = 1,
        [Display(Name = "[[[[Allow All]]]]")]
        AllowAll = 2,
        [Display(Name = "[[[[Deny]]]]")]
        Deny = 3,
        [Display(Name = "[[[[Deny All]]]]")]
        DenyAll = 4
    }
    public class IntegratedAppsViewModel
    {
        public int TenantSettingId { get; set; }

        [Required(ErrorMessage = "[[[[The field Mobile Device Access is required.]]]]")]
        [Range(1, 4)]
        [Display(Name = "[[[[Mobile Device Access]]]]")]
        public MobileDeviceAccessnTypeViewModel MobileDeviceAccess { get; set; }

        [Display(Name = "[[[[Users]]]]")]
        public List<string> Emails { get; set; }
    }
}