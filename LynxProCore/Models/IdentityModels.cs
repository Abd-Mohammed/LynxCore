//using Lynx.BusinessLogic;
//using Microsoft.AspNet.Identity;
//using Microsoft.Owin.Security;
//using System.Security.Claims;
//using System.Security.Principal;
//using System.Text;
//using Microsoft.AspNetCore.Identity;

//namespace Lynx.Models
//{
//    //// You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
//    public class ApplicationUser
//    {
//        public int UserId { get; private set; }

//        public string Username { get; private set; }

//        public string FirstName { get; private set; }

//        public string LastName { get; private set; }

//        public string MobileNo { get; private set; }

//        public string Email { get; private set; }

//        public string[] Roles { get; private set; }

//        public string[] Permissions { get; private set; }

//        public bool IsSystemAdmin { get; private set; }

//        public int[] Franchises { get; set; }

//        public int TenantId { get; set; }

//        public string TenantName { get; set; }

//        public string RidesharingToken { get; set; }

//        public string IdentityToken { get; set; }

//        public string IdentityRefreshToken { get; set; }

//        public bool IsCustomLogin { get; set; }

//        public ApplicationUserSettings Settings { get; set; }

//        public IEnumerable<ApplicationUserTenant> Tenants { get; set; }

//        public bool WmsEnabled { get; set; }

//        public List<Claim> Claims { get; set; }

//        public ApplicationUser() { }

//        public ApplicationUser(ClaimsIdentity claimsIdentity)
//        {
//            UserId = claimsIdentity.GetUserId<int>();
//            Username = claimsIdentity.GetUserName();
//            FirstName = claimsIdentity.FindFirst("FirstName").Value;
//            LastName = claimsIdentity.FindFirst("LastName").Value;
//            MobileNo = claimsIdentity.FindFirst("MobileNo").Value;
//            Email = claimsIdentity.FindFirst("Email").Value;
//            Roles = claimsIdentity.FindFirst("Roles").Value.Split(',');
//            IsSystemAdmin = Convert.ToBoolean(claimsIdentity.FindFirst("IsSysAdmin").Value);
//            Permissions = claimsIdentity.FindFirst("Permissions").Value.Split(',');
//            Franchises = claimsIdentity.FindFirst("Franchises")?.Value.Split(',').Select(franchiseId => Convert.ToInt32(franchiseId)).ToArray();
//            Settings = new ApplicationUserSettings()
//            {
//                CultureName = claimsIdentity.FindFirst("CultureName").Value,
//                DisplayLanguage = claimsIdentity.FindFirst("DisplayLanguage").Value,
//                TimeZoneId = claimsIdentity.FindFirst("TimeZoneId").Value,
//                LengthUnit = claimsIdentity.FindFirst("LengthUnit").Value,
//                SpeedUnit = claimsIdentity.FindFirst("SpeedUnit").Value,
//                TemperatureUnit = GetTemperatureUnitOrDefault(claimsIdentity),
//                BaseLengthUnit = claimsIdentity.FindFirst("BaseLengthUnit").Value,
//                CurrencySymbol = claimsIdentity.FindFirst("CurrencySymbol").Value,
//                RequestRate = Convert.ToInt32(claimsIdentity.FindFirst("RequestRate").Value),

//                Map = new ApplicationUserMapSettings()
//                {
//                    Lat = double.Parse(claimsIdentity.FindFirst("Lat").Value),
//                    Lng = double.Parse(claimsIdentity.FindFirst("Lng").Value),
//                    Type = claimsIdentity.FindFirst("MapType")?.Value,
//                    // Fallback provider value
//                    GeocodingProvider = claimsIdentity.FindFirst("GeocodingProvider")?.Value ?? "osm",
//                    RoadsProvider = claimsIdentity.FindFirst("RoadsProvider")?.Value ?? "osm",
//                    DistanceMatrixProvider = claimsIdentity.FindFirst("DistanceMatrixProvider")?.Value ?? "osm"
//                },

//                Video = new ApplicationUserVideoSettings()
//                {
//                    DefaultChannel = (claimsIdentity.FindFirst("VideoDefaultChannel")) != null ? int.Parse(claimsIdentity.FindFirst("VideoDefaultChannel").Value) : 1,
//                    AutoPlay = (claimsIdentity.FindFirst("VideoAutoPlay")) != null ? bool.Parse(claimsIdentity.FindFirst("VideoAutoPlay").Value) : true
//                },
//            };

