import { prisma } from '../server';

export interface BoatAccessResult {
    hasAccess: boolean;
    role?: string;
    membership?: any;
}

/**
 * Universel hjælpefunktion der godkender adgang til en båd.
 * Returnerer sandt hvis brugeren er SystemAdmin eller har et ægte CrewMembership.
 */
export const checkBoatAccess = async (userId: number, boatId: number, isSystemAdmin: boolean): Promise<BoatAccessResult> => {
    // 1. Bypass: Hvis brugeren er SystemAdmin, returner kunstig fuld adgang ('OWNER')
    if (isSystemAdmin) {
        return {
            hasAccess: true,
            role: 'OWNER',
            membership: { role: 'OWNER', userId, boatId }
        };
    }

    // 2. Original Godkendelse: Tjek databasen for reelt medlemskab
    const membership = await prisma.crewMember.findUnique({
        where: {
            userId_boatId: {
                userId,
                boatId
            }
        }
    });

    if (membership) {
        return {
            hasAccess: true,
            role: membership.role,
            membership
        };
    }

    return {
        hasAccess: false
    };
};
