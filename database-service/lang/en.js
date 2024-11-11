exports.STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    IM_A_TEAPOT: 218,
    BAD_REQUEST: 400,
    INTERNAL_SERVER: 500,
}

exports.USER_QUERIES = {
    CREATE_USER_TABLE: `
        CREATE TABLE IF NOT EXISTS User (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL UNIQUE,
            password CHAR(60) NOT NULL,
            role ENUM('user', 'admin') NOT NULL
        );
    `,
    GET_ALL_USERS: "SELECT * FROM User;",
    GET_USER: "SELECT * FROM User WHERE id = ?;",
    GET_USER_ID: "SELECT id FROM User WHERE email = ?;",
    INSERT_USER: "INSERT INTO User (email, password, role) VALUES (?, ?, ?);",
    UPDATE_USER: fields => `UPDATE User SET ${fields} WHERE id = ?;`,
    UPDATE_USER_ROLE: "UPDATE User SET role = ? WHERE id = ?;",
    DELETE_USER: "DELETE FROM User WHERE id = ?;",
}

exports.ENDPOINT_QUERIES = {
    CREATE_ENDPOINT_TABLE: `
        CREATE TABLE IF NOT EXISTS Endpoint (
            id INT PRIMARY KEY AUTO_INCREMENT,
            method CHAR(6) NOT NULL,
            path VARCHAR(255) NOT NULL,
            UNIQUE (method, path)
        );
    `,
    GET_ALL_ENDPOINTS: "SELECT * FROM Endpoint;",
    GET_ENDPOINT_ID: "SELECT id FROM Endpoint WHERE method = ? AND path = ?;",
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
    REQUESTS_PER_ENDPOINT: `
        SELECT e.method AS method, 
        e.path AS path, 
        SUM(r.count) AS total_requests
        FROM Endpoint e
        JOIN Request r ON e.id = r.endpoint_id
        GROUP BY e.id;
    `,
    REQUESTS_PER_USER: `
        SELECT u.email AS user_email, 
        SUM(r.count) AS total_requests
        FROM User u
        JOIN Request r ON u.id = r.user_id
        GROUP BY u.id;
    `,
    REQUESTS_SINGLE_USER: "SELECT SUM(count) AS total_requests FROM Request WHERE user_id = ?;",
}

exports.MSGS = {
    ALL_FIELDS_REQUIRED: "All fields are required.",
}

exports.USER_MSGS = {
    ERROR_CREATING_USER: "Error creating user.",
    NOT_ALLOWED_TO_MODIFY_ROLE: "Not allowed to modify the role permission.",
    PROVIDE_ROLE: "Must provide role field.",
    ROLE_RESTRICTIONS: "Role must be either user or admin.",
    USER_CREATED_SUCCESSFULLY: "User(s) created successfully.",
    USER_DELETED_SUCCESSFULLY: "User deleted successfully.",
    USER_NOT_FOUND: "User not found.",
    USER_ROLE_UPDATED_SUCCESSFULLY: "User role updated successfully.",
    USER_UPDATED_SUCCESSFULLY: "User updated successfully.",
}

exports.ENDPOINT_MSGS = {
    ENDPOINT_CREATED_SUCCESSFULLY: "Endpoint created successfully.",
    ENDPOINT_NOT_FOUND: "Endpoint not found.",
    ERROR_CREATING_ENDPOINT: "Error creating endpoint.",
}

exports.REQUEST_MSGS = {
    ERROR_CREATING_REQUEST: "Error creating request.",
    ERROR_INCREMENTING_REQUEST: "Error incrementing request.",
    REQUEST_COUNT_INCREMENTED: "Request count incremented.",
    REQUEST_NOT_FOUND: "Request not found.",
}