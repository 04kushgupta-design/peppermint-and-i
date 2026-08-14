import { useEffect, useRef, useState, type ReactNode } from 'react'
import './App.css'
import { memoryManifest, type MemoryCategory } from './memoryManifest'

import herOne from './assets/curated/galleries/her-1.JPG?url'
import herTwo from './assets/curated/galleries/her-2.JPG?url'
import usOne from './assets/curated/galleries/us-1.JPG?url'
import usTwo from './assets/curated/galleries/us-2.JPG?url'
import facetimeOne from './assets/curated/galleries/facetime-1.jpeg'
import facetimeTwo from './assets/curated/galleries/facetime-2.jpeg'
import foodOne from './assets/curated/galleries/food-1.JPG?url'
import foodTwo from './assets/curated/galleries/food-2.JPG?url'
import drawingTwo from './assets/curated/drawings/Future.jpeg'
import dateFiveHug from './assets/curated/drawings/Date5Hug.PNG?url'
import feelings from './assets/curated/drawings/Feelings.jpeg'
import firstPhotoOfUs from './assets/curated/galleries/FirstPhotoOfUs.jpeg'
import happy from './assets/curated/drawings/Happy.PNG?url'
import loveExplosion from './assets/curated/drawings/LoveExplosion.PNG?url'
import favoritePhotoOfHer from './assets/curated/galleries/MyFavoritePhotoOfHer.jpeg'
import ourDynamic from './assets/curated/drawings/OurDyanmic.PNG?url'
import theSound from './assets/curated/music/TheSound.jpeg'

type PhotoFile = {
  src: string
  key: string
  width?: number
  height?: number
  caption?: string
  sourceFolder?: string
}

type PhotoSection = {
  id: MemoryCategory
  label: string
  symbol: string
  photos: readonly PhotoFile[]
}

type StellaSection = {
  id: 'stella-status'
  label: 'STELLA STATUS'
  symbol: string
}

type Section = PhotoSection | StellaSection

type AdventureFolder = {
  id: string
  title: string
  photos: readonly PhotoFile[]
}

const memoryAssetModules = import.meta.glob('./assets/memories/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const importedPhotos = memoryManifest.map(record => {
  const src = memoryAssetModules[`./assets/memories/${record.path}`]
  if (!src) throw new Error(`Missing imported memory asset: ${record.path}`)
  return {
    src,
    key: record.name,
    width: record.width,
    height: record.height,
    category: record.category,
    dessert: record.dessert,
    sourceFolder: record.path.split('/')[0],
  }
})

const photosFor = (category: MemoryCategory): PhotoFile[] => importedPhotos.filter(photo => (
  photo.category === category && !photo.dessert
))

const importedAdventurePhotos = photosFor('adventures')
const datedAdventureFolders = [3, 4, 8, 9, 10, 11, 12, 13].map(date => ({
  id: `date-${date}`,
  title: `date_${date}.folder`,
  photos: importedAdventurePhotos.filter(photo => photo.sourceFolder === `Date${date}`),
})).filter(folder => folder.photos.length > 0)

const otherAdventurePhotos = [
  ...importedAdventurePhotos.filter(photo => !/^Date\d+$/.test(photo.sourceFolder ?? '')),
]

const adventureFolders: readonly AdventureFolder[] = [
  ...datedAdventureFolders,
  ...(otherAdventurePhotos.length > 0 ? [{ id: 'other-adventures', title: 'other_adventures.folder', photos: otherAdventurePhotos }] : []),
]

const sections: readonly Section[] = [
  {
    id: 'her',
    label: 'HER',
    symbol: '✿',
    photos: [
      { src: herOne, key: 'curated-her-one' },
      { src: herTwo, key: 'curated-her-two' },
      { src: favoritePhotoOfHer, key: 'curated-favorite-photo-of-her', caption: 'My Favorite Photo Of Her' },
      ...photosFor('her'),
    ],
  },
  {
    id: 'us',
    label: 'US',
    symbol: '♥',
    photos: [
      { src: usOne, key: 'curated-us-one' },
      { src: usTwo, key: 'curated-us-two' },
      { src: firstPhotoOfUs, key: 'curated-first-photo-of-us', caption: 'First Photo Of Us' },
      ...photosFor('us'),
    ],
  },
  {
    id: 'facetime',
    label: 'FACETIME',
    symbol: '▣',
    photos: [
      { src: facetimeOne, key: 'curated-facetime-one', caption: 'Smiling Facetime Picture' },
      { src: facetimeTwo, key: 'curated-facetime-two', caption: 'Post Drawing' },
      ...photosFor('facetime'),
    ],
  },
  {
    id: 'food',
    label: 'FOOD',
    symbol: '♨',
    photos: [
      { src: foodOne, key: 'curated-food-one' },
      { src: foodTwo, key: 'curated-food-two' },
      ...photosFor('food'),
    ],
  },
  {
    id: 'drawings',
    label: 'DRAWINGS',
    symbol: '✎',
    photos: [
      { src: dateFiveHug, key: 'curated-date-five-hug', caption: 'Date 5 Hug' },
      { src: feelings, key: 'curated-feelings', caption: 'Feelings' },
      { src: drawingTwo, key: 'curated-future', caption: 'Future?' },
      { src: happy, key: 'curated-happy', caption: 'Happy' },
      { src: loveExplosion, key: 'curated-love-explosion', caption: 'Love Explosion' },
      { src: ourDynamic, key: 'curated-our-dynamic', caption: 'Our Dyanmic' },
    ],
  },
  {
    id: 'adventures',
    label: 'ADVENTURES',
    symbol: '⚿',
    photos: importedAdventurePhotos,
  },
  {
    id: 'stella-status',
    label: 'STELLA STATUS',
    symbol: '?',
  },
  {
    id: 'music',
    label: 'MUSIC',
    symbol: '♫',
    photos: [{ src: theSound, key: 'curated-the-sound', caption: 'The Sound' }],
  },
]

