import { useEffect, useRef, useState } from 'react';
import { RotateCw, RotateCcw, Eraser, Minus, Plus } from 'lucide-react';
import { cn } from '../utils/meal';
import { MOCK_CAMERA_IMAGES } from '../api';

const FILTERS = [
  { id: 'none', label: '原图', css: 'none' },
  { id: 'warm', label: '暖调', css: 'sepia(0.28) saturate(1.25)' },
  { id: 'fresh', label: '清新', css: 'saturate(1.35) brightness(1.06)' },
  { id: 'film', label: '胶片', css: 'contrast(1.12) saturate(0.8)' },
  { id: 'mono', label: '黑白', css: 'grayscale(1) contrast(1.05)' },
  { id: 'sunset', label: '日落', css: 'sepia(0.45) hue-rotate(-10deg) saturate(1.3)' },
];

const CROP_RATIOS = [
  { id: 'free', label: '自由', value: 0 },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '3:4', label: '3:4', value: 3 / 4 },
];

const DOODLE_COLORS = ['#E85D4C', '#F4A261', '#E9C46A', '#2A9D8F', '#FFFFFF', '#2D2A26'];

type PrimaryTab = 'adjust' | 'mark';
type AdjustTab = 'filter' | 'crop' | 'rotate';

interface Props {
  image: string;
  onNext: (editedDataUrl: string) => void;
}

export default function ImageEditPanel({ image, onNext }: Props) {
  const [primary, setPrimary] = useState<PrimaryTab>('adjust');
  const [adjustTab, setAdjustTab] = useState<AdjustTab>('filter');
  const [filter, setFilter] = useState('none');
  const [rotation, setRotation] = useState(0);
  const [cropRatio, setCropRatio] = useState('free');
  const [zoom, setZoom] = useState(1);
  const [doodleColor, setDoodleColor] = useState(DOODLE_COLORS[0]);
  const [brushSize, setBrushSize] = useState(4);
  const [drawing, setDrawing] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const filterCss = FILTERS.find((f) => f.id === filter)?.css || 'none';
  const ratio = CROP_RATIOS.find((r) => r.id === cropRatio)?.value || 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const { width, height } = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, [image, cropRatio]);

  const clearDoodle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (primary !== 'mark') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = doodleColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || primary !== 'mark') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => setDrawing(false);

  const exportEdited = async () => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) {
      onNext(image);
      return;
    }

    try {
      const w = 720;
      const h = Math.round(w * (4 / 3));
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      const ctx = out.getContext('2d');
      if (!ctx) {
        onNext(image);
        return;
      }

      ctx.fillStyle = '#F3EDE4';
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.filter = filterCss === 'none' ? 'none' : filterCss;
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      const scale = zoom;
      const iw = img.naturalWidth || w;
      const ih = img.naturalHeight || h;
      const cover = Math.max(w / iw, h / ih) * scale;
      ctx.drawImage(img, (-iw * cover) / 2, (-ih * cover) / 2, iw * cover, ih * cover);
      ctx.restore();

      const doodle = canvasRef.current;
      if (doodle && doodle.width > 0) {
        ctx.drawImage(doodle, 0, 0, w, h);
      }

      onNext(out.toDataURL('image/jpeg', 0.9));
    } catch {
      // CORS 等导致无法导出时，仍用原图继续流程
      onNext(image);
    }
  };

  const aspectStyle =
    ratio > 0
      ? { aspectRatio: String(ratio) }
      : ({ aspectRatio: '3 / 4' } as React.CSSProperties);

  return (
    <div>
      <div
        ref={stageRef}
        className="relative rounded-[28px] overflow-hidden mb-4 bg-cream-dark mx-auto w-full max-h-[52vh]"
        style={aspectStyle}
      >
        <img
          ref={imgRef}
          src={image}
          alt="预览"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover origin-center"
          style={{
            filter: filterCss,
            transform: `rotate(${rotation}deg) scale(${zoom})`,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = MOCK_CAMERA_IMAGES[0];
          }}
        />
        <canvas
          ref={canvasRef}
          className={cn(
            'absolute inset-0 w-full h-full touch-none',
            primary === 'mark' ? 'z-10 cursor-crosshair' : 'z-10 pointer-events-none',
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {adjustTab === 'crop' && primary === 'adjust' && (
          <div className="absolute inset-3 border-2 border-white/80 rounded-2xl pointer-events-none z-20 shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]" />
        )}
      </div>

      {/* 一级 Tab */}
      <div className="flex gap-2 mb-3 p-1 bg-cream-dark rounded-full">
        {(
          [
            ['adjust', '调整'],
            ['mark', '标记'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPrimary(key)}
            className={cn(
              'flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors',
              primary === key ? 'bg-white text-ink shadow-sm' : 'text-ink-muted',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 二级 Tab / 工具 */}
      {primary === 'adjust' && (
        <>
          <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5">
            {(
              [
                ['filter', '滤镜'],
                ['crop', '裁剪'],
                ['rotate', '旋转'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setAdjustTab(key)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm shrink-0 border font-medium',
                  adjustTab === key
                    ? 'bg-tomato text-white border-tomato'
                    : 'bg-card border-border text-ink-muted',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {adjustTab === 'filter' && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-sm shrink-0 border',
                    filter === f.id
                      ? 'bg-tomato/10 border-tomato text-tomato font-semibold'
                      : 'bg-card border-border',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {adjustTab === 'crop' && (
            <div className="mb-4 space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CROP_RATIOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setCropRatio(r.id)}
                    className={cn(
                      'px-3.5 py-2 rounded-full text-sm shrink-0 border',
                      cropRatio === r.id
                        ? 'bg-tomato/10 border-tomato text-tomato font-semibold'
                        : 'bg-card border-border',
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-1">
                <Minus size={16} className="text-ink-muted" />
                <input
                  type="range"
                  min={1}
                  max={2}
                  step={0.02}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-tomato"
                />
                <Plus size={16} className="text-ink-muted" />
                <span className="text-xs text-ink-muted w-10 tabular-nums">{zoom.toFixed(1)}x</span>
              </div>
            </div>
          )}

          {adjustTab === 'rotate' && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRotation((r) => r - 90)}
                className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> 左转
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2"
              >
                <RotateCw size={16} /> 右转
              </button>
              <button
                type="button"
                onClick={() => setRotation(0)}
                className="btn-secondary px-4 py-3 text-sm"
              >
                复位
              </button>
            </div>
          )}
        </>
      )}

      {primary === 'mark' && (
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-2">
            {DOODLE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setDoodleColor(c)}
                className={cn(
                  'w-8 h-8 rounded-full border-2 shrink-0',
                  doodleColor === c ? 'border-ink scale-110' : 'border-transparent',
                )}
                style={{ background: c, boxShadow: c === '#FFFFFF' ? 'inset 0 0 0 1px #EDE6DC' : undefined }}
                aria-label={`颜色 ${c}`}
              />
            ))}
            <button
              type="button"
              onClick={clearDoodle}
              className="ml-auto flex items-center gap-1 text-sm text-ink-muted px-3 py-2 rounded-full bg-cream-dark"
            >
              <Eraser size={14} /> 清除
            </button>
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-ink-muted shrink-0">粗细</span>
            <input
              type="range"
              min={2}
              max={16}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="flex-1 accent-tomato"
            />
          </div>
        </div>
      )}

      <button type="button" onClick={exportEdited} className="btn-primary w-full py-4">
        下一步
      </button>
    </div>
  );
}