//            TenantId = int.Parse(claimsIdentity.FindFirst("TenantId").Value);
//            TenantName = claimsIdentity.FindFirst("TenantName").Value;
//            IsCustomLogin = bool.Parse(claimsIdentity.FindFirst("IsCustomLogin").Value);
//            RidesharingToken = claimsIdentity.FindFirst("RidesharingToken").Value;
//            IdentityToken = "";
//            IdentityRefreshToken = "";
//            Tenants = ResolveUserTenants(claimsIdentity);
//            WmsEnabled = Convert.ToBoolean(claimsIdentity.FindFirst("WmsEnabled")?.Value);
//        }

//        private IEnumerable<ApplicationUserTenant> ResolveUserTenants(ClaimsIdentity claimsIdentity)
//        {
//            var tenants = claimsIdentity.FindFirst("UserTenants").Value.Split(';');
//            var applicationTenants = new List<ApplicationUserTenant>();

//            foreach (var tenant in tenants)
//            {
//                var tenantParts = tenant.Split(',');
//                applicationTenants.Add(new ApplicationUserTenant()
//                {
//                    TenantId = int.Parse(tenantParts[0]),
//                    Name = tenantParts[1],
//                    DisplayName = tenantParts[2]
//                });
//            }

//            return applicationTenants;
//        }

//        // TODO: Find a better way to refresh his credentials

//        private string GetTemperatureUnitOrDefault(ClaimsIdentity claimsIdentity)
//        {
//            var imperial = claimsIdentity.FindFirst("LengthUnit").Value.Equals("mi");
//            return claimsIdentity.FindFirst("TemperatureUnit")?.Value ?? (imperial ? "℉" : "℃");
//        }
//    }

//    public class ApplicationUserSettings
//    {
//        public string CultureName { get; set; }

//        public string DisplayLanguage { get; set; }

//        public string TimeZoneId { get; set; }

//        public string LengthUnit { get; set; }

//        public string BaseLengthUnit { get; set; }

//        public string SpeedUnit { get; set; }

//        public string TemperatureUnit { get; set; }

//        public string CurrencySymbol { get; set; }

//        public ApplicationUserMapSettings Map { get; set; }

//        public string Theme { get; set; }

//        public int RequestRate { get; set; }

//        public ApplicationUserVideoSettings Video { get; set; }
//    }

//    public class ApplicationUserMapSettings
//    {
//        public double Lat { get; set; }

//        public double Lng { get; set; }

//        public string Type { get; set; }

//        public string GeocodingProvider { get; set; }

//        public string RoadsProvider { get; set; }

//        public string DistanceMatrixProvider { get; set; }
//    }

public class ApplicationUserTenant
{
    public int TenantId { get; set; }

    public string Name { get; set; }

    public string DisplayName { get; set; }
}

//    public class ApplicationSignInManager
//    {
//        private const string CookieType = DefaultAuthenticationTypes.ApplicationCookie;

//        private IAuthenticationManager AuthenticationManager
//        {
//            get
//            {
//                return default;
//            }
//        }

//        private struct UnitAbbr
//        {
//            public string BaseLengthUnit { get; set; }
//            public string LengthUnit { get; set; }
//            public string SpeedUnit { get; set; }
//            public string TemperatureUnit { get; set; }
//        }
//        public async Task IdentitySigninAsync(Tuple<User, TenantSetting> tenantUser, IEnumerable<Tuple<User, TenantSetting>> userTenantTuples, bool isCustomLogin, bool isPersistent = false, IdentityToken identityToken = null, CancellationToken cancellationToken = default)
//        {
//            AuthenticationManager.SignOut(CookieType);

//            var user = tenantUser.Item1;
//            var tenantSetting = tenantUser.Item2;
//            var allowedPermissionsCodes = (await new PermissionManager(tenantSetting.TenantId).GetAllowedPermissionsAsync(cancellationToken)).Select(p => p.Code);
//            var tenantAddonIds = (await new SubscriptionManager(tenantSetting.TenantId).GetTenantSubscriptionAsync(cancellationToken)).SubscriptionJson.Addons.Select(a => a.Id);

//            var claims = new List<Claim>();

//            // Set the cookie issue date in epoch
//            TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
//            long epochIssueDate = (long)t.TotalSeconds;
//            claims.Add(new Claim("CookieIssueDate", epochIssueDate.ToString()));

