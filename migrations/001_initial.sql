-- Initial database schema for hatena-abstract
CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY,
    hatena_id VARCHAR(255) UNIQUE,
    url TEXT NOT NULL,
    title TEXT,
    comment TEXT,
    bookmarked_at TIMESTAMP,
    processed_at TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    bookmark_id INTEGER,
    content TEXT,
    summary TEXT,
    nostr_event_id VARCHAR(255),
    posted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id)
);

CREATE TABLE processing_logs (
    id INTEGER PRIMARY KEY,
    bookmark_id INTEGER,
    step VARCHAR(50),
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id)
);