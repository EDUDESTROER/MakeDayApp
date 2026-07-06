# Tasks List:

- [ ] Implement all application features.
- [ ] Implement customisation features.
- [ ] Google OAuth 2.0 authentication (testing mode)
- [ ] AI-powered features using JavaScript and external APIs

# Other Tasks List:

- [ ] Create an error log.
- [ ] Invalidate old sessions after changing the password.
- [ ] When you enter 1234@ in register page, an error occured, because we don't say wath is the problem in the password.
- [ ] Sanitize the annotations before saving to the database and again when rendering to prevent XSS.
- [ ] Change bcrypt to Argon to prevent GPU-Accelerated dictionary attack
- [x] When saving images, use UUID to change their names, otherwise there may be name conflicts in the database.
- [x] When saving notes content, save a text version of content in search_content
- [ ] Fix sanitization issue! When users type: <script>alert()</script>, the database saves: script alert script. This is incorrect because users are saving plain text, not HTML. The original text should be preserved. 

# Customization Tasks List:

### Categories
- [ ] Categories Color.
- [ ] Categories Icon.
- [ ] Categories Custom sorting.
- [ ] Categories pinned.
- [ ] Categories Soft delete.
- [ ] Categories Visibility.
- [ ] More Categories viewMode.