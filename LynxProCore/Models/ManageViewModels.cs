using Lynx.Utils.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Owin.Security;

namespace Lynx.Models
{
    public class IndexViewModel
    {
        public bool HasPassword { get; set; }
        public IList<UserLoginInfo> Logins { get; set; }
        public string PhoneNumber { get; set; }
        public bool TwoFactor { get; set; }
        public bool BrowserRemembered { get; set; }
    }

    public class ManageLoginsViewModel
    {
        public IList<UserLoginInfo> CurrentLogins { get; set; }
        public IList<AuthenticationDescription> OtherLogins { get; set; }
    }

    public class FactorViewModel
    {
        public string Purpose { get; set; }
    }

    public class SetPasswordViewModel
    {
        [NoTrim("NewPassword")]
        [Required(ErrorMessage = "[[[[The field New Password is required.]]]]")]
        [StringLength(100, ErrorMessage = "[[[[The New Password must be at least]]]] {2} [[[[characters long.]]]]", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[New password]]]]")]
        public string NewPassword { get; set; }

        [NoTrim("ConfirmPassword")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Confirm new password]]]]")]
        [Compare("NewPassword", ErrorMessage = "[[[[The new password and confirmation password do not match.]]]]")]
        public string ConfirmPassword { get; set; }
    }

    public class ChangePasswordViewModel
    {

        [NoTrim("OldPassword")]
        [Required(ErrorMessage = "[[[[The field Old Password is required.]]]]")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Old Password]]]]")]
        public string OldPassword { get; set; }

        [NoTrim("NewPassword")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[New Password]]]]")]
        [Required(ErrorMessage = "[[[[The field New Password is required.]]]]")]
        [StringLength(100, ErrorMessage = "[[[[The new password must be at most 100 characters long.]]]]", MinimumLength = 8)]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*[A-Z])(?=(.*[\\d]){1,})(?=(.*[\\W_]){1,})(?!.*[A-Za-z]{4,}).{10,}$", ErrorMessage = "[[[[The minimum length is 10 characters.<br/> The maximum length is 100 characters.<br/> The password must contain at least:<br/> - 1 Capital character <br/>  - 1 Number<br/>  - 1 Special character<br/>The password must not contain four or more consecutive alphabetic characters.]]]]")]
        public string NewPassword { get; set; }

        [NoTrim("ConfirmPassword")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Confirm new password]]]]")]
        [Compare("NewPassword", ErrorMessage = "[[[[The new password and confirmation password do not match.]]]]")]
        public string ConfirmPassword { get; set; }
    }

    public class AddPhoneNumberViewModel
    {
        [Required(ErrorMessage = "[[[[The field Number is required.]]]]")]
        [Phone]
        [Display(Name = "[[[[Phone Number]]]]")]
        public string Number { get; set; }
    }

    public class VerifyPhoneNumberViewModel
    {
        [Required(ErrorMessage = "[[[[The field Code is required.]]]]")]
        [Display(Name = "[[[[Code]]]]")]
        public string Code { get; set; }

        [Required(ErrorMessage = "[[[[The field Phone Number is required.]]]]")]
        [Phone]
        [Display(Name = "[[[[Phone Number]]]]")]
        public string PhoneNumber { get; set; }
    }

    public class ConfigureTwoFactorViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<SelectListItem> Providers { get; set; }
    }
    public class ChangeSettingsViewModel
    {
        [Required(ErrorMessage = "[[[[The field Culture Name is required.]]]]")]
        [MaxLength(10, ErrorMessage = "[[[[The field Culture Name must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Culture Name]]]]")]
        public string CultureName { get; set; }

        [Required(ErrorMessage = "[[[[The field Time Zone is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Time Zone must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Time Zone]]]]")]
        public string TimeZoneId { get; set; }

        [Range(-90d, 90d, ErrorMessage = "[[[[The Latitude field is required.]]]]")]
        [Display(Name = "[[[[Latitude]]]]")]
        public double Latitude { get; set; }

        [Range(-180d, 180d, ErrorMessage = "[[[[The Longitude field is required.]]]]")]
        [Display(Name = "[[[[Longitude]]]]")]
        public double Longitude { get; set; }

        [Range(1, 60, ErrorMessage = "[[[[The Request Rate Setting field is required.]]]]")]
        [Display(Name = "[[[[Request Rate (min)]]]]", Description = "[[[[User Setting Request Rate (min)]]]]")]
        public int RequestRateSetting { get; set; }

        [Required(ErrorMessage = "[[[[The field Display Language is required.]]]]")]
        [MaxLength(5, ErrorMessage = "[[[[The field Display Language must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Column(TypeName = "VARCHAR")]
        [Display(Name = "[[[[Display Language]]]]")]
        public string DisplayLanguage { get; set; }

        [MaxLength(50, ErrorMessage = "[[[[The field Default Page must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Default Page]]]]")]
        public string DefaultPage { get; set; }

        [MaxLength(25, ErrorMessage = "[[[[The field Default Map Type must be a string or array type with a maximum length of]]]] '{1}'.")]
        [Display(Name = "[[[[Default Map Type]]]]")]
        public string DefaultMapType { get; set; }

        [Display(Name = "[[[[Default Channel]]]]")]
        public int VideoDefaultChannel { get; set; }

        [Display(Name = "[[[[Auto Play]]]]")]
        public bool VideoAutoPlay { get; set; }
        public int UserId { get; set; }
    }
}