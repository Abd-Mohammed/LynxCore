using Lynx.Utils.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Lynx.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [Display(Name = "[[[[Email]]]]")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required(ErrorMessage = "[[[[The field Provider is required.]]]]")]
        [Display(Name = "[[[[Provider]]]]")]
        public string Provider { get; set; }

        [Required(ErrorMessage = "[[[[The field Code is required.]]]]")]
        [Display(Name = "[[[[Code]]]]")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "[[[[Remember this browser?]]]]")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [Display(Name = "[[[[Email]]]]")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [RegularExpression(StandardEmailFormats.Default, ErrorMessage = "[[[[You must enter a valid email address]]]]")]
        [Display(Name = "[[[[Email]]]]")]
        public string Email { get; set; }

        [NoTrim("Password")]
        [Required(ErrorMessage = "[[[[The field Password is required.]]]]")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Password]]]]")]
        public string Password { get; set; }
        public string CompanyName { get; set; }

        public string CompanyDisplayName { get; set; }

        public string CompanyShortName { set; get; }

        public string CompanyImageBlobName { get; set; }

        public string CompanyIconBlobName { set; get; }

        public string CompanyTheme { set; get; }

        public bool IsCustomLogin { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [EmailAddress]
        [Display(Name = "[[[[Email]]]]")]
        public string Email { get; set; }

        [NoTrim("Password")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Password]]]]")]
        [Required(ErrorMessage = "[[[[The field Password is required.]]]]")]
        [StringLength(100, ErrorMessage = "[[[[The new password must be at most 100 characters long.]]]]", MinimumLength = 8)]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*[A-Z])(?=(.*[\\d]){1,})(?=(.*[\\W_]){1,})(?!.*[A-Za-z]{4,}).{10,}$", ErrorMessage = "[[[[The minimum length is 10 characters.<br/> The maximum length is 100 characters.<br/> The password must contain at least:<br/> - 1 Capital character <br/>  - 1 Number<br/>  - 1 Special character<br/>The password must not contain four or more consecutive alphabetic characters.]]]]")]
        public string Password { get; set; }

        [NoTrim("ConfirmPassword")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Confirm password]]]]")]
        [Compare("Password", ErrorMessage = "[[[[The password and confirmation password do not match.]]]]")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [NoTrim("Password")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[New Password]]]]")]
        [Required(ErrorMessage = "[[[[The field New Password is required.]]]]")]
        [StringLength(100, ErrorMessage = "[[[[The new password must be at most 100 characters long.]]]]", MinimumLength = 8)]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*[A-Z])(?=(.*[\\d]){1,})(?=(.*[\\W_]){1,})(?!.*[A-Za-z]{4,}).{10,}$", ErrorMessage = "[[[[The minimum length is 10 characters.<br/> The maximum length is 100 characters.<br/> The password must contain at least:<br/> - 1 Capital character <br/>  - 1 Number<br/>  - 1 Special character<br/>The password must not contain four or more consecutive alphabetic characters.]]]]")]
        public string Password { get; set; }

        [NoTrim("ConfirmPassword")]
        [Required(ErrorMessage = "[[[[The field Confirmation password is required.]]]]")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Confirm New Password]]]]")]
        [Compare("Password", ErrorMessage = "[[[[The password and confirmation password do not match.]]]]")]
        public string ConfirmPassword { get; set; }

        public string Data { get; set; }
        public string Email { get; set; }
        public string TenantName { get; set; }
        public string Token { get; set; }
        public string CompanyName { get; set; }

        public string CompanyDisplayName { get; set; }

        public string CompanyShortName { set; get; }

        public string CompanyImageBlobName { get; set; }

        public string CompanyIconBlobName { set; get; }

        public string CompanyTheme { set; get; }

        public bool IsCustomLogin { get; set; }
        public bool IsValidRequest { get; set; }

    }


    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [RegularExpression(StandardEmailFormats.Default, ErrorMessage = "[[[[You must enter a valid email address]]]]")]
        [Display(Name = "[[[[Email]]]]")]
        public string Email { get; set; }
        public bool IsCustomLogin { get; set; }
    }

    public class UpdatePasswordViewModel
    {
        [NoTrim("Password")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[New Password]]]]")]
        [Required(ErrorMessage = "[[[[The field New Password is required.]]]]")]
        [StringLength(100, ErrorMessage = "[[[[The new password must be at most 100 characters long.]]]]", MinimumLength = 8)]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*[A-Z])(?=(.*[\\d]){1,})(?=(.*[\\W_]){1,})(?!.*[A-Za-z]{4,}).{10,}$", ErrorMessage = "[[[[The minimum length is 10 characters.<br/> The maximum length is 100 characters.<br/> The password must contain at least:<br/> - 1 Capital character <br/>  - 1 Number<br/>  - 1 Special character<br/>The password must not contain four or more consecutive alphabetic characters.]]]]")]
        public string Password { get; set; }

        [NoTrim("ConfirmPassword")]
        [Required(ErrorMessage = "[[[[The field Confirmation password is required.]]]]")]
        [DataType(DataType.Password)]
        [Display(Name = "[[[[Confirm New Password]]]]")]
        [Compare("Password", ErrorMessage = "[[[[The password and confirmation password do not match.]]]]")]
        public string ConfirmPassword { get; set; }

        public string Data { get; set; }

        public string Email { get; set; }

        public string TenantName { get; set; }

        public string Token { get; set; }
        public bool IsValidRequest { get; internal set; }
    }
}
