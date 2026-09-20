 const messages = {
    // A) WebSocket - fiksne
    'Invalid question': 'Nevažeće pitanje',
    'Already answered this question': 'Već si odgovorio/la na ovo pitanje',
    'Player does not belong to this game session': 'Igrač ne pripada ovoj igri',
    'Game already started': 'Igra je već počela',
    'Game ended': 'Igra je završena!',
    'Game is not IN PROGRESS': 'Igra nije u toku',

    // B) REST validacione poruke (po polju)
    'Username is required': 'Korisničko ime je obavezno',
    'Username must be 3-50 characters': 'Korisničko ime mora imati 3-50 karaktera',
    'Email is required': 'Email je obavezan',
    'Invalid email format': 'Nevažeći format email adrese',
    'Email max 100 characters': 'Email može imati najviše 100 karaktera',
    'Password is required': 'Lozinka je obavezna',
    'Password must be 3-50 characters': 'Lozinka mora imati 3-50 karaktera',
    'Title is required': 'Naslov je obavezan',
    'Time per question is required': 'Vreme po pitanju je obavezno',
    'Time per question must be positive': 'Vreme po pitanju mora biti pozitivan broj',
    'Question type is required': 'Tip pitanja je obavezan',
    'Question text is required': 'Tekst pitanja je obavezan',
    'Time limit must be positive': 'Vremensko ograničenje mora biti pozitivan broj',
    'Order index is required': 'Redni broj je obavezan',
    'Answers are required': 'Odgovori su obavezni',
    'Must have 2-4 answers': 'Mora postojati 2-4 odgovora',
    'Answer text is required': 'Tekst odgovora je obavezan',
    'isCorrect is required': 'Polje "tačan odgovor" je obavezno',
    'Nickname is required': 'Nadimak je obavezan',
    'Nickname must be between 2 and 30 characters': 'Nadimak mora imati između 2 i 30 karaktera',
    'Quiz ID is required': 'ID kviza je obavezan',
    'PlayerID is required': 'ID igrača je obavezan',
    'QuestionID is required': 'ID pitanja je obavezan',
    'AnswerID is required': 'ID odgovora je obavezan',
    'Response time is required': 'Vreme odgovora je obavezno',
    'Response time must be positive': 'Vreme odgovora mora biti pozitivan broj',
    'Response time max 5 minutes': 'Vreme odgovora može biti najviše 5 minuta',
    'Validation failed': 'Podaci nisu validni',

     // C) REST poslovne/logičke - fiksne
    'Username already exists': 'Korisničko ime već postoji',
    'Email already exists': 'Email adresa već postoji',
    'Invalid credentials': 'Pogrešno korisničko ime ili lozinka',
    'You are not creator of this quiz, DO NOT HAVE PERMISSION TO MODIFY': 'Nisi kreator ovog kviza - nemaš dozvolu za izmenu',
    'You are not the creator of this quiz': 'Nisi kreator ovog kviza',
    'At least one answer must be correct': 'Bar jedan odgovor mora biti tačan',
    'MULTIPLE_CHOICE must have 2-4 answers': 'Pitanje sa više opcija mora imati 2-4 odgovora',
    'MULTIPLE_CHOICE must have exactly 1 correct answer': 'Pitanje sa više opcija mora imati tačno 1 tačan odgovor',
    'TRUE_FALSE must have exactly 2 answers': 'Tačno/netačno pitanje mora imati tačno 2 odgovora',
    'TRUE_FALSE must have exactly 1 correct answer': 'Tačno/netačno pitanje mora imati tačno 1 tačan odgovor',
    'IMAGE_RECOGNITION and AUDIO must have 2-4 answers': 'Pitanje sa slikom/audio zapisom mora imati 2-4 odgovora',
    'IMAGE_RECOGNITION and AUDIO must have exactly 1 correct answer': 'Pitanje sa slikom/audio zapisom mora imati tačno 1 tačan odgovor',
    'Access denied: Authentication required': 'Pristup odbijen - potrebna je prijava',
    'Authentication required': 'Potrebna je prijava',
    'This action conflicts with existing data': 'Ova akcija je u konfliktu sa postojećim podacima',
    'You have already answered this question': 'Već si odgovorio/la na ovo pitanje',
    'Nickname is already taken in this game': 'Nadimak je već zauzet u ovoj igri',
    'This record was modified concurrently, please retry': 'Podaci su izmenjeni u međuvremenu, pokušaj ponovo',

     // D) Fiksne HTTP fraze
    'Not Found': 'Nije pronađeno',
    'Conflict': 'Konflikt',
    'Unauthorized': 'Neautorizovano',
    'Bad Request': 'Neispravan zahtev',
    'Forbidden': 'Zabranjeno',
    'Internal Server Error': 'Greška na serveru',
  
    // E) Ostalo
    'Game started!': 'Igra je počela!',

    // F) Upload (slika/audio)
    'Invalid file type': 'Nevažeći tip fajla',
    'File is empty': 'Fajl je prazan',
    'File size exceeds maximum allowed limit': 'Fajl je prevelik',
    'Upload type must be image or audio': 'Tip upload-a mora biti image ili audio',
    'Failed to store file': 'Neuspešno čuvanje fajla na serveru',
};

