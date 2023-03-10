# LSDfy 🎶💊

LSDfy is a small Node.js program that automatically creates/updates Deezer playlists from the latest setlists of your favourite live bands!

![Scheme](resources/scheme.png)

The idea behind this program is to keep your Deezer playlists varied, changing, always in line with the latest performances of your favourite live artists (which often contain their biggest hits as well as new material :v:).

## Prerequisites 📋

The only prerequisite to use this program is to have Node.js on your machine. If you don't have it yet, you can download and install it through the [official website](https://nodejs.org/). LSDfy has been tested and works with Node.js 18.12.1 LTS version.

## Installation 🔧

Open a terminal and clone the repository wherever you want:

```bash
git clone https://github.com/ehenon/LSDfy.git
```
Navigate to the created directory and install the dependencies:
```bash
cd LSDfy
npm install
```
Create an app for LSDfy in your [Deezer for Developers dashboard](https://developers.deezer.com/myapps) and retrieve its "Application ID" and "Secret Key".

Open your favorite browser and navigate to the following URL: `https://connect.deezer.com/oauth/auth.php?app_id={YOUR_APP_ID}&redirect_uri=http://localhost:8888/callback&perms=manage_library,delete_library,offline_access`

Follow the process provided by Deezer. You should now be automatically redirected to `http://localhost:8888/callback?code={SOMETHING}` with an authorization code as parameter. Keep this authorization code in mind.

Finally, call the following URL (using the tool you want, like [Postman](https://www.postman.com/) or cURL) to generate your access token: `https://connect.deezer.com/oauth/access_token.php?app_id={YOUR_APP_ID}&secret={YOUR_APP_SECRET_KEY}&code={YOUR_AUTHORIZATION_CODE}&output=json`

Create a `.env` file based on `.env.sample`, and fill it with your own values:
```bash
cp .env.sample .env
```
Some details about the environment variables:
| # | Variable name         | Required | Description |
|---|-----------------------|----------|-------------|
| 1 | SETLISTFM_API_KEY     | *        | Setlist.fm API Key you can generate [here](https://www.setlist.fm/settings/api) (link for logged in users only) |
| 2 | DEEZER_USER_ID        | *        | Your Deezer User ID (can be found in the URL of your profile) |
| 3 | DEEZER_ACCESS_TOKEN   | *        | Deezer Access Token you retrieved just before |

Create an `artists.json` file with your favourite live artists based on `artists.sample.json`:
```bash
cp artists.sample.json artists.json
```

This JSON simply consists of an array containing one object per artist:
```javascript
[
    {
        "name": "Metallica", // Name of the artist
        "mbid": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab" // MusicBrainz id
    },
    {
        "name": "Municipal Waste", // Name of the artist
        "mbid": "b5a31e9b-1fa2-45f9-91f5-b3a25fb38038" // MusicBrainz id
    },
    ...
]
```

NB: `mbid` fields correspond to the unique identifiers of the artists in the [MusicBrainz](https://musicbrainz.org/) database. You can for example find them in the URL of the artist pages.

## Usage 🚀

To launch the application locally, open a terminal from the root of the directory and run the following command:

```bash
npm run dev
```

You can follow the progress of the program thanks to the logs appearing in the console.

If you want to build the program and run the compiled code separately, please note that the following commands are also available:
```bash
npm run build
npm run start
```

These commands allow you to compile the program in a `dist` folder using the [Babel](https://babeljs.io/) transcompiler, and then run the compiled program.

### Some rules to know about the program:
- If no `artists.json` file is found, the program stops immediately.
- If an environment variable is missing, the program stops immediately.
- If a new setlist is found but contains less than 10 songs, the program does not create a new playlist.
- If the last available setlist for an artist has already been transformed into a playlist, it is not re-created.
- If a new setlist is available for an artist, the generated playlist will automatically overwrite your old one.

## Alternatives 👀
As explained above, this project allows you to automatically generate Deezer playlists from the latest setlists of your favourite artists. That being said, this is a Node.js script only, and not a real web or mobile application. So it's intended for a more development-oriented audience (to adapt it, or to run it automatically every week, with a time-based job scheduler for example).

The interest of this project lies essentially in the **automation** of playlist creation. The user has nothing to do, all his favourite live artists are browsed and processed by the program without any action on his side.

If you want to create Deezer playlists from setlists **manually**, web and mobile applications already exist and are much more suitable for a non-developer audience:
- [Soundiiz](https://soundiiz.com/tutorial/setlist-to-deezer) web app
- [MusConv](https://musconv.com/fr/setlist-fm-vers-deezer/) desktop app
- and more..!

## Contributing ✒️
This project is a free and open personal project. Pull requests are welcome (targeting the `develop` branch). For major changes and problems encountered, feel free to open an issue to discuss what you would like to change/fix. Concerning the commits standards, please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) with these possible types: `feat:`, `fix:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`.

## Built With 🔨
- [setlistfm-js](https://www.npmjs.com/package/setlistfm-js) - Used to communicate with the [Setlist.fm API](https://api.setlist.fm/docs/1.0/index.html)
- [axios](https://www.npmjs.com/package/axios) - Used to communicate with the [Deezer API](https://developers.deezer.com/api)
- [dotenv](https://www.npmjs.com/package/dotenv) - Used to load environment variables from `.env` file into `process.env`
- [babel](https://babeljs.io/) - Used to compile next-gen JavaScript
- [eslint](https://www.npmjs.com/package/eslint) - Used to find and fix problems in JavaScript code
- [winston](https://www.npmjs.com/package/winston) - Used to manage console logs
- [husky](https://www.npmjs.com/package/husky) - Used to prevent bad commits 🐶