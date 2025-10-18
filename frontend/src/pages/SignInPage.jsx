import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/components/AuthProvider";
import SignInForm from "@/components/SignInForm";
import { Button, Card, CardContent, CardHeader, Separator } from '@/components/ui';

const SignInPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate, token]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@abulkhoyer.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1500);
    } catch {}
  };
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText('hellokhoyer');
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 1500);
    } catch {}
  };

  return (
    <div className='container flex h-screen flex-col items-center justify-center gap-4 py-4'>
      <SignInForm />
            <Card className='mx-auto w-[500px]'>
        <CardHeader>
          <h2 className='text-center text-2xl'>Demo Credentials</h2>
          <p className='text-center text-muted-foreground'>Use these to sign in</p>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm text-muted-foreground'>Email</div>
                <div className='font-mono text-sm'>hello@abulkhoyer.com</div>
              </div>
              <Button variant='outline' onClick={copyEmail}>
                {copiedEmail ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm text-muted-foreground'>Password</div>
                <div className='font-mono text-sm'>hellokhoyer</div>
              </div>
              <Button variant='outline' onClick={copyPassword}>
                {copiedPassword ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
