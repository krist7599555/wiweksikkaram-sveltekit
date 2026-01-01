<script lang="ts">
import { page } from '$app/state';
import { getPosts } from '$lib/pb.remote';
import hero_image from '$lib/assets/images/002.jpg';
import profile_image from '$lib/assets/images/ajarn.jpg';
import { AudioPlayer } from 'svelte-mp3';
import { browser } from '$app/environment';
const navItems = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Blog', href: '/blog' }
];
const { items: posts, ...paginate } = await getPosts();
let active_post = $state<(typeof posts)[number]>();
</script>

{#if browser && active_post && active_post.audio_link}
    <div
        class="fixed right-0 bottom-0 left-0 z-50 bg-base-200 px-6 pt-8 pb-6 [&_input.trackslider]:cursor-pointer"
    >
        <AudioPlayer
            class="**:[[name=repeat]]:hidden"
            color="black"
            disableVolSlider
            enableMediaSession={false}
            showTrackNum={false}
            progressForeground="#ff981a"
            showShuffle={false}
            showVolume={false}
            showPrev={false}
            showNext={false}
            urls={[active_post.audio_link]}
        />
    </div>
{/if}

<div class="relative text-[2.5vw]">
    <img class="aspect-6/3 w-full object-cover object-[50%_80%]" src={hero_image} alt="" />
    <div class="absolute top-[20%] left-[15%] text-white">
        <div class="mb-[-0.3em] text-[0.5em] font-light">สถานปฏิบัติธรรม</div>
        <div class="text-[1.5em] font-bold">วิเวกสิกขาราม</div>
        <div class="text-[0.5em] font-light">อำเภอพล จังหวัดขอนแก่น</div>
        <div class="text-[0.5em] font-light">ถวายผ้าป่าทุกวันอาทิตย์ 13:00</div>
    </div>
</div>

<div class="mx-auto flex max-w-[64rem] px-6">
    <aside class="w-78">
        <div class="relative">
            <img
                src={profile_image}
                class="relative -mt-25 size-50 rounded-full border-10 border-white"
                alt=""
            />
            <div
                class="absolute top-14 left-full w-90 overflow-visible text-2xl font-bold text-white"
            >
                พระอาจารย์วิชัย กัมมสุทโธ
            </div>
        </div>
        <ul>
            <li>About</li>
            <li>Contact</li>
            <li>Audio</li>
            <li>Book</li>
        </ul>
    </aside>
    <div class="w-full">
        <div class="pt-8">
            {#each posts as post}
                {@const is_active = post.id === active_post?.id}
                <section
                    class="mt-0 flex items-start justify-start gap-5 border-b border-base-300 bg-white pt-7 pb-5 {is_active
                        ? 'sticky top-0 z-20'
                        : ''}"
                >
                    <div>
                        <button
                            onclick={() => (active_post = post)}
                            class="btn size-15 rounded-full {is_active
                                ? 'btn-accent'
                                : 'btn-primary'}">Play</button
                        >
                    </div>
                    <div class="flex flex-col justify-center">
                        <div class=" font-bold">
                            {post.title}
                            {#if post.audio_duration}
                                {@const hour = Math.floor(post.audio_duration / 3600)}
                                {@const minute = Math.floor(post.audio_duration / 60) % 60}
                                <span class="badge badge-soft badge-xs font-medium badge-primary">
                                    {hour}:{('' + minute).padStart(2, '0')}
                                </span>
                            {/if}
                        </div>
                        <div class="text-xs opacity-40">
                            {new Date(post.published || '').toLocaleDateString('th', {
                                dateStyle: 'long'
                            })}

                            {post.location ? '- ' + post.location : ''}
                            {post.event ? '- ' + post.event : ''}
                        </div>
                        <div>
                            {#each post.expand.tags as tag}
                                <span class="badge badge-soft badge-xs badge-accent"
                                    >{tag.name}</span
                                >
                            {/each}
                        </div>
                    </div>
                </section>
            {/each}
        </div>
    </div>
</div>

<div class="border-b border-base-content/10 py-2 text-center">
    <div class="font-bold">วิเวกสิกขาราม</div>
</div>
<div class="flex justify-center border-b border-base-content/10 text-sm">
    {#each navItems as { title, href } (title)}
        {@const active = page.url.pathname === href}
        <a
            {href}
            class="btn rounded-none border-2 font-medium btn-ghost btn-sm"
            class:border-t-primary={active}>{title}</a
        >
    {/each}
</div>
<div class="grid text-xs sm:grid-cols-[2fr_5fr_3fr] [&>div]:p-2">
    <div class="order-last sm:order-0">
        <!--  -->
        <img src="https://images.pexels.com/photos/33712952/pexels-photo-33712952.jpeg" alt="" />
        <div class="mt-1 mb-4">
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
        <img src="https://images.pexels.com/photos/634242/pexels-photo-634242.jpeg" alt="" />
        <div class="mt-1 mb-4">
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
    </div>

    <div class="order-first border-x border-base-content/10 sm:order-0">
        <img src="https://images.pexels.com/photos/18705300/pexels-photo-18705300.jpeg" alt="" />
        <div class="mt-2 mb-4 space-y-1 text-center">
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-base-content/60">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate, incidunt nisi.
                Aliquid quod hic ipsum sunt enim animi cumque, corporis possimus explicabo. Fugiat
            </div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
    </div>

    <div class="grid h-fit grid-cols-2 gap-2">
        <div class="col-span-full border-b border-base-content/10 pb-2 font-bold">ล่าสุด</div>
        <div>
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
        <img
            class="aspect-4/3 h-40 object-cover sm:h-20"
            src="https://images.pexels.com/photos/6646542/pexels-photo-6646542.jpeg"
            alt=""
        />
        <div>
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
        <img
            class="aspect-4/3 h-40 object-cover sm:h-20"
            src="https://images.pexels.com/photos/27672712/pexels-photo-27672712.jpeg"
            alt=""
        />
        <div>
            <div class="text-[0.5rem] font-bold text-accent">BOOK</div>
            <div class="font-bold">How To Blaba</div>
            <div class="text-[0.6rem] text-base-content/50">12 June 2025</div>
        </div>
        <img
            class="aspect-4/3 h-40 object-cover sm:h-20"
            src="https://images.pexels.com/photos/33905796/pexels-photo-33905796.jpeg"
            alt=""
        />
        <!--  -->
    </div>
</div>

<div class="border-t border-base-content/10 px-4 py-8">
    <div class="container mx-auto">
        <div class="mb-2 flex justify-between">
            <h2>Recent Episode</h2>
            <a href="/">More</a>
        </div>
        <div class="grid grid-flow-col-dense grid-cols-2 grid-rows-3 gap-2">
            <div
                class="col-start-2 row-start-1 row-end-4 bg-base-300 bg-[url(https://images.pexels.com/photos/14022157/pexels-photo-14022157.jpeg)] bg-cover p-4"
            >
                <div class="text-base-content">
                    <div class="flex text-sm">
                        <div>EP -</div>
                        <div>1h 30m</div>
                    </div>
                    <div class="font-bold">Title Headerline</div>
                    <div class="text-xs opacity-70">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ipsa earum
                        quam maxime itaque hic iste veniam consequuntur magnam repellat ut, odio
                        sequi,
                    </div>
                    <div class="flex items-baseline gap-2">
                        <button class="btn mt-2 rounded-none btn-sm">Play</button>
                        <div class="link text-sm">Listen Now</div>
                    </div>
                </div>
            </div>
            {#each [1, 2, 3] as i}
                <div class="border border-base-300 p-4">
                    <div class="flex text-xs">
                        <div>EP {i} -</div>
                        <div>1h 30m</div>
                    </div>
                    <div class="font-bold">Title Headerline</div>
                    <div class="text-xs opacity-70">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero ipsa earum
                        quam maxime itaque hic iste veniam
                    </div>
                    <div class="flex items-baseline gap-2">
                        <button class="btn mt-2 rounded-none btn-sm">Play</button>
                        <div class="link text-sm">Listen Now</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<div class="border-t border-base-content/10 px-4 py-8">
    <div class="container mx-auto">
        <div class="flex items-baseline justify-between">
            <h2>All Posts</h2>
            <a target="_blank" href="/_" class="link text-sm text-base-content/70">Edit</a>
        </div>

        <section class="mt-2 space-y-2">
            {#each [posts, posts, posts].flat() as post}
                <div class="rounded-none border border-base-300 p-4">
                    <div class="font-bold">{post.id}. {post.title}</div>
                    <div class="prose text-xs">{@html post.content}</div>
                    <div class="text-xs opacity-70">{post.created}</div>
                    {#if post.audio_link}
                        <div class="prose text-xs">
                            <a href={post.audio_link} class="link">{post.audio_link}</a>
                            <audio src={post.audio_link} controls></audio>
                        </div>
                    {/if}
                </div>
            {/each}
        </section>
    </div>
</div>

<footer class="bg-base-200 text-base-content">
    <div class="container mx-auto grid gap-10 py-12 md:grid-cols-5">
        <!-- Brand -->
        <div class="space-y-3 md:col-span-2">
            <h2 class="">MyWebsite</h2>
            <p class="text-sm opacity-80">
                เว็บนี้ทำด้วย SvelteKit + DaisyUI<br />
                ไม่ได้สวยเวอร์ แต่ใช้งานจริง และไม่พัง
            </p>
        </div>

        <!-- Links -->
        <div>
            <h3 class="">Product</h3>
            <ul class="space-y-2 text-xs">
                <li><a href="/" class="link link-hover">Features</a></li>
                <li><a href="/" class="link link-hover">Pricing</a></li>
                <li><a href="/" class="link link-hover">Changelog</a></li>
                <li><a href="/" class="link link-hover">Roadmap</a></li>
            </ul>
        </div>

        <div>
            <h3 class="">Resources</h3>
            <ul class="space-y-2 text-xs">
                <li><a href="/" class="link link-hover">Docs</a></li>
                <li><a href="/" class="link link-hover">Tutorials</a></li>
                <li><a href="/" class="link link-hover">Blog</a></li>
                <li><a href="/" class="link link-hover">Examples</a></li>
            </ul>
        </div>

        <div>
            <h3 class="">Company</h3>
            <ul class="space-y-2 text-xs">
                <li><a href="/" class="link link-hover">About</a></li>
                <li><a href="/" class="link link-hover">Careers</a></li>
                <li><a href="/" class="link link-hover">Contact</a></li>
                <li><a href="/" class="link link-hover">Privacy</a></li>
            </ul>
        </div>
    </div>

    <!-- Bottom -->
    <div class="border-t border-base-300">
        <div
            class="container mx-auto flex flex-col items-center justify-between gap-2 py-4 text-xs opacity-70 md:flex-row"
        >
            <p>© 2025 วิเวกสิกขาราม. All rights reserved.</p>
            <p>อเสวนา จ พาลานํ ปญฺฑิตา จ เสวนา</p>
        </div>
    </div>
</footer>
