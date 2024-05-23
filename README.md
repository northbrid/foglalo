I need https://statically.io because ORB prevents me from using GitHub as CDN.  
More info: https://chromestatus.com/feature/5166834424217600

| Name | Value |
| ---- | ----- | 
| URL Converter | https://statically.io/convert/ |
| Github Raw URL | https://raw.githubusercontent.com/northbrid/foglalo/main/foglalo.js |
| CDN-Capable URL | https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo.js |

Paste this code snippet in Chrome DevTools to load the script:
```
var src = "https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo.js";
document.body.appendChild(document.createElement("script")).setAttribute("src", src);
```
