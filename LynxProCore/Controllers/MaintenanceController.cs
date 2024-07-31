using Kendo.Mvc.UI;
using Lynx.Models;
using LynxProCore.Helpers;
using LynxProCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace LynxProCore.Controllers;

public class MaintenanceController : MainControllerBase
{
    [HttpGet("Container/Maintenance")]
    public ActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> Read([DataSourceRequest] DataSourceRequest request)
    {

        var services = new List<MaintenanceService>
        {
            new MaintenanceService
            {
                MaintenanceServiceId = 1,
                InvoiceReferenceNo = Guid.NewGuid().ToString(),
                Date = DateTime.UtcNow,
                Cost = 12.2,
                Notes = "Test only",
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                Driver = new Driver
                {
                    StaffId = Guid.NewGuid().ToString()
                },
                Odometer = 11,
                MaintenanceServiceType = new MaintenanceServiceType
                {
                    Name = "Testing"
                },
                Vehicle = new Vehicle
                {
                    Name = "Abd Vehicle"
                }
            }
        };


        return Json(new DataSourceResult
        {
            Data = services.Select(c => new
            {
                MaintenanceServiceId = c.MaintenanceServiceId,
                InvoiceReferenceNo = c.InvoiceReferenceNo,
                Date = c.Date,
                Cost = c.Cost,
                Notes = c.Notes,
                Odometer = c.Odometer,
                MaintenanceServiceType = new { Name = c.MaintenanceServiceType.Name },
                Vehicle = new { Name = c.Vehicle.Name },
                Driver = new { StaffId = c.Driver != null ? c.Driver.StaffId : null },
                CreatedDate = c.CreatedDate,
                ModifiedDate = c.ModifiedDate,
            }),
            Total = 1
        });
    }

    public IActionResult Create()
    {
        SetViewData();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create([Bind("Provider,InvoiceReferenceNo,Date,Cost,Notes,VehicleId,DriverId,MaintenanceServiceTypeId,InitialInspection,FinalInspection,MaintenanceServiceParts")] MaintenanceServiceViewModel maintenanceViewModel)
    {
        if (ModelState.IsValid)
        {
            var model = ToModel(maintenanceViewModel);

            model.CreatedBy = model.ModifiedBy = "a.odeh";
            model.CreatedDate = model.ModifiedDate = DateTime.UtcNow;
            if (true)
            {
                BootstrapAlert(AlertFactory.AlertType.Success, "Maintenance service has been added.");
                return RedirectToAction("Index");
            }
        }

        BootstrapAlert(AlertFactory.AlertType.Error, "Filed to add maintenance service.");
        SetViewData();
        return View(maintenanceViewModel);
    }

    [HttpGet]
    public IActionResult GetDrivers(string text)
    {
        var drivers = new List<Driver>
        {
            new Driver
            {
                DriverId = 1,
                FirstName = "abd",
                LastName = "odeh",
                StaffId = "000001, "
            },
            new Driver
            {
                DriverId = 2,
                FirstName = "abd2",
                LastName = "odeh2",
                StaffId = "000002"
            }
        };

        return Json(drivers.Select(v => new { DriverId = v.DriverId, Name = $"{v.LastName} {v.FirstName} ({v.StaffId})" }));
    }

    [HttpGet]
    public IActionResult GetVehicles(string text)
    {
        var allVehicles = new List<Vehicle>()
        {
            new Vehicle
            {
                VehicleId = 1, 
                Name = "vehicle 1"
            },
            new Vehicle
            {
                VehicleId = 2,
                Name = "vehicle 2"
            }
        };

        return Json(allVehicles.Select(v => new { VehicleId = v.VehicleId, Name = v.Name }));
    }

    private void SetViewData()
    {
        ViewData["MaxDate"] = DateTime.UtcNow;
        var maintenanceService = new List<MaintenanceServiceType>
        {
            new MaintenanceServiceType
            {
                MaintenanceServiceTypeId = 1,
                Name = "Minor Service",
                IsFull = true,
                CreatedBy = "a.odeh",
                CreatedDate = DateTime.UtcNow,
                ModifiedBy = "a.odeh",
                TenantId = 123,
                ModifiedDate = DateTime.UtcNow.AddDays(10)
            }
        };

        ViewData["MaintenanceServiceTypesList"] = new SelectList(maintenanceService, "MaintenanceServiceTypeId", "Name");
    }

    private static MaintenanceService ToModel(MaintenanceServiceViewModel viewModel)
    {
        var model = new MaintenanceService
        {
            InvoiceReferenceNo = viewModel.InvoiceReferenceNo,
            Date = viewModel.Date,
            Cost = viewModel.Cost,
            Notes = viewModel.Notes,
            DriverId = viewModel.DriverId,
            VehicleId = viewModel.VehicleId,
            Provider = viewModel.Provider,
            MaintenanceServiceTypeId = viewModel.MaintenanceServiceTypeId,
            InitialInspection = viewModel.InitialInspection,
            FinalInspection = viewModel.FinalInspection,
            MaintenanceServiceParts = viewModel.MaintenanceServiceParts.Where(sp => sp.Name != null && sp.Quantity.HasValue).Select(mi =>
                new MaintenanceServicePart
                {
                    Cost = mi.Cost ?? 0,
                    Name = mi.Name,
                    Quantity = mi.Quantity.Value,
                }).ToList()
        };
        return model;
    }
}
