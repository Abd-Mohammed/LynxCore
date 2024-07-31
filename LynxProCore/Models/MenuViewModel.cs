using System.Collections.Generic;

namespace Lynx.Models
{
    public class MenuViewModel
    {
        public string ControllerName { get; set; }

        public string AreaName { get; set; }

        public bool IsClosed { get; set; }

        public bool IsSaasUser { get; set; }

        public IEnumerable<PermissionArea> AvailablePermissionAreas { get; set; }

        public PermissionArea CustomPermissionArea { get; set; }

        public IEnumerable<Json.Addon> CustomAddons { get; set; }
    }
}