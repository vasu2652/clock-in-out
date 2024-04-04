# clock-in-out
1. Change the values in the env file to  your values.
2. For personalEmailPassword we have to generate an app password from your personal Gmail account you can follow the guidelines mentioned below for generating your app password.
3. Install pm2 by running the command
   **npm install pm2 -g**
4. Then start the application by running the command
   **pm2 start ecosystem.config.js**



# generate gmail app password
1. Access Your Google Account:
2. Start by visiting the Google Account management page. You can do this by navigating to https://myaccount.google.com/.
3. Sign In: Sign in to the Google Account associated with the Gmail address you want to use for sending emails programmatically.
4. Security: In the left sidebar, click on “Security.”
5. Scroll down to How you sign in to Google and click on 2-step verification.
6. App Passwords: Scroll down to “App passwords.” Click on “App passwords.” You may be prompted to re-enter your password for security purposes.
7. App name: Enter a custom name for this App Password. It helps you identify it later, so choose something related to the application or use case where you plan to use this App Password.
8. Create: Click the “Create” button. Google will create a unique 16-character App Password for your custom application/device.

Generated app password
Once generated, Google will display the App Password on the screen. Important: This is the only time you’ll see this password. Make sure to save it securely because you won’t be able to view it again. You’ll use this App Password in your application code to authenticate with Gmail’s SMTP server.
