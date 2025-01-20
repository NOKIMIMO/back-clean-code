import database from "../../src/infrastructure/database";

describe("Database connection", () => {
    it("should connect to the database", async () => {
        try {
            await database.initialize();
            expect(database.isInitialized).toBe(true);
        } catch (error) {
            console.error("Erreur détectée :", error);
            throw error;
        }
    });
});