//            // Create User claims
//            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()));
//            claims.Add(new Claim(ClaimTypes.Name, user.Username));
//            claims.Add(new Claim("FirstName", user.FirstName));
//            claims.Add(new Claim("LastName", user.LastName));
//            claims.Add(new Claim("MobileNo", user.MobileNo));
//            claims.Add(new Claim("Email", user.Email));
//            claims.Add(new Claim("Roles", string.Join(",", user.UserRoles.Select(ur => ur.Role.Name))));
//            claims.Add(new Claim("IsSysAdmin", user.UserRoles.Any(ur => ur.Role.IsSystemAdmin).ToString()));

//            // Create permissions claims
//            var permissions = user.UserRoles
//                .SelectMany(ur => ur.Role.RolePermissions)
//                .Select(p => p.Permission.Code);

//            if (tenantSetting.Integration.WmsEnabled != null && (bool)tenantSetting.Integration.WmsEnabled)
//            {
//                permissions = permissions.Except(WmsDisabledPermissions.DisabledCodes);
//                allowedPermissionsCodes = allowedPermissionsCodes.Except(WmsDisabledPermissions.DisabledCodes);
//            }

//            claims.Add(new Claim("Permissions", string.Join(",", permissions.Distinct())));

//            //Create franchises claims 
//            var franchises = user.UserRoles.Where(r => r.Role.IsFranchise).Select(userRole => userRole.Role.FranchiseId);
//            if (franchises.Count() > 0)
//            {
//                claims.Add(new Claim("Franchises", string.Join(",", franchises.Distinct())));
//            }

//            // Create tenant allowed permission codes
//            claims.Add(new Claim("AddonScopes", string.Join(",", allowedPermissionsCodes)));

//            // Create tenant subscribed addon ids.
//            claims.Add(new Claim("AddonIds", string.Join(",", tenantAddonIds)));

//            // Create user settings claims
//            claims.Add(new Claim("CultureName", user.UserSetting.CultureName));
//            claims.Add(new Claim("DisplayLanguage", user.UserSetting.DisplayLanguage));
//            claims.Add(new Claim("TimeZoneId", user.UserSetting.TimeZoneId));
//            claims.Add(new Claim("Lat", user.UserSetting.Latitude.ToString()));
//            claims.Add(new Claim("Lng", user.UserSetting.Longitude.ToString()));
//            claims.Add(new Claim("SlidingExpiration", user.CookieSlidingExpiration.ToString()));
//            var unitAbbr = BuildUnitAbbreviation(tenantSetting.SystemOfMeasurement);

//            claims.Add(new Claim("LengthUnit", unitAbbr.LengthUnit));
//            claims.Add(new Claim("BaseLengthUnit", unitAbbr.BaseLengthUnit));
//            claims.Add(new Claim("SpeedUnit", unitAbbr.SpeedUnit));
//            claims.Add(new Claim("TemperatureUnit", unitAbbr.TemperatureUnit));
//            claims.Add(new Claim("CurrencySymbol", Lynx.Utils.Globalization.Currency.GetSymbolFromCode(tenantSetting.Currency)));
//            claims.Add(new Claim("RequestRate", user.UserSetting.RequestRate.ToString()));

//            claims.Add(new Claim("GeocodingProvider", tenantSetting.GeocodingProvider ?? "osm"));
//            claims.Add(new Claim("RoadsProvider", tenantSetting.RoadsProvider ?? "osm"));
//            claims.Add(new Claim("DistanceMatrixProvider", tenantSetting.DistanceMatrixProvider ?? "osm"));

//            if (!string.IsNullOrEmpty(user.UserSetting.DefaultMapType))
//            {
//                claims.Add(new Claim("MapType", user.UserSetting.DefaultMapType));
//            }
//            // Create tenant claims
//            claims.Add(new Claim("TenantId", user.TenantId.ToString()));
//            claims.Add(new Claim("TenantName", tenantSetting.Name));
//            claims.Add(new Claim("TenantShortName", tenantSetting.ShortName));
//            claims.Add(new Claim("TenantHeaderImageName", tenantSetting.HeaderImageBlobName ?? string.Empty));
//            claims.Add(new Claim("TenantIconName", tenantSetting.IconBlobName ?? string.Empty));
//            claims.Add(new Claim("Theme", tenantSetting.Theme));
//            claims.Add(new Claim("Region", tenantSetting.Region));
//            claims.Add(new Claim("VideoAutoPlay", user.UserSetting.VideoAutoPlay.ToString()));
//            claims.Add(new Claim("VideoDefaultChannel", user.UserSetting.VideoDefaultChannel.ToString()));
//            if (tenantSetting.Integration?.RideSharing?.Token != null)
//            {
//                claims.Add(new Claim("RidesharingToken", tenantSetting.Integration.RideSharing.Token));
//            }
//            else
//            {
//                claims.Add(new Claim("RidesharingToken", string.Empty));
//            }

