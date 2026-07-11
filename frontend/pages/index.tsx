import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mt-5">
      <h1>A.A Dynamic Computer Training Center - Cafe Management</h1>
      <p>Welcome. Please <Link href="/auth/login">login</Link> or <Link href="/auth/register">register</Link>.</p>
    </div>
  );
}
