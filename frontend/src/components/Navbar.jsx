import { Link } from 'react-router-dom';
import { Laptop, Moon, Sun } from 'lucide-react';

import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
  Button,
} from '@/components/ui';

const Navbar = () => {
  const { logout } = useAuth();
  const { setTheme } = useTheme();

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      <div className='flex flex-row items-center justify-between gap-8 px-8 py-4'>
        <Link to='/'>Home</Link>
        <div className='flex-end flex flex-row items-center gap-8'>
          <Link to='/favorites'>Favorites</Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Link>Account</Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Sun className='h-[1.2rem] w-[1.2rem]' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className='mr-2 h-4 w-4' />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className='mr-2 h-4 w-4' />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className='mr-2 h-4 w-4' />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Navbar;
