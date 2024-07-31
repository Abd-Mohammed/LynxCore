namespace Lynx.Models
{
    public class ProfileViewModels
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string ThirdName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string CultureName { get; set; }
        public string TimeZoneId { get; set; }
        public string DispalyLanguage { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int RequestRate { get; set; }
        public string DefaultPage { get; set; }
        public string DefaultMapType { get; set; }

    }
}