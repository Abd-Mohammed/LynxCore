using Lynx.Models;
using Lynx.Models.Json;
using Microsoft.AspNetCore.Mvc;
using Addon = Lynx.Models.Json.Addon;

namespace LynxProCore.Components;

public class SidebarMenuViewComponent : ViewComponent
{
    public Task<IViewComponentResult> InvokeAsync(string controllerName)
    {
        var permissionArea = new PermissionArea
        {
            PermissionAreaId = 1,
            Description = "Test Case Suite",
            Code = "ADM",
            Icon = "fa fa-flag",
            Link = "/Container",
            Number = 100,
            Permissions =
            [
                    new()
                    {
                        PermissionId = 101,
                        Description = "Maintenance Services",
                        Code = "VIEW_USERS",
                        Icon = "fa fa-wrench",
                        Link = "/Maintenance",
                        IsMultiSaas = true,
                        IsFranchise = false
                    },
                    new()
                    {
                        PermissionId = 102,
                        Description = "Fares",
                        Code = "VIEW_USERS",
                        Icon = "fa fa-star",
                        Link = "/Fares",
                        IsMultiSaas = true,
                        IsFranchise = false
                    }
            ]
        };

        // Create dummy data for Addon
        var addon = new Addon
        {
            Id = "addon_1",
            Code = "ADDON1",
            Name = "Sample Addon",
            Custom = true,
            Source = "custom_source",
            ShortcutLink = new AddonShortcutLink
            {
                Enabled = true,
                Grouped = false
            },
            AllowedUsers = ["user1", "user2"]
        };

        // Create dummy data for MenuViewModel
        var menuViewModel = new MenuViewModel
        {
            ControllerName = controllerName.ToLower(),
            AreaName = "Main",
            IsClosed = false,
            IsSaasUser = true,
            AvailablePermissionAreas = new List<PermissionArea> { permissionArea },
            CustomPermissionArea = permissionArea,
            CustomAddons = new List<Addon> { addon }
        };

        return Task.FromResult<IViewComponentResult>(View("_SidebarMenu", menuViewModel));
    }
}
