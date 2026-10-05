/**
 * Pretraga namirnica preko Open Food Facts API-ja.
 */
const searchOpenFoodFacts = async (
    searchTerm
) => {
    const url =
        `https://search.openfoodfacts.org/search` +
        `?q=${encodeURIComponent(
            searchTerm
        )}` +
        `&page_size=10`;

    const response = await fetch(url, {
        headers: {
            'User-Agent':
                'NutriPlan/1.0 (NutriPlan mobile app)',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        console.error(
            'Open Food Facts status:',
            response.status
        );

        throw new Error(
            'Open Food Facts API trenutno nije dostupan.'
        );
    }

    const data = await response.json();

    return data.hits || [];
};

module.exports = {
    searchOpenFoodFacts,
};