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
* An SNS __topic__
  * An SNS topic __subscription__, which will send the message to a phone number
  * An SNS topic __subscription__, which will send the message to an email address
* An IAM __role__, permissioned only to publish messages in this SNS topic
* An IAM __user__, permissioned only to assume this role

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

| Name            | Value                                                                   |
|-----------------|-------------------------------------------------------------------------| 
| URL Converter   | https://statically.io/convert/                                          |
| GitHub URL      | https://github.com/northbrid/foglalo/blob/main/foglalo_v17.js           |
| GitHub Raw URL  | https://raw.githubusercontent.com/northbrid/foglalo/main/foglalo_v17.js |
| CDN-Capable URL | https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v17.js      |

# Disabling Content-Security-Policy
Content-Security-Policy is an HTTP header that controls what the scripts can do in the webpage.
This will not prevent our script from running, but prevents it from communicating with AWS and sending SMS.
A workaround for this is install the following Chrome extension, and then disable CSP with it:
https://chromewebstore.google.com/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden

When this plugin is installed, it has a button in the toolbar, which has 2 states:
* If the icon is grey, then the CSP works normally, and the plugin has no effect
* If the icon is pink, then the plugin will manipulate the CSP headers in the HTTP responses

The plugin has effect only at the point when the page gets loaded, 
so you need to refresh the page after enabling!

# Injecting the script
Paste this code snippet in Chrome DevTools to load AWS SDK:
```
var aws_src = "https://sdk.amazonaws.com/js/aws-sdk-2.1044.0.min.js"
document.body.appendChild(document.createElement("script")).setAttribute("src", aws_src);
```
Allow a few seconds for it to load, and then paste this snippet:
```
var my_src = "https://cdn.statically.io/gh/northbrid/foglalo/main/foglalo_v17.js";
document.body.appendChild(document.createElement("script")).setAttribute("src", my_src);
```

# Example inputs
* 2024.05.23.-2024.06.30. 06:00-12:00
* 2024.07.01.-2024.07.07. 14:00-18:00

# Rooms for improvement
* Decrease the delay counter even if the page is still loading
* Test SNS sending should happen before asking for ranges. This will spare some time.

# Observations
* AWS allows you to send SMS messages only for total 1 USD in sandbox mode. 
  To increase this limit, you must justify your use-case.
* The application shares the same session across multiple open windows.
  So, if you open the application in a new window, and it leads you to the topic selection, 
  Then the other windows will be also reverted to the topic selection page.
  * I am afrad that this will also happen when you select a time slot in the calendar,
    So it's better to stay on the safe side, and run the multiple windows in multiple browser profiles.
    Note that incognito mode is one profile, so opening multiple incognito windows will not help.

## Making sound
I tried multiple things to make a sound so it worth collecting my observations.  
We lose the control when clicking on the time slot link, so we definitively need a popup window.

1. We cannot create HTML files in the server, so we need to define the HTML code inline.  
   This can be done with the `createObjectURL` method: 
   ```js
   const winHtml = `<!DOCTYPE html>
       <html>
           <head>
               <title>Window with Blob</title>
           </head>
           <body>
               <h1>Hello from the new window!</h1>
           </body>
       </html>`;
   
   const winUrl = URL.createObjectURL(
       new Blob([winHtml], { type: "text/html" })
   );
   
   const win = window.open(
       winUrl,
       "win",
       `width=800,height=400,screenX=200,screenY=200`
   );
   ```
2. We cannot upload media files to the server, so we need to create sound programmatically.  
   This can be done with the `AudioContext` API:
   ```
   var context = new AudioContext();
   var oscillator = context.createOscillator();
   oscillator.type = "sine";
   oscillator.frequency.value = 800;
   oscillator.connect(context.destination);
   oscillator.start();
   ```
3. First idea is combine points 1 and 2 to run the AudioContext code in a popup. This results in the following error:  
   `The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.`  
   I cannot bypass this protection mechanism, so let's find some other solution

4. I can create an auto-starting, looped audio playing with this snippet:
   ```
   <audio controls autoplay loop>
     <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
     <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
   </audio>
   ```
   Now the `CSP` comes to stop me: When I create object URL from a javascript running on an URL,
   the browser will represent it as a pseudo-url, and pretend that it's hosted on the same domain.
   So, it inherits the CSP settings of the parent website, which does not allow external media sources.

5. Let's try to use base64 data URLs instead of external sources.
   ```
   <audio controls autoplay loop>
     <source src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" type="audio/wav">
   </audio>
   ```
   It does not work because of `CSP`. CSP requires that the media source must be a real file on the server, not inline.

6. The `Disable Content-Security-Policy` plugin does not help, because it's effect is limited to the current tab.  
   The new window will not inherit the turned-on state of the plugin, and it makes a lot of sense in terms of security.

7. Looks like I need to fall back to the most primitive solution. I will open a popup with the following link:
   https://www.youtube.com/embed/ygLy02y7_n8?autoplay=1 
   
   
   
