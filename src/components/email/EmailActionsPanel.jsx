import React, { useState } from "react";
import { Mail, MailX, CheckCircle, Send, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useCandidates } from "../../hooks/useCandidates";
import EmailConfirmModal from "./EmailConfirmModal";
import toast from "react-hot-toast";

function EmailCard({ type, count, isSent, onSend, sentAt }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSelected = type === "selected";

  const config = isSelected
    ? {
        icon: Mail,
        title: "Send Shortlisting Emails",
        subtitle: "Notify all selected candidates with a congratulations email.",
        countLabel: "candidates selected",
        btnClass: "bg-green-500 hover:bg-green-400 text-white",
        iconBg: "bg-green-500/10",
        iconColor: "text-green-400",
        borderColor: "border-green-500/10",
        accentClass: "text-green-400",
        successBg: "bg-green-500/5 border-green-500/20",
      }
    : {
        icon: MailX,
        title: "Send Rejection Emails",
        subtitle: "Send professional rejection emails to all rejected candidates.",
        countLabel: "candidates rejected",
        btnClass: "bg-red-500 hover:bg-red-400 text-white",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
        borderColor: "border-red-500/10",
        accentClass: "text-red-400",
        successBg: "bg-red-500/5 border-red-500/20",
      };

  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      onSend();
      toast.success(`✅ Emails sent to ${count} candidates`, {
        style: { background: "#1E293B", color: "#E2E8F0", border: `1px solid ${isSelected ? "#22C55E" : "#EF4444"}` },
      });
    } catch {
      toast.error("Failed to send emails.", {
        style: { background: "#1E293B", color: "#E2E8F0", border: "1px solid #EF4444" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`rounded-2xl border border-slate-800 bg-[#1E293B] p-6 flex flex-col gap-5`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg} flex-shrink-0`}>
            <Icon size={22} className={config.iconColor} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base">{config.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{config.subtitle}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/60`}>
          <span className={`text-2xl font-bold font-mono ${config.accentClass}`}>{count}</span>
          <span className="text-sm text-slate-400">{config.countLabel}</span>
        </div>

        {isSent ? (
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.successBg}`}>
            <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-200">Emails sent successfully</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock size={10} />
                {sentAt}
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            disabled={count === 0 || isLoading}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              count === 0 || isLoading
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : config.btnClass
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={15} />
                {config.title}
              </>
            )}
          </button>
        )}
      </div>

      <EmailConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        count={count}
        type={type}
      />
    </>
  );
}

export default function EmailActionsPanel() {
  const { selected, rejected } = useCandidates();
  const { emailSentSelected, setEmailSentSelected, emailSentRejected, setEmailSentRejected } = useApp();
  const [sentSelectedAt, setSentSelectedAt] = useState("");
  const [sentRejectedAt, setSentRejectedAt] = useState("");

  const handleSendSelected = () => {
    setEmailSentSelected(true);
    setSentSelectedAt(new Date().toLocaleTimeString());
  };

  const handleSendRejected = () => {
    setEmailSentRejected(true);
    setSentRejectedAt(new Date().toLocaleTimeString());
  };

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmailCard
          type="selected"
          count={selected.length}
          isSent={emailSentSelected}
          onSend={handleSendSelected}
          sentAt={sentSelectedAt}
        />
        <EmailCard
          type="rejected"
          count={rejected.length}
          isSent={emailSentRejected}
          onSend={handleSendRejected}
          sentAt={sentRejectedAt}
        />
      </div>

      {/* Log */}
      {(emailSentSelected || emailSentRejected) && (
        <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Log</p>
          <div className="space-y-1.5">
            {emailSentSelected && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <CheckCircle size={12} className="text-green-400" />
                <span>{sentSelectedAt} — Shortlisting emails sent to {selected.length} candidates</span>
              </div>
            )}
            {emailSentRejected && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <CheckCircle size={12} className="text-green-400" />
                <span>{sentRejectedAt} — Rejection emails sent to {rejected.length} candidates</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
