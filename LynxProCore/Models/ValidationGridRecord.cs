using System.Collections.Generic;

namespace Lynx.Models
{
    public class ValidationGridRecord
    {
        public string Field { get; set; }

        public IEnumerable<string> ErrorMessages { get; set; }
    }
}