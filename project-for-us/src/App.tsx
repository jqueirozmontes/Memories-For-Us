import React, { useState, useEffect, useRef } from 'react';
import { Heart, Clock, Image as ImageIcon, Plus, Trash2, Music, Volume2, VolumeX } from 'lucide-react';

interface Memory {
  id: number;
  date: string;
  image: string;
  description: string;
}

function App() {
  const startDate = new Date('2024-01-01');
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 1,
      date: '2024-01-01',
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
      description: 'Nosso primeiro encontro'
    },
    {
      id: 2,
      date: '2024-02-14',
      image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca',
      description: 'Primeiro Dia dos Namorados juntos'
    }
  ]);

  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemory, setNewMemory] = useState({
    date: '',
    image: '',
    description: ''
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 * 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddMemory = () => {
    if (newMemory.date && imagePreview && newMemory.description) {
      setMemories([...memories, {
        id: memories.length + 1,
        date: newMemory.date,
        image: imagePreview,
        description: newMemory.description
      }]);
      setNewMemory({ date: '', image: '', description: '' });
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
      setShowAddMemory(false);
    }
  };

  const handleDeleteMemory = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta memória?')) {
      setMemories(memories.filter(memory => memory.id !== id));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecione apenas arquivos de imagem.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (cameraInputRef.current) {
          cameraInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3"
        loop
      />
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors z-50"
        title={isPlaying ? 'Pausar música' : 'Tocar música'}
      >
        {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-pink-600 flex items-center justify-center gap-2">
            <Heart className="text-pink-600" /> Nossa História
          </h1>
        </div>
      </header>

      {/* Counter Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2">
            <Clock className="text-pink-600" /> Tempo Juntos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">{timeElapsed.days}</div>
              <div className="text-gray-600">Dias</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">{timeElapsed.hours}</div>
              <div className="text-gray-600">Horas</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">{timeElapsed.minutes}</div>
              <div className="text-gray-600">Minutos</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">{timeElapsed.seconds}</div>
              <div className="text-gray-600">Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Memories Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ImageIcon className="text-pink-600" /> Nossas Memórias
            </h2>
            <button
              onClick={() => setShowAddMemory(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 transition-colors"
            >
              <Plus size={20} /> Adicionar Memória
            </button>
          </div>

          {/* Add Memory Form */}
          {showAddMemory && (
            <div className="mb-8 bg-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Nova Memória</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data da Memória
                    </label>
                    <input
                      type="date"
                      value={newMemory.date}
                      onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Adicionar Foto
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ImageIcon size={20} /> Tirar Foto
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ImageIcon size={20} /> Escolher da Galeria
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        ref={cameraInputRef}
                        className="hidden"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      placeholder="Conte um pouco sobre esse momento especial..."
                      value={newMemory.description}
                      onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center bg-white p-4 rounded-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                      onError={() => setImagePreview('')}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Preview da imagem</p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    onClick={handleAddMemory}
                    disabled={!newMemory.date || !imagePreview || !newMemory.description}
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300"
                  >
                    Salvar Memória
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMemory(false);
                      setNewMemory({ date: '', image: '', description: '' });
                      setImagePreview('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      if (cameraInputRef.current) {
                        cameraInputRef.current.value = '';
                      }
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Memories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <div key={memory.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
                <img
                  src={memory.image}
                  alt={memory.description}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(memory.date).toLocaleDateString('pt-BR')}
                  </div>
                  <p className="text-gray-700">{memory.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteMemory(memory.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  title="Excluir memória"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;