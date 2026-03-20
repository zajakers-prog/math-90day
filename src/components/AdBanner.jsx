import React, { useEffect } from 'react';

export default function AdBanner({ dataAdSlot }) {
  useEffect(() => {
    try {
      const pushAd = () => {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      };
      
      // Delay push slightly to ensure <ins> tag is fully mounted before AdSense script finds it
      let timeoutId = setTimeout(pushAd, 300);
      return () => clearTimeout(timeoutId);
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 min-h-[100px] max-h-[120px] relative items-center shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
      <span className="text-gray-400 font-black text-sm tracking-[0.3em] absolute z-0 pointer-events-none">
        ADVERTISEMENT
      </span>
      <ins
        className="adsbygoogle relative z-10 w-full"
        style={{ display: 'block', minWidth: '320px', height: '100px' }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={dataAdSlot || "1234567890"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
