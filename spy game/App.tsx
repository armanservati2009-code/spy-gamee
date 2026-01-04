
import React, { useState, useEffect } from 'react';
import { GameState, Player, GameSettings, Language } from './types';
import { getSecretWord } from './services/geminiService';

const LOCAL_WORDS: Record<Language, Record<string, string[]>> = {
  fa: {
    "مکان‌ها": ["سینما", "رستوران", "بیمارستان", "مدرسه", "پارک", "فرودگاه", "موزه", "بانک", "باشگاه ورزشی", "هتل", "کتابخانه", "ساحل", "زندان", "قصر", "کشتی", "کلانتری", "دانشگاه", "مترو", "آزمایشگاه", "کارخانه", "باغ", "ویلا", "برج", "پل", "آتش‌نشانی"],
    "مشاغل": ["پزشک", "نانوا", "برنامه نویس", "معلم", "آتش‌نشان", "خلبان", "آشپز", "وکیل", "مهندس", "کشاورز", "کارآگاه", "دزد", "پلیس", "خیاط", "مکانیک", "عکاس", "ملوان", "غواص", "فضانورد", "دانشمند", "نویسنده"],
    "اشیا": ["تلفن", "یخچال", "چتر", "ساعت", "دوربین", "مسواک", "کلید", "کیف", "عینک", "خودکار", "لپ‌تاپ", "هدفون", "کفش", "کلاه", "تلویزیون", "آینه", "شانه", "میز", "صندلی", "فرش"],
    "حیوانات": ["فیل", "زرافه", "شیر", "ببر", "پنگوئن", "خرس", "گرگ", "روباه", "لاک‌پشت", "طوطی", "اسب", "دلفین", "کوسه", "مار", "میمون", "عقاب", "جغد", "شتر", "گاو", "تمساح"],
    "غذاها": ["پیتزا", "همبرگر", "قورمه‌سبزی", "کباب", "پاستا", "لازانیا", "سوشی", "فلافل", "ساندویچ", "آش", "استیک", "سالاد", "ماکارونی", "آبگوشت", "ته‌چین", "کوفته", "سمبوسه", "سوپ", "جوجه کباب", "حلیم"],
    "ورزش‌ها": ["فوتبال", "بسکتبال", "والیبال", "تنیس", "شنا", "کشتی", "بوکس", "کاراته", "شطرنج", "بدمینتون", "اسکی", "کوهنوردی", "بیلیارد", "گلف", "ژیمناستیک", "یوگا", "اسکیت", "موج سواری", "تکواندو"],
    "کشورها": ["ایران", "آلمان", "فرانسه", "ژاپن", "برزیل", "ایتالیا", "کانادا", "چین", "روسیه", "هند", "ترکیه", "اسپانیا", "مصر", "استرالیا", "آرژانتین", "آمریکا", "انگلستان", "هلند", "سوییس", "کره جنوبی"]
  },
  en: {
    "Places": ["Cinema", "Restaurant", "Hospital", "School", "Park", "Airport", "Museum", "Bank", "Gym", "Hotel", "Library", "Beach", "Mountain", "Desert", "Forest", "Prison", "Castle", "Ship", "Police Station", "University"],
    "Jobs": ["Doctor", "Baker", "Programmer", "Teacher", "Firefighter", "Pilot", "Painter", "Carpenter", "Chef", "Lawyer", "Engineer", "Nurse", "Farmer", "Actor", "Detective", "Thief", "Police", "Judge", "Driver", "Scientist"],
    "Objects": ["Phone", "Fridge", "Umbrella", "Watch", "Camera", "Toothbrush", "Key", "Bag", "Glasses", "Pen", "Laptop", "Remote", "Headphones", "Shoes", "Hat", "TV", "Mirror", "Comb", "Table", "Chair"],
    "Animals": ["Elephant", "Giraffe", "Lion", "Tiger", "Penguin", "Bear", "Wolf", "Fox", "Turtle", "Parrot", "Horse", "Dolphin", "Shark", "Snake", "Monkey", "Eagle", "Owl", "Camel", "Cow", "Sheep"],
    "Food": ["Pizza", "Burger", "Pasta", "Lasagna", "Sushi", "Sandwich", "Steak", "Salad", "Taco", "Ice Cream", "Pancake", "Soup", "Fries", "Donut", "Curry", "Kebab", "Falafel", "Waffles", "Ramen", "Hot Dog"],
    "Sports": ["Football", "Basketball", "Volleyball", "Tennis", "Swimming", "Wrestling", "Boxing", "Karate", "Chess", "Badminton", "Skiing", "Cycling", "Climbing", "Golf", "Hockey", "Yoga", "Skating", "Surfing", "Fencing", "Judo"],
    "Countries": ["USA", "Germany", "France", "Japan", "Brazil", "Italy", "Canada", "China", "Russia", "India", "Turkey", "Spain", "Egypt", "Australia", "Argentina", "UK", "Netherlands", "Switzerland", "Mexico", "South Korea"]
  }
};

