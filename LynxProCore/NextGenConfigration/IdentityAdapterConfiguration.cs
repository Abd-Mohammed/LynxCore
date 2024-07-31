//using IdentityModel.Client;
//using Lynx.Areas.Administration.Adapter.Enums;
//using Lynx.Areas.Administration.Adapter.Models;
//using Lynx.Models;
//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.IdentityModel.Tokens.Jwt;
//using System.Net.Http;
//using System.Security.Claims;
//using System.Threading;

//namespace Lynx.NextGenConfigration
//{
//    public class IdentityAdapterConfiguration : AdapterConfiguration
//    {
//        protected string IdentityBaseUrl { get; } = $"{ConfigurationManager.AppSettings["identity:Authority"]}{ConfigurationManager.AppSettings["identity:BaseUrl"]}";

//        private ApplicationUser applicationUser;

//        protected ApplicationUser ApplicationUser
//        {
//            get
//            {
//                if (applicationUser == null || DateTime.UtcNow > GetJwtTokenExpiration())
//                {
//                    RefreshApplicationUser();
//                }

//                return applicationUser;
//            }
//        }

//        private DateTime GetJwtTokenExpiration()
//        {
//            if (string.IsNullOrEmpty(applicationUser?.IdentityToken))
//            {
//                return DateTime.MinValue;
//            }

//            var tokenHandler = new JwtSecurityTokenHandler();
//            var jwtToken = tokenHandler.ReadJwtToken(applicationUser.IdentityToken);
//            return jwtToken.ValidTo;
//        }

//        private void RefreshApplicationUser()
//        {
//            applicationUser = new ApplicationUser((ClaimsIdentity)Thread.CurrentPrincipal.Identity);

//            if (!string.IsNullOrEmpty(applicationUser?.IdentityToken) && DateTime.UtcNow > GetJwtTokenExpiration())
//            {
//                var token = RefreshTokenAsync(applicationUser.IdentityRefreshToken);

//                if (token != null)
//                {
//                    var claims = new Dictionary<string, string>
//                {
//                    { IdentityConstants.IdentityAccessTokenClaim, token.AccessToken },
//                    { IdentityConstants.IdentityRefreshTokenClaim, token.RefreshToken }
//                };
//                    new ApplicationSignInManager().UpdateIdentityExtraClaims((ClaimsIdentity)Thread.CurrentPrincipal.Identity, claims);
//                    applicationUser = new ApplicationUser((ClaimsIdentity)Thread.CurrentPrincipal.Identity);
//                }
//            }
//        }

//        private static IdentityToken RefreshTokenAsync(string refreshToken)
//        {
//            var tokenClient = new TokenClient(new HttpClient(), new TokenClientOptions
//            {
//                Address = $"{ConfigurationManager.AppSettings["identity:Authority"]}{ConfigurationManager.AppSettings["identity:TokenEndpoint"]}",
//                ClientId = ConfigurationManager.AppSettings["identity:Client"],
//                ClientSecret = ConfigurationManager.AppSettings["identity:Secret"],
//            });

//            var tokenResponse = tokenClient.RequestRefreshTokenAsync(refreshToken).GetAwaiter().GetResult();
//            return !tokenResponse.IsError
//                ? new IdentityToken
//                {
//                    AccessToken = tokenResponse.AccessToken,
//                    RefreshToken = tokenResponse.RefreshToken
//                }
//                : null;
//        }
//    }
//}