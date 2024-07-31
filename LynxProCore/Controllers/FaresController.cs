using Kendo.Mvc.UI;
using Lynx.BusinessLogic;
using Lynx.Utils.ComponentModel;
using Lynx.Utils.Globalization;
using LynxProCore.Adapters;
using LynxProCore.Adapters.Responses;
using LynxProCore.Helpers;
using LynxProCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using Currency = Lynx.Models.Currency;


namespace LynxProCore.Controllers;

public class FaresController(
    FareAdapter fareAdapter,
    CityAdapter cityAdapter,
    RideTypeAdapter rideTypeAdapter,
    IWebHostEnvironment webHostEnvironment) : MainControllerBase
{
    private readonly string _colorsJsonPath = "~/wwwroot/json/color-picker-colors.json";

    [HttpGet("Container/Fares")]
    public IActionResult Index()
    {
        return View();
    }
    public async Task<IActionResult> Read([DataSourceRequest] DataSourceRequest request, CancellationToken cancellationToken)
    {
        var orderBy = ExtractSort(request.Sorts);
        var cityName = ExtractFilter(request.Filters, "City.Name");
        var cityFares = await fareAdapter.GetFaresAsync(cityName, request.Page, request.PageSize, orderBy, cancellationToken);
        if (!cityFares.IsSuccess)
        {
            return Json(new DataSourceResult());
        }

        return Json(new DataSourceResult
        {
            Data = cityFares.Fares.Select(c => new
            {
                CityFareId = c.Id,
                CityId = c.City?.Id,
                Color = c.Settings?.Color,
                BaseFare = c.BaseFare.ToMoney("").Text,
                City = new CityViewModel { Name = c.City.Name },
                RideType = new RideTypeViewModel { Name = c.RideType.Name },
                ModifiedDate = c.ModifiedDate,
                CreatedDate = c.CreatedDate
            }),
            Total = cityFares.Pagination.TotalItemCount,
        });
    }

    public async Task<IActionResult> Details(int id, CancellationToken cancellationToken)
    {
        var cityFare = await fareAdapter.GetFareAsync(id, cancellationToken);
        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        return View(ToViewModel(cityFare));
    }

    [HttpGet]
    public async Task<IActionResult> Create(CancellationToken cancellationToken)
    {
        await MakeViewDataAsync(cancellationToken: cancellationToken);

        return View(new FareViewModel());
    }

    [HttpPost]
    public async Task<IActionResult> Create(FareViewModel model, CancellationToken cancellationToken)
    {
        ModelState.Remove("City");
        ModelState.Remove("CreatedBy");
        ModelState.Remove("Schedules");
        ModelState.Remove("ModifiedBy");
        ModelState.Remove("ExtraCharges");
        ModelState.Remove("TransitCharges");
        ModelState.Remove("RideType");

        if (!ModelState.IsValid)
        {
            await MakeViewDataAsync(cancellationToken: cancellationToken);

            return View(model);
        }

        if (model.Schedules != null)
        {
            if (CheckPeriodOverlaps(model.Schedules))
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare, the Fare schedules periods are overlapped");
                await MakeViewDataAsync(cancellationToken: cancellationToken);

                return View(model);
            }
        }

        if (model.ExtraCharges?.GroupBy(a => a.Name).Count() != model.ExtraCharges?.Count())
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare, extra charge names must be unique.");
            await MakeViewDataAsync(cancellationToken: cancellationToken);

            return View(model);
        }

        if (model.TransitCharges?.Any(a => a.CityId == model.CityId) ?? false)
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare, transit origin and destination should be different.");
            await MakeViewDataAsync(cancellationToken: cancellationToken);

            return View(model);
        }

        var extraCharges = model.ExtraCharges?.ToList() ?? [];
        var transitCharges = model.TransitCharges?.ToList() ?? [];
        var transitChargesWithoutCity = transitCharges.Count(s => s.CityId is null);
        if ((transitCharges.GroupBy(tc => tc.CityId).Count() != transitCharges.Count)
            || (transitChargesWithoutCity > 0 && transitChargesWithoutCity < transitCharges.Count))
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare ,due to conflict in transit charges.");
            await MakeViewDataAsync(cancellationToken: cancellationToken);

            return View(model);
        }

        var fare = await fareAdapter.CreateFareAsync(ToViewModel(model, extraCharges, transitCharges), cancellationToken);
        if (fare.IsSuccess)
        {
            BootstrapAlert(AlertFactory.AlertType.Success, "Fare has been added.");
            return RedirectToAction("Index");
        }

        switch (fare.ResultStatus)
        {
            case "OVERLAPPED_FARE":
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare, fare overlaps with other fares by city, ride type or schedule periods.");
                break;
            case "INVALID_TRANSIT":
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not add fare ,No match found for transit city.");
                break;
            default:
                BootstrapAlert(AlertFactory.AlertType.Error, "Failed to add fare.");
                break;
        }


        await MakeViewDataAsync(cancellationToken: cancellationToken);

        return View(model);
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id, CancellationToken cancellationToken)
    {
        var cityFare = await fareAdapter.GetFareAsync(id, cancellationToken);
        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        await MakeViewDataAsync(cancellationToken: cancellationToken);

        var viewModel = ToViewModel(cityFare);

        return View(viewModel);
    }

    [HttpPost]
    public async Task<IActionResult> Edit(FareViewModel model, CancellationToken cancellationToken)
    {
        ModelState.Remove("City");
        ModelState.Remove("CreatedBy");
        ModelState.Remove("Schedules");
        ModelState.Remove("ModifiedBy");
        ModelState.Remove("ExtraCharges");
        ModelState.Remove("RideType");
        ModelState.Remove("TransitCharges");

        if (ModelState.IsValid)
        {
            if (model.Schedules != null)
            {
                if (CheckPeriodOverlaps(model.Schedules))
                {
                    BootstrapAlert(AlertFactory.AlertType.Warning, "Could not edit fare, the Fare schedules periods are overlapped]]]]");
                    await MakeViewDataAsync(cancellationToken: cancellationToken);

                    return View(model);
                }
            }

            if (model.ExtraCharges?.GroupBy(a => a.Name).Count() != model.ExtraCharges?.Count())
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not edit fare, extra charge names must be unique.]]]]");
                await MakeViewDataAsync(cancellationToken: cancellationToken);

                return View(model);
            }

            if (model.TransitCharges?.Any(a => a.CityId == model.CityId) ?? false)
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not update fare, transit origin and destination should be different.]]]]");
                await MakeViewDataAsync(cancellationToken: cancellationToken);

                return View(model);
            }

            var extraCharges = model.ExtraCharges?.ToList() ?? new List<ExtraChargeViewModel>();
            var transitCharges = model.TransitCharges?.ToList() ?? new List<TransitChargeViewModel>();
            var transitChargesWithoutCity = transitCharges.Count(s => s.CityId == null);
            if ((transitCharges.GroupBy(tc => tc.CityId).Count() != transitCharges.Count())
                || (transitChargesWithoutCity > 0 && transitChargesWithoutCity < transitCharges.Count()))
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not update fare ,due to conflict in transit charges.]]]]");
                await MakeViewDataAsync(cancellationToken: cancellationToken);

                return View(model);
            }

            var fare = await fareAdapter.UpdateFareAsync(model.CityFareId, ToViewModel(model, extraCharges, transitCharges), cancellationToken);
            if (fare.IsSuccess)
            {
                BootstrapAlert(AlertFactory.AlertType.Success, "[[[[Fare has been updated.]]]]");

                return RedirectToAction(nameof(Index));
            }

            switch (fare.ResultStatus)
            {
                case "OVERLAPPED_FARE":
                    BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not update fare, fare overlaps with other fares by city, ride type or schedule periods.]]]]");
                    break;
                case "INVALID_TRANSIT":
                    BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not update fare, No match found for transit city.]]]]");
                    break;
                default:
                    BootstrapAlert(AlertFactory.AlertType.Error, "[[[[Failed to update fare.]]]]");
                    break;
            }
        }
        await MakeViewDataAsync(cancellationToken: cancellationToken);

        return View(model);
    }

    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var cityFare = await fareAdapter.GetFareAsync(id, cancellationToken);

        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        return PartialView("_Delete", new FareViewModel { CityFareId = cityFare.Id, });
    }

    [HttpPost]
    [ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id, CancellationToken cancellationToken)
    {
        var response = await fareAdapter.DeleteFareAsync(id, cancellationToken);
        if (response.IsSuccess)
        {
            BootstrapAlert(AlertFactory.AlertType.Success, "Fare has been deleted.");
        }
        else if (!string.IsNullOrEmpty(response.ResultStatus))
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, $"{response.ResultStatus}");
        }
        else
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "Failed to delete fare.");
        }

        return RedirectToAction("Index");
    }

    private async Task MakeViewDataAsync(string currentCode = null, CancellationToken cancellationToken = default)
    {
        var colors = GetColors();
        ViewData["Colors"] = colors.GetValue("dark")?.ToObject<List<string>>();

        var cityResponse = await cityAdapter.GetCitiesAsync(null, sortOrder: "Name", cancellationToken: cancellationToken);
        if (cityResponse.IsSuccess)
        {
            ViewData["citiesList"] = new SelectList(cityResponse.Cities, "Id", "Name");
            ViewData["MasterCities"] = new SelectList(cityResponse.Cities.Select(c => new TransitChargeViewModel
            {
                CityId = c.Id,
                CityName = c.Name,
            }), "CityId", "CityName");

            ViewData["RawMasterCities"] = cityResponse.Cities.Select(c => new TransitChargeViewModel
            {
                CityId = c.Id,
                CityName = c.Name,
            });
        }
        else
        {
            ViewData["citiesList"] = new SelectList(new List<GoCityResponse>(), "Id", "Name");
            ViewData["MasterCities"] = new SelectList(new List<TransitChargeViewModel>(), "CityId", "CityName");
            ViewData["RawMasterCities"] = new List<TransitChargeViewModel>();
        }

        ViewData["DayOfWeek"] = new SelectList(Enum.GetValues(typeof(DayOfWeek)).Cast<System.DayOfWeek>(), System.DayOfWeek.Sunday);

        var currencies = new List<Currency>
        {
            new()
            {
                Name = "Dollars",
                Code = "USD"
            },
            new()
            {
                Name = "Euro",
                Code = "EUR"
            },
            new()
            {
                Name = "Pounds",
                Code = "GBP"
            },
            new()
            {
                Name = "Yen",
                Code = "JPY"
            },
            new()
            {
                Name = "Jordan Denars",
                Code = "JOD"
            },
            new()
            {
                Name = "UAE Dirham",
                Code = "AED"
            },
            new()
            {
                Name = "Saudi Riyal",
                Code = "SAR"
            }
        };
        ViewData["currenciesList"] = new SelectList(currencies.Select(c => new { c.Code, Name = $"{c.Name} ({c.Code})" }), "Code", "Name");

        var rideTypeResponse = await rideTypeAdapter.GetRideTypesAsync(sortOrder: "name", cancellationToken: cancellationToken);
        if (rideTypeResponse.IsSuccess)
        {
            ViewData["rideTypesList"] = new SelectList(rideTypeResponse.RideTypes, "Id", "Name");
        }
        else
        {
            ViewData["rideTypesList"] = new SelectList(new List<RideTypeViewModel>(), "Id", "Name");
        }
    }

    private static FareViewModel ToViewModel(GoFareResponse fare)
    {
        var fareViewModel = new FareViewModel
        {
            CityFareId = fare.Id,
            BaseFare = fare.BaseFare.ToMoney().Value,
            MinimumFare = fare.MinimumFare.ToMoney().Value,
            BookingFee = fare.BookingFee.ToMoney().Value,
            CityId = fare?.City?.Id ?? 0,
            CostPerDistance = fare.CostPerDistance.ToMoney().Value,
            CostPerMinute = fare.CostPerMinute.ToMoney().Value,
            RideTypeId = fare?.RideType?.Id ?? 0,
            Color = fare.Settings.Color,
            City = new CityViewModel { Name = fare.City.Name },
            RideType = new RideTypeViewModel { Name = fare.RideType.Name },
            ExtraCharges = fare.ExtraCharges.Count > 0 ?
                fare.ExtraCharges.Select(c => new ExtraChargeViewModel() { Fee = c.Fee, Name = c.Name }).ToArray() :
                [],
            TransitCharges = fare.TransitCharges.Count > 0 ?
                fare.TransitCharges.Select(c => new TransitChargeViewModel() { Fee = c.Fee, CityId = c.City?.Id, CityName = c.City?.Name }).ToArray() :
                [],
            WaitTimeChargePerMinute = fare.WaitTimeChargePerMinute,
            WaitTimeThreshold = fare.WaitTimeThreshold,
            Schedules = fare.Settings.Schedules.Count > 0 ?
            fare.Settings.Schedules.Select(s => new FareScheduleRequest()
            {
                DayOfWeek = GetModelsDayOfWeek((int)s.DayOfWeek),
                From = s.From,
                To = s.To
            }).ToList() : [],
            CreatedBy = fare.CreatedBy,
            ModifiedBy = fare.ModifiedBy,
            CreatedDate = fare.CreatedDate,
            ModifiedDate = fare.ModifiedDate,
        };

        return fareViewModel;
    }

    private static DayOfWeek GetModelsDayOfWeek(int index)
    {
        if (index == 0)
        {
            return DayOfWeek.Sunday;
        }
        return (DayOfWeek)index;
    }

    private static DayOfWeek GetSystemDayOfWeek(int index)
    {
        if (index == 7)
        {
            return System.DayOfWeek.Sunday;
        }

        return (System.DayOfWeek)index;
    }

    private static CreateFareRequest ToViewModel(FareViewModel cityFare, List<ExtraChargeViewModel> extraCharges, List<TransitChargeViewModel> transitCharges)
    {
        var fare = new CreateFareRequest
        {
            BaseFare = cityFare.BaseFare,
            BookingFee = cityFare.BookingFee,
            CostPerMinute = cityFare.CostPerMinute,
            CostPerDistance = cityFare.CostPerDistance,
            LengthUnit = FareDistanceUnitViewModel.Kilometer,
            MinimumFare = cityFare.MinimumFare,
            WaitTimeChargePerMinute = cityFare.WaitTimeChargePerMinute,
            WaitTimeThreshold = cityFare.WaitTimeThreshold,
            Settings = new Settings
            {
                Color = cityFare.Color,
                Schedules = []

            },
            CityId = cityFare?.CityId ?? 0,
            RideTypeId = cityFare.RideTypeId,
            ExtraCharges = [],
            TransitCharges = []
        };

        foreach (var extracharge in extraCharges)
        {
            fare.ExtraCharges.Add(new ExtraChargeResponse
            {
                Fee = extracharge.Fee,
                Name = extracharge.Name,
            });
        }

        foreach (var transitCharge in transitCharges)
        {
            fare.TransitCharges.Add(new TransitChargeRequest
            {
                Fee = transitCharge.Fee,
                CityId = transitCharge.CityId
            });
        }

        if (cityFare.Schedules is null)
        {
            return fare;
        }

        foreach (var fareSchedule in cityFare.Schedules)
        {
            fare.Settings.Schedules.Add(new FareScheduleResponse
            {
                DayOfWeek = GetSystemDayOfWeek((int)fareSchedule.DayOfWeek),
                From = Convert.ToDateTime(fareSchedule.From).ToString("HH:mm:ss"),
                To = Convert.ToDateTime(fareSchedule.To).ToString("HH:mm:ss")
            });

        }

        return fare;
    }

    public IActionResult GetSchedules(int index) => PartialView("_Schedules", new FareScheduleRequest() { Index = index });

    private async Task<string> GetDefaultCurrencyCode(string currentCode, bool isEditMode)
    {
        var currencies = await new TenantCurrencyManager(22).GetTenantCurrenciesAsync();

        if (!isEditMode)
        {
            if (currencies.Count() == 1)
            {
                return currencies.First().Code;
            }
            else
            {
                return null;
            }
        }

        // If the old code does not exists anymore then fall back to select.
        if (!currencies.Any(c => c.Code.Equals(currentCode)))
        {
            return currencies.First().Code;
        }
        else if (currencies.Count() == 1)
        {
            return currencies.First().Code;
        }

        return currentCode;
    }

    private static bool CheckPeriodOverlaps(List<FareScheduleRequest> fareSchedulePeriods)
    {
        var fareScheduleSamePeriods = fareSchedulePeriods.GroupBy(a => a.DayOfWeek);

        return (from periods in fareScheduleSamePeriods
                select periods.Select(a => a) into period
                where period.Count() > 1
                let timeSpanRange = new TimeSpanRange(ConvertToTimespan(period.First().From), ConvertToTimespan(period.First().To))
                where timeSpanRange.IntersectsOrEqual(new TimeSpanRange(ConvertToTimespan(period.Last().From), ConvertToTimespan(period.Last().To)), true)
                select period).Any();
    }

    private JObject GetColors() => JsonConvert.DeserializeObject<JObject>(System.IO.File.ReadAllText(Path.Combine(webHostEnvironment.WebRootPath, "json", "color-picker-colors.json")))!;

    private static TimeSpan ConvertToTimespan(string text)
    {
        var dateTime = DateTime.ParseExact(text, "h:mm tt", CultureInfo.InvariantCulture);

        return dateTime.TimeOfDay;
    }
}
