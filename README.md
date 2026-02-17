# MakeDayApp

- [ ] A productivity workspace application that centralizes notes, tasks, and project organization.

## ⚠️ In developing


## Home page

<img width="1453" height="675" alt="Captura de tela 2026-01-20 122337" src="https://github.com/user-attachments/assets/ee5a249c-ee74-41f9-a040-19ad9572e1ec" />

## Login page and Register page

<img width="1473" height="763" alt="Captura de tela 2026-02-05 132604" src="https://github.com/user-attachments/assets/04436729-bbd8-4b59-824a-5366d0f1fc7f" />
<img width="1467" height="671" alt="Captura de tela 2026-01-20 122245" src="https://github.com/user-attachments/assets/e7c08214-f30a-419e-b06e-da9025ed3389" />

# Front-end validation 
- is done manually to demonstrate logical mastery and improve the user experience.

# Back-end Security Enhancements & Hardening
### Secure Password Handling (bcrypt)

- Password hashing using bcrypt
- Proper use of ```bcrypt.compare()```  without re-hashing on login

✔ Prevents plaintext password storage
✔ Protects against database leaks
✔ Follows modern password security standards

### Advanced Rate Limiting

- Login route protected usin ```express-rate-limit``` With a maximum of five attempts and proper ```429 Too Many Request``` Response

✔ Mitigates brute force attacks
✔ Reduces credential stuffing attempts
✔ Protects authentication endpoints

### Others
- IPv6 Bypass Prevention
- Progressive Login Slow Down

### 🎯 Security Objectives Achieved

✔ Secure password storage
✔ Protection against brute force attacks
✔ IPv6 bypass prevention
✔ Scalable Redis-backed infrastructure
✔ Session hardening
✔ Production-ready middleware design
✔ Defensive backend architecture