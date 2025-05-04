CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author TEXT,
	url TEXT NOT NULL,
	title TEXT NOT NULL,
	likes INTEGER DEFAULT 0
	);

INSERT INTO blogs (author, url, title) VALUES ('Simo Toivanen', 'www.simotoivanen.fi', 'Testing code');

INSERT INTO blogs (author, url, title) VALUES ('Matias Mäyrä', 'www.mm.fi', 'Kuinka kaivaa koloja');