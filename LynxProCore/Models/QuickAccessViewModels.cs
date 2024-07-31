using System.Collections.Generic;

namespace Lynx.Models
{
    public class QuickMenuViewModel
    {
        public bool ShowDashboardShortcutLink { get; set; }

        public IEnumerable<ShortcutLink> ShortcutLinks { get; set; }

        public IEnumerable<Models.Json.Addon> Addons { get; set; }
    }

    public class ShortcutLink
    {
        public string Name { get; set; }

        public Permission Permission { get; set; }

        public bool IsSubMenu { get; set; }

        public IEnumerable<Permission> SubMenuPermissions { get; set; }
    }
}