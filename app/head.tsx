// app/head.tsx
export default function Head() {
  const exp = new Date().getFullYear() - 2000;

  return (
    <>
      <title>a Mestre Fábio | Personal Portfolio</title>
      <meta
        name="description"
        content={`Fábio is a full-stack developer with ${exp} years of experience. Bring me your ideas and I'll bring them to life!`}
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
