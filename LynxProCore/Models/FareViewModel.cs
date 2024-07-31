using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Spatial;
using FluentValidation;
using FluentValidation.Attributes;
using Lynx.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using DayOfWeek = System.DayOfWeek;

namespace LynxProCore.Models;

public enum FareDistanceUnitViewModel
{
    [Display(Name = "Kilometer")]
    Kilometer = 1,
    [Display(Name = "Mile")]
    Mile = 2,
    [Display(Name = "Nautical Mile")]
    NauticalMile = 3
}

public class ExtraChargeViewModel
{
    [Required(ErrorMessage = "[[[[The field Name is required.]]]]")]
    [Display(Name = "[[[[Name]]]]", Description = "[[[[Name]]]]")]
    [StringLength(10, ErrorMessage = "[[[[The field Name must be of length 10 at max]]]]")]
    public string Name { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Fee must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Fee is required.]]]]")]
    [Display(Name = "[[[[Fee]]]]", Description = "[[[[Fee]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Fee field must be between.]]]] {1} [[[[and]]]] {2}")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal Fee { get; set; }
}

public class TransitChargeViewModel
{
    [Display(Name = "[[[[City]]]]", Description = "[[[[City]]]]")]
    public int? CityId { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Fee must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Fee is required.]]]]")]
    [Display(Name = "[[[[Fee]]]]", Description = "[[[[Fee]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Fee field must be between.]]]] {1} [[[[and]]]] {2}")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal Fee { get; set; }

    public string CityName { get; set; }
}

public class FareViewModel
{
    public int CityFareId { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Base Fare must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Base Fare is required.]]]]")]
    [Display(Name = "[[[[Base Fare]]]]", Description = "[[[[City Fare Base Fare]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Base Fare field must be between.]]]] {1} [[[[and]]]] {2}")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal BaseFare { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Cost Per Minute must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Cost Per Minute is required.]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Cost Per Minute field must be between.]]]] {1} [[[[and]]]] {2}")]
    [Display(Name = "[[[[Cost Per Minute]]]]", Description = "[[[[City Fare Cost Per Minute]]]]")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal CostPerMinute { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Cost Per Distance must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Cost Per Distance is required.]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Cost Per Distance field must be between.]]]] {1} [[[[and]]]] {2}")]
    [Display(Name = "[[[[Cost Per Distance]]]]", Description = "[[[[City Fare Cost Per Distance]]]]")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal CostPerDistance { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Minimum Fare must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Minimum Fare is required.]]]]")]
    [Display(Name = "[[[[Minimum Fare]]]]", Description = "[[[[City Minimum Fare]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Minimum Fare field must be between.]]]] {1} [[[[and]]]] {2}")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal MinimumFare { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Booking Fee must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Booking Fee is required.]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Booking Fee field must be between.]]]] {1} [[[[and]]]] {2}")]
    [Display(Name = "[[[[Booking Fee]]]]", Description = "[[[[City Fare Booking Fee]]]]")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal BookingFee { get; set; }

    [Required(ErrorMessage = "[[[[The field City is required.]]]]")]
    [Display(Name = "[[[[City]]]]", Description = "[[[[City ID]]]]")]
    public int CityId { get; set; }

    [BindNever]
    public CityViewModel City { get; set; }

    [Required(ErrorMessage = "[[[[The Ride Type is required.]]]]")]
    [Display(Name = "[[[[Ride Type]]]]", Description = "[[[[Ride Type ID]]]]")]
    public int RideTypeId { get; set; }

    [BindNever]
    public RideTypeViewModel RideType { get; set; }

    [Display(Name = "[[[[Fare Schedule]]]]", Description = "[[[[Fare Schedule ID]]]]")]
    public int? FareScheduleId { get; set; }

    [Required(ErrorMessage = "[[[[The field Color is required.]]]]")]
    [MaxLength(7, ErrorMessage = "[[[[The field Color must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Color]]]]")]
    public string Color { get; set; }

    [RegularExpression(@"^\d+(\.\d{1,3})?$", ErrorMessage = "[[[[The field Charge Per Minute must be zero or a positive value with up to three decimal]]]]")]
    [Required(ErrorMessage = "[[[[The field Charge Per Minute is required.]]]]")]
    [Display(Name = "[[[[Charge Per Minute]]]]", Description = "[[[[Charge Per Minute]]]]")]
    [Range(0, 1000, ErrorMessage = "[[[[The Charge Per Minute field must be between.]]]] {1} [[[[and]]]] {2}")]
    [DisplayFormat(DataFormatString = "{0:0.000}", ApplyFormatInEditMode = true)]
    public decimal WaitTimeChargePerMinute { get; set; }

    [Required(ErrorMessage = "[[[[The field After is required.]]]]")]
    [Display(Name = "[[[[After (minutes)]]]]", Description = "[[[[After]]]]")]
    [Range(0, 60, ErrorMessage = "[[[[The After field must be between]]]] {1} [[[[and]]]] {2}")]
    public int WaitTimeThreshold { get; set; }

    public ExtraChargeViewModel[] ExtraCharges { get; set; }

    public TransitChargeViewModel[] TransitCharges { get; set; }

    public List<FareScheduleRequest> Schedules { get; set; }

    [MaxLength(50)]
    [Display(Name = "[[[[Created By]]]]")]
    public string CreatedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Creation Date]]]]")]
    public DateTime CreatedDate { get; set; }

    [MaxLength(50)]
    [Display(Name = "[[[[Modified By]]]]")]
    public string ModifiedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Modification Date]]]]")]
    public DateTime ModifiedDate { get; set; }
}

