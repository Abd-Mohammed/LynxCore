using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public enum AlertPermissionLevel
    {
        [Display(Name = "[[[[Allow]]]]")]
        Allow = 1,
        [Display(Name = "[[[[Allow All]]]]")]
        AllowAll = 2
    }

    public class AlertPermissionsViewModel
    {
        public int TenantSettingId { get; set; }

        [Required(ErrorMessage = "[[[[The field Permission Level is required.]]]]")]
        [Range(1, 2)]
        [Display(Name = "[[[[Permission Level]]]]")]
        public AlertPermissionLevel PermissionLevel { get; set; }

        [Display(Name = "[[[[Roles]]]]")]
        public List<string> Roles { get; set; }

        [Display(Name = "[[[[Alert Rules]]]]")]
        public List<string> AlertRules { get; set; }
    }
}