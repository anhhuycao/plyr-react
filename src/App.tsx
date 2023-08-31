import Hls from 'hls.js';
import { useEffect, useRef } from 'react';
import Plyr, { APITypes, PlyrProps } from 'plyr-react';
import 'plyr-react/plyr.css';

declare global {
  interface Window {
    hls: Hls;
  }
}

const App = () => {
  const hls = new Hls();
  const ref = useRef<APITypes>(null);
  const supported = Hls.isSupported();
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

  useEffect(() => {
    const video = document.getElementById('player') as HTMLVideoElement;
    hls.loadSource('https://video.metaserv.vn:444/hls/31082023/costa-rica,720p.mp4,1080p.mp4,.urlset/master.m3u8');
    hls.attachMedia(video);
    window.hls = hls;

    // hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //   hls.levels.map((level) => level.height);
    // });
  }, []);

  const onChangeQuality = (newQuality: number): void => {
    if (window.hls) {
      window.hls.levels.forEach((level, index) => {
        if (level.height === newQuality) {
          window.hls.currentLevel = index;
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
            quality: { default: 0, options: [1080, 720], forced: true, onChange: (e) => onChangeQuality(e) },
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
