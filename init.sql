Create Table openOrder (
    id SERIAl PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    orderType VARCHAR(20) NOT NULL,
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT into users 
(first_name, last_name, email, password) 
values ('maikonweber', 'ma128sio4', 'maikonweber@gmail.com.br', 'ma128sio4');


CREATE TABLE users_token (
    users_id integer REFERENCES users(id),
    token text NOT NULL,
    navegator text NOT NULL,
    is_admin BOOLEAN
);

CREATE TABLE lead_location (
    id SERIAL PRIMARY KEY,
    token text,
    infomation JSON
);

CREATE TABLE post_relation (
    users_id integer REFERENCES users(id),
    post integer REFERENCES post(id)
);

CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    text text not null,
    img JSON
);


CREATE TABLE registerOrder 
(
 id SERIAL PRIMARY KEY
 values 
)