public class CityViewModel
{
    [Required]
    public int CityId { get; set; }

    [Required]
    [MaxLength(50)]
    [Display(Name = "[[[[Name]]]]", Description = "[[[[City Name]]]]")]
    public string Name { get; set; }

    [MaxLength(250)]
    [Display(Name = "[[[[Description]]]]", Description = "[[[[City Description]]]]")]
    public string Description { get; set; }

    [Required]
    [Display(Name = "[[[[Location]]]]", Description = "[[[[City Location]]]]")]
    public DbGeography Location { get; set; }

    [Required]
    [MaxLength(50)]
    [Display(Name = "[[[[Master City]]]]", Description = "[[[[Master City]]]]")]
    public City Parent { get; set; }

    [Display(Name = "[[[[Sub Cities]]]]", Description = "[[[[Sub Cities]]]]")]
    public IEnumerable<City> SubCities { get; set; }

    [Required]
    [MaxLength(50)]
    [Display(Name = "[[[[Created By]]]]", Description = "[[[[City Created By]]]]")]
    public string CreatedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Creation Date]]]]", Description = "[[[[City Created Date]]]]")]
    public DateTime CreatedDate { get; set; }

    [Required]
    [MaxLength(50)]
    [Display(Name = "[[[[Modified By]]]]", Description = "[[[[City Modified By]]]]")]
    public string ModifiedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Modification Date]]]]", Description = "[[[[City Modification Date]]]]")]
    public DateTime ModifiedDate { get; set; }
}

public class RideTypeViewModel
{
    public RideTypeViewModel()
    {
    }
    public int RideTypeId { get; set; }

    [Required(ErrorMessage = "[[[[The field Name is required.]]]]")]
    [MaxLength(50, ErrorMessage = "[[[[The field Name must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Name]]]]")]
    public string Name { get; set; }

    [MaxLength(250, ErrorMessage = "[[[[The field Description must be a string with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Description]]]]")]
    public string Description { get; set; }

    [Display(Name = "[[[[No Fare]]]]", Description = "[[[[No Fare]]]]")]
    public bool NoFare { get; set; }

    [MaxLength(50)]
    [Display(Name = "[[[[Created By]]]]")]
    public string CreatedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Creation Date]]]]")]
    public DateTime CreatedDate { get; set; }

    [MaxLength(50)]
    [Display(Name = "[[[[Modified By]]]]")]
    public string ModifiedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Modification Date]]]]")]
    public DateTime ModifiedDate { get; set; }

    [Display(Name = "[[[[Receive Requests When Vacant Only]]]]", Description = "[[[[Receive Requests When Vacant Only]]]]")]
    public bool BackToBackTrip { get; set; }

    [Required]
    [Display(Name = "[[[[Passenger Count]]]]", Description = "[[[[Ride Type Passenger Count]]]]")]
    [Range(1, 10)]
    public int PassengerCount { get; set; } = 1;

    [Display(Name = "[[[[Vehicle Types]]]]", Description = "[[[[Vehicle Types]]]]")]
    [Required(ErrorMessage = "[[[[Should select at least one vehicle type.]]]]")]
    public List<string> VehicleTypes { get; set; } = new List<string>();

    [Required]
    [Display(Name = "[[[[Fuel Cost]]]]", Description = "[[[[Fuel Cost]]]]")]
    [DisplayFormat(DataFormatString = "{0:n2}", ApplyFormatInEditMode = true)]
    [Range(0, 100)]
    public decimal FuelCost { get; set; }
    public string NoFareDisplay => NoFare ? "[[[[Yes]]]]" : "[[[[No]]]]";

    public string BackToBackDisplay => BackToBackTrip ? "[[[[Yes]]]]" : "[[[[No]]]]";
}

[Validator(typeof(FareScheduleRequestValidator))]
public class FareScheduleRequest
{
    public int Index { get; set; }

    [Range(1, 7, ErrorMessage = "[[[[The field is required.]]]]")]
    public DayOfWeek DayOfWeek { get; set; }

    public string From { get; set; } = "12:00 AM";

    public DateTime ParsedFrom
    {
        get
        {
            if (From == null)
            {
                return ParsedFrom;
            }

            return DateTime.Parse(From);
        }
    }

    public string To { get; set; } = "12:30 AM";

    public DateTime ParsedTo
    {
        get
        {
            if (To == null)
            {
                return ParsedTo;
            }
            return DateTime.Parse(To);
        }
    }
}

public class FareScheduleRequestValidator : AbstractValidator<FareScheduleRequest>
{
    public FareScheduleRequestValidator()
    {
        RuleFor(fsr => fsr.From).NotNull().NotEmpty().WithErrorCode("[[[[The Start Time field is required.]]]]");

        RuleFor(fsr => fsr.To).NotNull().NotEmpty().WithErrorCode("[[[[The End Time field is required.]]]]");

        RuleFor(fsr => fsr.DayOfWeek).NotNull().NotEqual((DayOfWeek)0).WithErrorCode("[[[[The DayOfWeek field is required.]]]]");

        RuleFor(fsr => fsr.ParsedTo).GreaterThan(a => a.ParsedFrom).WithMessage("[[[[The Start Time field should be less than  End Time.]]]]");
    }
}