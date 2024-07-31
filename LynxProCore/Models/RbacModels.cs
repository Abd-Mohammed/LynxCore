//using Microsoft.AspNetCore.Mvc;
//using System.Security.Principal;
//using Microsoft.AspNet.Identity;

//namespace Lynx.Models
//{
//    public class RbacUser
//    {
//        public RbacUser(IIdentity identity)
//        {
//            UserId = identity.GetUserId<int>();
//            roles = [];
//            permissions = [];
//            addonScopes = [];
//            addonIds = [];
//            IsSystemAdmin = true;
//            TenantId = 10;
//        }

//        public int UserId { get; set; }
//        public bool IsSystemAdmin { get; set; }
//        public int TenantId { get; set; }

//        private string[] roles;
//        private string[] permissions;
//        private string[] addonScopes;
//        private string[] addonIds;

//        public bool HasPermission(string requiredPermission)
//        {
//            return permissions.Any(p => p.Equals(requiredPermission, StringComparison.OrdinalIgnoreCase));
//        }

//        public bool HasAddon(string requiredAddonId)
//        {
//            return addonIds.Any(a => a.Equals(requiredAddonId));
//        }

//        public bool HasAddonCode(string requiredPermissionCode)
//        {
//            return addonScopes.Any(a => a.Equals(requiredPermissionCode, StringComparison.OrdinalIgnoreCase));
//        }

//        public bool HasRole(string name)
//        {
//            return roles.Any(r => r.Equals(name, StringComparison.OrdinalIgnoreCase));
//        }

//        public bool HasRoles(string names)
//        {
//            if (string.IsNullOrEmpty(names))
//            {
//                return false;
//            }

//            var found = false;
//            var roleNames = names.ToLower().Split(',');
//            foreach (var role in roles)
//            {
//                found = roleNames.Contains(role.ToLower());
//                if (found)
//                {
//                    return found;
//                }
//            }
//            return found;
//        }
//    }

//    public static class RbacExtensions
//    {
//        public static bool HasRole(this ControllerBase controller, string roleName)
//        {
//            var rbacUser = new RbacUser(controller.ControllerContext.HttpContext.User.Identity);

//            //Check if the requesting user has the specified role...
//            return rbacUser.HasRole(roleName);
//        }

//        public static bool HasRoles(this ControllerBase controller, string roleNames)
//        {
//            var rbacUser = new RbacUser(controller.ControllerContext.HttpContext.User.Identity);

//            //Check if the requesting user has any of the specified roles...
//            //Make sure you separate the roles using ','
//            return rbacUser.HasRoles(roleNames);
//        }

//        public static bool HasPermission(this ControllerBase controller, string permissionName)
//        {
//            var rbacUser = new RbacUser(controller.ControllerContext.HttpContext.User.Identity);

//            //Check if the requesting user has the specified application permission...
//            return rbacUser.HasPermission(permissionName);
//        }

//        public static bool HasAnyPermission(this ControllerBase controller, string permissions)
//        {
//            var perms = permissions.Split(',');
//            var rbacUser = new RbacUser(controller.ControllerContext.HttpContext.User.Identity);

//            var length = perms.Length;
//            for (int i = 0; i < length; i++)
//            {
//                if (rbacUser.HasPermission(perms[i]))
//                {
//                    return true;
//                }
//            }

//            return false;
//        }

//        public static bool HasMultiSaasPermission(this ControllerBase controller, string tenantName)
//        {
//            var identity = controller.ControllerContext.HttpContext.User.Identity;
//            var permissionName = controller.ControllerContext.RouteData.Values["controller"].ToString();

//            var mutliSaasPermissions = identity.GetMultiSaasPermissions();
//            var requiredPermission = $"{tenantName}-{permissionName}";

//            return mutliSaasPermissions.Any(msp => msp.Equals(requiredPermission, StringComparison.OrdinalIgnoreCase));
//        }

//        public static bool HasMultiSaasPermission(this ControllerBase controller, string tenantName, string permissionName)
//        {
//            var identity = controller.ControllerContext.HttpContext.User.Identity;

//            var mutliSaasPermissions = identity.GetMultiSaasPermissions();
//            var requiredPermission = $"{tenantName}-{permissionName}";

//            return mutliSaasPermissions.Any(msp => msp.Equals(requiredPermission, StringComparison.OrdinalIgnoreCase));
//        }

//        public static bool HasMultiSaasActionPermission(this ControllerBase controller, string tenantName, string actionName)
//        {
//            var identity = controller.ControllerContext.HttpContext.User.Identity;
//            var permissionName = controller.ControllerContext.RouteData.Values["controller"].ToString();

//            var mutliSaasPermissions = identity.GetMultiSaasPermissions();
//            var requiredPermission = $"{tenantName}-{permissionName}-{actionName}";

//            return mutliSaasPermissions.Any(msp => msp.Equals(requiredPermission, StringComparison.OrdinalIgnoreCase));
//        }

//        public static bool IsSysAdmin(this ControllerBase controller)
//        {
//            var rbacUser = new RbacUser(controller.ControllerContext.HttpContext.User.Identity);

//            //Check if the requesting user has the System Administrator privilege...
//            return rbacUser.IsSystemAdmin;
//        }

//        public static bool IsMultiSaasAdmin(this ControllerBase controller, string tenantName)
//        {
//            var identity = controller.ControllerContext.HttpContext.User.Identity;
//            var dictionary = identity.GetMultiSaasSysAdmins();

//            var sysAdmin = false;
//            if (dictionary.TryGetValue(tenantName, out sysAdmin))
//            {
//                return sysAdmin;
//            }
//            else
//            {
//                return false;
//            }
//        }
//    }
//}