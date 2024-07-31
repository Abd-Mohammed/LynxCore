using System.Collections.Generic;

namespace Lynx.Models
{
    public class CsvValidationRecordResult
    {
        public string GridId { get; set; }
        public string ExportFileName { get; set; }
        public IEnumerable<CsvValidationRecord> Records { get; set; }
    }
}