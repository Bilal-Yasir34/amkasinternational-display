export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="p-5">
        <div className="skeleton mb-3 h-3 w-20 rounded" />
        <div className="skeleton mb-2 h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedCarouselSkeleton() {
  return (
    <section className="bg-beige-50 py-20 lg:py-28 overflow-hidden">
      <div className="container-px">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="skeleton mb-3 h-3 w-24 rounded" />
            <div className="skeleton h-8 w-56 sm:w-72 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="skeleton h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[4/5] w-full" />
              <div className="p-5">
                <div className="skeleton mb-3 h-3 w-20 rounded" />
                <div className="skeleton mb-2 h-5 w-3/4 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-1.5 w-6 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CollectionsGridSkeleton() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <div className="mb-12 max-w-2xl">
          <div className="skeleton mb-3 h-3 w-24 rounded" />
          <div className="skeleton mb-4 h-8 w-64 sm:w-80 rounded-lg" />
          <div className="skeleton h-4 w-full max-w-lg rounded" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[4/3] w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSkeleton() {
  return (
    <section className="bg-ink-950 py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-14 max-w-2xl text-center flex flex-col items-center">
          <div className="skeleton mb-3 h-3 w-28 rounded bg-white/10" />
          <div className="skeleton mb-4 h-8 w-60 sm:w-72 rounded-lg bg-white/10" />
          <div className="skeleton h-4 w-full max-w-md rounded bg-white/10" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="skeleton mb-5 h-12 w-12 rounded-2xl bg-white/10" />
              <div className="skeleton mb-3 h-5 w-3/4 rounded bg-white/10" />
              <div className="skeleton h-4 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificationsSkeleton() {
  return (
    <section className="bg-beige-50/50 py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-14 max-w-2xl text-center flex flex-col items-center">
          <div className="skeleton mb-3 h-3 w-36 rounded" />
          <div className="skeleton mb-4 h-8 w-64 sm:w-80 rounded-lg" />
          <div className="skeleton h-4 w-full max-w-md rounded" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-ink-100 bg-white p-5">
              <div className="skeleton aspect-[4/3] w-full rounded-2xl mb-4" />
              <div className="skeleton mb-2 h-5 w-3/4 rounded" />
              <div className="skeleton mb-2 h-4 w-1/2 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyInfoSkeleton() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-12 max-w-2xl text-center flex flex-col items-center">
          <div className="skeleton mb-3 h-3 w-32 rounded" />
          <div className="skeleton h-8 w-60 sm:w-72 rounded-lg" />
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="card divide-y divide-ink-100 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-5 sm:p-6">
                <div className="skeleton h-10 w-10 flex-shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="skeleton mb-2 h-3 w-28 rounded" />
                  <div className="skeleton h-5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BankDetailsSkeleton() {
  return (
    <section className="bg-beige-50 py-20 lg:py-28">
      <div className="container-px">
        <div className="mx-auto mb-12 max-w-2xl text-center flex flex-col items-center">
          <div className="skeleton mb-3 h-3 w-28 rounded" />
          <div className="skeleton mb-4 h-8 w-56 rounded-lg" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-6 py-4">
              <div className="skeleton h-5 w-5 rounded" />
              <div className="skeleton h-5 w-44 rounded" />
            </div>
            <div className="divide-y divide-ink-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="skeleton mb-1 h-3 w-24 rounded" />
                    <div className="skeleton h-5 w-48 rounded" />
                  </div>
                  <div className="skeleton h-9 w-9 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
