export class CardNotFoundError extends Error{
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CardNotFoundError.prototype);
    }

    sayHello() {
        return "hello " + this.message;
    }
}