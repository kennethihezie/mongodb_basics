import ShortUniqueId from "short-unique-id";

export class Helpers {
    static databaseUserName = 'collinsihezie6'
    static databasePassword = 'wSmr0Qn1pkCLkqB8'
    static databaseUrl = `mongodb+srv://${this.databaseUserName}:${this.databasePassword}@cluster0.hzoqofb.mongodb.net/?retryWrites=true&w=majority`

    static generateRandomString(): string {
        const { randomUUID } = new ShortUniqueId({ length: 10 });
        return randomUUID()
    }
}