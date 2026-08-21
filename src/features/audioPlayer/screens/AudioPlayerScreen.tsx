import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { useLibraryStore } from '../../../store/useLibraryStore';
import AudioLyricsModal from '../components/AudioLyricsModal';
import AudioMoreOptionsModal from '../components/AudioMoreOptionsModal';
import EqualizerScreen from '../../equalizer/screens/EqualizerScreen';

interface AudioPlayerScreenProps {
  title?: string;
  artist?: string;
  onBack?: () => void;
}

type ShuffleMode = 'off' | 'on';
type RepeatMode = 'off' | 'one' | 'all';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function AudioPlayerScreen({
  title = 'Audio Track Title',
  artist = 'Aperture Music Engine',
  onBack,
}: AudioPlayerScreenProps) {
  const { playbackState, play, pause, seekRelative, service } = usePlayerStore();
  const { positionMs, durationMs, isPlaying } = playbackState;

  const [isLiked, setIsLiked] = useState(false);
  const [shuffleMode, setShuffleMode] = useState<ShuffleMode>('off');
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [equalizerVisible, setEqualizerVisible] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleShuffle = () => {
    setShuffleMode(shuffleMode === 'off' ? 'on' : 'off');
  };

  if (equalizerVisible) {
    return <EqualizerScreen onBack={() => setEqualizerVisible(false)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E10" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onBack}>
          <Ionicons name="chevron-down" size={26} color="#F5F5F7" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>PLAYING FROM LIBRARY</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={() => setOptionsVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#F5F5F7" />
        </TouchableOpacity>
      </View>

      {/* Album Art Vinyl Card */}
      <View style={styles.artContainer}>
        <View style={styles.artCard}>
          <View style={styles.artCircle}>
            <Ionicons name="disc" size={140} color="#5B8CFF" />
          </View>
        </View>
      </View>

      {/* Track Info & Favorites Heart Button */}
      <View style={styles.trackInfoRow}>
        <View style={styles.trackTextContainer}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {artist}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.heartButton}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={26}
            color={isLiked ? '#FF495C' : '#A0A0A8'}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMs > 0 ? durationMs : 1}
          value={positionMs}
          minimumTrackTintColor="#5B8CFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
          thumbTintColor="#FFFFFF"
          onSlidingComplete={async (val) => await service.seek(val)}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
        </View>
      </View>

      {/* Main Playback Controls Row */}
      <View style={styles.controlsRow}>
        {/* Shuffle Mode */}
        <TouchableOpacity style={styles.controlButton} onPress={toggleShuffle}>
          <Ionicons
            name="shuffle"
            size={22}
            color={shuffleMode === 'on' ? '#5B8CFF' : '#A0A0A8'}
          />
        </TouchableOpacity>

        {/* Skip Previous */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => useLibraryStore.getState().playPrevious()}
        >
          <Ionicons name="play-skip-back" size={26} color="#F5F5F7" />
        </TouchableOpacity>

        {/* Rewind 10s */}
        <TouchableOpacity style={styles.controlButton} onPress={() => seekRelative(-10000)}>
          <Ionicons name="play-back-outline" size={22} color="#A0A0A8" />
        </TouchableOpacity>

        {/* Play / Pause Main Button */}
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color="#000000"
            style={isPlaying ? null : styles.playIconOffset}
          />
        </TouchableOpacity>

        {/* Forward 10s */}
        <TouchableOpacity style={styles.controlButton} onPress={() => seekRelative(10000)}>
          <Ionicons name="play-forward-outline" size={22} color="#A0A0A8" />
        </TouchableOpacity>

        {/* Skip Next */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => useLibraryStore.getState().playNext()}
        >
          <Ionicons name="play-skip-forward" size={26} color="#F5F5F7" />
        </TouchableOpacity>

        {/* Repeat Mode */}
        <TouchableOpacity style={styles.controlButton} onPress={toggleRepeat}>
          <Ionicons
            name={repeatMode === 'one' ? 'repeat' : 'repeat-outline'}
            size={22}
            color={repeatMode !== 'off' ? '#5B8CFF' : '#A0A0A8'}
          />
          {repeatMode === 'one' && <Text style={styles.repeatBadge}>1</Text>}
        </TouchableOpacity>
      </View>

      {/* Bottom Bar: Lyrics & Equalizer Shortcuts */}
      <View style={styles.bottomToolBar}>
        <TouchableOpacity style={styles.toolCta} onPress={() => setLyricsVisible(true)}>
          <Ionicons name="document-text-outline" size={18} color="#00E676" style={styles.toolIcon} />
          <Text style={styles.toolText}>Lyrics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCta} onPress={() => setEqualizerVisible(true)}>
          <Ionicons name="options-outline" size={18} color="#5B8CFF" style={styles.toolIcon} />
          <Text style={styles.toolText}>Equalizer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCta} onPress={() => setOptionsVisible(true)}>
          <Ionicons name="timer-outline" size={18} color="#FFB300" style={styles.toolIcon} />
          <Text style={styles.toolText}>Timer</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AudioLyricsModal
        visible={lyricsVisible}
        title={title}
        onClose={() => setLyricsVisible(false)}
      />

      <AudioMoreOptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        onOpenEqualizer={() => setEqualizerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E10',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerSubtitle: {
    color: '#A0A0A8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  artContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  artCard: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#161619',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(91, 140, 255, 0.3)',
    shadowColor: '#5B8CFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  artCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  trackTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    color: '#F5F5F7',
    fontSize: 20,
    fontWeight: '800',
  },
  trackArtist: {
    color: '#A0A0A8',
    fontSize: 14,
    marginTop: 4,
  },
  heartButton: {
    padding: 8,
  },
  sliderContainer: {
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    color: '#A0A0A8',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginVertical: 14,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5B8CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOffset: {
    marginLeft: 3,
  },
  repeatBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    color: '#5B8CFF',
    fontSize: 10,
    fontWeight: '900',
  },
  bottomToolBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  toolCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161619',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toolIcon: {
    marginRight: 6,
  },
  toolText: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
  },
});
