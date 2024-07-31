using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace LynxProCore.Helpers;

public static class CustomColorPicker
{

    public static IHtmlContent ColorPickerFor<TModel, TValue>(this IHtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, CustomColorOptions colorOptions)
    {
        var memberExpression = expression.Body as MemberExpression;
        var memberName = memberExpression.Member.Name;
        var prop = memberExpression.Member as PropertyInfo;

        string defaultColor = colorOptions.DefaultColor;

        if (htmlHelper.ViewData.Model != null)
        {
            var func = expression.Compile();
            var propValue = func(htmlHelper.ViewData.Model);
            if (propValue != null)
            {
                defaultColor = propValue.ToString();
            }
        }

        var hasRequired = Attribute.IsDefined(prop, typeof(RequiredAttribute));

        var parentDiv = new TagBuilder("div");
        parentDiv.AddCssClass("custom-color-picker");

        if (colorOptions.ReadOnly)
        {
            parentDiv.Attributes["style"] = "pointer-events: none; cursor: not-allowed;";
        }

        var htmlBuilder = new HtmlContentBuilder();

        if (hasRequired && colorOptions.WithAsterisk)
        {
            var label = htmlHelper.DnLabelWithRequiredFor(expression, new { @class = "control-label", onclick = "event.preventDefault();" });
            htmlBuilder.AppendHtml(label);
        }
        else
        {
            var label = htmlHelper.DnLabelFor(expression, new { @class = "control-label", onclick = "event.preventDefault();" });
            htmlBuilder.AppendHtml(label);
        }

        var inputGroupDiv = new TagBuilder("div");
        inputGroupDiv.AddCssClass("input-group");
        htmlBuilder.AppendHtml(inputGroupDiv.RenderStartTag());

        var inputControl = new TagBuilder("input");
        inputControl.Attributes["type"] = "text";
        inputControl.Attributes["id"] = htmlHelper.IdFor(expression).ToString();
        inputControl.Attributes["name"] = htmlHelper.NameFor(expression).ToString();
        inputControl.AddCssClass(colorOptions.InputClass);
        inputControl.Attributes["data-control"] = "minicolors";
        inputControl.Attributes["maxlength"] = "7";
        inputControl.Attributes["value"] = defaultColor; // Set the default value here
        if (colorOptions.ReadOnly)
        {
            inputControl.Attributes["readonly"] = "readonly";
        }


        htmlBuilder.AppendHtml(inputControl);

        if (hasRequired)
        {
            var validation = htmlHelper.ValidationMessageFor(expression, "", new { @class = "text-danger" });
            htmlBuilder.AppendHtml(validation);
        }

        var divInputGroupBtn = new TagBuilder("div");
        divInputGroupBtn.AddCssClass("input-group-btn");
        htmlBuilder.AppendHtml(divInputGroupBtn.RenderStartTag());

        var divBtnGroup = new TagBuilder("div");
        divBtnGroup.AddCssClass("btn-group color-picker-circles-container");
        htmlBuilder.AppendHtml(divBtnGroup.RenderStartTag());

        var btn = new TagBuilder("button");
        btn.AddCssClass("btn dropdown-toggle color-picker-circles");
        btn.Attributes["data-toggle"] = "dropdown";
        btn.Attributes["id"] = "btn-color-bk-" + memberName;
        btn.Attributes["style"] = "background-color:" + defaultColor + ";";
        htmlBuilder.AppendHtml(btn.Render());

        var ul = new TagBuilder("ul");
        ul.AddCssClass("dropdown-menu");
        ul.Attributes["role"] = "menu";
        htmlBuilder.AppendHtml(ul.RenderStartTag());

        var liPicker = new TagBuilder("li");
        liPicker.AddCssClass("color-circles-title");
        htmlBuilder.AppendHtml(liPicker.RenderStartTag());

        var liH4 = new TagBuilder("h4");
        liH4.InnerHtml.Append("[[[[Pick a color]]]]");
        htmlBuilder.AppendHtml(liH4.Render());

        htmlBuilder.AppendHtml(liPicker.RenderEndTag());

        var liParent = new TagBuilder("li");
        htmlBuilder.AppendHtml(liParent.RenderStartTag());

        var ulList = new TagBuilder("ul");
        ulList.AddCssClass("color-circles");
        ulList.AddCssClass("clearfix");
        htmlBuilder.AppendHtml(ulList.RenderStartTag());

        for (int i = 0; i < colorOptions.Colors.Count; i++)
        {
            var color = colorOptions.Colors[i];

            var li = new TagBuilder("li");
            li.AddCssClass("color-c-" + (i + 1));
            li.Attributes["onclick"] = $"setColorPickerValue('{memberName}','{color.Replace("#", "")}')";
            htmlBuilder.AppendHtml(li.RenderStartTag());

            var a = new TagBuilder("a");
            a.Attributes["style"] = "background-color:" + color + ";";
            a.Attributes["id"] = memberName + "-" + color.Replace("#", "");
            if (color == color)
            {
                a.AddCssClass("selected");
            }
            htmlBuilder.AppendHtml(a.Render());

            htmlBuilder.AppendHtml(li.RenderEndTag());
        }

        htmlBuilder.AppendHtml(ulList.RenderEndTag());
        htmlBuilder.AppendHtml(liParent.RenderEndTag());
        htmlBuilder.AppendHtml(ul.RenderEndTag());
        htmlBuilder.AppendHtml(divBtnGroup.RenderEndTag());
        htmlBuilder.AppendHtml(divInputGroupBtn.RenderEndTag());
        htmlBuilder.AppendHtml(inputGroupDiv.RenderEndTag());

        parentDiv.InnerHtml.AppendHtml(htmlBuilder);
        return parentDiv;
    }

    private static string Render(this IHtmlContent content)
    {
        using var writer = new System.IO.StringWriter();
        content.WriteTo(writer, System.Text.Encodings.Web.HtmlEncoder.Default);
        return writer.ToString();
    }

    private static string RenderStartTag(this TagBuilder tagBuilder)
    {
        using var writer = new StringWriter();
        tagBuilder.WriteTo(writer, System.Text.Encodings.Web.HtmlEncoder.Default);
        return writer.ToString();
    }

    private static string RenderEndTag(this TagBuilder tagBuilder)
    {
        return $"</{tagBuilder.TagName}>";
    }

    private static string RenderSelfClosingTag(this TagBuilder tagBuilder)
    {
        using var writer = new StringWriter();
        tagBuilder.WriteTo(writer, System.Text.Encodings.Web.HtmlEncoder.Default);
        return writer.ToString();
    }
}

public class CustomColorOptions
{
    public bool Disabled { get; set; }

    public bool ReadOnly { get; set; }

    public List<string> Colors { get; set; }

    public string InputClass { get; set; }

    public bool WithAsterisk { get; set; }

    public string DefaultColor { get; set; }
}