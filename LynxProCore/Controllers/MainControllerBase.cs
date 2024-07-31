using Kendo.Mvc;
using LynxProCore.Helpers;
using Microsoft.AspNetCore.Mvc;
using static LynxProCore.Helpers.AlertFactory;

namespace LynxProCore.Controllers;
public class MainControllerBase : Controller
{
    protected virtual void BootstrapAlert(AlertFactory.AlertType alertType, string message)
    {
        TempData["BootstrapAlert"] = Create(alertType, message);
    }

    protected virtual void BootstrapAlert(AlertFactory.AlertType alertType, string title, params string[] messages)
    {
        TempData["BootstrapAlert"] = Create(alertType, title, messages);
    }

    protected string ExtractSort(IList<SortDescriptor> sortDiscriptors)
    {
        var firstSortDescriptor = sortDiscriptors.FirstOrDefault();
        if (firstSortDescriptor == null)
        {
            throw new Exception("Sort descriptor cannot be null.");
        }

        var sortDir = firstSortDescriptor.SortDirection == ListSortDirection.Ascending ? "asc" : "desc";
        return $"{firstSortDescriptor.Member}-{sortDir}";
    }

    protected T? ExtractFilter<T>(IList<IFilterDescriptor> filterDescriptors, string member) where T : struct
    {
        foreach (var filter in filterDescriptors)
        {
            if (filter is CompositeFilterDescriptor)
            {
                var compositeFilter = (CompositeFilterDescriptor)filter;
                var tvalue = ExtractFilter<T>(compositeFilter.FilterDescriptors.ToList(), member);
                if (tvalue != null)
                {
                    return tvalue;
                }
            }
            else
            {
                var filterDescriptor = (FilterDescriptor)filter;
                if (filterDescriptor.Member.Equals(member))
                {
                    if (typeof(T).IsEnum)
                    {
                        return (T)Convert.ChangeType(filterDescriptor.Value, typeof(int));
                    }
                    else
                    {
                        return (T)Convert.ChangeType(filterDescriptor.Value, typeof(T));
                    }
                }
            }
        }

        return null;
    }

    protected void ExtractFilters<T>(IList<IFilterDescriptor> filterDescriptors, string member, ICollection<T?> values) where T : struct
    {
        foreach (var filter in filterDescriptors)
        {
            if (filter is CompositeFilterDescriptor)
            {
                var compositeFilter = (CompositeFilterDescriptor)filter;
                ExtractFilters(compositeFilter.FilterDescriptors.ToList(), member, values);
            }
            else
            {
                var filterDescriptor = (FilterDescriptor)filter;
                if (filterDescriptor.Member.Equals(member))
                {
                    if (typeof(T).IsEnum)
                    {
                        values.Add((T)Convert.ChangeType(filterDescriptor.Value, typeof(int)));
                    }
                    else if (filterDescriptor.Value != null)
                    {
                        values.Add((T)Convert.ChangeType(filterDescriptor.Value, typeof(T)));
                    }
                    else
                    {
                        values.Add(null);
                    }
                }
            }
        }
    }

    protected string ExtractFilter(IList<IFilterDescriptor> filterDescriptors, string member)
    {
        foreach (var filter in filterDescriptors)
        {
            if (filter is CompositeFilterDescriptor)
            {
                var compositeFilter = (CompositeFilterDescriptor)filter;
                var svalue = ExtractFilter(compositeFilter.FilterDescriptors.ToList(), member);
                if (svalue != null)
                {
                    return svalue;
                }
            }
            else
            {
                var filterDescriptor = (FilterDescriptor)filter;
                if (filterDescriptor.Member.Equals(member))
                {
                    return filterDescriptor.Value.ToString().Trim();
                }
            }
        }

        return null;
    }
}
