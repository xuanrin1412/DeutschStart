import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AlphabetLetter } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { audioService } from '@/services/audio/audioService';
import { PageHeader } from '@/components/common/PageHeader';
import { LetterCard, LetterTile } from '@/components/alphabet/LetterCard';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function AlphabetPage() {
  const { alphabet } = useContent();
  const { progress, markLetterSeen } = useProgress();
  const [open, setOpen] = useState<AlphabetLetter | null>(null);
  const [playingAll, setPlayingAll] = useState<number | null>(null);

  const basic = alphabet.filter((l) => !l.special);
  const special = alphabet.filter((l) => l.special);
  const seen = progress.alphabetSeen.length;

  const openLetter = (l: AlphabetLetter) => {
    setOpen(l);
    markLetterSeen(l.letter);
  };

  const playAll = async () => {
    if (playingAll !== null) {
      audioService.stopSequence();
      setPlayingAll(null);
      return;
    }
    await audioService.playSequence(
      basic.map((l) => l.speak),
      {},
      (i) => setPlayingAll(i),
    );
    setPlayingAll(null);
  };

  const grid = (letters: AlphabetLetter[]) => (
    <div className="letter-grid">
      {letters.map((l, i) => (
        <div key={l.letter} className={playingAll !== null && basic[playingAll]?.letter === l.letter ? 'pulse' : ''} data-i={i}>
          <LetterTile letter={l} seen={progress.alphabetSeen.includes(l.letter)} onOpen={() => openLetter(l)} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🔤"
        title="Bảng chữ cái tiếng Đức"
        subtitle="26 chữ cái + Ä Ö Ü ß. Bấm vào một chữ để nghe, xem ví dụ và lưu ý phát âm."
        why="Bạn cần đánh vần tên, email và địa chỉ khi làm thủ tục ở Đức. Chữ cái cũng là chìa khóa để đọc đúng từ mới."
        actions={
          <button className="btn btn-primary" onClick={playAll}>
            {playingAll !== null ? '⏹ Dừng' : '▶ Nghe cả bảng chữ cái'}
          </button>
        }
      />

      <div className="card">
        <div className="row gap-sm center-y">
          <span className="small">
            Đã xem {seen}/{alphabet.length} chữ
          </span>
          <div className="grow">
            <ProgressBar value={(seen / alphabet.length) * 100} label="Số chữ cái đã xem" size="sm" />
          </div>
        </div>
        <p className="muted small legend">
          <span className="legend-flag" aria-hidden="true" /> Chữ có chấm cam có lưu ý phát âm dành riêng cho người Việt.
        </p>
      </div>

      <section aria-labelledby="basic">
        <h2 id="basic" className="h3">
          Chữ cái cơ bản
        </h2>
        {grid(basic)}
      </section>

      <section aria-labelledby="special">
        <h2 id="special" className="h3">
          Chữ cái đặc biệt: Umlaut & Eszett
        </h2>
        <p className="muted">Ä, Ö, Ü thay đổi cách đọc nguyên âm; ß là "s" sắc. Không có bàn phím Đức? Viết ae, oe, ue, ss.</p>
        {grid(special)}
      </section>

      <section className="card tip-card">
        <h2 className="h3">💡 Đánh vần kiểu Đức</h2>
        <p>
          Khi đọc email hoặc tên qua điện thoại, người Đức thường nói <em lang="de">„A wie Anton, B wie Berta…“</em>. Hãy tập đánh vần tên bạn: <strong lang="de">N – G – U – Y – E – N</strong>.
        </p>
        <div className="row gap-sm wrap">
          <Link to="/learn/alphabet" className="btn btn-ghost">
            🎓 Học bài Bảng chữ cái
          </Link>
          <Link to="/pronunciation" className="btn btn-ghost">
            🗣️ Luyện phát âm
          </Link>
        </div>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} title={`Chữ ${open?.letter ?? ''}`}>
        {open && (
          <>
            <LetterCard letter={open} />
            <div className="modal-nav">
              {(() => {
                const idx = alphabet.findIndex((l) => l.letter === open.letter);
                const prev = alphabet[idx - 1];
                const next = alphabet[idx + 1];
                return (
                  <>
                    <button className="btn btn-ghost" disabled={!prev} onClick={() => prev && openLetter(prev)}>
                      ← {prev?.letter}
                    </button>
                    <button className="btn btn-ghost" disabled={!next} onClick={() => next && openLetter(next)}>
                      {next?.letter} →
                    </button>
                  </>
                );
              })()}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
