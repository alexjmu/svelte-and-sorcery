<script>
	import { tweened } from 'svelte/motion';
	import { cubicIn } from 'svelte/easing';
	import { onMount, createEventDispatcher } from 'svelte';
	
	export const dots = 80;
	export const duration = 2000;
	
	const dispatch = createEventDispatcher();
  
	const progress = tweened(0, {
		duration,
		easing: cubicIn
	});
	
	$: if ($progress === dots) {
		dispatch('loaded');
	}

	onMount(() => {
		$progress += dots;
	});
</script>

<span>
.{#each Array.from({length: Math.floor($progress)}) as _dot, idx}
			{idx + 1 !== dots ? '.' : 'bye'}
{/each}
</span>

<style>
	span {
		color: white;
		font-size: 10pt;
		overflow: all;
	}
</style>
