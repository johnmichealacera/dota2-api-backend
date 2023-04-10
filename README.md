# **Dota Express Backend**
This is a dota api Node.js backend project built with Express.js and TypeScript.

## Installation
To install the dependencies, run:

`npm install`

## Running the application
To start the application in development mode, run:

`npm run dev`

The application will start on port 5000 by default.

## Environment variables
The application requires the following environment variables to be set:

- `PORT`: The port number the server should listen on.
- `DOTA_SITE`: The frontend site that will connect to our backend.
- `OPEN_DOTA_API_URL`: Open dota api url
- `REDIS_STRING_URL`: redis string url connection
- `REDIS_DATABASE`: the redis database number

Create a `.env` file in the root directory of the project with the following values:

`PORT=3000`

`DOTA_SITE=http://localhost:8080`

`OPEN_DOTA_API_URL=https://api.opendota.com/api`

`REDIS_STRING_URL=redis://localhost:6379`

`REDIS_DATABASE=11`


You can customize the values as per your requirements.

**Note**: Make sure to never commit your `.env` file to version control. You can add it to your `.gitignore` file to ensure it is not accidentally committed.

## License
This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/) file for details.