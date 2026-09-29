# Postavljanje u produkciju

Frontend je posle build-a skup **statičkih fajlova** (HTML, JS, CSS) u folderu `dist/`. Za njega nije potreban poseban kontejner ni Node.js proces koji stalno radi, dovoljan je bilo koji hosting za statičke fajlove.

Postoje dve varijante, iste kao u [backend DEPLOYMENT.md](https://github.com/Dumanex/kahoot-backend/blob/main/DEPLOYMENT.md):

- **[Varijanta A: Vercel](#varijanta-a-vercel)** je **trenutno korišćena i testirana**. Frontend je na Vercel-u, a backend na laptopu iza Tailscale Funnel-a (backend varijanta A). Besplatno je i ne treba ni domen ni server.
- **[Varijanta B: Linux server (VPS) sa Nginx-om](#varijanta-b-linux-server-vps-sa-nginx-om)** je generički postupak za isti server na kome radi backend po backend varijanti B. **Nije testirana** na pravom serveru.

---

## Varijanta A: Vercel

> **Testirano 29.09.2026.**

Trenutne adrese:

| Deo | Adresa |
|---|---|
| Frontend | `https://kahoot-frontend-three.vercel.app` |
| Backend | `https://kahoot-quiz.taild913ec.ts.net` |

**Uslov:** backend mora biti postavljen po backend varijanti A i dostupan na HTTPS adresi. Dok se aplikacija koristi, laptop sa backendom mora biti upaljen, na internetu i bez sleep-a.

### A1. Šta je u kodu već pripremljeno

- Adresa backenda se čita iz `VITE_API_URL` u `src/api/axios.js`. REST ide na `VITE_API_URL/api`, a SockJS na `VITE_API_URL/ws`, sa šemom `https://` (ne `wss://`, SockJS sam bira transport).
- `vercel.json` u korenu repoa preusmerava svaku putanju koja nije fajl na `index.html`.
  ```json
  {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- `define: { global: 'globalThis' }` u `vite.config.js` je potreban zbog `sockjs-client`. Bez njega build prolazi, ali stranica pukne u browseru.
- Linkovi `imageUrl` / `audioUrl` iz backend odgovora su već puni URL-ovi (backend ih pravi od `UPLOAD_BASE_URL`), pa ih frontend koristi tačno kako stignu.

### A2. Postavljanje na Vercel

1. Kod mora biti na GitHub-u (`kahoot-frontend`), uključujući `vercel.json`. Vercel pravi build iz GitHub-a, ne sa lokalnog diska.
2. Na https://vercel.com se prijaviti preko GitHub-a, pa *Add New → Project* i *Import* pored `kahoot-frontend`.
3. Podešavanja:

   | Polje | Vrednost |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` (popunjava se samo) |
   | Output Directory | `dist` (popunjava se samo) |
   | Environment Variables | `VITE_API_URL` = `https://kahoot-quiz.taild913ec.ts.net`, **bez `/` na kraju** |

4. *Deploy*. Posle 1–2 minuta projekat dobija adresu tipa `https://<projekat>.vercel.app`. Ime se po želji menja u *Settings → Domains*, i to **pre** sledećeg koraka.
5. Production adresu upisati u `CORS_ALLOWED_ORIGINS` u backend `.env` (sa `https://`, bez `/` na kraju), pa na backendu pokrenuti `docker compose --profile prod up -d` (backend korak A2 i A3).

> Preview adrese koje Vercel pravi za pojedinačne deploy-e (`...-git-...vercel.app`) nisu u CORS-u backenda i na njima prijava i igra ne rade. Koristi se samo production adresa.

### A3. Ažuriranje na novu verziju

Svaki `git push` na `main` granu Vercel sam primeti i uradi novi build i deploy.

Provera da je deploy prošao: na vercel.com otvoriti projekat, pa tab *Deployments*. Na vrhu liste treba da bude poslednji commit (poruka i kratki hash) sa statusom *Ready* i oznakom *Production*. Dok build traje, status je *Building*.

> `VITE_API_URL` se **ugrađuje u JavaScript pri build-u**. Posle promene vrednosti u *Settings → Environment Variables* potrebno je *Deployments → ⋯ → Redeploy*, inače sajt i dalje koristi staru adresu. U ovu varijablu se ne upisuju tajne, jer svako može da je pročita u browseru.

### A4. Provera

Sa bilo kog računara:

```bash
F=https://kahoot-frontend-three.vercel.app
curl -s -o /dev/null -w '%{http_code}\n' $F/               # očekivano: 200
curl -s -o /dev/null -w '%{http_code}\n' $F/play/123456    # očekivano: 200 (vercel.json rewrite)
```

CORS za Vercel adresu (očekivano `200` i `Access-Control-Allow-Origin: https://kahoot-frontend-three.vercel.app`):

```bash
curl -s -o /dev/null -D - -X OPTIONS \
  -H 'Origin: https://kahoot-frontend-three.vercel.app' \
  -H 'Access-Control-Request-Method: POST' \
  https://kahoot-quiz.taild913ec.ts.net/api/auth/login
```

U DevTools-u (F12 → *Network*) zahtevi idu na `https://kahoot-quiz.taild913ec.ts.net/api/...`, a u *Console* nema CORS ni *mixed content* grešaka.

### A5. Zvuk na telefonu

Browseri ne dozvoljavaju da stranica sama pusti zvuk ako korisnik malo pre toga nije dodirnuo stranicu. Pitanje stiže preko WebSocket-a, a ne posle dodira, pa mobilni browseri zvuk tiho blokiraju. Na iPhone-u ovo važi za **sve** browsere, i za Chrome, jer na iOS-u svi koriste Safari-jev WebKit. Browser pritom ne traži dozvolu, jer dozvola za zvučnik ne postoji.

Zato audio pitanje ima plejer sa kontrolama (`QuestionDisplay.jsx`). Na računaru zvuk kreće sam, a na telefonu igrač dodirne *Play*.

### A6. Rešavanje problema

| Simptom | Uzrok i rešenje |
|---|---|
| CORS greška ili WebSocket `403` | Vercel adresa nije u `CORS_ALLOWED_ORIGINS` backenda, nema `https://` ili se koristi preview adresa (A2, korak 5) |
| U *Network* tabu zahtevi idu na `http://localhost:8080` | `VITE_API_URL` nije postavljen u Vercel-u. Dodati ga i uraditi *Redeploy* |
| Promena `VITE_API_URL` nema efekta | Nije urađen *Redeploy* (A3) |
| *Mixed Content* greška u konzoli | `VITE_API_URL` ili link slike počinje sa `http://`. Frontend na `https://` ne sme da zove `http://` adrese |
| Neke slike ili zvuk se ne prikazuju, a nova pitanja rade | Pitanje je napravljeno dok je `UPLOAD_BASE_URL` bio `http://localhost:8080`, pa je u bazi stari link. Ponovo otpremiti fajl u editoru ili prepraviti linkove (backend korak A4) |
| Zvuk na telefonu ne kreće sam | Očekivano ponašanje mobilnih browsera (A5). Pustiti ga preko plejera |
| Sve je radilo, pa odjednom ništa ne radi | Laptop sa backendom je ugašen, uspavan ili bez interneta. Proveriti backend varijantu A |

---

## Varijanta B: Linux server (VPS) sa Nginx-om

> **Napomena:** ova varijanta nije testirana na pravom serveru. Build sa produkcionim URL-om i serviranje build-a (koraci 3 i 4, i provere iz koraka 7 koje se mogu uraditi lokalno) su provereni lokalno. Instalacija Node.js-a na serveru, Nginx, HTTPS i rad na pravom domenu nisu.

Na serveru statičke fajlove servira **Nginx**, isti onaj koji je u koraku 6 backend uputstva (varijanta B) postavljen kao reverse proxy za API.

Primer koristi iste izmišljene domene kao backend uputstvo:

| Deo | Domen | Šta radi |
|---|---|---|
| Frontend | `https://kviz.example.com` | Nginx servira fajlove iz `dist/` |
| Backend | `https://api.kviz.example.com` | Nginx prosleđuje na backend kontejner (port 8080) |

### Sadržaj

0. [Preduslov: postavljen backend](#0-preduslov-postavljen-backend)
1. [Priprema servera](#1-priprema-servera)
2. [Preuzimanje koda](#2-preuzimanje-koda)
3. [Konfiguracija URL-a backenda](#3-konfiguracija-url-a-backenda)
4. [Build](#4-build)
5. [Serviranje build-a (Nginx i HTTPS)](#5-serviranje-build-a-nginx-i-https)
6. [Povezivanje sa backendom (CORS)](#6-povezivanje-sa-backendom-cors)
7. [Provera da aplikacija radi](#7-provera-da-aplikacija-radi)
8. [Ažuriranje na novu verziju](#8-ažuriranje-na-novu-verziju)
9. [Rešavanje problema](#9-rešavanje-problema)

## 0. Preduslov: postavljen backend

Pre frontenda na serveru treba da budu završeni svi koraci iz backend varijante B, **uključujući korak 6** (Nginx, Certbot i domen `api.kviz.example.com`). Posle toga na serveru već postoje Docker, Git, Nginx, Certbot i otvoreni portovi 80 i 443.

Provera sa servera:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://api.kviz.example.com/v3/api-docs   # očekivano: 200
```

## 1. Priprema servera

Potrebno je još:
- DNS `A` zapis za `kviz.example.com` koji pokazuje na IP adresu istog servera
- Node.js **20.19+** ili **22.12+** sa npm-om, samo za build (Vite 8 ne radi sa starijim verzijama)

Instalacija Node.js-a preko NodeSource repozitorijuma (primer za Node.js 24):

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

> Build se može uraditi i na drugom računaru (koraci 2–4), pa na server kopirati samo folder `dist/` (npr. sa `scp -r dist/ korisnik@server:~/kahoot-frontend/`). Tada Node.js na serveru nije potreban.

## 2. Preuzimanje koda

Pored foldera `kahoot-backend`:

```bash
git clone https://github.com/Dumanex/kahoot-frontend.git
cd kahoot-frontend
```

## 3. Konfiguracija URL-a backenda

```bash
cp .env.example .env
nano .env
```

Vrednost za produkciju:

| Varijabla | Šta upisati |
|---|---|
| `VITE_API_URL` | Javni URL backenda iz koraka 6 backend uputstva, npr. `https://api.kviz.example.com`, **bez `/` na kraju**. Mora biti `https`, jer browser blokira HTTP zahteve sa HTTPS stranice (*mixed content*) |

Primer produkcionog `.env`:

```dotenv
VITE_API_URL=https://api.kviz.example.com
```

> Vrednost se **ugrađuje u JavaScript pri build-u**. Ako se `.env` izmeni, mora se ponovo uraditi build (korak 4) i kopiranje (korak 5). Ako `.env` ne postoji, build koristi `http://localhost:8080` i aplikacija u produkciji neće raditi. U ovaj fajl se ne upisuju tajne, jer svako može da ga pročita u browseru.

## 4. Build

```bash
npm ci
npm run build
```

Šta se dešava:
1. `npm ci` instalira tačne verzije zavisnosti iz `package-lock.json`.
2. `npm run build` (Vite) pravi optimizovane fajlove u folderu `dist/`: `index.html` i `assets/` sa JS i CSS fajlovima čija imena sadrže hash sadržaja.

Provera da je u build ugrađen produkcioni URL:

```bash
grep -rl "api.kviz.example.com" dist/assets/   # očekivano: jedan .js fajl
grep -rl "localhost:8080" dist/                 # očekivano: prazan izlaz
```

## 5. Serviranje build-a (Nginx i HTTPS)

Kopiranje build-a u folder koji Nginx čita:

```bash
sudo mkdir -p /var/www/kahoot-frontend
sudo cp -r dist/. /var/www/kahoot-frontend/
```

`/etc/nginx/sites-available/kahoot-frontend`:

```nginx
server {
    listen 80;
    server_name kviz.example.com;

    root /var/www/kahoot-frontend;
    index index.html;

    # Aplikacija koristi rutiranje u browseru (/dashboard, /play/123456, ...).
    # Svaka putanja koja nije fajl vraća index.html, inače osvežavanje stranice daje 404.
    location / {
        try_files $uri $uri/ /index.html;
    }

    # index.html se uvek proverava, da bi browser posle ažuriranja dobio novu verziju
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # Fajlovi u assets/ imaju hash u imenu, pa se mogu keširati dugo
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kahoot-frontend /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d kviz.example.com
```

Certbot sam dodaje HTTPS (port 443) i preusmerenje sa HTTP-a na HTTPS u ovaj fajl.

## 6. Povezivanje sa backendom (CORS)

Backend prihvata REST i WebSocket zahteve samo sa origin-a navedenih u `CORS_ALLOWED_ORIGINS`. U `kahoot-backend/.env` upisati tačan origin frontenda (šema i domen, bez `/` na kraju):

```dotenv
CORS_ALLOWED_ORIGINS=https://kviz.example.com
```

Primena bez ponovnog build-a backenda:

```bash
cd ~/kahoot-backend
docker compose --profile prod up -d
```

U istom fajlu `UPLOAD_BASE_URL` treba da bude `https://api.kviz.example.com` (korak 6 backend uputstva). Od te vrednosti backend pravi linkove ka slikama i audio fajlovima koje frontend prikazuje.

## 7. Provera da aplikacija radi

Frontend sa servera:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://kviz.example.com/               # očekivano: 200
curl -s -o /dev/null -w '%{http_code}\n' https://kviz.example.com/play/123456    # očekivano: 200 (SPA fallback)
```

CORS za frontend domen (očekivano `Access-Control-Allow-Origin: https://kviz.example.com`):

```bash
curl -s -o /dev/null -D - -X OPTIONS \
  -H 'Origin: https://kviz.example.com' \
  -H 'Access-Control-Request-Method: POST' \
  https://api.kviz.example.com/api/auth/login
```

U browseru, na `https://kviz.example.com`, proći iste korake kao u [A4](#a4-provera). U DevTools-u (F12 → *Network*):
- zahtevi idu na `https://api.kviz.example.com/api/...`, ne na `localhost`
- postoji zahtev ka `https://api.kviz.example.com/ws/.../websocket` sa statusom `101 Switching Protocols`
- u *Console* nema CORS ni *mixed content* grešaka

## 8. Ažuriranje na novu verziju

```bash
cd ~/kahoot-frontend
git pull
npm ci
npm run build
sudo rm -rf /var/www/kahoot-frontend/*
sudo cp -r dist/. /var/www/kahoot-frontend/
```

Nginx ne treba restartovati. Browser preuzima nove fajlove, jer se `index.html` uvek proverava (`no-cache`), a novi JS i CSS imaju nova imena.

## 9. Rešavanje problema

| Simptom | Uzrok i rešenje |
|---|---|
| Osvežavanje stranice na npr. `/dashboard` daje Nginx `404` | Nedostaje `try_files $uri $uri/ /index.html;` u `location /` (korak 5) |
| U *Network* tabu zahtevi idu na `http://localhost:8080` | Build je urađen bez `.env` ili sa pogrešnim `VITE_API_URL`. Ispraviti `.env`, pa ponovo korake 4 i 5 |
| *Mixed Content* greška u konzoli | `VITE_API_URL` počinje sa `http://`, a frontend je na `https://`. Postaviti `https://` adresu backenda i ponovo uraditi build |
| CORS greška ili WebSocket `403` | Origin frontenda nije u `CORS_ALLOWED_ORIGINS` backenda (korak 6). Mora se tačno poklapati: `https://kviz.example.com`, bez `/` na kraju |
| Igra se ne ažurira u realnom vremenu, a REST radi | WebSocket ne prolazi kroz Nginx backenda. Proveriti `location /ws` sa `Upgrade`/`Connection` header-ima u koraku 6 backend uputstva |
| Slike i audio se ne prikazuju | `UPLOAD_BASE_URL` u backend `.env` pokazuje na pogrešnu adresu (npr. `http://localhost:8080`). Već sačuvana pitanja imaju stari URL i treba ponovo otpremiti fajl |
| `npm run build` javlja grešku o verziji Node.js-a | Node.js je stariji od 20.19. Instalirati noviju verziju (korak 1) |
