// Packages Depencies
require('dotenv').config()
const fs = require('fs-extra')
const hostedGitInfo = require("hosted-git-info");
const fetch = require('node-fetch');

async function UpdateCheck()
{
    if( await CheckVersions()) return;
    
    // Update function
    var gitVersion = await GetGitVersion();
    var path = "./versions/" + gitVersion;
    if(fs.existsSync(path)) return;

    fs.mkdir(path);


}

async function CheckVersions()
{
    var gitVersion = await GetGitVersion();
    var currentVersion =  GetCurrentVersion();

    if(gitVersion == currentVersion) return true;
    else return false;
}

async function GetGitVersion()
{
    var version = "";
    var url = hostedGitInfo.fromUrl(process.env.REPO).file("package.json");
    var settings = { method: "Get" };

    await fetch(url, settings)
        .then(res => res.json())
        .then((json) => { version = json.version; });

    return version;
}

function GetCurrentVersion()
{
    var version = "0";
    LoopDirs("./versions", file => 
    {
        version = CompareVersions(version, file.name);
    })

    return console.log(version);
}

//
function LoopDirs(path, callback)
{
    var files = fs.readdirSync(path, {withFileTypes : true});
    if(files.length == 0) return "";

    files.forEach( file => 
    {
        if(file.isDirectory()) callback(file);
    })
}

function CompareVersions(v1, v2)
{
    var version1 = v1.split('.');
    var version2 = v2.split('.');

    var length = version1 > version2 ? version2.length : version1.length;

    for(var i = 0; i < length; i++)
    {
        if(version1[i] > version2[i]) return v1;
        else if(version2[i] > version1[i]) return v2;
    }

    return null;
}

UpdateCheck();