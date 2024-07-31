using System.Collections.Generic;

namespace Lynx.Models
{
    public class UserTenantMenuViewModel
    {
        public string ActiveName { get; set; }

        public IEnumerable<ApplicationUserTenant> Tenants { get; set; }
    }
}