type UtilityWindow = 'grapefruit' | 'dessert' | 'letter' | 'stella' | 'taco' | 'claude'
type BackroomsPhase = 'idle' | 'flicker' | 'glitch' | 'creature' | 'active' | 'restore'

const dessertPhotos: PhotoFile[] = importedPhotos.filter(photo => photo.dessert)
const westCoastUrl = 'https://open.spotify.com/track/1W1E807HjrMFYSpBysrgHp'
const playlistUrl = 'https://open.spotify.com/playlist/0knhQaSLEIojGVYscydAfS?si=2841f1a0cd1849ed'

const featuredSongs = [
  { number: '01', title: 'West Coast', artist: 'Lana Del Rey', label: <>WEST<br />COAST</> },
  { number: '02', title: 'BLUE', artist: 'Billie Eilish', label: <>BL<br />UE</> },
  { number: '03', title: 'Daddy Issues', artist: 'The Neighbourhood', label: <>DADDY<br />ISSUES</> },
] as const

const tacoBellOrder = [
  ['CBR', 'cheesy bean rice'],
  ['SSTWB', 'supreme soft taco with beans'],
  ['3CCFM', '3 cheese chicken flatbread melt'],
  ['ACSR', 'avocado chicken ranch stacker'],
  ['BBF', 'baja blast freeze'],
] as const

function RetroWindow({
  title,
  closeLabel,
  onClose,
  children,
  className = '',
}: {
  title: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <div className="modal-layer" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className={`memory-window ${className}`} role="dialog" aria-modal="true" aria-labelledby="window-title">
        <div className="window-bar">
          <span aria-hidden="true">♥</span>
          <h2 id="window-title">{title}</h2>
          <div className="window-controls" aria-hidden="true"><span>—</span><span>□</span></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel}>×</button>
        </div>
        {children}
      </section>
    </div>
  )
}

function PhotoFiles({ photos, onOpen }: { photos: readonly PhotoFile[]; onOpen: (photo: PhotoFile) => void }) {
  return (
    <div className={`folder-files ${photos.length === 1 ? 'single-file' : ''}`}>
      {photos.map(photo => (
        <button className="file-photo" type="button" key={photo.key} onClick={() => onOpen(photo)} aria-label="Open memory photo">
          <span className="photo-frame"><img src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" /></span>
          {photo.caption && <span className="photo-note">{photo.caption}</span>}
        </button>
      ))}
    </div>
  )
}

function MemoryWindow({ section, onClose, onPhotoOpen }: { section: PhotoSection; onClose: () => void; onPhotoOpen: (photo: PhotoFile) => void }) {
  return (
    <RetroWindow title={`${section.label.toLowerCase()}.folder`} closeLabel={`Close ${section.label}`} onClose={onClose} className="collection-window">
      <PhotoFiles photos={section.photos} onOpen={onPhotoOpen} />
    </RetroWindow>
  )
}

function PhotoViewer({ photo, onClose }: { photo: PhotoFile; onClose: () => void }) {
  return (
    <div className="photo-viewer" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <figure className={photo.caption ? 'has-caption' : ''} role="dialog" aria-modal="true" aria-label="Enlarged memory photo">
        <button type="button" onClick={onClose} aria-label="Close photo">×</button>
        <img src={photo.src} alt="" />
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>
    </div>
  )
}

function AdventureWindow({ activeFolderId, onFolderOpen, onBack, onClose, onPhotoOpen }: {
  activeFolderId: string | null
  onFolderOpen: (folderId: string) => void
  onBack: () => void
  onClose: () => void
  onPhotoOpen: (photo: PhotoFile) => void
}) {
  const activeFolder = adventureFolders.find(folder => folder.id === activeFolderId)

  if (activeFolder) {
    return (
      <RetroWindow title={activeFolder.title} closeLabel="Close ADVENTURES" onClose={onClose} className="collection-window adventure-window">
        <div className="folder-toolbar"><button type="button" onClick={onBack}>← adventures</button></div>
        <PhotoFiles photos={activeFolder.photos} onOpen={onPhotoOpen} />
      </RetroWindow>
    )
  }

  return (
    <RetroWindow title="adventures.folder" closeLabel="Close ADVENTURES" onClose={onClose} className="adventure-window">
      <div className="adventure-folders">
        {adventureFolders.map(folder => (
          <button type="button" key={folder.id} onClick={() => onFolderOpen(folder.id)}>
            <span className="retro-folder-icon" aria-hidden="true"><i>♥</i></span>
            <span>{folder.title}</span>
          </button>
        ))}
      </div>
    </RetroWindow>
  )
}

