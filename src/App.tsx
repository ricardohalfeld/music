import { useEffect, useRef, useState } from 'react';
import * as alphaTab from '@coderline/alphatab';
import { songs } from './songs';

const initialTex = [
  '\\title "Arpeggio Study"',
  '\\subtitle "Music Notebook Experiment"',
  '\\tempo 96',
  '\\track "Guitar"',
  '\\instrument 25',
  '.',
  ':8 0.6 2.4 0.3 3.2 0.1 3.2 0.3 2.4 |',
  ':8 0.5 2.4 0.3 1.2 0.1 1.2 0.3 2.4 |',
  ':8 3.6 2.4 0.3 0.2 3.2 0.2 0.3 2.4 |',
  ':8 2.4 0.3 2.2 0.1 3.2 0.1 2.2 0.3 |',
].join('\n');

const chords = ['Em7', 'Cmaj7', 'G', 'D'];
type View = 'simple' | 'tab' | 'playback';

function Score({ tex, playback }: { tex: string; playback: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<alphaTab.AlphaTabApi | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!container.current) return;
    setReady(false);
    setPlaying(false);
    setError('');
    const instance = new alphaTab.AlphaTabApi(container.current, {
      core: { fontDirectory: '/font/' },
      player: {
        enablePlayer: playback,
        soundFont: '/soundfont/sonivox.sf2',
      },
    });
    api.current = instance;
    instance.error.on((e) => setError(String(e)));
    instance.playerReady.on(() => setReady(true));
    instance.playerStateChanged.on((e) => setPlaying(e.state === alphaTab.synth.PlayerState.Playing));
    instance.tex(tex);
    return () => {
      api.current = null;
      instance.destroy();
    };
  }, [playback]);

  useEffect(() => {
    if (api.current) {
      try { api.current.tex(tex); } catch (e) { setError(String(e)); }
    }
  }, [tex]);

  return (
    <div className="score-panel">
      {playback && <div className="player-controls">
        <button onClick={() => api.current?.playPause()} disabled={!ready}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="secondary" onClick={() => api.current?.stop()} disabled={!ready}>Stop</button>
        <span className="muted">{ready ? 'Player ready' : 'Loading SoundFont…'}</span>
      </div>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="score-scroll"><div ref={container} /></div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('simple');
  const [songId, setSongId] = useState(songs[0].id);
  const song = songs.find((item) => item.id === songId)!;
  const [tex, setTex] = useState(initialTex);
  const [showEditor, setShowEditor] = useState(false);
  return (
    <main className="shell">
      <section className="song-picker"><label htmlFor="song">Test song</label><select id="song" value={songId} onChange={(e) => setSongId(e.target.value)}>{songs.map((item) => <option key={item.id} value={item.id}>{item.artist} — {item.title}</option>)}</select></section>
      <header className="header">
        <div><span className="eyebrow">MUSIC NOTEBOOK · PROTOTYPE 01</span><h1>{song.title}</h1>
          <p className="muted">{song.artist} · Transcription not started</p></div>
        <div className="key">Key <strong>Not entered</strong></div>
      </header>
      <p className="notice">{song.notes} The notation below is an <strong>original technical demo</strong>, not a transcription of this song. Its chords, tempo and harmonic analysis belong only to the demo.</p>
      <section className="card">
        <div className="section-title"><h2>Demo: Arpeggio Study</h2><span className="muted">E minor · 96 BPM · 4 measures</span></div>
        <div className="chord-grid">{chords.map((chord, i) =>
          <div className="chord" key={i}><small>BAR {i + 1}</small><strong>{chord}</strong></div>)}</div>
        <nav aria-label="Detail level" className="tabs">
          {(['simple', 'tab', 'playback'] as View[]).map((v) =>
            <button key={v} className={view === v ? 'selected' : ''} onClick={() => setView(v)}>
              {v === 'simple' ? 'Simple' : v === 'tab' ? 'Tab' : 'Playback'}
            </button>)}
        </nav>
        {view === 'simple' ?
          <div className="detail"><h3>Playing notes</h3><p>Fingerpicked eighth notes. Repeat twice.</p>
            <p><b>Harmony:</b> i⁷ → VImaj7 → III → VII in E natural minor.</p>
            <p><b>Em7 chord tones:</b> E · G · B · D</p></div> :
          <><Score tex={tex} playback={view === 'playback'} />
          <div className="editor-header">
            <button className="link-button" onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? 'Hide' : 'Edit'} alphaTex source
            </button>
          </div>
          {showEditor && <div className="editor">
            <label htmlFor="notation">alphaTex notation</label>
            <textarea id="notation" spellCheck={false} value={tex} onChange={(e) => setTex(e.target.value)} rows={14} />
            <button className="secondary" onClick={() => setTex(initialTex)}>Restore sample</button>
          </div>}</>}
      </section>
      <footer>Music data and notation are intentionally separate. Changes are not saved yet.</footer>
    </main>
  );
}
