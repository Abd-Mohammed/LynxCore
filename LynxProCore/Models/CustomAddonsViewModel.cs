using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lynx.Models
{
    public class CustomAddonsViewModel
    {
        public CustomAddonsViewModel()
        {
        }

        public CustomAddonsViewModel(List<CustomAddonAccess> accesses)
        {
            Accesses = accesses;
        }

        public List<CustomAddonAccess> Accesses { get; set; } = new List<CustomAddonAccess>();
    }

    public class CustomAddonAccess
    {
        [Required]
        public string Id { get; set; }

        [Display(Name = "[[[[Name]]]]")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "[[[[Users]]]]")]
        public List<string> Emails { get; set; } = new List<string>();

        public bool AllowAll { get; set; } = false;
    }
}