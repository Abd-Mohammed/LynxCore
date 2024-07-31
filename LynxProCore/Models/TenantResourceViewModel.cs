using System;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class TenantResourceViewModel
    {
        public int TenantResourceId { get; set; }

        [Range(1, 3)]
        [Display(Name = "[[[[Type]]]]", Description = "[[[[Resource Type]]]]")]
        public ResourceType ResourceType { get; set; }

        [Range(1, 2)]
        [Display(Name = "[[[[Kind]]]]", Description = "[[[[Resource Kind]]]]")]
        public ResourceKind ResourceKind { get; set; }

        [Range(0, int.MaxValue)]
        [Display(Name = "[[[[Quota]]]]", Description = "[[[[Resource Quota]]]]")]
        public int Quota { get; set; }

        [Range(0, int.MaxValue)]
        [Display(Name = "[[[[Used Quota]]]]", Description = "[[[[Resource Used Quota]]]]")]
        public int UsedQuota { get; set; }

        [Range(0, int.MaxValue)]
        [Display(Name = "[[[[Remaining Quota]]]]", Description = "[[[[Resource Remaining Quota]]]]")]
        public int RemainingQuota { get; set; }

        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        [Display(Name = "[[[[Reset Quota Date]]]]", Description = "[[[[Resource Reset Quota Date]]]]")]
        public DateTime? ResetQuotaDate { get; set; }

        [MaxLength(50)]
        [Display(Name = "[[[[Created By]]]]", Description = "[[[[Resource Created By]]]]")]
        public string CreatedBy { get; set; }

        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        [Display(Name = "[[[[Creation Date]]]]", Description = "[[[[Resource Created Date]]]]")]
        public DateTime CreatedDate { get; set; }

        [MaxLength(50)]
        [Display(Name = "[[[[Modified By]]]]", Description = "[[[[Resource Modified By]]]]")]
        public string ModifiedBy { get; set; }

        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        [Display(Name = "[[[[Modification Date]]]]", Description = "[[[[Resource Modification Date]]]]")]
        public DateTime ModifiedDate { get; set; }

    }
}