function StellaStatusWindow({ requested, requester, onRequestedChange, onRequesterChange, onClose }: {
  requested: 'yes' | 'no' | null
  requester: 'K' | 'L' | null
  onRequestedChange: (value: 'yes' | 'no') => void
  onRequesterChange: (value: 'K' | 'L') => void
  onClose: () => void
}) {
  return (
    <RetroWindow title="stella_status.exe" closeLabel="Close Stella status" onClose={onClose} className="utility-window stella-window">
      <div className="stella-status">
        <div className="stella-row">
          <span className="stella-heading"><i className={`status-led ${requested === 'yes' ? 'active' : 'inactive'}`} aria-hidden="true" />STATUS:</span>
          <div className="status-options">
            <button className={requested === 'yes' ? 'selected' : ''} type="button" aria-pressed={requested === 'yes'} onClick={() => onRequestedChange('yes')}>YES</button>
            <button className={requested === 'no' ? 'selected' : ''} type="button" aria-pressed={requested === 'no'} onClick={() => onRequestedChange('no')}>NO</button>
          </div>
        </div>
        <div className="stella-row">
          <span>REQUESTED BY:</span>
          <div className="status-options requester-options">
            <button className={requested === 'yes' && requester === 'K' ? 'selected' : ''} type="button" disabled={requested !== 'yes'} aria-pressed={requested === 'yes' && requester === 'K'} onClick={() => onRequesterChange('K')}>K</button>
            <button className={requested === 'yes' && requester === 'L' ? 'selected' : ''} type="button" disabled={requested !== 'yes'} aria-pressed={requested === 'yes' && requester === 'L'} onClick={() => onRequesterChange('L')}>L</button>
          </div>
        </div>
      </div>
    </RetroWindow>
  )
}

