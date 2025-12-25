type AsyncFn<I, O> = (input: I) => O | Promise<O>;

// overloads (1–10)
export function apipe<A, B>(a: A, ab: AsyncFn<A, B>): Promise<B>;

export function apipe<A, B, C>(a: A, ab: AsyncFn<A, B>, bc: AsyncFn<B, C>): Promise<C>;

export function apipe<A, B, C, D>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>
): Promise<D>;

export function apipe<A, B, C, D, E>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>
): Promise<E>;

export function apipe<A, B, C, D, E, F>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>
): Promise<F>;

export function apipe<A, B, C, D, E, F, G>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>,
    fg: AsyncFn<F, G>
): Promise<G>;

export function apipe<A, B, C, D, E, F, G, H>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>,
    fg: AsyncFn<F, G>,
    gh: AsyncFn<G, H>
): Promise<H>;

export function apipe<A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>,
    fg: AsyncFn<F, G>,
    gh: AsyncFn<G, H>,
    hi: AsyncFn<H, I>
): Promise<I>;

export function apipe<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>,
    fg: AsyncFn<F, G>,
    gh: AsyncFn<G, H>,
    hi: AsyncFn<H, I>,
    ij: AsyncFn<I, J>
): Promise<J>;

// implementation
export async function apipe(value: unknown, ...fns: Array<(v: any) => any>) {
    let acc = value;
    for (const fn of fns) {
        acc = await fn(acc);
    }
    return acc;
}
