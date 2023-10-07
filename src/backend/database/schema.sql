CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_id TEXT,
    data BLOB,
    name TEXT,
    rating BIGINT DEFAULT 1400
);