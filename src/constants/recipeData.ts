import { Recipe } from '../types/recipe';

export const RECIPES: Recipe[] = [
    {
        id: 1,
        name: 'Piletina sa povrćem',
        description: 'Piletina sa sezonskim povrćem i pirinčem.',
        calories: 520,
        preparationTime: 30,
        ingredients: [
            {
                id: 1,
                name: 'Pileći file',
                quantity: 200,
                unit: 'g',
            },
            {
                id: 2,
                name: 'Pirinač',
                quantity: 100,
                unit: 'g',
            },
            {
                id: 3,
                name: 'Paprika',
                quantity: 100,
                unit: 'g',
            },
            {
                id: 4,
                name: 'Maslinovo ulje',
                quantity: 10,
                unit: 'ml',
            },
        ],

        preparationSteps: [
            'Operite i iseckajte povrće.',
            'Skuvajte pirinač prema uputstvu sa pakovanja.',
            'Isecite pileći file na manje komade i ispecite ga na maslinovom ulju.',
            'Dodajte povrće i kratko propržite.',
            'Poslužite piletinu sa povrćem uz kuvani pirinač.',
        ],
    },

    {
        id: 2,
        name: 'Ovsena kaša sa bananom',
        description: 'Jednostavan doručak sa ovsenim pahuljicama i bananom.',
        calories: 420,
        preparationTime: 10,
        ingredients: [
            {
                id: 5,
                name: 'Ovsene pahuljice',
                quantity: 60,
                unit: 'g',
            },
            {
                id: 6,
                name: 'Banana',
                quantity: 1,
                unit: 'kom',
            },
            {
                id: 7,
                name: 'Mleko',
                quantity: 200,
                unit: 'ml',
            },
        ],
        preparationSteps: [
            'Sipajte ovsene pahuljice i mleko u šerpu.',
            'Kuvajte na umerenoj temperaturi uz povremeno mešanje.',
            'Kada kaša dobije željenu gustinu, sklonite je sa šporeta.',
            'Isecite bananu na kolutove i dodajte je preko kaše.',
            'Po želji dodajte cimet, med ili druge dodatke.',
        ],
    },

    {
        id: 3,
        name: 'Omlet sa povrćem',
        description: 'Omlet sa jajima, paprikom, paradajzom i sirom.',
        calories: 350,
        preparationTime: 15,
        ingredients: [
            {
                id: 8,
                name: 'Jaja',
                quantity: 3,
                unit: 'kom',
            },
            {
                id: 9,
                name: 'Paprika',
                quantity: 80,
                unit: 'g',
            },
            {
                id: 10,
                name: 'Paradajz',
                quantity: 100,
                unit: 'g',
            },
            {
                id: 11,
                name: 'Sir',
                quantity: 40,
                unit: 'g',
            },
        ],
        preparationSteps: [
            'Operite i iseckajte papriku i paradajz na manje komade.',
            'Umutite jaja u činiji.',
            'Na zagrejanom tiganju kratko propržite papriku i paradajz.',
            'Prelijte povrće umućenim jajima i pecite na umerenoj temperaturi.',
            'Dodajte sir i nastavite pečenje dok jaja ne budu potpuno pečena.',
            'Presavijte omlet i poslužite dok je topao.',
        ],
    },

    {
        id: 4,
        name: 'Salata sa tunjevinom',
        description: 'Lagani obrok sa tunjevinom, povrćem i kukuruzom.',
        calories: 360,
        preparationTime: 15,
        ingredients: [
            {
                id: 12,
                name: 'Tunjevina',
                quantity: 120,
                unit: 'g',
            },
            {
                id: 13,
                name: 'Zelena salata',
                quantity: 100,
                unit: 'g',
            },
            {
                id: 14,
                name: 'Kukuruz',
                quantity: 80,
                unit: 'g',
            },
            {
                id: 15,
                name: 'Paradajz',
                quantity: 100,
                unit: 'g',
            },
        ],
        preparationSteps: [
            'Operite i pripremite povrće.',
            'Isecite zelenu salatu i paradajz na manje komade.',
            'Ocedite tunjevinu i kukuruz.',
            'U većoj činiji pomešajte salatu, tunjevinu, kukuruz i paradajz.',
            'Po želji dodajte malo maslinovog ulja, soli i limunovog soka.',
            'Lagano promešajte i poslužite.',
        ],
    },
];