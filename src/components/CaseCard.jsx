import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Play, FileText } from 'lucide-react';
import { getStatusBadge } from '../data/casesData';
import { voiceService } from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function CaseCard({ caseItem }) {
  const { getCaseContent, t } = useLanguage();
  const item = getCaseContent(caseItem);
  const badge = getStatusBadge(item.status);
  const handleCardClick = () => voiceService.playAudioFeedback('click');

  const getDifficultyBadge = (diff) => {
    if (diff === 'Master' || diff === 'Expert') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (diff === 'Advanced') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-mneme-accent/40 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-mneme-accent/10 hover:-translate-y-1">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-mneme-accent/0 to-transparent group-hover:via-mneme-accent/60 transition-all duration-500" />
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-mneme-muted px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">{item.domain}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold tracking-wide ${badge.classes}`}>{badge.label}</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-white group-hover:text-mneme-lavender transition-colors mb-1.5 leading-snug">{item.title}</h3>
        <p className="text-xs text-mneme-lavender/70 font-mono mb-3 line-clamp-1">{item.subtitle || item.location}</p>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{item.summary}</p>
      </div>
      <div>
        <div className="flex items-center justify-between py-2.5 my-2 border-t border-b border-white/5 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /><span>{item.duration || '15 min'}</span></div>
          <span className={`px-2 py-0.5 rounded text-[10px] border font-medium ${getDifficultyBadge(item.difficulty)}`}>{item.difficulty || 'Intermediate'}</span>
          <span className="text-slate-500">{item.year || '2024'}</span>
        </div>
        <div className="pt-2 flex items-center justify-between gap-2">
          <Link to={`/case/${item.id}`} onClick={handleCardClick} className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"><FileText className="w-3.5 h-3.5" /><span>Dossier</span></Link>
          {item.playable ? (
            <Link to={`/investigate/${item.id}`} onClick={handleCardClick} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-mneme-accent hover:bg-purple-600 text-white text-xs font-semibold tracking-wide shadow-md shadow-mneme-accent/20 transition-all group-hover:scale-105">
              <Play className="w-3 h-3 fill-current" /><span>{t('btn.investigate', 'Investigate')}</span><ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          ) : (
            <Link to={`/case/${item.id}`} onClick={handleCardClick} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium border border-white/10 transition-colors"><span>Explore Facts</span><ArrowRight className="w-3 h-3 ml-0.5" /></Link>
          )}
        </div>
      </div>
    </div>
  );
}
