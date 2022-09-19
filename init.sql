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
