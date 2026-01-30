import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

export const ShadcnShowcase: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <Card
      title="UI Kit — shadcn/ui"
      action={
        <span className="text-2xs font-black uppercase tracking-[0.22em] text-gray-400">
          Starter set
        </span>
      }
    >
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Korzystamy z shadcn/ui jako standardu komponentów. Poniżej mini-stub: pole, przycisk i
          dialog zgodnie z nową biblioteką.
        </p>
        <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Work email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            hint="Potwierdzimy dostęp do trialu."
          />
          <div className="flex items-end gap-2">
            <Button type="submit" variant="default" size="lg">
              Zapisz się
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="lg">
                  Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Standard UI</DialogTitle>
                  <DialogDescription>
                    Button/Input/Dialog/Card pochodzą z shadcn/ui i są trzymane w{' '}
                    <code>apps/web/components/ui</code> jako standard projektowy.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </form>
        {submitted && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-2xs font-black uppercase tracking-[0.2em] px-4 py-3">
            Zapis przyjęty — sprawdź skrzynkę.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
