using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lynx.Models
{
    public class TenantSettingViewModel
    {
        public int TenantSettingId { get; set; }

        [Required(ErrorMessage = "[[[[The field Display Name is required.]]]]")]
        [MaxLength(100, ErrorMessage = "[[[[The field Display Name must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Display Name]]]]")]
        public string DisplayName { get; set; }

        [Required(ErrorMessage = "[[[[The field Culture Name is required.]]]]")]
        [MaxLength(10, ErrorMessage = "[[[[The field Culture Name must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Culture Name]]]]")]
        public string CultureName { get; set; }

        [Required(ErrorMessage = "[[[[The field Time Zone is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Time Zone must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Time Zone]]]]")]
        public string TimeZoneId { get; set; }

        [Range(1, 3, ErrorMessage = "[[[[The System Of Measurement field is required.]]]]")]
        [Display(Name = "[[[[System Of Measurement]]]]")]
        public SystemOfMeasurement SystemOfMeasurement { get; set; }

        [Required(ErrorMessage = "[[[[The field Latitude is required.]]]]")]
        [Range(-90d, 90d, ErrorMessage = "[[[[The Latitude field is required.]]]]")]
        [Display(Name = "[[[[Latitude]]]]")]
        public double Latitude { get; set; }

        [Required(ErrorMessage = "[[[[The field Longitude is required.]]]]")]
        [Range(-180d, 180d, ErrorMessage = "[[[[The Longitude field is required.]]]]")]
        [Display(Name = "[[[[Longitude]]]]")]
        public double Longitude { get; set; }

        [Required(ErrorMessage = "[[[[The field Color is required.]]]]")]
        [MaxLength(7, ErrorMessage = "[[[[The field Color must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Color]]]]")]
        public string Color { get; set; }

        [Required(ErrorMessage = "[[[[The field Automated Email is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Automated Email must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Automated Email]]]]")]
        [RegularExpression(StandardEmailFormats.Default, ErrorMessage = "[[[[You must enter a valid email address]]]]")]
        public string AutomatedEmail { set; get; }

        [Required(ErrorMessage = "[[[[The field Currency is required.]]]]")]
        [MaxLength(5, ErrorMessage = "[[[[The field Currency must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Column(TypeName = "VARCHAR")]
        [Display(Name = "[[[[Currency]]]]")]
        public string Currency { get; set; }

        [Display(Name = "[[[[Dashboard Shortcut Link]]]]")]
        public bool ShowDashboardShortcutLink { get; set; }
    }
}