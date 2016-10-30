# Postman-fox

## Installation

```
cd server 
npm install
cd server/client 
npm install
docker-compose up
```

## To watch front chages

```
docker exec -it postman_node bash
cd client
npm run webpack
```

app works in the browser at `localhost:3030`