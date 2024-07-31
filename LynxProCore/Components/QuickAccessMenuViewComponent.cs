using Lynx.Models;
using Lynx.Models.Json;
using Microsoft.AspNetCore.Mvc;
using Addon = Lynx.Models.Json.Addon;

namespace LynxProCore.Components;

public class QuickAccessMenuViewComponent : ViewComponent
{
    public Task<IViewComponentResult> InvokeAsync(string controllerName)
    {
        var permissionArea = new PermissionArea
        {
            PermissionAreaId = 1,
            Description = "Main Area",
            Code = "MAIN",
            Icon = "main_icon",
            Link = "/main",
            Number = 1
        };

        // Create dummy Permission
        var permission = new Permission
        {
            PermissionId = 1,
            Description = "View Dashboard",
            Code = "VIEW_DASHBOARD",
            Icon = "dashboard_icon",
            Link = "/dashboard",
            IsMultiSaas = true,
            IsFranchise = false,
            PermissionAreaId = permissionArea.PermissionAreaId,
            PermissionArea = permissionArea
        };

        // Create dummy ShortcutLink
        var shortcutLink = new ShortcutLink
        {
            Name = "Dashboard",
            Permission = permission,
            IsSubMenu = false,
            SubMenuPermissions = [permission]
        };

        // Create dummy Addon
        var addon = new Addon
        {
            Id = "1",
            Code = "ADD1",
            Name = "Addon One",
            Custom = true,
            Source = "Source One",
            ShortcutLink = new AddonShortcutLink
            {
                Enabled = true,
                Grouped = false
            },
            AllowedUsers = ["user1", "user2"]
        };

        // Create QuickMenuViewModel with dummy data
        var quickMenuViewModel = new QuickMenuViewModel
        {
            ShowDashboardShortcutLink = true,
            ShortcutLinks = [shortcutLink],
            Addons = [addon]
        };

        return Task.FromResult<IViewComponentResult>(View("_QuickAccessMenu", quickMenuViewModel));
    }

}
