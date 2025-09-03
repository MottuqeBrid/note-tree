export default async function Hero() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/others/hero`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const { slogan, subSlogan, image } = data?.hero || {};
  return (
    <section>
      <div
        className="hero min-h-[400px]"
        style={{
          backgroundImage: `url(${
            image
              ? image
              : "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          })`,
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="hero-overlay"></div>

        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-lg">
            <h1 className="mb-5 text-5xl font-bold">
              {slogan ? slogan : "Organize Your Thoughts with NoteTree"}
            </h1>
            <p className="mb-5 text-lg">
              {subSlogan
                ? subSlogan
                : "Create, manage, and track your notes seamlessly. NoteTree helps you stay organized, boost productivity, and never lose track of your ideas."}
            </p>
            <button className="btn btn-primary text-neutral btn-lg">
              Get Started for Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
