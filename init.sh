docker-compose up -d
psql -U binance -h localhost -p 5832 -d binance -W -f init.sql
