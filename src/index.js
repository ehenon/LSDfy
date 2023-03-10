import Setlistfm from 'setlistfm-js';
import artists from '../artists.json';
import deezer from './services/deezer';
import logger from './services/logger';
import sleep from './services/sleep';
import config, { getMissingConfigVariables } from './config';

const missingConfigVariables = getMissingConfigVariables(config);

if (missingConfigVariables.length > 0) {
  const errorMessage = missingConfigVariables.reduce((acc, cur) => `${acc}- ${cur}\n`, 'The following config variables are missing:\n');
  logger.error(errorMessage);
  process.exit(1);
}

let setlistfmClient;
try {
  setlistfmClient = new Setlistfm({
    key: config.setlistFmApiKey,
    format: 'json',
    language: 'en',
  });
} catch (err) {
  logger.error(`An error occurred while connecting to the Setlist.fm API: ${err.message}`);
  process.exit(1);
}

(async () => {
  try {
    const existingPlaylists = await deezer.getExistingUserPlaylists();

    for (const artist of artists) {
      logger.info(`| Starting process for ${artist.name}`);
      const setlists = await setlistfmClient.getArtistSetlists(artist.mbid, { p: 1 });
      let lastEventDate;
      let sets;
      let songs = [];
      let counter = 0;

      while (!(songs.length > 9) && counter < setlists.setlist.length) {
        songs = [];
        lastEventDate = setlists.setlist[counter].eventDate;
        sets = setlists.setlist[counter].sets.set;
        sets.forEach((set) => { songs.push(...set.song); });
        counter += 1;
      }

      if (songs.length > 9 && !existingPlaylists.some((p) => p.name === `${artist.name} live ${lastEventDate}`)) {
        const playlistsToRemove = existingPlaylists.filter((p) => p.name.startsWith(`${artist.name} live `));
        if (playlistsToRemove.length > 0) {
          for (const playlist of playlistsToRemove) {
            logger.info(`|--- Removing the '${playlist.name}' existing playlist...`);
            await deezer.removePlaylist(playlist.id);
          }
        }

        const songIds = [];

        for (const song of songs) {
          const track = await deezer.searchTrack(artist.name, song.name);
          if (track && !songIds.includes(track)) songIds.push(track);
        }

        if (songIds.length > 0) {
          const playlistName = `${artist.name} live ${lastEventDate}`;
          logger.info(`|--- Creating '${playlistName}' playlist...`);
          const createdPlaylist = await deezer.createPlaylist(playlistName);
          await sleep(500);
          await deezer.addTracksToPlaylist(createdPlaylist, songIds);
        }
      } else {
        logger.info(`|--- There is no new playlist to create for ${artist.name}`);
      }
      await sleep(1000);
    }
    logger.info('The playlist generation process was completed without any errors');
    process.exit(0);
  } catch (err) {
    logger.error(`An error occurred while generating the playlists: ${err.stack}`);
    process.exit(1);
  }
})();
