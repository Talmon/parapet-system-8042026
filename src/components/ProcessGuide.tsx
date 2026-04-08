import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, ArrowDown, ArrowRight, CheckCircle2, GitBranch } from 'lucide-react';

export interface WorkflowStep {
  step: number;
  title: string;
  who: string;
  description: string;
  tip?: string;
  branch?: { condition: string; yes: string; no: string };
  color?: string;
}

interface ProcessGuideProps {
  title: string;
  description: string;
  steps: WorkflowStep[];
  tips?: string[];
  defaultOpen?: boolean;
}

const WHO_COLORS: Record<string, string> = {
  Employee: 'bg-green-100 text-green-700 border-green-200',
  Supervisor: 'bg-amber-100 text-amber-700 border-amber-200',
  'HR Manager': 'bg-blue-100 text-blue-700 border-blue-200',
  HRBP: 'bg-purple-100 text-purple-700 border-purple-200',
  'HR Head': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  System: 'bg-slate-100 text-slate-700 border-slate-200',
  Admin: 'bg-red-100 text-red-700 border-red-200',
  HOD: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Finance: 'bg-orange-100 text-orange-700 border-orange-200',
  Driver: 'bg-teal-100 text-teal-700 border-teal-200',
};

function getWhoColor(who: string) {
  for (const [key, val] of Object.entries(WHO_COLORS)) {
    if (who.includes(key)) return val;
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

export default function ProcessGuide({ title, description, steps, tips, defaultOpen = false }: ProcessGuideProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Info size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">How it works — {title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="shrink-0 ml-4">
          {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t p-4 space-y-6">
          {/* Flow diagram */}
          <div className="overflow-x-auto">
            <div className="flex flex-col items-start gap-0 min-w-max">
              {steps.map((step, idx) => (
                <div key={step.step} className="flex flex-col items-start">
                  {/* Step card */}
                  <div className="flex items-start gap-3 group">
                    {/* Step number + connector line */}
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm ${
                        step.color || 'bg-primary'
                      }`}>
                        {step.step}
                      </div>
                      {idx < steps.length - 1 && !step.branch && (
                        <div className="w-0.5 h-8 bg-border mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{step.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getWhoColor(step.who)}`}>
                          {step.who}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 max-w-lg">{step.description}</p>
                      {step.tip && (
                        <p className="text-xs mt-1.5 text-primary/80 flex items-start gap-1">
                          <span className="shrink-0">💡</span>
                          <span>{step.tip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Branch */}
                  {step.branch && (
                    <div className="ml-4 mt-0 mb-2">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <GitBranch size={14} className="text-muted-foreground" />
                        <span className="font-medium text-muted-foreground">{step.branch.condition}?</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
                          <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-green-700">YES</span>
                            <p className="text-green-600 mt-0.5">{step.branch.yes}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
                          <ArrowRight size={14} className="text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-red-600">NO</span>
                            <p className="text-red-500 mt-0.5">{step.branch.no}</p>
                          </div>
                        </div>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="flex justify-center mt-2">
                          <ArrowDown size={16} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* End node */}
              <div className="flex items-center gap-3 mt-1">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-600 text-white shrink-0 shadow-sm">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm font-semibold text-green-700">Process Complete</span>
              </div>
            </div>
          </div>

          {/* Tips section */}
          {tips && tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Key Tips</p>
              <ul className="space-y-1.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                    <span className="shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
