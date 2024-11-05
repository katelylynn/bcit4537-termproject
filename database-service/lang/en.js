exports.USER_QUERIES = {
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
    INSERT_SAMPLE_USERS: `
        INSERT INTO User (email, password, role) 
        VALUES 
        ('user@group7.com', 'group7', 'user'),
        ('admin@admin.com', '111', 'admin');
    `,
    UPDATE_USER: fields => `UPDATE User SET ${fields} WHERE id = ?;`,
    UPDATE_USER_ROLE: "UPDATE User SET role = ? WHERE id = ?;",
    DELETE_USER: "DELETE FROM User WHERE id = ?;",
}

exports.ENDPOINT_QUERIES = {
    CREATE_ENDPOINT_TABLE: `
        CREATE TABLE IF NOT EXISTS Endpoint (
            id INT PRIMARY KEY AUTO_INCREMENT,
            method CHAR(6) NOT NULL,
            path VARCHAR(255) NOT NULL
        );
    `,
    GET_ALL_ENDPOINTS: "SELECT * FROM Endpoint;",
    INSERT_ENDPOINT: "INSERT INTO Endpoint (method, path) VALUES (?, ?);",
}

exports.REQUEST_QUERIES = {
    CREATE_REQUEST_TABLE: `
        CREATE TABLE IF NOT EXISTS Request (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            endpoint_id INT NOT NULL,
            count INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
            FOREIGN KEY (endpoint_id) REFERENCES Endpoint(id) ON DELETE CASCADE,
            UNIQUE (user_id, endpoint_id)
        );
    `,
    GET_ALL_REQUESTS: "SELECT * FROM Request;",
    GET_REQUEST: "SELECT id, count FROM Request WHERE user_id = ? AND endpoint_id = ?;",
    INSERT_REQUEST: "INSERT INTO Request (user_id, endpoint_id, count) VALUES (?, ?, ?);",
    UPDATE_REQUEST_COUNT: "UPDATE Request SET count = ? WHERE id = ?;",
}

exports.MSGS = {
    ALL_FIELDS_REQUIRED: "All fields are required.",
}

exports.USER_MSGS = {
    ERROR_CREATING_USER: "Error creating user.",
    NOT_ALLOWED_TO_MODIFY_ROLE: "Not allowed to modify the role permission.",
    PROVIDE_ROLE: "Must provide role field.",
    ROLE_RESTRICTIONS: "Role must be either user or admin.",
    USER_CREATED_SUCCESSFULLY: "User created successfully.",
    USER_DELETED_SUCCESSFULLY: "User deleted successfully.",
    USER_NOT_FOUND: "User not found.",
    USER_ROLE_UPDATED_SUCCESSFULLY: "User role updated successfully.",
    USER_UPDATED_SUCCESSFULLY: "User updated successfully.",
}

exports.ENDPOINT_MSGS = {
    ENDPOINT_CREATED_SUCCESSFULLY: "Endpoint created successfully.",
    ERROR_CREATING_ENDPOINT: "Error creating endpoint.",
}

exports.REQUEST_MSGS = {
    ERROR_CREATING_REQUEST: "Error creating request.",
    ERROR_INCREMENTING_REQUEST: "Error incrementing request.",
    REQUEST_COUNT_INCREMENTED: "Request count incremented.",
    REQUEST_NOT_FOUND: "Request not found.",
}