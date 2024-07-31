using System.Collections.Generic;

namespace Lynx.Models
{
    public class ValidationGridViewModel
    {
        public string ExportFileName { get; set; }

        public IEnumerable<ValidationGridRecord> Records { get; set; }
    }
}