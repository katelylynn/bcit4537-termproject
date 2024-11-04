exports.QUERIES = {
    CREATE_USER_TABLE: `
        CREATE TABLE IF NOT EXISTS User (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL,
            password CHAR(60) NOT NULL,
            role ENUM('user', 'admin') NOT NULL
        );
    `,
    GET_ALL_USERS: "SELECT * FROM User;",
    GET_USER: "SELECT * FROM User WHERE id = ?;",
    INSERT_USER: "INSERT INTO User (email, password, role) VALUES (?, ?, ?);",
    UPDATE_USER: fields => `UPDATE User SET ${fields} WHERE id = ?;`,
    UPDATE_USER_ROLE: "UPDATE User SET role = ? WHERE id = ?;",
    DELETE_USER: "DELETE FROM User WHERE id = ?;",
}

exports.USER_MSGS = {
    USER_NOT_FOUND: "User not found.",
    ALL_FIELDS_REQUIRED: "All fields are required.",
    ERROR_CREATING_USER: "Error creating user.",
    NOT_ALLOWED_TO_MODIFY_ROLE: "Not allowed to modify the role permission.",
    PROVIDE_ROLE: "Must provide role field.",
    ROLE_RESTRICTIONS: "Role must be either user or admin.",
    USER_UPDATED_SUCCESSFULLY: "User updated successfully.",
    USER_ROLE_UPDATED_SUCCESSFULLY: "User role updated successfully.",
    USER_DELETED_SUCCESSFULLY: "User deleted successfully."
}