//            if (identityToken != null)
//            {
//                //claims.Add(new Claim(IdentityConstants.IdentityAccessTokenClaim, identityToken.AccessToken));
//                //claims.Add(new Claim(IdentityConstants.IdentityIdTokenClaim, identityToken.IdToken));
//                //claims.Add(new Claim(IdentityConstants.IdentityRefreshTokenClaim, identityToken.RefreshToken));
//            }

//            // Order user tenants and create tenant display names and names, collection will always have at 
//            // least one tenant which user logged in
//            var userTenants = userTenantTuples.Select(utt => utt.Item2).OrderBy(ut => ut.DisplayName);
//            var builder = new StringBuilder();
//            foreach (var userTenant in userTenants)
//            {
//                builder.Append($"{userTenant.TenantId},{userTenant.Name},{userTenant.DisplayName}");
//                builder.Append(";");
//            }
//            builder.Length -= 1;
//            claims.Add(new Claim("UserTenants", builder.ToString()));

//            // Build SaaS permissions with tenant name in mind
//            var saasPermBuilder = new StringBuilder();
//            var saasSysAdminBuilder = new StringBuilder();
//            foreach (var tuple in userTenantTuples)
//            {
//                var mulitSaasPermissions = tuple.Item1.UserRoles.SelectMany(ur => ur.Role.RolePermissions)
//                    .Select(p => p.Permission)
//                    .Where(p => p.IsMultiSaas)
//                    .Select(p => $"{tuple.Item2.Name}-{p.Code}");

//                if (mulitSaasPermissions.Count() > 0)
//                {
//                    saasPermBuilder.Append(string.Join(",", mulitSaasPermissions.Distinct()));
//                    saasPermBuilder.Append(",");
//                }

//                saasSysAdminBuilder.Append($"{tuple.Item2.Name}+{tuple.Item1.UserRoles.Any(ur => ur.Role.IsSystemAdmin)}");
//                saasSysAdminBuilder.Append(",");
//            }

//            if (saasPermBuilder.Length > 0)
//            {
//                saasPermBuilder.Length -= 1;
//            }
//            saasSysAdminBuilder.Length -= 1;

//            claims.Add(new Claim("MultiSaasPermissions", saasPermBuilder.ToString()));
//            claims.Add(new Claim("MultiSaasSysAdmin", saasSysAdminBuilder.ToString()));

//            // Create custom login claims
//            claims.Add(new Claim("IsCustomLogin", isCustomLogin.ToString()));

//            claims.Add(new Claim("WmsEnabled", (tenantSetting.Integration?.WmsEnabled ?? false).ToString()));

//            var cookieExpirationDic = new Dictionary<String, String>();

//            if (user.CookieExpirationDuration != null)
//            {
//                cookieExpirationDic.Add("expirationDuration", user.CookieExpirationDuration.ToString());
//                cookieExpirationDic.Add("slidingExpiration", user.CookieSlidingExpiration.ToString());
//            }

//            if (user.CookieExpirationDuration != null)
//            {
//                claims.Add(new Claim("ExpirationDuration", user.CookieExpirationDuration.Value.ToString()));
//                var identity = new ClaimsIdentity(claims, CookieType);

//                AuthenticationManager.SignIn(new AuthenticationProperties(cookieExpirationDic)
//                {
//                    ExpiresUtc = DateTime.UtcNow.AddMinutes(user.CookieExpirationDuration.Value),
//                    AllowRefresh = true,
//                    IsPersistent = isPersistent,
//                }, identity);
//            }
//            else
//            {
//                //Sliding for one month
//                claims.Add(new Claim("ExpirationDuration", "43200"));
//                var identity = new ClaimsIdentity(claims, CookieType);
//                AuthenticationManager.SignIn(new AuthenticationProperties(cookieExpirationDic)
//                {
//                    ExpiresUtc = DateTime.UtcNow.AddDays(30),
//                    AllowRefresh = true,
//                    IsPersistent = isPersistent
//                }, identity);
//            }