function TacoBellMenu({ onClose }: { onClose: () => void }) {
  return (
    <RetroWindow title="taco_bell.menu" closeLabel="Close Taco Bell menu" onClose={onClose} className="utility-window taco-menu-window">
      <div className="taco-menu">
        <div className="menu-diablo-packets" aria-hidden="true"><i>DIABLO</i><i>DIABLO</i></div>
        <div className="taco-menu-list">
          {tacoBellOrder.map(([abbreviation, meaning]) => (
            <div className="taco-menu-row" key={abbreviation}>
              <strong>{abbreviation}</strong>
              <span>{meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </RetroWindow>
  )
}

function MusicWindow({ onClose, onPhotoOpen }: { onClose: () => void; onPhotoOpen: (photo: PhotoFile) => void }) {
  const [selectedSong, setSelectedSong] = useState(0)
  const song = featuredSongs[selectedSong]
  const soundPhoto = sections.find((section): section is PhotoSection => section.id === 'music')!.photos[0]

  return (
    <RetroWindow title="music.player" closeLabel="Close music player" onClose={onClose} className="music-window">
      <div className="music-player">
        <p className="music-intro">what this summer sounded like</p>
        <div className="player-layout">
          <div className="turntable" aria-label={`${song.title} by ${song.artist} selected`}>
            <span className="turntable-lid" aria-hidden="true" />
            <span className="vinyl spinning" aria-hidden="true"><span className={`vinyl-label vinyl-label-${selectedSong}`}>{song.label}</span></span>
            <span className="tonearm engaged" aria-hidden="true"><i /></span>
            <span className="player-light" aria-hidden="true" />
          </div>
          <div className="track-panel">
            <ol className="track-list" aria-label="Featured songs">
              {featuredSongs.map((track, index) => (
                <li key={track.number}>
                  <button className={selectedSong === index ? 'selected' : ''} type="button" onClick={() => setSelectedSong(index)} aria-pressed={selectedSong === index}>
                    <span>{track.number}</span><strong>{track.title}</strong><small>{track.artist}</small>
                  </button>
                </li>
              ))}
            </ol>
            <button className="sound-memory" type="button" onClick={() => onPhotoOpen(soundPhoto)} aria-label="Open memory photo">
              <span><img src={soundPhoto.src} alt="" /></span>
              {soundPhoto.caption && <small>{soundPhoto.caption}</small>}
            </button>
          </div>
        </div>
        <div className="music-footer"><span>♫ you + me</span><span>what this summer sounded like</span></div>
        <a className="playlist-link" href={playlistUrl} target="_blank" rel="noreferrer">[ OPEN FULL PLAYLIST ]</a>
      </div>
    </RetroWindow>
  )
}

function PixelCar({ color, name, model, onHonk }: { color: 'black' | 'gray'; name: string; model: string; onHonk: () => void }) {
  return (
    <button className="car-wrap" type="button" title={`${name} — ${model}`} onClick={onHonk} aria-label={`${name}, ${model}. Honk.`}>
      <span className={`pixel-car ${color}`} aria-hidden="true">
        <span className="car-window" />
        <span className="headlight left" />
        <span className="headlight right" />
        <span className="wheel left" />
        <span className="wheel right" />
        <span className="car-plate">{color === 'black' ? 'CX-5' : 'QX50'}</span>
      </span>
      <span>{name}</span>
    </button>
  )
}

function playHonk(car: 'benedict' | 'florentine') {
  try {
    const audio = new AudioContext()
    const notes = car === 'benedict'
      ? [[248, 0, 0.13]]
      : [[196, 0, 0.09], [220, 0.12, 0.09]]

    notes.forEach(([frequency, delay, duration]) => {
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      oscillator.type = 'square'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.035, audio.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + duration)
      oscillator.connect(gain)
      gain.connect(audio.destination)
      oscillator.start(audio.currentTime + delay)
      oscillator.stop(audio.currentTime + delay + duration)
    })

    window.setTimeout(() => void audio.close(), 450)
  } catch {
    // Audio is a tiny enhancement and may be unavailable in some browsers.
  }
}

function playBackroomsSound() {
  try {
    const audio = new AudioContext()
    const gain = audio.createGain()
    gain.gain.setValueAtTime(0.018, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.34)
    gain.connect(audio.destination)

    ;[83, 117, 76].forEach((frequency, index) => {
      const oscillator = audio.createOscillator()
      oscillator.type = index === 1 ? 'square' : 'sawtooth'
      oscillator.frequency.setValueAtTime(frequency, audio.currentTime + index * 0.075)
      oscillator.connect(gain)
      oscillator.start(audio.currentTime + index * 0.075)
      oscillator.stop(audio.currentTime + 0.16 + index * 0.075)
    })

    window.setTimeout(() => void audio.close(), 500)
  } catch {
    // The visual Easter egg works without audio.
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<PhotoSection | null>(null)
  const [activeUtility, setActiveUtility] = useState<UtilityWindow | null>(null)
  const [activePhoto, setActivePhoto] = useState<PhotoFile | null>(null)
  const [activeAdventureFolder, setActiveAdventureFolder] = useState<string | null>(null)
  const [stellaRequested, setStellaRequested] = useState<'yes' | 'no' | null>(null)
  const [stellaRequester, setStellaRequester] = useState<'K' | 'L' | null>(null)
  const [grapefruitPressed, setGrapefruitPressed] = useState(false)
  const [moonMode, setMoonMode] = useState(false)
  const [spriteFizzy, setSpriteFizzy] = useState(false)
  const [backroomsPhase, setBackroomsPhase] = useState<BackroomsPhase>('idle')
  const grapefruitTimer = useRef<number | null>(null)
  const moonTimer = useRef<number | null>(null)
  const spriteTimer = useRef<number | null>(null)
  const backroomsTimers = useRef<number[]>([])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (activePhoto) setActivePhoto(null)
      else if (activeAdventureFolder) setActiveAdventureFolder(null)
      else if (activeSection) setActiveSection(null)
      else if (activeUtility) setActiveUtility(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeAdventureFolder, activePhoto, activeSection, activeUtility])

  useEffect(() => () => {
    if (grapefruitTimer.current) window.clearTimeout(grapefruitTimer.current)
    if (moonTimer.current) window.clearTimeout(moonTimer.current)
    if (spriteTimer.current) window.clearTimeout(spriteTimer.current)
    backroomsTimers.current.forEach(timer => window.clearTimeout(timer))
  }, [])

  const openSection = (section: Section) => {
    setActiveAdventureFolder(null)
    if (section.id === 'stella-status') {
      setActiveSection(null)
      setActiveUtility('stella')
      return
    }
    setActiveUtility(null)
    setActiveSection(section)
  }

  const closeSection = () => {
    setActiveAdventureFolder(null)
    setActiveSection(null)
  }

  const openGrapefruit = () => {
    setGrapefruitPressed(true)
    setActiveSection(null)
    setActiveUtility('grapefruit')
    if (grapefruitTimer.current) window.clearTimeout(grapefruitTimer.current)
    grapefruitTimer.current = window.setTimeout(() => setGrapefruitPressed(false), 260)
  }

  const activateMoon = () => {
    setMoonMode(true)
    if (moonTimer.current) window.clearTimeout(moonTimer.current)
    moonTimer.current = window.setTimeout(() => setMoonMode(false), 1000)
  }

  const activateSprite = () => {
    setSpriteFizzy(false)
    window.requestAnimationFrame(() => setSpriteFizzy(true))
    if (spriteTimer.current) window.clearTimeout(spriteTimer.current)
    spriteTimer.current = window.setTimeout(() => setSpriteFizzy(false), 1000)
  }

  const activateBackrooms = () => {
    if (backroomsPhase !== 'idle') return
    backroomsTimers.current.forEach(timer => window.clearTimeout(timer))
    backroomsTimers.current = []
    setBackroomsPhase('flicker')
    playBackroomsSound()

    const schedule = (phase: BackroomsPhase, delay: number) => {
      backroomsTimers.current.push(window.setTimeout(() => setBackroomsPhase(phase), delay))
    }

    schedule('glitch', 320)
    schedule('creature', 500)
    schedule('active', 700)
    schedule('restore', 4100)
    schedule('idle', 4500)
  }

  const backroomsMode = backroomsPhase === 'glitch' || backroomsPhase === 'creature' || backroomsPhase === 'active' || backroomsPhase === 'restore'

  return (
    <main className={`desktop ${moonMode ? 'moon-mode' : ''} ${backroomsMode ? 'backrooms-mode' : ''} backrooms-${backroomsPhase}`}>
      <div className="desktop-stars right-stars" aria-hidden="true">✧ ˚ · ✦</div>

      <aside className="left-decor" aria-label="Desktop decorations">
        <div className="mini-computer"><span>♥</span></div>
        <span className="decor-label">my computer</span>
        <div className="mini-folder"><span>♥</span></div>
        <span className="decor-label">memories</span>
        <div className="claude-tile"><span>☀</span><small>Claude</small></div>
      </aside>

      <section className="desktop-window" aria-labelledby="site-title">
        <div className="window-bar main-bar">
          <span aria-hidden="true">♥</span>
          <p>{backroomsMode ? 'WHERE_ARE_WE.exe' : 'peppermint_and_i.exe'}</p>
          <div className="window-controls" aria-hidden="true"><span>—</span><span>□</span><span>×</span></div>
        </div>

        <div className="desktop-inner">
          <div className="title-sparkles" aria-hidden="true">✦ ˚ ✧ ☾ ✧ ˚ ✦</div>
          <h1 id="site-title">Peppermint and I</h1>
          <div className="title-rule"><span>♥</span></div>

          <nav className="section-grid" aria-label="Memory folders">
            {sections.map(section => (
              <button className="desktop-icon" type="button" key={section.id} onClick={() => openSection(section)}>
                <span className={`pixel-object icon-${section.id}`} aria-hidden="true">
                  <span className="icon-glyph">{section.symbol}</span>
                  {section.id === 'her' && <i className="idle-detail her-bloom">✿</i>}
                  {section.id === 'facetime' && <i className="idle-detail call-light" />}
                  {section.id === 'food' && <i className="idle-detail food-steam" />}
                  {section.id === 'drawings' && <i className="idle-detail drawing-scribble" />}
                  {section.id === 'adventures' && <i className="idle-detail adventure-marker">✦</i>}
                  {section.id === 'stella-status' && <i className={`idle-detail status-led ${stellaRequested === 'yes' ? 'active' : 'inactive'}`} />}
                  {section.id === 'music' && <i className="idle-detail music-note">♪</i>}
                </span>
                <span className="icon-label">{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="initials" aria-label="K and L"><span>✧</span> K + L <span>♥</span></div>
        </div>
      </section>

      <aside className="right-decor" aria-label="Keepsake decorations">
        <div className="pixel-flower" aria-label="Periwinkle flower"><span>✿</span></div>
        <div className="matcha" aria-label="Lavender matcha"><span className="straw" /><span>♥</span></div>
        <button className={`grapefruit-icon ${grapefruitPressed ? 'pressed' : ''}`} type="button" onClick={openGrapefruit} aria-label="grapefruit">
          <span aria-hidden="true">●</span><small>grapefruit</small>
        </button>
      </aside>

      <div className="little-world" aria-label="Little world keepsakes">
        <button className="moon-scene" type="button" onClick={activateMoon} aria-label="Full moon over White Rock Lake">
          <span className="white-rock-sky" aria-hidden="true">
            <span className="white-rock-moon" />
            <span className="white-rock-trees tree-top" />
            <span className="white-rock-trees tree-left" />
            <span className="white-rock-trees tree-right" />
            <span className="white-rock-lake" />
            <span className="white-rock-reflection" />
          </span>
        </button>
        <button className={`world-grapefruit ${grapefruitPressed ? 'pressed' : ''}`} type="button" onClick={openGrapefruit} aria-label="grapefruit">
          <span className="grapefruit-rind" aria-hidden="true"><span className="grapefruit-flesh"><i /><i /><i /><i /></span></span>
          <small>grapefruit</small>
        </button>
        <div className="escape-key" aria-label="Escape-room key"><span className="key-loop" /><span className="key-shaft" /></div>
        <button className="ice-cream" type="button" aria-label="Open dessert folder" onClick={() => setActiveUtility('dessert')}><span className="scoop" /><span className="cone" /></button>
        <div className="aquamarine-gem" aria-label="Aquamarine"><span>◆</span><small>AQUAMARINE</small></div>
        <div className="scribble" aria-label="Tiny chaotic drawing"><span>╲╱✦╳╲╱</span></div>
        <div className="tiny-claude" aria-label="Claude"><span>☀</span><small>Claude</small></div>
        <a className="west-coast" href={westCoastUrl} target="_blank" rel="noreferrer" aria-label="Open West Coast by Lana Del Rey on Spotify">
          <span className="west-sun" /><span className="palm-trunk" /><span className="palm-leaves">✣</span>
          <span className="ocean-wave wave-one" /><span className="ocean-wave wave-two" />
          <small>WEST COAST</small>
        </a>
        <button className="summer-letter" type="button" aria-label="Open summer letter" onClick={() => setActiveUtility('letter')}>
          <span className="envelope-flap" aria-hidden="true" /><small>summer_letter.txt</small>
        </button>
        <button className="taco-object" type="button" aria-label="Open Taco Bell menu" onClick={() => setActiveUtility('taco')}>
          <span className="taco-takeout" aria-hidden="true"><i>TB</i></span>
          <span className="desktop-diablo-packets" aria-hidden="true"><i>DIABLO</i><i>DIABLO</i></span>
        </button>
        <button className={`sprite-object ${spriteFizzy ? 'fizzy' : ''}`} type="button" aria-label="Sprite cup" onClick={activateSprite}>
          <span className="sprite-straw" aria-hidden="true" />
          <span className="sprite-lid" aria-hidden="true" />
          <span className="sprite-cup" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span>
        </button>
        <button className={`backrooms-hallway ${backroomsPhase === 'flicker' ? 'flicker' : ''}`} type="button" aria-label="Pixel hallway" onClick={activateBackrooms} disabled={backroomsPhase !== 'idle'}>
          <span className="hall-ceiling" aria-hidden="true"><i /></span>
          <span className="hall-doorway" aria-hidden="true" />
          <span className="hall-floor" aria-hidden="true" />
        </button>
      </div>

      {backroomsMode && <div className="backrooms-overlay" aria-hidden="true"><span className="hall-lines" /><span className="static-pixels" /></div>}
      {backroomsPhase === 'creature' && <div className="pixel-creature-flash" aria-hidden="true"><span className="pixel-creature"><i /><i /><i /></span></div>}

      <div className="desktop-shelf" aria-label="Desktop keepsakes">
        <div className="cars">
          <PixelCar color="gray" name="Benedict" model="2020 Infiniti QX50" onHonk={() => playHonk('benedict')} />
          <PixelCar color="black" name="Florentine" model="Mazda CX-5" onHonk={() => playHonk('florentine')} />
        </div>
        <div className="books" aria-label="Book stack">
          <div>Four Thousand Weeks</div>
          <div>Sapiens</div>
          <div>Everything, Everything</div>
        </div>
      </div>

      <footer className="taskbar"><span aria-hidden="true">♥ start</span><span aria-hidden="true">♫ you + me</span><button type="button" onClick={() => setActiveUtility('claude')} aria-label="Open Claude greeting">☀ Claude</button><time>11:11 PM</time></footer>

      {activeSection?.id === 'music' && <MusicWindow onClose={() => setActiveSection(null)} onPhotoOpen={setActivePhoto} />}
      {activeSection?.id === 'adventures' && <AdventureWindow activeFolderId={activeAdventureFolder} onFolderOpen={setActiveAdventureFolder} onBack={() => setActiveAdventureFolder(null)} onClose={closeSection} onPhotoOpen={setActivePhoto} />}
      {activeSection && activeSection.id !== 'music' && activeSection.id !== 'adventures' && <MemoryWindow section={activeSection} onClose={closeSection} onPhotoOpen={setActivePhoto} />}

      {activeUtility === 'stella' && (
        <StellaStatusWindow
          requested={stellaRequested}
          requester={stellaRequester}
          onRequestedChange={value => {
            setStellaRequested(value)
            if (value === 'no') setStellaRequester(null)
          }}
          onRequesterChange={setStellaRequester}
          onClose={() => setActiveUtility(null)}
        />
      )}

      {activeUtility === 'grapefruit' && (
        <RetroWindow title="grapefruit_status.exe" closeLabel="Close grapefruit status" onClose={() => setActiveUtility(null)} className="utility-window">
          <div className="grapefruit-status" aria-label="Grapefruit status">
            <span>STATUS</span>
            <div className="status-track"><i /></div>
            {/* TODO: Add personal grapefruit status text. */}
          </div>
        </RetroWindow>
      )}

      {activeUtility === 'dessert' && (
        <RetroWindow title="dessert.folder" closeLabel="Close dessert folder" onClose={() => setActiveUtility(null)}>
          <PhotoFiles photos={dessertPhotos} onOpen={setActivePhoto} />
        </RetroWindow>
      )}

      {activeUtility === 'taco' && <TacoBellMenu onClose={() => setActiveUtility(null)} />}

      {activeUtility === 'claude' && (
        <RetroWindow title="claude.chat" closeLabel="Close Claude greeting" onClose={() => setActiveUtility(null)} className="utility-window claude-window">
          <div className="claude-chat">
            <p>Good evening, Pepper.</p>
            <p>You found Claude.</p>
            <p>Fun fact:<br />I was not required for this website.</p>
            <p>Kush added me anyway.</p>
          </div>
        </RetroWindow>
      )}

      {activeUtility === 'letter' && (
        <RetroWindow title="summer_letter.txt" closeLabel="Close summer letter" onClose={() => setActiveUtility(null)} className="utility-window letter-window">
          <div className="letter-paper">
            <span className="text-cursor" aria-hidden="true" />
            <p>Dear Laya,</p>
            <p>I dont really know how to start this.</p>
            <p>I think theres so much I feel about you that whenever I try to explain all of it at once it gets harder to explain any of it. Like I know exactly what I mean until I actually have to turn it into words.</p>
            <p>But heres my attempt at it.</p>
            <p>---</p>
            <p>I think one of my favorite things about getting to know you is that I keep finding out more and more.</p>
            <p>From innocently trying to go on a date with someone i was so intrugied about to becoming quantum entangled and spending my entire summer with, theres always another layer to our wonderful story.</p>
            <p>I love when you start talking about something and then somehow we end up six or seven topics away from where we originally started.</p>
            <p>I love the way your eyes look when you talk about one of your quirky interests and the way I can feel the passion you have for them.</p>
            <p>I love when youre explaining something at first and I genuinely have no idea how your brain got there at first, or the fact that you see something that way.</p>
            <p>I just love learning you.</p>
            <p>And i really hope you know that I dont want some edited version of you.</p>
            <p>I dont want you thinking about whether something you like is cringe or strange before you show it to me.</p>
            <p>I dont want you wondering youre talking about yourself too much when im literally sitting there wanting to hear every word.</p>
            <p>I dont want you worrying about me while youre with me.</p>
            <p>I just want you to be there.</p>
            <p>I love the completely unhinged unfiltered you, the random thoughts, the hypotheticals, the niche interests, the things you could talk about forever as time continues to fly by.</p>
            <p>---</p>
            <p>Its kind of insane looking back at how much happened in such a short amount of time.</p>
            <p>May 31st feels like it was literally yesterday but also like it happened years ago at the same time.</p>
            <p>I remember just being so intrigued by you.</p>
            <p>I know i wanted to see you again and know more about you but I had no idea what I was getting myself into.</p>
            <p>I defeintely didnt expect one date to turn into an entire summer of random drives, taco bell runs, movies, bookstores, sleepovers, losing track of time, black hour conversations, quantum entanglement, spanish churches, amazing conversations by lakes, and the rest of the amazing lore we created along the way.</p>
            <p>Somehow every time we hung out there was always something, even when there wasnt suppose to be.</p>
            <p>We could literally just be driving somewhere and somehow it would become a memory I would think about and smile to myself about later.</p>
            <p>We could go somewhere with an actual plan and then completely abandon it because we found something else to do and we both love spontanous adventrues.</p>
            <p>We could meet up to “study” and then spend nine hours just yapping to each other and accomplish nothing.</p>
            <p>We could get food and then somehow get more food just hours later.</p>
            <p>I dont even know how many hours of this summer were spent sitting in Ben just talking about absolultely everything.</p>
            <p>And honestly those are probably some of my favorite moments.</p>
            <p>---</p>
            <p>I love our adventures and all the random things we’ve done but theres something about the really normal moments with you that I love just as much.</p>
            <p>Sitting next to you.</p>
            <p>Driving around.</p>
            <p>Listening to music.</p>
            <p>Watching random youtube videos of Melaine Martinez getting her hair done.</p>
            <p>Looking over and seeing you work.</p>
            <p>Talking until one of us realizes we had been talking for 8+ hours.</p>
            <p>Going to Barnes and Nobles and having an entire conversation for hours on every book and you reccomeding them to me.</p>
            <p>Theres just something about your presense that makes normal things feel different to me.</p>
            <p>And then theres the other form of communcation we developed over this summer, feeling each other.</p>
            <p>All of this would sound insane to anybody else but in our little world they make perfect sense.</p>
            <p>I think theres something so beautiful about feeling things from your persepctive, and having your emtoional processing yet sometimes needing to be explained over and over until something finally makes sense to me.</p>
            <p>Youre fimiliar to me and still constantly surprising me at the same exact time.</p>
            <p>And I think knowing you has changed the way I see things so much.</p>
            <p>You notice things I would normally walk straight past.</p>
            <p>You can take one feeling or random thought and find ten different layers underneath it.</p>
            <p>Sometimes I geneunely dont understand how you get there until i need you to explain it to me step by step.</p>
            <p>I hope you dont get annoyed by that.</p>
            <p>---</p>
            <p>This summer hasnt been perfect either.</p>
            <p>We’ve had our confusing moments, our difficult conversations, our disconnects, date 5 happened as well and we still navigate through that.</p>
            <p>Not every memory has to be sweet or perfect for it to mean something to me.</p>
            <p>I think ive learned more about you through some of those conversations than I ever could have if everything had just been easy all the time.</p>
            <p>And somehow through all of it, we just kept finding more things to talk about.</p>
            <p>More places to go.</p>
            <p>More little weird theories.</p>
            <p>More stories.</p>
            <p>More pieces of each other.</p>
            <p>---</p>
            <p>I think an underrated part for me was how naturally you became a huge part of my summer.</p>
            <p>So fast it turned from “im going on another date with Laya” to it feeling like i was living my life and you were just a part of it now.</p>
            <p>Something happens? I wanna tell laya.</p>
            <p>I see something and wonder what you would think about it.</p>
            <p>I hear something and it reminds me of a conversation we had.</p>
            <p>I find a random place and immediately think it would be so fun to go there with you.</p>
            <p>And when I havent seen you for a while, I genuinely just miss having you around.</p>
            <p>I dont need some huge conversation or some crazy adventure.</p>
            <p>Sometimes I just miss you sitting next to me.</p>
            <p>I think thats probably one of the biggest things this summer gave me.</p>
            <p>Not our fabulous dates.</p>
            <p>Not the insane memories.</p>
            <p>It gave me someone whose presense became fimiliar to me.</p>
            <p>Someone I could spend an entire day with and somehow still have something else to talk about at 2 in the morning.</p>
            <p>Someone I could go on an actual adventure with or literally do anything with and somehow enjoy both equally.</p>
            <p>Someone I can be stupid and then five mintures later be talking about the meaning of identity with.</p>
            <p>Someone who turned an oridinary summer into something I know I wont forget till the day I die.</p>
            <p>---</p>
            <p>And beyond all of the memories and all of the stuff we did, I dont think I can even fully explain how much you as a person have come to mean to me.</p>
            <p>I care about you so fucking much.</p>
            <p>I care about what makes you happy, what excites you, what youre curious about, what you wanna do with your life, and even all the little random things you probably dont think matter that much.</p>
            <p>Seeing you happy genuinely makes me happy.</p>
            <p>Seeing you light up about something you love makes me wanna just sit there and listen forever.</p>
            <p>I want you to be happy Laya.</p>
            <p>Like genuinely, deeply happy.</p>
            <p>I want you to find the things that make you feel the most like yourself and chase them as hard as you can.</p>
            <p>I want you to do all the weird ambitious things you wanna do and explore every random interest that grabs you and become whatever version of yourself makes you the happiest.</p>
            <p>And I hope you know ill always be cheering you on.</p>
            <p>I wanna be the person sitting there getting way too excited for you when something good happens, listening when something doesnt, reminding you how capable you are when you forget, and watching you grow into whoever youre going to become.</p>
            <p>---</p>
            <p>I think thats one of the things that made me realize I had actually fallen in love with you.</p>
            <p>It wasnt just that I wanted to spend time with you or that I missed you when you werent there.</p>
            <p>Somewhere along the way I started caring so deeply about you and your happiness completely separate from what that meant for me.</p>
            <p>I started wanting good things for you just because they were good for you.</p>
            <p>I wanted to see you win.</p>
            <p>I wanted to see you become more yourself.</p>
            <p>I wanted to see you experience everything you deserve to experience.</p>
            <p>And I love you in all these little ways too.</p>
            <p>I love hearing your voice.</p>
            <p>I love your laugh.</p>
            <p>I love looking at you when youre not paying attention to me.</p>
            <p>I love when you get passionate and start talking faster.</p>
            <p>I love when youre being weird.</p>
            <p>I love how curious you are.</p>
            <p>I love how deeply you feel things.</p>
            <p>I love the way you can make me think about something I never wouldve thought twice about before.</p>
            <p>I love how somehow after spending an entire day with you I can still wish I had a little more time.</p>
            <p>I love you in all of these tiny moments that kept piling up until I realized they werent tiny to me anymore.</p>
            <p>I dont ever want my love for you to feel like something youre responsible for though.</p>
            <p>I dont love you because I expect something back from you or because I need you to become something for me.</p>
            <p>I just feel really fucking lucky that out of every possible person I couldve met that night, it was you, and that I got enough time with you to fall in love with who you are.</p>
            <p>---</p>
            <p>I dont know exactly what our story becomes from here.</p>
            <p>And honestly I dont think i need to know right now.</p>
            <p>I think thats one of the things I like about us.</p>
            <p>Theres still so much left that hasnt happened yet.</p>
            <p>More places we havent gone.</p>
            <p>More conversations we havent had.</p>
            <p>More versions of each other we havent gotten to meet yet.</p>
            <p>And probably another 15 code words we are going to invent that make no sense to anybody else except us.</p>
            <p>---</p>
            <p>And im incredinbly grateful may 31st happened.</p>
            <p>Im grateful I got curious about you.</p>
            <p>Im grateful that weird force made me stand up and talk to you.</p>
            <p>Im grateful you kept saying yes to seeing me again.</p>
            <p>Im grateful for every weird turn this summer took.</p>
            <p>Im grateful for the really big moments, but also the tiny ones that probably wouldnt mean anything to anyone else.</p>
            <p>And im grateful I got to spend this summer getting to know the wonderful human being you are.</p>
            <p>Im grateful to have fallen in love with you.</p>
            <p>More than anything I hope you look back at this and it makes you smile.</p>
            <p>I think we found something pretty special this summer, and i wanted to save a little piece of it.</p>
            <p>- Kush</p>
          </div>
        </RetroWindow>
      )}

      {activePhoto && <PhotoViewer photo={activePhoto} onClose={() => setActivePhoto(null)} />}
    </main>
  )
}
