import axios from 'axios';
import config from '../../config';

/**
 * Get the existing playlists of the Deezer user.
 * @returns {Array<Object>} Array of playlist objects as { id, name }
 */
const getExistingUserPlaylists = async () => {
  const response = await axios({
    method: 'get',
    url: `https://api.deezer.com/user/${config.deezerUserId}/playlists`,
    params: {
      access_token: config.deezerAccessToken,
      title: 'New test playlist',
    },
  });

  return response?.data?.data.map((p) => ({ id: p.id, name: p.title }));
};

/**
 * Create a new Deezer playlist.
 * @param {string} name - Playlist name.
 * @returns {number} ID of the created playlist.
 */
const createPlaylist = async (name) => {
  const response = await axios({
    method: 'post',
    url: `https://api.deezer.com/user/${config.deezerUserId}/playlists`,
    params: {
      access_token: config.deezerAccessToken,
      title: name,
    },
  });

  return response?.data?.id;
};

/**
 * Add some tracks to an existing Deezer playlist.
 * @param {number} playlistId - Playlist id.
 * @param {Array<number>} trackIds - List of track ids.
 */
const addTracksToPlaylist = async (playlistId, trackIds) => {
  await axios({
    method: 'post',
    url: `https://api.deezer.com/playlist/${playlistId}/tracks`,
    params: {
      access_token: config.deezerAccessToken,
      songs: trackIds.toString(),
    },
  });
};

/**
 * Remove a Deezer playlist.
 * @param {number} playlistId - Playlist id.
 */
const removePlaylist = async (playlistId) => {
  await axios({
    method: 'delete',
    url: `https://api.deezer.com/playlist/${playlistId}`,
    params: {
      access_token: config.deezerAccessToken,
    },
  });
};

/**
 * Search for a Deezer track.
 * @param {string} artistName - Name of the artist.
 * @param {string} songName - Name of the song.
 * @returns {number|undefined} Track id if found.
 */
const searchTrack = async (artistName, songName) => {
  const response = await axios({
    method: 'get',
    url: 'https://api.deezer.com/search/track',
    params: {
      q: `artist:"${artistName}" track:"${songName}"`,
      index: 0,
      limit: 1,
    },
  });

  return response?.data?.data[0]?.id;
};

export default {
  getExistingUserPlaylists,
  createPlaylist,
  addTracksToPlaylist,
  removePlaylist,
  searchTrack,
};
