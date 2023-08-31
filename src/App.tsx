import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import Plyr, { APITypes, PlyrProps } from 'plyr-react';
import 'plyr-react/plyr.css';

declare global {
  interface Window {
    hls: Hls;
  }
}

const controls = [
  'play-large',
  'play',
  'fast-forward',
  'progress',
  'current-time',
  'mute',
  'volume',
  'settings',
  'fullscreen',
];

const App = () => {
  const [qualities, setQualities] = useState<number[]>([1080, 720]);
  const ref = useRef<APITypes>(null);
  const supported = Hls.isSupported();
  const hls = new Hls();

  useEffect(() => {
    const video = document.getElementById('player') as HTMLVideoElement;
    hls.loadSource('https://video.metaserv.vn:444/hls/31082023/costa-rica,-720p.mp4,.mp4,.urlset/master.m3u8');
    // hls.loadSource('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8');
    hls.attachMedia(video);
    window.hls = hls;

    // hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //   setQualities(hls.levels.map((level) => level.height));
    // });
  }, []);

  // useEffect(() => {
  //   // const video = document.getElementById('player') as HTMLVideoElement;
  //   hls.startLoad();
  //   // hls.loadSource('https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8');
  //   // hls.loadSource('https://video.metaserv.vn:444/hls/31082023/costa-rica,-720p.mp4,.mp4,.urlset/master.m3u8');
  //   // hls.attachMedia(video);
  // }, [qualities]);

  const onChangeQuality = (newQuality: number) => {
    if (!window.hls) {
      return;
    }

    if (newQuality === 0) {
      window.hls.currentLevel = -1;
    } else {
      window.hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          window.hls.currentLevel = levelIndex;
        }
      });
    }
  };

  return (
    <div style={{ width: 1000 }}>
      {supported ? (
        <Plyr
          id='player'
          options={{
            controls,
            quality: { default: 0, options: qualities, forced: true, onChange: (e) => onChangeQuality(e) },
          }}
          source={{} as PlyrProps['source']}
          ref={ref}
        />
      ) : (
        'HLS is not supported in your browser'
      )}
    </div>
  );
};

export default App;
