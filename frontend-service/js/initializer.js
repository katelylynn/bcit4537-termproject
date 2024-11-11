import { userMessages } from '../lang/en.js'

export class Initializer {

    static loadUserMessages() {
        for (const message in userMessages) {
            if (document.getElementById(message))
                document.getElementById(message).textContent = userMessages[message]
        }
    }

}
