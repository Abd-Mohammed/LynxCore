using System.Globalization;
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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Currency = Lynx.Models.Currency;
using Microsoft.AspNetCore.Mvc.Filters;
using Telerik.SvgIcons;
using Microsoft.AspNetCore.Hosting;

namespace LynxProCore.Controllers;

public class FaresController : MainControllerBase
{
    private readonly FareAdapter _fareAdapter;
    private readonly CityAdapter _cityAdapter;
    private readonly RideTypeAdapter _rideTypeAdapter;
    private readonly string _colorsJsonPath = "~/wwwroot/json/color-picker-colors.json";
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FaresController(FareAdapter fareAdapter, CityAdapter cityAdapter, RideTypeAdapter rideTypeAdapter, IWebHostEnvironment webHostEnvironment)
    {
        _fareAdapter = fareAdapter;
        _cityAdapter = cityAdapter;
        _rideTypeAdapter = rideTypeAdapter;
        _webHostEnvironment = webHostEnvironment;
    }

    [HttpGet("Container/Fares")]
    public ActionResult Index()
    {
        return View();
    }
    public async Task<IActionResult> Read([DataSourceRequest] DataSourceRequest request)
    {
        var orderBy = ExtractSort(request.Sorts);
        var cityName = ExtractFilter(request.Filters, "City.Name");
        var cityFares = await _fareAdapter.GetFaresAsync(cityName, request.Page, request.PageSize, orderBy);
        if (!cityFares.IsSuccess)
        {
            return Json(new DataSourceResult());
        }

        return Json(new DataSourceResult()
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

    public async Task<ActionResult> Details(int id)
    {
        var cityFare = await _fareAdapter.GetFareAsync(id);
        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        return View(ToViewModel(cityFare));
    }

    [HttpGet]
    public async Task<ActionResult> Create()
    {
        await MakeViewDataAsync();

        return View(new FareViewModel());
    }

    [HttpPost]
    public async Task<ActionResult> Create(FareViewModel model)
    {
        ModelState.Remove("City");
        ModelState.Remove("CreatedBy");
        ModelState.Remove("Schedules");
        ModelState.Remove("ModifiedBy");
        ModelState.Remove("ExtraCharges");
        ModelState.Remove("TransitCharges");

        if (!ModelState.IsValid)
        {
            await MakeViewDataAsync();

            return View(model);
        }

        if (model.Schedules != null)
        {
            if (CheckPeriodOverlaps(model.Schedules))
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare, the Fare schedules periods are overlapped]]]]");
                await MakeViewDataAsync();

