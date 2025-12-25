type Fn<I, O> = (input: I) => O;

// overloads (1–10)
export function pipe<A, B>(a: A, ab: Fn<A, B>): B;

export function pipe<A, B, C>(a: A, ab: Fn<A, B>, bc: Fn<B, C>): C;

export function pipe<A, B, C, D>(a: A, ab: Fn<A, B>, bc: Fn<B, C>, cd: Fn<C, D>): D;

export function pipe<A, B, C, D, E>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>
): E;

export function pipe<A, B, C, D, E, F>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>
): F;

export function pipe<A, B, C, D, E, F, G>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>
): G;

export function pipe<A, B, C, D, E, F, G, H>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>,
    hi: Fn<H, I>
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: Fn<A, B>,
    bc: Fn<B, C>,
    cd: Fn<C, D>,
    de: Fn<D, E>,
    ef: Fn<E, F>,
    fg: Fn<F, G>,
    gh: Fn<G, H>,
    hi: Fn<H, I>,
    ij: Fn<I, J>
): J;

// implementation
export function pipe(value: unknown, ...fns: Array<(v: any) => any>) {
    return fns.reduce((acc, fn) => fn(acc), value);
}
