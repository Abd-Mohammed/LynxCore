using System.Collections.Generic;

namespace Lynx.Models
{
    public class UrlReferer
    {
        public string ActionName { get; set; }
        public string ControllerName { get; set; }
        public string AreaName { get; set; }
        public Dictionary<string, object> QueryParameters { get; set; } = new Dictionary<string, object>();
    }
}