import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="border-b border-border-hairline">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-4">
          <Image
            src="/logo/symbol.svg"
            alt="HuoCode"
            width={28}
            height={28}
            priority
          />
          <span className="font-display text-lg font-semibold">HuoCode</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Find out where the risk sits
        </h1>
        <p className="mt-4 max-w-prose text-lg text-text-secondary">
          Paste a public GitHub URL and HuoCode maps the hot spots: the files
          that are both complicated and changing fast, which is where bugs hide.
        </p>

        <p className="mt-10 text-sm text-text-tertiary">
          The analyzer is being wired up. Nothing here works yet.
        </p>
      </main>
    </>
  );
}
