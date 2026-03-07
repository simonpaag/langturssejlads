// Helper to assign a deterministic fallback image based on an ID
export const getFallbackImage = (id: number | string | undefined | null, type: 'avatar' | 'cover' = 'avatar'): string => {
    // If no ID is provided, default to fallback #1
    if (!id) {
        return `/images/fallbacks/${type}/1.svg`;
    }

    // Convert string IDs to numbers if necessary (e.g. for UUIDs, take char codes)
    let numericId = 0;
    if (typeof id === 'string') {
        for (let i = 0; i < id.length; i++) {
            numericId += id.charCodeAt(i);
        }
    } else {
        numericId = id;
    }

    // We have 10 SVGs (1 to 10)
    const index = (Math.abs(numericId) % 10) + 1;
    return `/images/fallbacks/${type}/${index}.svg`;
};
