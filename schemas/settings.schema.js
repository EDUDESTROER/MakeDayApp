export const SETTINGS_SCHEMA = [
  //Account section
  {
    key: "profile photo",
    type: "button",
    btnTitle: "choose a new photo",
    icon: 'fa-solid fa-images',
    section: "account",
    action: "changeProfilePhoto"
  },
  {
    key: "nickname",
    type: "button",
    btnTitle: "change your nickname",
    icon: 'fa-solid fa-feather',
    section: "account",
    action: "changeNickname"
  },
  {
    key: "personal name",
    type: "button",
    btnTitle: "change your name",
    icon: 'fa-solid fa-pen-clip',
    section: "account",
    action: "changePersonalName"
  },
  {
    key: "email",
    type: "button",
    btnTitle: "change your email",
    icon: 'fa-solid fa-envelope',
    section: "account",
    action: "changeUserEmail"
  },
  {
    key: "delete your account",
    type: "button",
    btnTitle: "delete",
    icon: "fa-solid fa-user-slash",
    section: "account",
    action: "openDeleteAccount"
  },
  //General section
  {
    key: "language",
    type: "select",
    defaultValue: "system",
    options: ["system", "en", "pt"],
    section: "general",
    action: "changeLanguage"
  },
  {
    key: "aplication updates",
    type: "button",
    btnTitle: "check for updates",
    icon: 'fa-solid fa-cloud-arrow-up',
    section: "general",
    action: "checkUpdate"
  },
];