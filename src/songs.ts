export type Song = {
  id: string;
  title: string;
  artist: string;
  notes: string;
  transcriptionStatus: 'not-started';
};

export const songs: Song[] = [
  {
    id: 'nos-vamos-invadir-sua-praia',
    title: 'Nós Vamos Invadir Sua Praia',
    artist: 'Ultraje a Rigor',
    notes: 'Test case: guitar and bass riff, song sections and vocal cues.',
    transcriptionStatus: 'not-started',
  },
  {
    id: 'i-saw-you-saying',
    title: 'I Saw You Saying (That You Say That You Saw)',
    artist: 'Raimundos',
    notes: 'Test case: guitar techniques, chord changes and voice cues.',
    transcriptionStatus: 'not-started',
  },
  {
    id: 'learn-to-fly',
    title: 'Learn to Fly',
    artist: 'Foo Fighters',
    notes: 'Test case: multiple guitar tracks, bass, drums and vocals.',
    transcriptionStatus: 'not-started',
  },
];
