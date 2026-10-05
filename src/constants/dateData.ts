export type PlanDay = {
    id: number;
    shortName: string;
    date: string;
    fullDate: string;
};

/**
 * Nazivi dana na srpskom jeziku.
 *
 * JavaScript Date objekat koristi:
 * 0 = nedelja
 * 1 = ponedeljak
 * ...
 * 6 = subota
 */
const DAY_NAMES = [
    'NED',
    'PON',
    'UTO',
    'SRE',
    'ČET',
    'PET',
    'SUB',
];

/**
 * Nazivi meseci na srpskom jeziku.
 */
const MONTH_NAMES = [
    'januar',
    'februar',
    'mart',
    'april',
    'maj',
    'jun',
    'jul',
    'avgust',
    'septembar',
    'oktobar',
    'novembar',
    'decembar',
];

/**
 * Vraća sve dane za izabrani mesec.
 */
export function getPlanDays(
    year: number,
    month: number
): PlanDay[] {
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    return Array.from(
        { length: daysInMonth },
        (_, index) => {
            const dateNumber = index + 1;

            const date = new Date(
                year,
                month,
                dateNumber
            );

            const dayOfWeek = date.getDay();

            return {
                id: dateNumber,
                shortName: DAY_NAMES[dayOfWeek],
                date: dateNumber.toString(),
                fullDate: `${DAY_NAMES_FULL[dayOfWeek]}, ${dateNumber}. ${MONTH_NAMES[month]}`,
            };
        }
    );
}

/**
 * Puni nazivi dana za prikaz izabranog datuma.
 */
const DAY_NAMES_FULL = [
    'Nedelja',
    'Ponedeljak',
    'Utorak',
    'Sreda',
    'Četvrtak',
    'Petak',
    'Subota',
];

/**
 * Vraća naziv meseca i godinu za prikaz
 * u zaglavlju plana.
 */
export function getMonthTitle(
    year: number,
    month: number
): string {
    const monthName =
        MONTH_NAMES[month].charAt(0).toUpperCase() +
        MONTH_NAMES[month].slice(1);

    return `${monthName} ${year}`;
}

/**
 * Pretvara godinu, mesec i dan u format:
 * YYYY-MM-DD
 *
 * Primer:
 * 2026, 8, 24 -> 2026-09-24
 */
export function getDateString(
    year: number,
    month: number,
    day: number
): string {
    const monthString = String(month + 1).padStart(2, '0');
    const dayString = String(day).padStart(2, '0');

    return `${year}-${monthString}-${dayString}`;
}