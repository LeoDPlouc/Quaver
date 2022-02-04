<div style="display:flex; wrap-direction:row;margin:0 auto;width:fit-content;">
<img src="logo.svg" height="150">
<h1 style="align-self:center;">Quaver</h1>
</div>

Quaver is an open-source self-hostable music player and music library manager. It's meant to be used via the browser but exposes an API so alternative frontends like smartphone or desktop app can use it.
Quaver is made to run in a docker container but can be installed bare metal. It runs with NodeJs and therefore is cross-plateform.

## Features
- Music player
- Visualisation of your library, songs, albums, artists
- Like/dislike songs

### Planned Features
- Automatic fetching of album covers
- Automatic fetching of songs metadata
- Import folder and upload from the frontend
- Automatic update of the metadatas
- Research songs in the frontend
- And more...
  
## Installation
### Docker
```shell
#Start a MongoDb container
docker run -d --name DB_NAME -v DB_PATH:/data/db -e MONGO_INITDB_ROOT_USERNAME=$MONGO_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD mongo

#Start Quaver
docker run -d --name quaver -p 8080:8080 -v $MUSIC_PATH:/music -e QUAVER_DB_USER=$MONGO_USERNAME -e QUAVER_DB_PASSWORD=$MONGO_PASSWORD -e QUAVER_SESSION_SECRET=$SESSION_SECRET -e QUAVER_MUSIC_PATH=/music dplouc/ --link $DB_NAME:mongo quaver
```
Make sure to replace those fields
- $DB_NAME: The name of the MongoDb container
- $DB_PATH: The path to where you want to store the database data for persistent storage
- $MONGO_USERNAME: The username for the root user of the database
- $MONGO_PASSWORD: The password for the root user of the database
- $MUSIC_PATH: The path to your music library in the host
- $SESSION_SECRET: The secret used to sign the session ID cookie

Note that "--link" is a depreciated feature of docker. You may want to use [docker networking](https://docs.docker.com/network/).

### Docker-compose
docker-compose.yaml
```yaml
version: "3.4"
services:
  quaver:
    container_name: quaver
    image: dplouc/quaver
    ports:
      - 8080:8080
    volumes:
      - $MUSIC_PATH:/music
    environment:
      - QUAVER_DB_USER=$MONGO_USERNAME
      - QUAVER_DB_PASSWORD=$MONGO_PASSWORD
      - QUAVER_SESSION_SECRET=$SESSION_SECRET
      - QUAVER_MUSIC_PATH=/music
    depends_on:
      - mongo

  mongo:
    image: mongo
    volumes:
      - $DB_PATH:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=$MONGO_USERNAME
      - MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD
```
Make sure to replace those fields
- $MUSIC_PATH: The path to your music library in the host
- $MONGO_USERNAME: The username for the root user of the database
- $MONGO_PASSWORD: The password for the root user of the database
- $SESSION_SECRET: The secret used to sign the session ID cookie
- $DB_PATH: The path to where you want to store the database data for persistent storage

### Bare Metal
- Install [Chromaprint](https://acoustid.org/chromaprint) (For simplicity's sake you can make sure it's in your ```PATH```, but it's optional)
- Install [NodeJs](https://nodejs.org)
- Download the [latest release of Quaver](https://github.com/LeoDPlouc/Quaver/releases)
- Install [MongoDB](https://www.mongodb.com/try/download/community) and start it
- In ```dist/``` run ```npm run start``` with the following environment variables

    - QUAVER_DB_IP: The ip or hostname where the Mongo instance is (Optional if Quaver and MongoDb are hosted on the same machine)
    - QUAVER_DB_PORT: The port configured to access Mongo (Optional if the default port is in use)
    - QUAVER_DB_USER: The username for the root user of the database
    - QUAVER_DB_PASSWORD: The password for the root user of the database
    - QUAVER_SESSION_SECRET: The secret used to sign the session ID cookie
    - QUAVER_PORT: The port used to access Quaver (Optional if you want to use the default port: 8080)
    - QUAVER_MUSIC_PATH: The path to your music library (You may also link the path in ```dist/```, in wich case this variable is optional)
    - QUAVER_FPCALC_PATH: The path to chromaprint (Optional if chromaprint is in your ```PATH```)

- Go to http://localhost:8080 (Change the address and the port according to your configuration)

For more advanced configuration refere to the [wiki](https://github.com/LeoDPlouc/Quaver/wiki)