I need https://statically.io because ORB prevents me from using GitHub as CDN.  
More info: https://chromestatus.com/feature/5166834424217600

| Name            | Value                                                                  |
|-----------------|------------------------------------------------------------------------| 
| URL Converter   | https://statically.io/convert/                                         |
| GitHub URL      | https://github.com/northbrid/foglalo/blob/main/foglalo_v1.js           |
| GitHub Raw URL  | https://raw.githubusercontent.com/northbrid/foglalo/main/foglalo_v1.js |
| CDN-Capable URL | https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v1.js      |

Paste this code snippet in Chrome DevTools to load the script:
```
var src = "https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v1.js";
document.body.appendChild(document.createElement("script")).setAttribute("src", src);
```
