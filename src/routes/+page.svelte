<script lang="ts">
import { page } from '$app/state';
import { getPosts } from '$lib/pb.remote';
import hero_image from '$lib/assets/images/002.jpg';
import profile_image from '$lib/assets/images/ajarn.jpg';
import AudioPlayer from './audio-player.svelte';
import { browser } from '$app/environment';
import * as Svg from '$lib/svg';

const { items: posts, ...paginate } = await getPosts();
let active_post = $state<(typeof posts)[number]>();
let preloadAudioElement = $state<HTMLAudioElement>();
const hoverPreload = (node: HTMLButtonElement, src: string) => {
    node.addEventListener('mouseenter', () => {
        preloadAudioElement!.src = src;
        preloadAudioElement!.load();
    });
};
</script>

<audio preload="auto" bind:this={preloadAudioElement}></audio>

{#if browser && active_post && active_post.audio_link}
    {#key active_post.id}
        <div
            class="fixed right-0 bottom-0 left-0 z-50 bg-base-200 px-6 pt-8 pb-6 [&_input.trackslider]:cursor-pointer"
        >
            <AudioPlayer post={active_post} src={active_post.audio_link} />
        </div>
    {/key}
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
                            {@attach (node) => hoverPreload(node, post.audio_link)}
                            onclick={() => (active_post = post)}
                            class="btn size-15 rounded-full p-3 text-center text-white {is_active
                                ? 'btn-accent'
                                : 'btn-neutral'}"
                        >
                            {#if is_active}
                                <Svg.Pause />
                            {:else}
                                <Svg.Play class="ml-1 fill-current" />
                            {/if}
                        </button>
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
