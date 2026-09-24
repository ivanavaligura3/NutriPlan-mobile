// Zajednička pravila za validaciju podataka koje korisnik unosi
// kroz Login i Registr forme.

// Proverava da li email ima osnovni validan format.
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Proverava da li lozinka ispunjava sva bezbednosna pravila.
export function isValidPassword(password: string): boolean {
    const hasMinimumLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return (
        hasMinimumLength &&
        hasUppercase &&
        hasNumber &&
        hasSpecialCharacter
    );
}

// Određuje jačinu lozinke na osnovu ispunjenih pravila.
// Koristićemo rezultat za prikaz indikatora ispod inputa.
export function getPasswordStrength(
    password: string
): 'weak' | 'medium' | 'strong' | null {
    if (!password) {
        return null;
    }

    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    if (score <= 1) {
        return 'weak';
    }

    if (score <= 3) {
        return 'medium';
    }

    return 'strong';
}