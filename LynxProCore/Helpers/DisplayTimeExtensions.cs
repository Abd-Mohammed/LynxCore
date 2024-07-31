using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq.Expressions;

namespace LynxProCore.Helpers
{
    [Flags]
    public enum TimeDurationFormat
    {
        None = 0,
        Months = 1,
        Days = 2,
        Hours = 4,
        Minutes = 8,
        Seconds = 16,
    }

    public static class DisplayTimeExtensions
    {
        public static IHtmlContent DisplayLocalTimeFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string cultureName, string timeZoneId)
        {
            return DisplayLocalTimeFor(htmlHelper, expression, "g", cultureName, timeZoneId);
        }

        public static IHtmlContent DisplayLocalDateFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string cultureName, string timeZoneId)
        {
            return DisplayLocalTimeFor(htmlHelper, expression, "d", cultureName, timeZoneId);
        }

        public static IHtmlContent DisplayTimeSpanFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string cultureName)
        {
            return DisplayTimeSpanFor(htmlHelper, expression, "t", cultureName);
        }

        public static IHtmlContent DisplayFormattedTimeSpanFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, TimeDurationFormat format = TimeDurationFormat.None)
        {
            var model = htmlHelper.ViewData.Model;
            var timeSpanValue = expression.Compile().Invoke((TModel)model);

            var timeSpan = timeSpanValue as TimeSpan?;

            if (timeSpan == null)
            {
                return HtmlString.Empty;
            }

            var timeDuration = timeSpan.Value;
            var template = new List<string>();

            if (format.HasFlag(TimeDurationFormat.Days) || timeDuration.Days > 0)
            {
                template.Add("{d} [[[[d]]]]");
            }

            if (format.HasFlag(TimeDurationFormat.Hours) || timeDuration.Hours > 0)
            {
                template.Add("{h} [[[[h]]]]");
            }

            if (format.HasFlag(TimeDurationFormat.Minutes) || timeDuration.Minutes > 0)
            {
                template.Add("{m} [[[[min]]]]");
            }

            if (format.HasFlag(TimeDurationFormat.Seconds) || timeDuration.Seconds > 0)
            {
                template.Add("{s} [[[[s]]]]");
            }

            var formattedDuration = timeDuration.ToString(string.Join(", ", template));

            return new HtmlString(string.IsNullOrEmpty(formattedDuration) ? "0 s" : formattedDuration);
        }

        public static IHtmlContent DisplayLocalTimeSpanFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string cultureName, string timeZoneId)
        {
            return DisplayTimeSpanFor(htmlHelper, expression, "t", cultureName, timeZoneId);
        }

        public static IHtmlContent DisplayLocalTimeFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string format, string cultureName, string timeZoneId)
        {
            var model = htmlHelper.ViewData.Model;
            var dateValue = expression.Compile().Invoke((TModel)model);

            if (dateValue == null)
            {
                return HtmlString.Empty;
            }

            if (!DateTime.TryParse(dateValue.ToString(), out var date))
            {
                throw new Exception("Value type is not date time.");
            }

            if (string.IsNullOrEmpty(format))
            {
                throw new Exception("Format is not provided.");
            }

            if (string.IsNullOrEmpty(cultureName))
            {
                cultureName = "en-us";
            }

            if (string.IsNullOrEmpty(timeZoneId))
            {
                timeZoneId = "Asia/Dubai";
            }

            var localDate = TimeZoneInfo.ConvertTime(date, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
            return new HtmlString(localDate.ToString(format, new System.Globalization.CultureInfo(cultureName)));
        }

        public static IHtmlContent DisplayTimeSpanFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, string format, string cultureName, string timeZoneId = null)
        {
            var model = htmlHelper.ViewData.Model;
            var dateValue = expression.Compile().Invoke((TModel)model);

            if (dateValue == null)
            {
                return HtmlString.Empty;
            }

            if (!DateTime.TryParse(dateValue.ToString(), out var date))
            {
                throw new Exception("Value type is not date time.");
            }

            if (string.IsNullOrEmpty(format))
            {
                throw new Exception("Format is not provided.");
            }

            if (string.IsNullOrEmpty(cultureName))
            {
                throw new Exception("Culture name is not provided.");
            }

            if (timeZoneId == null)
            {
                return new HtmlString(date.ToString(format, new System.Globalization.CultureInfo(cultureName)));
            }
            else
            {
                var localDate = TimeZoneInfo.ConvertTime(date, TimeZoneInfo.FindSystemTimeZoneById(timeZoneId));
                return new HtmlString(localDate.ToString(format, new System.Globalization.CultureInfo(cultureName)));
            }
        }
    }
}