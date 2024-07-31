using System.ComponentModel.DataAnnotations;
using Lynx.Models;

namespace LynxProCore.Models;

public class MaintenanceServiceViewModel
{

    public MaintenanceServiceViewModel()
    {
        MaintenanceServiceParts = new List<MaintenanceServicePartViewModel>(5);
    }

    public int MaintenanceServiceId { get; set; }

    [Required(ErrorMessage = "[[[[The field Date is required.]]]]")]
    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Date]]]]")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "[[[[The field Provider is required.]]]]")]
    [MaxLength(50, ErrorMessage = "[[[[The field Provider must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Provider]]]]", Description = "[[[[Maintenance Service Provider]]]]")]
    public string Provider { get; set; }

    [MaxLength(250, ErrorMessage = "[[[[The field Initial Inspection must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Initial Inspection]]]]")]
    public string InitialInspection { get; set; }

    [MaxLength(250, ErrorMessage = "[[[[The field Final Inspection must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Final Inspection]]]]")]
    public string FinalInspection { get; set; }

    [MaxLength(250, ErrorMessage = "[[[[The field Notes must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Notes]]]]")]
    public string Notes { get; set; }

    [Display(Name = "[[[[Odometer]]]]")]
    public long Odometer { get; set; }

    [Display(Name = "[[[[Engine Hours]]]]")]
    public double EngineHours { get; set; }

    [Required(ErrorMessage = "[[[[The field Invoice Reference No. is required.]]]]")]
    [MaxLength(50, ErrorMessage = "[[[[The field Invoice Reference No. must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Invoice Reference No.]]]]")]
    public string InvoiceReferenceNo { get; set; }

    [Required(ErrorMessage = "[[[[The field Cost is required.]]]]")]
    [Range(1, 10000, ErrorMessage = "[[[[The field Cost must be between {1} and {2}]]]]")]
    [Display(Name = "[[[[Cost]]]]")]
    public double Cost { get; set; }

    [Required(ErrorMessage = "[[[[The field Type is required.]]]]")]
    [Display(Name = "[[[[Type]]]]")]
    public int MaintenanceServiceTypeId { get; set; }

    [Required(ErrorMessage = "[[[[The field Vehicle is required.]]]]")]
    [Display(Name = "[[[[Vehicle]]]]")]
    public int VehicleId { get; set; }

    [Display(Name = "[[[[Driver]]]]")]
    public int? DriverId { get; set; }

    [MaxLength(50, ErrorMessage = "[[[[The field Created By must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Created By]]]]")]
    public string CreatedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Creation Date]]]]")]
    public DateTime CreatedDate { get; set; }

    [MaxLength(50, ErrorMessage = "[[[[The field Modified By must be a string or array type with a maximum length of]]]] '{1}'.")]
    [Display(Name = "[[[[Modified By]]]]")]
    public string ModifiedBy { get; set; }

    [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
    [Display(Name = "[[[[Modification Date]]]]")]
    public DateTime ModifiedDate { get; set; }

    public virtual Vehicle Vehicle { get; set; }
    public virtual Driver Driver { get; set; }
    public virtual MaintenanceServiceType MaintenanceServiceType { get; set; }
    public virtual List<MaintenanceServicePartViewModel> MaintenanceServiceParts { get; set; }
}
public class MaintenanceServicePartViewModel
{
    public int MaintenanceServicePartId { get; set; }
    public int MaintenanceServiceId { get; set; }
    [MaxLength(50)]
    [Display(Name = "[[[[Name]]]]", Description = "[[[[Maintenance Service Part Name]]]]")]
    public string Name { get; set; }
    [Range(1, 100)]
    [Display(Name = "[[[[Quantity]]]]", Description = "[[[[Maintenance Service Part Quantity]]]]")]
    public int? Quantity { get; set; }
    [Range(1, 10000)]
    [Display(Name = "[[[[Cost]]]]", Description = "[[[[Maintenance Part Cost]]]]")]
    public double? Cost { get; set; }
}
