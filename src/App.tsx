import React, { useState, useEffect, useRef } from 'react';
import { Heart, Clock, Image as ImageIcon, Plus, Trash2, Music, Volume2, VolumeX } from 'lucide-react';

interface Memory {
  id: number;
  date: string;
  image: string;
  description: string;
}

function App() {
  const startDate = new Date('2024-09-05');
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
  
}

export default App;