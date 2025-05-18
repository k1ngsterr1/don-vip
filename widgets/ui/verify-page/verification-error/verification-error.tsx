interface VerificationErrorProps {
  error: string | null;
}

export function VerificationError({ error }: VerificationErrorProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
      {error}
    </div>
  );
}
