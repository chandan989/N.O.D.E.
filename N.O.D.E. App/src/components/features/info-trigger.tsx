import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface InfoTriggerProps {
  title: string;
  description: React.ReactNode;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export const InfoTrigger: React.FC<InfoTriggerProps> = ({ title, description }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2">
            <Info className="h-4 w-4 text-glow" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <h3 className="text-lg font-bold text-glow">{title}</h3>
          <div className="py-2 text-base text-gray-400">{description}</div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Info className="h-4 w-4 text-glow" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-glow">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-base text-gray-400">{description}</div>
      </DialogContent>
    </Dialog>
  );
};
