import Image from "next/image";

export function AuthWelcomeImage() {
  return (
    <Image
      src="/images/auth/register-welcome.jpg"
      alt=""
      width={448}
      height={252}
      priority
      className="rounded-2xl border border-border shadow-md"
    />
  );
}
