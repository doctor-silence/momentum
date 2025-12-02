import React, { useState } from 'react';
import PolicyModal from '@/components/common/PolicyModal';
import { privacyPolicyTitle, privacyPolicyContent } from "@/lib/privacy-policy";
import { termsOfServiceTitle, termsOfServiceContent } from "@/lib/terms-of-service";
import ReactMarkdown from 'react-markdown';

const Footer = () => {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openPolicyModal = (type) => {
    if (type === 'privacy') {
      setModalContent({ title: privacyPolicyTitle, content: privacyPolicyContent });
    } else {
      setModalContent({ title: termsOfServiceTitle, content: termsOfServiceContent });
    }
    setIsPolicyModalOpen(true);
  };

  return (
    <>
      <footer className="py-8 border-t border-white/10 bg-transparent text-center text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Momentum Amplify AI.</div>
          <div className="flex gap-8">
            <button onClick={() => openPolicyModal('privacy')} className="hover:text-white transition-colors">Политика конфиденциальности</button>
            <button onClick={() => openPolicyModal('terms')} className="hover:text-white transition-colors">Условия обслуживания</button>
            <a href="mailto:support@momentum-ai.ru" className="hover:text-white transition-colors">Поддержка</a>
          </div>
        </div>
      </footer>
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onOpenChange={setIsPolicyModalOpen}
        title={modalContent.title}
      >
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{modalContent.content}</ReactMarkdown>
        </div>
      </PolicyModal>
    </>
  );
};

export default Footer;