const dynamicPatterns = [
    { re: /^Nickname '(.+)' is already taken in this game$/, tr: (m) => `Nadimak "${m[1]}" je već zauzet u ovoj igri` },
    { re: /^Can only join while game is WAITING\. Current status: (.+)$/, tr: (m) => `Igri se može pridružiti samo dok čeka igrače (trenutni status: ${m[1]})` },
    { re: /^Game is not IN_PROGRESS\. Current status: (.+)$/, tr: (m) => `Igra nije u toku (trenutni status: ${m[1]})` },
    { re: /^Failed to generate unique PIN after (\d+) attempts$/, tr: (m) => `Nije moguće generisati jedinstveni PIN kod (${m[1]} pokušaja)` },
    { re: /^Game can only be started from WAITING status\. Current status: (.+)$/, tr: (m) => `Igra može početi samo iz statusa čekanja (trenutni status: ${m[1]})` },
    { re: /^Game must be IN_PROGRESS to advance question\. Current status: (.+)$/, tr: (m) => `Igra mora biti u toku da bi se prešlo na sledeće pitanje (trenutni status: ${m[1]})` },
    { re: /^Game can only be ended from IN_PROGRESS status\. Current status: (.+)$/, tr: (m) => `Igra se može završiti samo dok je u toku (trenutni status: ${m[1]})` },
    { re: /^User not found: (.+)$/, tr: (m) => `Korisnik nije pronađen: ${m[1]}` },
    { re: /^Quiz not found: (.+)$/, tr: (m) => `Kviz nije pronađen: ${m[1]}` },
    { re: /^Question not found: (.+)$/, tr: (m) => `Pitanje nije pronađeno: ${m[1]}` },
    { re: /^Game session not found( with PIN)?: (.+)$/, tr: (m) => `Igra sa PIN kodom ${m[2]} nije pronađena` },
    { re: /^Player not found: (.+)$/, tr: (m) => `Igrač nije pronađen: ${m[1]}` },
    { re: /^An unexpected error occurred:/, tr: () => 'Došlo je do neočekivane greške' },
];

export function translateMessage(message) {
    if (!message) return 'Došlo je do greške';
  
    if (messages[message]) {
      return messages[message];
    }
  
    for (const { re, tr } of dynamicPatterns) {
      const match = message.match(re);
      if (match) return tr(match);
    }
  
    return 'Došlo je do greške, pokušaj ponovo';
}

export function translateErrorResponse(data) {
    if (!data) return 'Greška u komunikaciji sa serverom';
  
    if (data.errors && Object.keys(data.errors).length > 0) {
      return Object.values(data.errors).map(translateMessage).join(', ');
    }
  
    return translateMessage(data.message);
}