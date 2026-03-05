//Home server principal
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');

  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-background-page">
        
    </div>
  );
}
