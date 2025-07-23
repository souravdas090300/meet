# OAuth Authorization Help

## "Google hasn't verified this app" Warning

When you click the authorization link, you may see a warning that "Google hasn't verified this app." This is normal for applications in development/testing mode.

### How to Proceed Safely

1. **Click "Advanced"** at the bottom left of the warning screen
2. **Click "Go to Meet Calendar App (unsafe)"** 
3. **Review the permissions** - the app only requests read-only access to your calendar
4. **Click "Allow"** to grant permissions

### Why This Happens

- This app is currently in testing mode
- Google shows this warning for unverified apps as a security measure
- The app only requests calendar read permissions - it cannot modify your data

### What Permissions Are Requested

- **Read-only access to your calendar**: To display upcoming events
- **No write access**: The app cannot create, modify, or delete events
- **No access to other Google services**: Only calendar data

### Security

- Your credentials are handled securely through Google's OAuth 2.0
- The app receives only temporary access tokens
- No passwords are stored or transmitted
- All communication is encrypted (HTTPS)

---

*This warning will disappear once the app is submitted for and completes Google's verification process.*
