import database from "../../src/infrastructure/db";

describe("Database connection", () => {
    it("should connect to the database", async () => {
        const connection = await database.getConnection();
        expect(connection).toBeDefined();
    });
});