import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScrollToTopBottom = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(true);

  const handleScroll = () => {
    // Show top button if user has scrolled down
    if (window.pageYOffset > 300) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }

    // Show bottom button if user is not at the bottom of the page
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10; // 10px buffer
    setShowBottomButton(!isAtBottom);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center space-y-2">
      {showTopButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="h-10 w-10"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Go to top</span>
        </Button>
      )}
      {showBottomButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className="h-10 w-10"
        >
          <ArrowDown className="h-5 w-5" />
          <span className="sr-only">Go to bottom</span>
        </Button>
      )}
    </div>
  );
};

export default ScrollToTopBottom;
