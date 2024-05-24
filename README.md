# Prerequisites
You have an empty "credentials" folder, where you need to create 2 files
* __root.sh__ with the access keys of your root AWS user. Terraform will use this.
* __iam.sh__ with the access keys of the IAM user. The assume-role script will use this.

In both files, you need to export the following variables:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_DEFAULT_REGION

The IAM user will be created by terraform, so first you can create the __root.sh__, and then __iam.sh__.

# Terraform structure
In terraform, we have
* An SNS __topic__, and a subscription to send SMS to a specific phone number
* An IAM __role__, permissioned only to publish message in this specific SNS topic
* An IAM __user__, permissioned only to assume this specific role

The different tasks uses different credentials
* The __terraform__ scripts are running with the credentials of the root AWS user
* The __assume-role__ script runs with the credentials of the IAM user

The generated temporary session token can be used in the JavaScript.

# Registering phone number in AWS
In Sandbox mode, AWS allows you to send SMS messages only to verified phone numbers.
Adding the phone number cannot be done in terraform, you need to do it manually.
To add and verify your phone number, follow these steps:

1. Open the Amazon SNS console at https://console.aws.amazon.com/sns/v3/home
2. In the navigation pane, choose Text messaging (SMS).
3. In the 'Sandbox destination phone numbers', choose 'Add phone number'
4. Enter your phone number, and choose 'Add phone number'
5. You will receive a message with a verification code.
6. Enter the code in the verification dialog box, and now you can save the number

# Generating CDN-capable URL
I need https://statically.io because ORB prevents me from using GitHub as CDN.  
More info: https://chromestatus.com/feature/5166834424217600

| Name            | Value                                                                  |
|-----------------|------------------------------------------------------------------------| 
| URL Converter   | https://statically.io/convert/                                         |
| GitHub URL      | https://github.com/northbrid/foglalo/blob/main/foglalo_v7.js           |
| GitHub Raw URL  | https://raw.githubusercontent.com/northbrid/foglalo/main/foglalo_v7.js |
| CDN-Capable URL | https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v7.js      |

# Disabling Content-Security-Policy
Content-Security-Policy is an HTTP header that controls what the scripts can do in the webpage.
This will not prevent our script from running, but prevents it from communicating with AWS and sending SMS.
A workaround for this is install the following Chrome extension, and then disable CSP with it:
https://chromewebstore.google.com/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden

# Injecting the script
Paste this code snippet in Chrome DevTools to load the script:
```
var aws_src = "https://sdk.amazonaws.com/js/aws-sdk-2.1044.0.min.js"
document.body.appendChild(document.createElement("script")).setAttribute("src", aws_src);
var my_src = "https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v7.js";
document.body.appendChild(document.createElement("script")).setAttribute("src", my_src);
```

# Example inputs
* 2024.05.23.-2024.06.30. 06:00-12:00
* 2024.07.01.-2024.07.07. 14:00-18:00