//        }

//        public void IdentitySignout()
//        {
//            AuthenticationManager.SignOut(CookieType);
//        }

//        public void UpdateIdentityExtraClaims(ClaimsIdentity claimsIdentity, Dictionary<string, string> claims, bool isPersistent = false)
//        {
//            foreach (var claim in claims)
//            {
//                var existingClaim = claimsIdentity.FindFirst(claim.Key);
//                if (existingClaim != null)
//                {
//                    claimsIdentity.RemoveClaim(existingClaim);
//                }

//                claimsIdentity.AddClaim(new Claim(claim.Key, claim.Value));
//            }

//            AuthenticationManager.AuthenticationResponseGrant = new AuthenticationResponseGrant(new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties()
//            {
//                IsPersistent = isPersistent
//            });
//        }

//        private UnitAbbr BuildUnitAbbreviation(SystemOfMeasurement systemOfMeasurement)
//        {
//            var units = new UnitAbbr();
//            switch (systemOfMeasurement)
//            {
//                case SystemOfMeasurement.Imperial:
//                    units = new UnitAbbr()
//                    {
//                        BaseLengthUnit = "ft",
//                        LengthUnit = "mi",
//                        SpeedUnit = "mph",
//                        TemperatureUnit = "℉",
//                    };
//                    break;

//                case SystemOfMeasurement.Metric:
//                    units = new UnitAbbr()
//                    {
//                        BaseLengthUnit = "m",
//                        LengthUnit = "km",
//                        SpeedUnit = "km/h",
//                        TemperatureUnit = "℃",
//                    };
//                    break;
//                case SystemOfMeasurement.Nautical:
//                    units = new UnitAbbr
//                    {
//                        BaseLengthUnit = "m",
//                        LengthUnit = "NM",
//                        SpeedUnit = "kn",
//                        TemperatureUnit = "℃",
//                    };
//                    break;
//            }

//            return units;
//        }
//    }

//    public static class IdentityExtensions
//    {
//        public static int GetTenantId(this IIdentity identity)
//        {
//            return int.Parse(((ClaimsIdentity)identity).FindFirst("TenantId").Value);
//        }

//        public static int? GetExpirationDuration(this IIdentity identity)
//        {
//            if (((ClaimsIdentity)identity).FindFirst("ExpirationDuration") is null)
//            {
//                return null;
//            }
//            return int.Parse(((ClaimsIdentity)identity).FindFirst("ExpirationDuration").Value);
//        }

//        public static string[] GetPermissions(this IIdentity identity)
//        {
//            return ((ClaimsIdentity)identity).FindFirst("Permissions").Value.Split(',');
//        }

//        public static string[] GetAddons(this IIdentity identity)
//        {
//            return ((ClaimsIdentity)identity).FindFirst("AddonIds").Value.Split(',');
//        }

//        public static string[] GetAddonsScopes(this IIdentity identity)
//        {
//            return ((ClaimsIdentity)identity).FindFirst("AddonScopes").Value.Split(',');
//        }

//        public static string[] GetRoles(this IIdentity identity)
//        {
//            return ((ClaimsIdentity)identity).FindFirst("Roles").Value.Split(',');
//        }

//        public static bool IsSysAdmin(this IIdentity identity)
//        {
//            return Convert.ToBoolean(((ClaimsIdentity)identity).FindFirst("IsSysAdmin").Value);
//        }

//        public static Dictionary<string, bool> GetMultiSaasSysAdmins(this IIdentity identity)
//        {
//            var dictionary = new Dictionary<string, bool>();
//            var values = ((ClaimsIdentity)identity).FindFirst("MultiSaasSysAdmin").Value.Split(',');

//            foreach (var val in values)
//            {
//                string[] parts;

//                // Fallback to '-' for users already logged in,
//                if (val.Contains("+"))
//                {
//                    parts = val.Split('+');
//                }
//                else
//                {
//                    parts = val.Split('-');

//                }

//                dictionary.Add(parts[0], bool.Parse(parts[1]));
//            }

//            return dictionary;
//        }

//        public static string[] GetMultiSaasPermissions(this IIdentity identity)
//        {
//            return ((ClaimsIdentity)identity).FindFirst("MultiSaasPermissions").Value.Split(',');
//        }
//    }
//    public class ApplicationUserVideoSettings
//    {
//        public int DefaultChannel { get; set; }
//        public bool AutoPlay { get; set; }
//    }
//}