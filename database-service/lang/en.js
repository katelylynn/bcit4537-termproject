exports.QUERIES = {
    GET_ALL_USERS: "SELECT * FROM User;",
    GET_USER: "SELECT * FROM User WHERE id = ?;",
    INSERT_USER: "INSERT INTO User (name, role) VALUES (?, ?);",
    UPDATE_USER: "UPDATE User SET ? WHERE id = ?;",
    UPDATE_USER_ROLE: "UPDATE User SET role = ? WHERE id = ?;",
    DELETE_USER: "DELETE FROM User WHERE id = ?;",
}

exports.USER_MSGS = {
    USER_NOT_FOUND: "User not found.",
    ALL_FIELDS_REQUIRED: "All fields are required.",
    ERROR_CREATING_USER: "Error creating user.",
    NOT_ALLOWED_TO_MODIFY_ROLE: "Not allowed to modify the role permission.",
    USER_UPDATED_SUCCESSFULLY: "User updated successfully.",
    USER_ROLE_UPDATED_SUCCESSFULLY: "User role updated successfully.",
    USER_DELETED_SUCCESSFULLY: "User deleted successfully."
}