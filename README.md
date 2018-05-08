# Shapp
### Simple Chat App
  Prosta aplikacja czatowa, umozliwiająca wysyłanie wiadomości oraz plików.
  
  
## Jak Działa?
Żeby użytkownik mógł używać aplikacji musi tylko wpisać nick, a potem wybrać jeden z dostępnych pokoi, bądź otworzyć swój własny.
Dodane pokoje są automatycznie usuwane minutę po wylogowaniu ostatniego użytkownika.
Użytkownik wylogowuję się z pokoju zmieniając go na inny, wychodząc ze strony, lub resetując nick.
Pliki można wysyłać klikając na ikonę w prawym dolnych rogu czatu, bądź metodą drag'n'drop.

## Użyte technologie

- ### [Angular](https://angular.io/)
  - ##### [qrcode-generator-ts](https://www.npmjs.com/package/qrcode-generator-ts)
- ### [Node.js](https://nodejs.org/en/)
  - #### [Express.js](https://expressjs.com/)
  - #### [Socket.io](https://socket.io/)
  
## Do zrobienia
- [ ] Dopasowanie strony do urządzeń mobilnych.
- [ ] Grupowanie wysyłanych zdjęć w oknie czatu.
- [ ] Możliwość zmniejszenie rozmiaru zdjęć na serwerze.
- [ ] Dodanie możliwości generowania kodu QR dla wybranych plików.
- [ ] Poprawienie paska progresu wysyłania plików (uwględnienie wielu plików).
