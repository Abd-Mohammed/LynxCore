using System;
using System.ComponentModel.DataAnnotations;
using Lynx.NextGenConfigration.Streaming.Models;

namespace Lynx.Models
{
    public class VideoViewModel
    {
        [Display(Name = "[[[[Id]]]]")]
        public Guid Id { get; set; }

        [Display(Name = "[[[[Device ID]]]]")]
        public string DeviceId { get; set; }

        [Display(Name = "[[[[Name]]]]")]
        public string Name { get; set; }

        [Display(Name = "[[[[Description]]]]")]
        public string Description { get; set; }

        [Display(Name = "[[[[Status]]]]")]
        public JobStatus Status { get; set; }

        [Display(Name = "[[[[Requested Time]]]]")]
        [DisplayFormat(DataFormatString = StandardDateTimeFormats.Full)]
        public DateTime RequestedTime { get; set; }

        [Display(Name = "[[[[Blob URI]]]]")]
        public string BlobUri { get; set; }

        [Display(Name = "[[[[User Id]]]]")]
        public string UserId { get; set; }
    }
}