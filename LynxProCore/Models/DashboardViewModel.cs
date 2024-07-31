using System.Collections.Generic;

namespace Lynx.Models
{
    public class DashboardViewModel
    {
        public DashboardViewModel()
        {
            KeyValueTrackedItem = new List<KeyValueViewModel>();
            KeyValueVehicles = new List<KeyValueViewModel>();
            KeyValueAlerts = new List<KeyValueViewModel>();
        }
        public List<KeyValueViewModel> KeyValueTrackedItem { get; set; }
        public List<KeyValueViewModel> KeyValueVehicles { get; set; }
        public List<KeyValueViewModel> KeyValueAlerts { get; set; }
    }
}