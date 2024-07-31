using System.Collections.Generic;

namespace Lynx.Models
{
    public class CsvValidationRecord
    {
        public int Number { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }
}