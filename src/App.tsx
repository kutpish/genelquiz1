import React, { useState, useEffect } from 'react';
import { Brain, Check, X, Trophy } from 'lucide-react';

// Quiz questions database
const quizData = [
  { q: "Türkiye'nin başkenti neresidir?", a: "Ankara" },
  { q: "Hangi gezegen Güneş Sistemi'nin en büyüğüdür?", a: "Jüpiter" },
  { q: "İnsan vücudundaki en büyük organ hangisidir?", a: "Deri" },
  { q: "Hangi element periyodik tabloda 'Fe' sembolü ile gösterilir?", a: "Demir" },
  { q: "DNA'nın açılımı nedir?", a: "Deoksiribo Nükleik Asit" },
  { q: "Hangi yıl Türkiye Cumhuriyeti kuruldu?", a: "1923" },
  { q: "Dünyanın en derin okyanusu hangisidir?", a: "Pasifik Okyanusu" },
  { q: "İstanbul'un fethi hangi yılda gerçekleşti?", a: "1453" },
  { q: "Hangi gezegen 'Kızıl Gezegen' olarak bilinir?", a: "Mars" },
  { q: "Everest Dağı hangi ülkededir?", a: "Nepal" },
  { q: "Pi sayısının ilk 3 hanesi nedir?", a: "3.14" },
  { q: "İnsan vücudunda kaç kemik vardır?", a: "206" },
  { q: "Hangi hayvan en uzun boyunlu memelilerdir?", a: "Zürafa" },
  { q: "Dünya'nın en büyük kıtası hangisidir?", a: "Asya" },
  { q: "Hangi vitamin güneş ışığından sentezlenir?", a: "D vitamini" }
];

function App() {
  const [questions, setQuestions] = useState<typeof quizData>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    // Randomly select 10 questions
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      setTimerActive(false);
      return;
    }

    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase() === questions[currentQuestion].a.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
      setConsecutiveWrong(0);
    } else {
      setConsecutiveWrong(prev => prev + 1);
      if (consecutiveWrong === 2) {
        setShowAnswer(true);
        setConsecutiveWrong(0);
        return;
      }
    }

    if (currentQuestion === 9) {
      setGameOver(true);
      setTimerActive(false);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        {!gameOver ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Genel Kültür Testi</h1>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Soru {currentQuestion + 1}/10
                </span>
                <div className="flex gap-4">
                  <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
                    Süre: {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    Skor: {score}
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {questions[currentQuestion].q}
              </h2>

              {showAnswer && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    Doğru cevap: {questions[currentQuestion].a}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Cevabınızı yazın..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                
                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Cevapla
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {timeLeft === 0 ? 'Süre Doldu!' : 'Test Tamamlandı!'}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Skorunuz: {score}/10 ({(score/10 * 100).toFixed(0)}%)
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Yeniden Başla
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(3 - consecutiveWrong)].map((_, i) => (
                <Check key={i} className="w-6 h-6 text-green-500" />
              ))}
              {[...Array(consecutiveWrong)].map((_, i) => (
                <X key={i} className="w-6 h-6 text-red-500" />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {3 - consecutiveWrong} hakkınız kaldı
            </span>
          </div>
          <span className="text-sm text-gray-500">Credits: Salih Orhan</span>
        </div>
      </div>
    </div>
  );
}

export default App;