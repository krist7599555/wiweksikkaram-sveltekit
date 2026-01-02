<script lang="ts">
import { formatSecond } from '$lib';
import type { PostsRecord } from '$lib/pocketbase/pb_types';
import * as Svg from '$lib/svg';

const { src, post }: { src: string | undefined; post?: PostsRecord } = $props();
let input = $state<HTMLInputElement>();
let audio = $state<HTMLAudioElement>();
let duration = $state(0);
let currentTime = $state(0);
let paused = $state(true);
$effect(() => {
    console.log('propValue changed to:', src);
    duration = NaN;
});
</script>

<div class="flex gap-3">
    <button
        onclick={() => (paused ? audio!.play() : audio!.pause())}
        class="btn size-15 rounded-full bg-base-content p-3 text-center text-base-100"
    >
        {#if isNaN(duration)}
            <Svg.Loader class="animate-[spin_1.5s_linear_infinite]" />
        {:else if paused}
            <Svg.Play class="ml-1 fill-current" />
        {:else}
            <Svg.Pause class="fill-current" />
        {/if}
    </button>

    <div class="w-full">
        <div class="flex justify-between font-mono">
            <div>{formatSecond(currentTime)}</div>
            {#if post}
                <div>{post.title}</div>
            {/if}
            <div>{formatSecond(duration)}</div>
        </div>
        <input
            value="0"
            type="range"
            class="range w-full range-sm"
            bind:this={input}
            oninput={(e) => {
                audio!.currentTime = +e.currentTarget.value;
            }}
        />
    </div>
    {#key src}
        <audio
            {src}
            bind:duration
            bind:currentTime
            bind:paused
            autoplay
            bind:this={audio}
            onprogress={(e) => {
                input!.value = `${e.currentTarget.currentTime}`;
            }}
            onloadedmetadata={(e) => {
                input!.min = `0`;
                input!.max = `${e.currentTarget.duration}`;
                duration = e.currentTarget.duration;
            }}
        ></audio>
    {/key}
</div>
