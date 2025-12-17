using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

var projectRoot = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), ".."));
var provider = new PhysicalFileProvider(projectRoot);
var contentTypeProvider = new FileExtensionContentTypeProvider();

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = provider,
    DefaultFileNames = new List<string> { "index.html", "home.html" }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = provider,
    ContentTypeProvider = contentTypeProvider,
    ServeUnknownFileTypes = true
});

app.MapFallback(async context =>
{
    var index = provider.GetFileInfo("index.html");
    if (index.Exists)
    {
        await context.Response.SendFileAsync(index);
    }
    else
    {
        context.Response.StatusCode = 404;
    }
});

app.Run();