                return View(model);
            }
        }

        if (model.ExtraCharges?.GroupBy(a => a.Name).Count() != model.ExtraCharges?.Count())
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare, extra charge names must be unique.]]]]");
            await MakeViewDataAsync();

            return View(model);
        }

        if (model.TransitCharges?.Any(a => a.CityId == model.CityId) ?? false)
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare, transit origin and destination should be different.]]]]");
            await MakeViewDataAsync();

            return View(model);
        }

        var extraCharges = model.ExtraCharges?.ToList() ?? new List<ExtraChargeViewModel>();
        var transitCharges = model.TransitCharges?.ToList() ?? new List<TransitChargeViewModel>();
        var transitChargesWithoutCity = transitCharges.Where(s => s.CityId == null).Count();
        if ((transitCharges.GroupBy(tc => tc.CityId).Count() != transitCharges.Count())
            || (transitChargesWithoutCity > 0 && transitChargesWithoutCity < transitCharges.Count()))
        {
            BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare ,due to conflict in transit charges.]]]]");
            await MakeViewDataAsync();

            return View(model);
        }

        var fare = await _fareAdapter.CreateFareAsync(ToViewModel(model, extraCharges, transitCharges));
        if (fare.IsSuccess)
        {
            BootstrapAlert(AlertFactory.AlertType.Success, "[[[[Fare has been added.]]]]");
            return RedirectToAction("Index");
        }

        switch (fare.ResultStatus)
        {
            case "OVERLAPPED_FARE":
                BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare, fare overlaps with other fares by city, ride type or schedule periods.]]]]");
                break;
            case "INVALID_TRANSIT":
                BootstrapAlert(AlertFactory.AlertType.Warning, "[[[[Could not add fare ,No match found for transit city.]]]]");
                break;
            default:
                BootstrapAlert(AlertFactory.AlertType.Error, "[[[[Failed to add fare.]]]]");
                break;
        }


        await MakeViewDataAsync();

        return View(model);
    }

    [HttpGet]
    public async Task<ActionResult> Edit(int id)
    {
        var cityFare = await _fareAdapter.GetFareAsync(id);
        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        await MakeViewDataAsync();

        var viewModel = ToViewModel(cityFare);

        return View(viewModel);
    }

    [HttpPost]
    public async Task<ActionResult> Edit(FareViewModel model)
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
                    await MakeViewDataAsync();

                    return View(model);
                }
            }

            if (model.ExtraCharges?.GroupBy(a => a.Name).Count() != model.ExtraCharges?.Count())
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not edit fare, extra charge names must be unique.]]]]");
                await MakeViewDataAsync();

                return View(model);
            }

            if (model.TransitCharges?.Any(a => a.CityId == model.CityId) ?? false)
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not update fare, transit origin and destination should be different.]]]]");
                await MakeViewDataAsync();

                return View(model);
            }

            var extraCharges = model.ExtraCharges?.ToList() ?? new List<ExtraChargeViewModel>();
            var transitCharges = model.TransitCharges?.ToList() ?? new List<TransitChargeViewModel>();
            var transitChargesWithoutCity = transitCharges.Where(s => s.CityId == null).Count();
            if ((transitCharges.GroupBy(tc => tc.CityId).Count() != transitCharges.Count())
                || (transitChargesWithoutCity > 0 && transitChargesWithoutCity < transitCharges.Count()))
            {
                BootstrapAlert(AlertFactory.AlertType.Warning, "Could not update fare ,due to conflict in transit charges.]]]]");
                await MakeViewDataAsync();

                return View(model);
            }

            var fare = await _fareAdapter.UpdateFareAsync(model.CityFareId, ToViewModel(model, extraCharges, transitCharges));
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
        await MakeViewDataAsync();

        return View(model);
    }

    public async Task<ActionResult> Delete(int id)
    {
        var cityFare = await _fareAdapter.GetFareAsync(id);

        if (!cityFare.IsSuccess)
        {
            return NotFound();
        }

        return PartialView("_Delete", new FareViewModel() { CityFareId = cityFare.Id, });
    }

    [HttpPost]
    [ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> DeleteConfirmed(int id)
    {
        var response = await _fareAdapter.DeleteFareAsync(id);
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

    private async Task MakeViewDataAsync(string currentCode = null)
    {
        var colors = GetColors();
        ViewData["Colors"] = colors.GetValue("dark")?.ToObject<List<string>>();

        var cityResponse = await _cityAdapter.GetCitiesAsync(null, sortOrder: "Name");
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

        ViewData["DayOfWeek"] = new SelectList(Enum.GetValues(typeof(System.DayOfWeek)).Cast<System.DayOfWeek>(), System.DayOfWeek.Sunday);

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

        var rideTypeResponse = await _rideTypeAdapter.GetRideTypesAsync(sortOrder: "name");
        if (rideTypeResponse.IsSuccess)
        {
            ViewData["rideTypesList"] = new SelectList(rideTypeResponse.RideTypes, "Id", "Name");
        }
        else
        {
            ViewData["rideTypesList"] = new SelectList(new List<RideTypeViewModel>(), "Id", "Name");
        }
    }

    private FareViewModel ToViewModel(GoFareResponse fare)
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
            }).ToList() : new List<FareScheduleRequest>(),
            CreatedBy = fare.CreatedBy,
            ModifiedBy = fare.ModifiedBy,
            CreatedDate = fare.CreatedDate,
            ModifiedDate = fare.ModifiedDate,
        };

        return fareViewModel;
    }

    private DayOfWeek GetModelsDayOfWeek(int index)
    {
        if (index == 0)
        {
            return DayOfWeek.Sunday;
        }
        return (DayOfWeek)index;
    }

    private System.DayOfWeek GetSystemDayOfWeek(int index)
    {
        if (index == 7)
        {
            return System.DayOfWeek.Sunday;
        }

        return (System.DayOfWeek)index;
    }

    private CreateFareRequest ToViewModel(FareViewModel cityFare, List<ExtraChargeViewModel> extraCharges, List<TransitChargeViewModel> transitCharges)
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
            Settings = new Settings()
            {
                Color = cityFare.Color,
                Schedules = new List<FareScheduleResponse>()

            },
            CityId = cityFare?.CityId ?? 0,
            RideTypeId = cityFare.RideTypeId,
            ExtraCharges = new List<ExtraChargeResponse>(),
            TransitCharges = new List<TransitChargeRequest>()
        };

        foreach (var extracharge in extraCharges)
        {
            fare.ExtraCharges.Add(new ExtraChargeResponse()
            {
                Fee = extracharge.Fee,
                Name = extracharge.Name,
            });
        }

        foreach (var transitCharge in transitCharges)
        {
            fare.TransitCharges.Add(new TransitChargeRequest()
            {
                Fee = transitCharge.Fee,
                CityId = transitCharge.CityId
            });
        }

        if (cityFare.Schedules != null)
        {
            foreach (var fareSchedule in cityFare.Schedules)
            {
                fare.Settings.Schedules.Add(new FareScheduleResponse()
                {
                    DayOfWeek = GetSystemDayOfWeek((int)fareSchedule.DayOfWeek),
                    From = Convert.ToDateTime(fareSchedule.From).ToString("HH:mm:ss"),
                    To = Convert.ToDateTime(fareSchedule.To).ToString("HH:mm:ss")
                });

            }
        }

        return fare;
    }

    public ActionResult GetSchedules(int index)
    {
        return PartialView("_Schedules", new FareScheduleRequest() { Index = index });
    }

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


    private bool CheckPeriodOverlaps(List<FareScheduleRequest> fareSchedulePeriods)
    {
        var fareScheduleSamePeriods = fareSchedulePeriods.GroupBy(a => a.DayOfWeek);
        foreach (var periods in fareScheduleSamePeriods)
        {
            var period = periods.Select(a => a);
            if (period.Count() > 1)
            {
                TimeSpanRange timeSpanRange;
                timeSpanRange = new TimeSpanRange(ConvertToTimespan(period.First().From), ConvertToTimespan(period.First().To));
                if (timeSpanRange.IntersectsOrEqual(new TimeSpanRange(ConvertToTimespan(period.Last().From), ConvertToTimespan(period.Last().To)), true))
                {
                    return true;
                }
            }
        }
        return false;
    }

    private JObject GetColors()
    {
        return JsonConvert.DeserializeObject<JObject>(System.IO.File.ReadAllText(Path.Combine(_webHostEnvironment.WebRootPath, "json", "color-picker-colors.json")));
    }
    private TimeSpan ConvertToTimespan(string text)
    {
        DateTime dateTime = DateTime.ParseExact(text,
                                "h:mm tt", CultureInfo.InvariantCulture);
        return dateTime.TimeOfDay;
    }


}
