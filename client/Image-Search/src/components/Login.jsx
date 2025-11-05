import React from 'react'
import { loginUrl } from '../api'

export default function Login() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <a href={loginUrl('google')}>Login with Google</a>
      <a href={loginUrl('github')}>Login with GitHub</a>
    </div>
  )
}
