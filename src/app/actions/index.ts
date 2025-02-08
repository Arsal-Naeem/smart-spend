'use server'

import { signIn } from '@/auth'

export async function doSocialLogin(formData: any) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: '/dashboard' });
    console.log(action);

}

// https://youtu.be/O8Ae6MC5bf4?t=1540