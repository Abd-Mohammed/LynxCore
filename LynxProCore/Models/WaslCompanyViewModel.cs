using System;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public enum RegistrationType
    {
        [Display(Name = "[[[[Commercial]]]]")]
        Commercial = 1,
        [Display(Name = "[[[[Individual]]]]")]
        Individual = 2
    }

    public enum ActivityType
    {
        [Display(Name = "[[[[Bus Rental]]]]")]
        BusRental = 1,
        [Display(Name = "[[[[Educational Transport]]]]")]
        EducationalTransport = 2,
        [Display(Name = "[[[[Speciality Transport]]]]")]
        SpecialityTransport = 3
    }

    public class WaslCompanyViewModel
    {
        [Display(Name = "[[[[Name English]]]]")]
        [Required(ErrorMessage = "[[[[The field Name English is required.]]]]")]
        [MaxLength(100, ErrorMessage = "[[[[The field Name English must be a string or array type with a maximum length of]]]] '{1}'.")]
        public string NameEnglish { get; set; }

        [Display(Name = "[[[[Name Arabic]]]]")]
        [Required(ErrorMessage = "[[[[The field Name Arabic is required.]]]]")]
        [MaxLength(100, ErrorMessage = "[[[[The field Name Arabic must be a string or array type with a maximum length of]]]] '{1}'.")]
        public string NameArabic { get; set; }

        [Display(Name = "[[[[Identity No.]]]]")]
        [Required(ErrorMessage = "[[[[The field Identity No. is required.]]]]")]
        [MaxLength(10, ErrorMessage = "[[[[The field Identity No. must be a string or array type with a maximum length of]]]] '{1}'.")]
        public string IdentityNumber { get; set; }

        [Display(Name = "[[[[Phone No.]]]]")]
        [Required(ErrorMessage = "[[[[The field Phone No. is required.]]]]")]
        [MaxLength(25, ErrorMessage = "[[[[The field Phone No. must be a string or array type with a maximum length of]]]] '{1}'.")]
        [RegularExpression(StandardPhoneNoFormats.Default, ErrorMessage = "[[[[The field Phone No. is invalid.]]]]")]
        public string PhoneNumber { get; set; }

        [Display(Name = "[[[[Email]]]]")]
        [Required(ErrorMessage = "[[[[The field Email is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Email must be a string or array type with a maximum length of]]]] '{1}'.")]
        [RegularExpression(StandardEmailFormats.Default, ErrorMessage = "[[[[You must enter a valid email address.]]]]")]
        public string Email { get; set; }

        [Range(1, 3)]
        [Display(Name = "[[[[Activity Type]]]]")]
        [Required(ErrorMessage = "[[[[The field Activity Type is required.]]]]")]
        public ActivityType ActivityType { get; set; }

        [Range(1, 2)]
        [Display(Name = "[[[[Registration Type]]]]")]
        [Required(ErrorMessage = "[[[[The field Registration type is required.]]]]")]
        public RegistrationType RegistrationType { get; set; }

        [Display(Name = "[[[[Company]]]]")]
        public CompanyRegistrationViewModel Company { get; set; }

        [Display(Name = "[[[[Individual]]]]")]
        public IndividualRegistrationViewModel Individual { get; set; }

        // Hidden Fields
        public Guid? Reference { get; set; }

        public int TenantId { get; set; }

        public bool CanEdit { get; set; }

        public bool Registration { get; set; }

        public string NotFoundError { get; set; }
    }

    public class CompanyRegistrationViewModel
    {
        [Display(Name = "[[[[Commercial Record Number]]]]")]
        [Required(ErrorMessage = "[[[[The field Commercial Record Number is required.]]]]")]
        [MaxLength(10, ErrorMessage = "[[[[The field Commercial Record Number must be a string or array type with a maximum length of]]]] '{1}'.")]
        public string CommercialRecordNumber { get; set; }

        [Display(Name = "[[[[Commercial Record Issue Date]]]]")]
        [Required(ErrorMessage = "[[[[The field Commercial Record Issue Date is required.]]]]")]
        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        public DateTime CommercialRecordIssueDate { get; set; }

        [Display(Name = "[[[[Manager Name]]]]")]
        [Required(ErrorMessage = "[[[[The field Manager Name is required.]]]]")]
        [MaxLength(50, ErrorMessage = "[[[[The field Name must be a string or array type with a maximum length of]]]] '{1}'.")]
        public string ManagerName { get; set; }

        [Display(Name = "[[[[Manager Phone No.]]]]")]
        [Required(ErrorMessage = "[[[[The field Manager Phone No. is required.]]]]")]
        [RegularExpression(StandardPhoneNoFormats.Default, ErrorMessage = "[[[[The field Manager Phone No. is invalid.]]]]")]
        public string ManagerPhoneNumber { get; set; }

        [Display(Name = "[[[[Manager Mobile No.]]]]")]
        [Required(ErrorMessage = "[[[[The field Manager Mobile No. is required.]]]]")]
        [RegularExpression(StandardPhoneNoFormats.Default, ErrorMessage = "[[[[The field Manager Mobile No. is invalid.]]]]")]
        public string ManagerMobileNumber { get; set; }
    }

    public class IndividualRegistrationViewModel
    {
        [Display(Name = "[[[[Date Of Birth]]]]")]
        [Required(ErrorMessage = "[[[[The field Date Of Birth is required.]]]]")]
        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        public DateTime DateOfBirth { get; set; }
    }
}