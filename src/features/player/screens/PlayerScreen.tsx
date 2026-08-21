import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { vlcPlayerService } from '../../../data/services/vlcPlayerService';

import GestureLayer from '../components/GestureLayer';
import VolumeBrightnessIndicator from '../components/VolumeBrightnessIndicator';
import SeekScrubOverlay from '../components/SeekScrubOverlay';
import PlayerControlsOverlay from '../components/PlayerControlsOverlay';
import LockScreenButton from '../components/LockScreenButton';
import PlayerMoreOptionsModal from '../components/PlayerMoreOptionsModal';
import SubtitleSearchModal from '../../subtitles/screens/SubtitleSearchModal';
import EqualizerScreen from '../../equalizer/screens/EqualizerScreen';
import AudioDelayControlModal from '../components/AudioDelayControlModal';

interface PlayerScreenProps {
  uri?: string;
  title?: string;
  onBack?: () => void;
}

const DEFAULT_SAMPLE_URI =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function PlayerScreen({
  uri = DEFAULT_SAMPLE_URI,
  title = 'Big Buck Bunny',
  onBack,
}: PlayerScreenProps) {
  const vlcRef = useRef<any>(null);
  const { playbackState, open } = usePlayerStore();
  const { isPlaying } = playbackState;

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [equalizerVisible, setEqualizerVisible] = useState(false);
  const [audioDelayVisible, setAudioDelayVisible] = useState(false);

  useEffect(() => {
    open(uri);
  }, [uri, open]);

  const handleRef = (ref: any) => {
    vlcRef.current = ref;
    if (ref) {
      vlcPlayerService.attachRef(ref);
    } else {
      vlcPlayerService.detachRef();
    }
  };

  const handleProgress = (event: any) => {
    const currentMs = (event.currentTime || 0) * 1000;
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      positionMs: currentMs,
      durationMs: durMs > 0 ? durMs : playbackState.durationMs,
      isBuffering: false,
    });
  };

  const handlePlaying = (event: any) => {
    const durMs = (event.duration || 0) * 1000;
    vlcPlayerService.updateState({
      isPlaying: true,
      isBuffering: false,
      durationMs: durMs > 0 ? durMs : playbackState.durationMs,
    });
  };

  const handlePaused = () => {
    vlcPlayerService.updateState({ isPlaying: false });
  };

  const handleBuffering = () => {
    vlcPlayerService.updateState({ isBuffering: true });
  };

  const handleEnded = () => {
    vlcPlayerService.handleEndReached();
  };

  if (equalizerVisible) {
    return <EqualizerScreen onBack={() => setEqualizerVisible(false)} />;
  }

  return (
    <View style={styles.container}>
      <GestureLayer>
        <VLCPlayer
          ref={handleRef}
          style={styles.video}
          source={{ uri }}
          paused={!isPlaying}
          onProgress={handleProgress}
          onPlaying={handlePlaying}
          onPaused={handlePaused}
          onBuffering={handleBuffering}
          onEnd={handleEnded}
          autoplay={true}
        />
        <VolumeBrightnessIndicator />
        <SeekScrubOverlay />
        <PlayerControlsOverlay
          title={title}
          onBack={onBack}
          onMoreOptions={() => setOptionsVisible(true)}
        />
        <LockScreenButton />
      </GestureLayer>

      <PlayerMoreOptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        onOpenSubtitlesSearch={() => setSubModalVisible(true)}
        onOpenEqualizer={() => setEqualizerVisible(true)}
        onOpenAudioDelay={() => setAudioDelayVisible(true)}
      />

      <SubtitleSearchModal
        visible={subModalVisible}
        initialQuery={title}
        onClose={() => setSubModalVisible(false)}
      />

      <AudioDelayControlModal
        visible={audioDelayVisible}
        onClose={() => setAudioDelayVisible(false)}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width,
    height,
    position: 'absolute',
  },
});
