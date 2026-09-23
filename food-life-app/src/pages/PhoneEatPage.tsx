import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ImageIcon, RotateCw, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';
import MoodSelector from '../components/MoodSelector';
import SafeImage from '../components/SafeImage';
import { createDiaryEntry, mockRecognizeDish, MOCK_CAMERA_IMAGES } from '../api';
import type { Mood } from '../types';
import { format } from 'date-fns';
import { cn } from '../utils/meal';

type Step = 'capture' | 'edit' | 'meta';

const FILTERS = [
  { id: 'none', label: '原图', css: 'none' },
  { id: 'warm', label: '暖调', css: 'sepia(0.25) saturate(1.2)' },
  { id: 'fresh', label: '清新', css: 'saturate(1.3) brightness(1.05)' },
  { id: 'film', label: '胶片', css: 'contrast(1.1) saturate(0.85)' },
];

export default function PhoneEatPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('capture');
  const [image, setImage] = useState('');
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('none');
  const [foodName, setFoodName] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();
  const [note, setNote] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const [saving, setSaving] = useState(false);

  const useMock = () => {
    const src = MOCK_CAMERA_IMAGES[Math.floor(Math.random() * MOCK_CAMERA_IMAGES.length)];
    setImage(src);
    setStep('edit');
  };

  const onFile = (file: File) => {
    setImage(URL.createObjectURL(file));
    setStep('edit');
  };

  const goMeta = async () => {
    setStep('meta');
    setRecognizing(true);
    const name = await mockRecognizeDish();
    setFoodName(name);
    setRecognizing(false);
  };

  const save = async () => {
    if (!image || !foodName) return;
    setSaving(true);
    const now = new Date();
    const hour = now.getHours();
    const mealType =
      hour < 11 ? '早餐' : hour < 14 ? '午餐' : hour < 17 ? '下午茶' : hour < 21 ? '晚餐' : '夜宵';

    await createDiaryEntry({
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      mealType,
      foodName,
      image,
      note: note || undefined,
      mood,
    });
    setSaving(false);
    navigate(`/diary/${format(now, 'yyyy-MM-dd')}`);
  };

  const filterCss = FILTERS.find((f) => f.id === filter)?.css || 'none';

  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="手机先吃" />

        {step === 'capture' && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full aspect-[3/4] rounded-[28px] bg-cream-dark border border-dashed border-border flex flex-col items-center justify-center gap-4 mb-6">
              <Camera size={40} className="text-ink-muted" />
              <p className="text-ink-muted text-sm">拍照或选一张图</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-primary w-full py-4 mb-3 flex items-center justify-center gap-2"
            >
              <Camera size={18} /> 打开相机 / 相册
            </button>
            <button
              type="button"
              onClick={useMock}
              className="btn-secondary w-full py-4 flex items-center justify-center gap-2"
            >
              <ImageIcon size={18} /> 用一张示例图
            </button>
          </div>
        )}

        {step === 'edit' && (
          <div>
            <div className="rounded-[28px] overflow-hidden mb-4 aspect-[3/4] bg-cream-dark">
              <img
                src={image}
                alt="预览"
                className="w-full h-full object-cover"
                style={{ filter: filterCss, transform: `rotate(${rotation}deg)` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = MOCK_CAMERA_IMAGES[0];
                }}
              />
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm shrink-0 border',
                    filter === f.id
                      ? 'bg-tomato text-white border-tomato'
                      : 'bg-card border-border',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRotation((r) => r + 90)}
              className="btn-secondary w-full py-3 mb-3 flex items-center justify-center gap-2"
            >
              <RotateCw size={16} /> 旋转
            </button>
            <button type="button" onClick={goMeta} className="btn-primary w-full py-4">
              下一步
            </button>
          </div>
        )}

        {step === 'meta' && (
          <div className="space-y-5">
            <SafeImage src={image} className="w-full aspect-video rounded-[24px]" alt="" />

            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">菜品名称</label>
              <div className="relative">
                <input
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="这是什么？"
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-card outline-none focus:border-tomato"
                />
                {recognizing && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs flex items-center gap-1">
                    <Loader2 size={14} className="animate-spin" /> 识别中
                  </span>
                )}
              </div>
              {!recognizing && foodName && (
                <p className="text-xs text-leaf mt-1">识别到：{foodName}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">今天这顿怎么样？</label>
              <MoodSelector value={mood} onChange={setMood} />
            </div>

            <div>
              <label className="text-sm text-ink-muted mb-1.5 block">写两句</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="味道、心情、随便写…"
                className="w-full px-4 py-3 rounded-2xl border border-border bg-card outline-none focus:border-tomato resize-none"
              />
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving || !foodName}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              {saving ? '保存中…' : '保存到美食日记'}
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
