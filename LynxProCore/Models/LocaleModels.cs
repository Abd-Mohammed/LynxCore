using System.Globalization;
using System.Security.Claims;
using System.Threading;

namespace Lynx.Models
{
    public static class UserLocale
    {
        public static bool IsRightToLeft()
        {
            var claimsIdentity = (ClaimsIdentity)Thread.CurrentPrincipal.Identity;

            var culture = new CultureInfo(claimsIdentity.FindFirst("DisplayLanguage").Value);
            return culture.TextInfo.IsRightToLeft;
        }
    }
}