const translations = {
  fa: {
    title: "جاسوس",
    players: "بازیکنان",
    playerNamePlaceholder: "نام...",
    add: "افزودن",
    spyCountLabel: "جاسوس‌ها",
    timerLabel: "زمان",
    noLimit: "بدون محدودیت",
    category: "موضوع انتخابی",
    categoryPlaceholder: "مثلا: پایتخت‌ها...",
    random: "تصادفی",
    start: "شروع بازی",
    loading: "درحال آماده‌سازی...",
    playerTurn: "نوبت:",
    roleInstruction: "برای مشاهده نقش ضربه بزنید",
    showRole: "مشاهده نقش",
    next: "بازیکن بعدی",
    letsGo: "بزن بریم!",
    roleLabel: "نقش شما:",
    spy: "🕵️‍♂️ جاسوس",
    topic: "موضوع:",
    timeLeft: "زمان باقی‌مانده",
    playingInstruction: "سوال بپرسید و جاسوس را پیدا کنید!",
    endGame: "افشای نقش‌ها",
    gameOver: "پایان بازی!",
    secretWordWas: "کلمه مخفی:",
    spies: "جاسوس‌ها:",
    playAgain: "بازی دوباره",
    minPlayersAlert: "حداقل ۳ بازیکن اضافه کنید.",
    spyLimitAlert: "تعداد جاسوس غیرمجاز است.",
    offlineMode: "حالت آفلاین",
    offlineCategory: "موضوع",
    confirm: "تأیید",
    cancel: "لغو",
    minute: "دقیقه",
    playerCount: "تعداد"
  },
  en: {
    title: "Spy",
    players: "Players",
    playerNamePlaceholder: "Name...",
    add: "Add",
    spyCountLabel: "Spies",
    timerLabel: "Timer",
    noLimit: "No Limit",
    category: "Category",
    categoryPlaceholder: "e.g. Capitals...",
    random: "Random",
    start: "Start Game",
    loading: "Loading...",
    playerTurn: "Turn:",
    roleInstruction: "Tap to reveal your role",
    showRole: "Show Role",
    next: "Next Player",
    letsGo: "Let's Go!",
    roleLabel: "Your Role:",
    spy: "🕵️‍♂️ Spy",
    topic: "Topic:",
    timeLeft: "Time Remaining",
    playingInstruction: "Ask questions and find the spy!",
    endGame: "Reveal Spies",
    gameOver: "Game Over!",
    secretWordWas: "Secret Word:",
    spies: "Spies:",
    playAgain: "Play Again",
    minPlayersAlert: "Add at least 3 players.",
    spyLimitAlert: "Invalid spy count.",
    offlineMode: "Offline Mode",
    offlineCategory: "Category",
    confirm: "Confirm",
    cancel: "Cancel",
    minute: "min",
    playerCount: "Count"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    spyCount: 1,
    category: 'مکان‌ها',
    timerSeconds: 300,
    language: 'fa',
    isOffline: false
  });
  
  const [secretWord, setSecretWord] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(300);
  const [isLoading, setIsLoading] = useState(false);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const [activePicker, setActivePicker] = useState<null | 'spies' | 'timer' | 'offline_cat'>(null);
  const [tempValue, setTempValue] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let interval: any;
    if (gameState === GameState.PLAYING && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState(GameState.REVEAL);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const startGame = async () => {
    if (players.length < 3) {
      alert(t.minPlayersAlert);
      return;
    }
    if (settings.spyCount >= players.length) {
      alert(t.spyLimitAlert);
      return;
    }

    setIsLoading(true);
    let word = "";

    if (settings.isOffline) {
      const cats = LOCAL_WORDS[lang];
      let selectedCat = settings.category;
      if (selectedCat === 'RANDOM') {
        const catKeys = Object.keys(cats);
        selectedCat = catKeys[Math.floor(Math.random() * catKeys.length)];
      }
      const availableWords = (cats[selectedCat] || cats[Object.keys(cats)[0]]).filter(w => !usedWords.has(w));
      if (availableWords.length === 0) {
        word = cats[selectedCat][Math.floor(Math.random() * cats[selectedCat].length)];
        setUsedWords(new Set([word]));
      } else {
        word = availableWords[Math.floor(Math.random() * availableWords.length)];
        setUsedWords(prev => new Set(prev).add(word));
      }
    } else {
      const result = await getSecretWord(settings.category, lang, Array.from(usedWords));
      word = result.word;
      setUsedWords(prev => new Set(prev).add(word));
    }

    setSecretWord(word);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const spyIndices = new Set<number>();
    while (spyIndices.size < settings.spyCount) {
      spyIndices.add(Math.floor(Math.random() * players.length));
    }

    setPlayers(shuffled.map((p, idx) => ({ ...p, isSpy: spyIndices.has(idx), seen: false })));
    setGameState(GameState.ROLE_DISTRIBUTION);
    setCurrentPlayerIndex(0);
    setTimeLeft(settings.timerSeconds);
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const SettingRow = ({ label, value, onClick }: any) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 mb-2 bg-[#121218] border border-white/5 rounded-2xl cursor-pointer active:bg-white/5 transition-all"
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        <span className="text-white font-bold text-sm">{value}</span>
      </div>
      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black text-slate-100 overflow-y-auto custom-scrollbar">
      
      {/* Small Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
        className="self-end glass px-4 py-2 rounded-xl text-[10px] font-black shadow-lg border border-white/5 active:scale-95 transition-all uppercase tracking-widest mb-4"
      >
        {lang === 'fa' ? 'EN' : 'FA'}
      </button>

      <div className="w-full max-w-sm">
        {!isLoading && gameState === GameState.SETUP && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-2xl font-black text-center mb-6 text-white tracking-tight">{t.title}</h1>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{t.playerCount}: {players.length}</span>
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.players}</label>
              </div>
              
              <div className="flex gap-2">
                <input 
                  id="playerInput"
                  type="text" 
                  placeholder={t.playerNamePlaceholder}
                  className="flex-1 bg-[#121218] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-white/20 transition-all text-white font-bold text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value.trim();
                      if(val) { setPlayers([...players, { id: Math.random().toString(), name: val, isSpy: false, seen: false }]); e.currentTarget.value = ''; }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('playerInput') as HTMLInputElement;
                    const val = input.value.trim();
                    if(val) { setPlayers([...players, { id: Math.random().toString(), name: val, isSpy: false, seen: false }]); input.value = ''; }
                  }}
                  className="bg-white text-black px-5 rounded-xl transition-all font-black text-xs active:scale-90"
                >
                  {t.add}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {players.map(p => (
                  <span key={p.id} className="bg-[#1c1c24] border border-white/5 pl-2 pr-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-in zoom-in-90 duration-200">
                    <button onClick={() => setPlayers(players.filter(x => x.id !== p.id))} className="text-red-500 font-black text-sm">×</button>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
               <SettingRow label={t.spyCountLabel} value={settings.spyCount} onClick={() => { setTempValue(settings.spyCount); setActivePicker('spies'); }} />
               <SettingRow label={t.timerLabel} value={settings.timerSeconds === null ? t.noLimit : `${settings.timerSeconds / 60} ${t.minute}`} onClick={() => { setTempValue(settings.timerSeconds); setActivePicker('timer'); }} />

               {settings.isOffline ? (
                 <SettingRow label={t.offlineCategory} value={settings.category === 'RANDOM' ? t.random : settings.category} onClick={() => { setTempValue(settings.category); setActivePicker('offline_cat'); }} />
               ) : (
                 <div className="mt-2">
                    <input 
                      type="text" 
                      value={settings.category}
                      onChange={(e) => setSettings({...settings, category: e.target.value})}
                      placeholder={t.categoryPlaceholder}
                      className="w-full bg-[#121218] border border-white/5 rounded-2xl px-4 py-3 focus:outline-none focus:border-white/20 text-right font-bold text-sm"
                    />
                 </div>
               )}
            </div>

            <div className="flex items-center justify-between p-3 bg-[#121218] rounded-2xl border border-white/5 mt-2">
              <span className="text-xs font-bold text-slate-500">{t.offlineMode}</span>
              <button 
                onClick={() => setSettings({...settings, isOffline: !settings.isOffline, category: !settings.isOffline ? 'RANDOM' : 'مکان‌ها'})}
                className={`w-10 h-5 rounded-full transition-all relative ${settings.isOffline ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${settings.isOffline ? (lang === 'fa' ? 'left-0.5' : 'right-0.5') : (lang === 'fa' ? 'right-0.5' : 'left-0.5')}`}></div>
              </button>
            </div>

            <button 
              onClick={startGame}
              className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 text-lg mt-4 uppercase tracking-tighter"
            >
              {t.start}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold text-sm tracking-widest">{t.loading}</p>
          </div>
        )}

        {gameState === GameState.ROLE_DISTRIBUTION && (
           <div className="text-center space-y-6 pt-4 animate-in fade-in zoom-in-95 duration-500">
             <div>
                <h2 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{t.playerTurn}</h2>
                <p className="text-4xl font-black text-white">{players[currentPlayerIndex].name}</p>
             </div>
             
             <div className="aspect-square flex flex-col items-center justify-center bg-[#121218] rounded-3xl border border-white/5 p-6 shadow-2xl overflow-hidden">
               {showRole ? (
                 <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.roleLabel}</p>
                   <p className={`text-4xl font-black ${players[currentPlayerIndex].isSpy ? 'text-red-500' : 'text-emerald-400'}`}>
                     {players[currentPlayerIndex].isSpy ? t.spy : secretWord}
                   </p>
                 </div>
               ) : (
                 <div className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto border-2 border-white/5 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <p className="text-slate-500 text-sm font-bold opacity-60">{t.roleInstruction}</p>
                 </div>
               )}
             </div>

             <button 
               onClick={() => {
                 if(!showRole) setShowRole(true);
                 else {
                   setShowRole(false);
                   if (currentPlayerIndex < players.length - 1) setCurrentPlayerIndex(prev => prev + 1);
                   else setGameState(GameState.PLAYING);
                 }
               }}
               className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 text-lg ${!showRole ? 'bg-[#1c1c24] text-white' : 'bg-white text-black'}`}
             >
               {!showRole ? t.showRole : (currentPlayerIndex < players.length - 1 ? t.next : t.letsGo)}
             </button>
           </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="text-center space-y-8 pt-4 animate-in fade-in duration-500">
            {timeLeft !== null && (
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t.timeLeft}</p>
                <div className={`text-6xl font-black tracking-tighter ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}

            <div className="bg-[#121218] px-6 py-8 rounded-3xl border border-white/5 shadow-xl">
              <p className="text-slate-300 text-xl leading-relaxed font-bold">
                {t.playingInstruction}
              </p>
            </div>

            <button 
              onClick={() => setGameState(GameState.REVEAL)}
              className="w-full bg-red-500/10 text-red-500 border border-red-500/10 py-4 rounded-2xl font-black active:scale-95 text-sm uppercase tracking-widest"
            >
              {t.endGame}
            </button>
          </div>
        )}

        {gameState === GameState.REVEAL && (
          <div className="text-center space-y-6 pt-4 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black text-red-500">{t.gameOver}</h2>
            
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.secretWordWas}</p>
              <p className="text-5xl font-black text-white">{secretWord}</p>
            </div>

            <div className="bg-[#121218] p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-black">{t.spies}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {players.filter(p => p.isSpy).map(p => (
                  <span key={p.id} className="text-2xl font-black text-red-500">{p.name}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setGameState(GameState.SETUP);
                setSecretWord('');
                setPlayers(players.map(p => ({ ...p, isSpy: false, seen: false })));
              }}
              className="w-full bg-white text-black py-4 rounded-2xl font-black transition-all active:scale-95 text-lg"
            >
              {t.playAgain}
            </button>
          </div>
        )}
      </div>

      {/* REFINED BOTTOM SHEET */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${activePicker ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActivePicker(null)}></div>
        
        <div className={`absolute bottom-0 left-0 right-0 bg-[#121218] rounded-t-[2rem] p-6 bottom-sheet flex flex-col items-center ${activePicker ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-10 h-1 bg-white/10 rounded-full mb-6"></div>
          
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">
            {activePicker === 'spies' && t.spyCountLabel}
            {activePicker === 'timer' && t.timerLabel}
            {activePicker === 'offline_cat' && t.offlineCategory}
          </h3>

          <div className="w-full max-h-48 overflow-y-auto custom-scrollbar flex flex-col items-center gap-3 py-2">
             {activePicker === 'spies' && Array.from({length: Math.max(1, players.length - 1)}, (_, i) => i + 1).map(n => (
               <div key={n} onClick={() => setTempValue(n)} className={`text-xl picker-item cursor-pointer py-1 ${tempValue === n ? 'picker-selected' : 'picker-dimmed'}`}>{n}</div>
             ))}

             {activePicker === 'timer' && [null, 60, 120, 180, 300, 600].map(val => (
               <div key={val === null ? 'none' : val} onClick={() => setTempValue(val)} className={`text-xl picker-item cursor-pointer py-1 ${tempValue === val ? 'picker-selected' : 'picker-dimmed'}`}>{val === null ? t.noLimit : `${val / 60} ${t.minute}`}</div>
             ))}

             {activePicker === 'offline_cat' && (
               <>
                 <div onClick={() => setTempValue('RANDOM')} className={`text-xl picker-item cursor-pointer py-1 ${tempValue === 'RANDOM' ? 'text-blue-500 font-black' : 'picker-dimmed'}`}>{t.random}</div>
                 {Object.keys(LOCAL_WORDS[lang]).map(cat => (
                   <div key={cat} onClick={() => setTempValue(cat)} className={`text-xl picker-item cursor-pointer py-1 ${tempValue === cat ? 'picker-selected' : 'picker-dimmed'}`}>{cat}</div>
                 ))}
               </>
             )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <button onClick={() => {
                if (activePicker === 'spies') setSettings({ ...settings, spyCount: tempValue });
                if (activePicker === 'timer') setSettings({ ...settings, timerSeconds: tempValue });
                if (activePicker === 'offline_cat') setSettings({ ...settings, category: tempValue });
                setActivePicker(null);
            }} className="bg-white text-black font-black py-3 rounded-xl text-sm active:scale-95 transition-all">{t.confirm}</button>
            <button onClick={() => setActivePicker(null)} className="bg-transparent border border-white/10 text-white font-black py-3 rounded-xl text-sm active:scale-95 transition-all">{t.cancel}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
