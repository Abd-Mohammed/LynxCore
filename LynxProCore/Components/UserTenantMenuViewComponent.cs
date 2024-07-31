using Lynx.Models;
using Microsoft.AspNetCore.Mvc;

namespace LynxProCore.Components;

public class UserTenantMenuViewComponent : ViewComponent
{
    public Task<IViewComponentResult> InvokeAsync(string controllerName)
    {
        var userTenantMenuViewModel = new UserTenantMenuViewModel
        {
            ActiveName = "AbdelRahman Odeh",
            Tenants = [
                new ApplicationUserTenant
                {
                    Name = "Test 1",
                    DisplayName = "Test 1",
                    TenantId = 22
                },
                new ApplicationUserTenant
                {
                    Name = "Test 2",
                    DisplayName = "Test 2",
                    TenantId = 22
                }
            ]
        };

        return Task.FromResult<IViewComponentResult>(View("_UserTenantMenu", userTenantMenuViewModel));
    }
}