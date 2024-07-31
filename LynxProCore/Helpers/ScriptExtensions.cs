using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace LynxProCore.Helpers;

public static class ScriptExtensions
{
    public static IHtmlContent Script(this IHtmlHelper htmlHelper, object? template)
    {
        return template == null ? HtmlString.Empty : new HtmlString($"<script type=\"text/javascript\">{template}</script>");
    }

    public static IHtmlContent DnLabelFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayName", null, false);
    }

    public static IHtmlContent DnLabelFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string unitAbbrev, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayName", unitAbbrev, false);
    }

    public static IHtmlContent DnLabelWithRequiredFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayName", null, true);
    }

    public static IHtmlContent DnLabelWithRequiredFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string unitAbbrev, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayName", unitAbbrev, true);
    }

    public static IHtmlContent DdLabelFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayDescription", null, false);
    }

    public static IHtmlContent DdLabelFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string unitAbbrev, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayDescription", unitAbbrev, false);
    }

    public static IHtmlContent DdLabelWithRequiredFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayDescription", null, true);
    }

    public static IHtmlContent DdLabelWithRequiredFor<TModel, TValue>(this IHtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string unitAbbrev, object htmlAttributes = null)
    {
        return LabelHelper(html, expression, htmlAttributes, "DisplayDescription", unitAbbrev, true);
    }

    public static IHtmlContent LabelHelper<TModel, TValue>(
        this IHtmlHelper<TModel> htmlHelper,
        Expression<Func<TModel, TValue>> expression,
        object htmlAttributes,
        string displayAttr,
        string displayUnit,
        bool required)
    {
        var expressionProvider = htmlHelper.ViewContext.HttpContext.RequestServices
            .GetService<ModelExpressionProvider>();

        var htmlFieldName = expressionProvider?.GetExpressionText(expression);

        var properties = htmlHelper.ViewData.ModelMetadata.Properties;
        var labelText = properties.FirstOrDefault(p => p.Name == htmlFieldName)?.DisplayName;
       
        if (!string.IsNullOrEmpty(displayUnit))
        {
            labelText += $" ({displayUnit})";
        }

        var tagBuilder = new TagBuilder("label")
        {
            Attributes =
            {
                ["for"] = TagBuilder.CreateSanitizedId(htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(htmlFieldName), "")
            }
        };

        var labelContent = required ? $"{labelText} <span class=\"required\">*</span>" : labelText;
        tagBuilder.InnerHtml.AppendHtml(labelContent ?? string.Empty); 
        tagBuilder.MergeAttributes(HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));

        return tagBuilder;
    }

    public static IHtmlContent Modal(this IHtmlHelper html, string modalId)
    {
        var tag = new TagBuilder("div")
        {
            Attributes =
            {
                ["id"] = modalId,
                ["tabindex"] = "-1",
                ["role"] = "basic"
            }
        };
        tag.AddCssClass("modal fade");
        tag.InnerHtml.AppendHtml(
            "<div class=\"modal-dialog diag-style1\"><div class=\"modal-content\"><div class=\"modal-body\"><span>&nbsp;&nbsp;Loading...</span></div></div></div>");

        return tag;
    }


}
