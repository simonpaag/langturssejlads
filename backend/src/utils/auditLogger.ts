import { prisma } from '../server';

/**
 * Hjælpefunktion til globalt at logge handlinger på platformen ind i Databasens AuditLog.
 * @param action En beskrivende tekst for handlingen, f.eks. 'USER_REGISTERED', 'CREATED_VOYAGE'
 * @param userId ID'et på den bruger der udførte handlingen. Brug evt. null ved system-genererede events.
 * @param entityId ID'et på det berørte objekt (f.eks bådens ID, logbogens ID, togtets ID) hvis relevant.
 * @param details Et JSON objekt (eller tekst streng) med ekstra data (hvad blev rettet, ændret mv.)
 */
export const logAction = async (action: string, userId: number | null, entityId?: number, details?: string | object) => {
    try {
        let detailsString = null;
        if (details) {
            detailsString = typeof details === 'string' ? details : JSON.stringify(details);
        }

        await prisma.auditLog.create({
            data: {
                action,
                userId,
                entityId,
                details: detailsString
            }
        });
    } catch (error) {
        // En logningsfejl bør ikke kaste (throw) og afbryde den primære transaktion/handling
        console.error(`Fejl ved AuditLoggning af ${action}:`, error);
    }
};
