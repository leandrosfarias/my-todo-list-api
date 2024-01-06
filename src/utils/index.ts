const bcrypt = require('bcrypt');

export async function hashPassword(password: string) {
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        // console.log('salt ->', salt);
        const hash = await bcrypt.hash(password, salt);
        // console.log('hash ->', hash);
        return hash;
    } catch (error) {
        console.log('error -> ', error);
        throw error;
    }

}

export async function comparePasswords(password1: string, password2: string): Promise<boolean> {
    return await bcrypt.compare(password1, password2);
}