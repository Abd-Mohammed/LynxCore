using System.Text;

namespace LynxProCore.Helpers;

public static class AlertFactory
{
    public enum AlertType
    {
        Success,
        Error,
        Warning,
        Info,
    }

    public static string Create(AlertType alertType, string message)
    {
        return CreateAlert(alertType, message, null);
    }

    public static string Create(AlertType alertType, string title, params string[] messages)
    {
        return CreateAlert(alertType, title, messages);
    }

    private static string CreateAlert(AlertType alertType, string title, string[] messages)
    {
        var alertMessage = new StringBuilder();

        if (messages != null)
        {
            var length = messages.Length;
            var needScroll = length > 5;

            alertMessage.Append(title);
            alertMessage.Append(needScroll ? "<div class=\"scroller\" style=\"max-height:100px;\">" : string.Empty);
            alertMessage.Append("<ul>");
            for (int i = 0; i < length; i++)
            {
                alertMessage.Append($"<li>{messages[i]}</li>");
            }
            alertMessage.Append("</ul>");
            alertMessage.Append(needScroll ? "</div>" : string.Empty);
        }
        else
        {
            alertMessage.Append(title);
        }

        var alertScript = new StringBuilder();
        alertScript.Append("Metronic.alert({");
        alertScript.Append("container: '.portlet-body',"); // alerts parent container(by default placed after the page breadcrumbs)
        alertScript.Append("place: 'prepend',"); // append or prepent in container 
        alertScript.Append($"type: '{GetType(alertType)}',");  // alert's type
        alertScript.Append($"message: '{alertMessage.Replace("'", "\\'")}',");  // alert's message
        alertScript.Append("close: true,"); // make alert closable
        alertScript.Append("reset: true,"); // close all previouse alerts first
        alertScript.Append("focus: false,"); // auto scroll to the alert after shown
        alertScript.Append("closeInSeconds: 0,"); // auto close after defined seconds
        alertScript.Append($"icon: '{GetIcon(alertType)}'"); // put icon before the message
        alertScript.Append("});");

        return alertScript.ToString();
    }

    private static string GetType(AlertType alertType)
    {
        switch (alertType)
        {
            case AlertType.Success:
                return "success";
            case AlertType.Warning:
                return "warning";
            case AlertType.Error:
                return "danger";
            case AlertType.Info:
            default:
                return "info";
        }
    }

    private static string GetIcon(AlertType alertType)
    {
        switch (alertType)
        {
            case AlertType.Success:
                return "check";
            case AlertType.Warning:
                return "exclamation";
            case AlertType.Error:
                return "times";
            case AlertType.Info:
            default:
                return "info";
        }
    }
}