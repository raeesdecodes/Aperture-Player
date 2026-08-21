import TrackPlayer, { Event } from 'react-native-track-player';
import { vlcPlayerService } from './src/data/services/vlcPlayerService';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    vlcPlayerService.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    vlcPlayerService.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    vlcPlayerService.seek(event.position * 1000);
  });
};
