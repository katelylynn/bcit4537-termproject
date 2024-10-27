const UserManager = require("../../modules/userManager")

module.exports = app => {

    const um = new UserManager()
    
    app.post("/register", um.register.bind(um))
    app.post("/login", um.login.bind(um))
    app.get("/users", um.getAllUsers.bind(um))
    app.get("/users/:userId", um.getUser.bind(um))
    app.patch("/users/:userId", um.patchUser.bind(um))
    app.patch("/users/change-role/:userId", um.patchUserRole.bind(um))
    app.delete("/users/:userId", um.deleteUser.bind(um))

}