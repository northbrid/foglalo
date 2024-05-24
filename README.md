# Prerequisites
You have an empty "credentials" folder, where you need to create 2 files
* __root.sh__ with the access keys of your root AWS user. Terraform will use this.
* __iam.sh__ with the access keys of the IAM user. The assume-role script will use this.

In both files, you need to export the following variables:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_DEFAULT_REGION

The IAM user will be created by terraform, so first you can create the __root.sh__, and then __iam.sh__.

# Terraform
In terraform, we have
* An SNS __topic__, and a subscription to send SMS to a specific phone number
* An IAM __role__, permissioned only to publish message in a specific SNS topic
* An IAM __user__, permissioned only to assume a specific role

The different tasks uses different credentials
* The __terraform__ scripts are running with the credentials of the root AWS user
* The __assume-role__ script runs with the credentials of the IAM user

The generated temporary session token can be used in the JavaScript.

# Links
I need https://statically.io because ORB prevents me from using GitHub as CDN.  
More info: https://chromestatus.com/feature/5166834424217600

| Name            | Value                                                                  |
|-----------------|------------------------------------------------------------------------| 
| URL Converter   | https://statically.io/convert/                                         |
| GitHub URL      | https://github.com/northbrid/foglalo/blob/main/foglalo_v3.js           |
| GitHub Raw URL  | https://raw.githubusercontent.com/northbrid/foglalo/main/foglalo_v3.js |
| CDN-Capable URL | https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v3.js      |

# Usage
Paste this code snippet in Chrome DevTools to load the script:
```
var src = "https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v3.js";
document.body.appendChild(document.createElement("script")).setAttribute("src", src);
```
