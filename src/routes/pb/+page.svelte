<script lang="ts">
import { getPosts } from '$lib/pb.remote';

let posts = await getPosts();
</script>

<pre>{JSON.stringify(posts, null, 2)}</pre>
