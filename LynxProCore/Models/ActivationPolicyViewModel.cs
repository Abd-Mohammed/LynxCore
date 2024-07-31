using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class ActivationPolicyViewModel
    {
        public int TenentSettingId { get; set; }

        [Display(Name = "[[[[Day(s)]]]]")]
        [Range(1, int.MaxValue, ErrorMessage = "[[[[The field Day(s) must be a greater than or equal 1.]]]]")]
        public int? Days { get; set; }
    }
}