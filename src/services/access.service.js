const prisma = require('../helpers/prisma_client')

const login = async ({username, password}) => {
    const data = await prisma.users.findFirst({
        where: {
            username
        }
    })
    if(!data || data.password != password) {
        return false
    }
    return data;

}

module.exports = {
    login
}