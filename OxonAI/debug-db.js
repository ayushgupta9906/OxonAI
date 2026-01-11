const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const accountCount = await prisma.account.count();
        const latestUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { email: true, name: true, createdAt: true }
        });

        console.log('--- DB Audit ---');
        console.log('User count:', userCount);
        console.log('Account count:', accountCount);
        console.log('Latest users:', JSON.stringify(latestUsers, null, 2));

        const googleAccounts = await prisma.account.findMany({
            where: { provider: 'google' },
            take: 5
        });
        console.log('Google accounts:', JSON.stringify(googleAccounts, null, 2));

    } catch (error) {
        console.error('Audit Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
