<script>
	import { onMount } from 'svelte';
	
	let hp = 2;
	let stepCount = 0;
	let unicornsOwned = 0;
	$: fuzzyHp = hp + (Array.of(1, 0, -1, 0)[stepCount % 4])
	$: fuzzyUnicorns = unicornsOwned + (Array.of(0, 0, 0.1)[stepCount % 3])
	
	onMount(() => {
		const interval = setInterval(() => { stepCount = (stepCount + 1) }, 2500);
		return () => clearInterval(interval);
	});
</script>

<div>
	<div>hp: {fuzzyHp}</div>
	<div>unicorns owned: {fuzzyUnicorns.toFixed(1)}</div>
	<div>you: <span style="color: #3F3F6F">i a m s a d</span></div>
</div>

<style>
	div {
		color: lightgray;
		font-size: 8pt;
		font-family: monospace;
	}
</style>