<script>
	import { onMount } from 'svelte';
	import Stats from './Stats.svelte';
	import Tile from './Tile.svelte';
	import Controls from './Controls.svelte';
	
	import { getTileAt, playerLocation, walkDirection } from './worldmap.js';
	
	let location = playerLocation;
	function idxToLocation({location, idx}) {
		let yDiff = Math.floor(idx / 11);
		let xDiff = idx % 11;
		// view is 11 by 11, player should be centred
		const centerX = 5;
		const centerY = 5;
		return {
			x: location.x - 5 + xDiff,
			y: location.y - 5 + yDiff
		}
	}
	
	let frame = 0;
	onMount(() => {
		const interval = setInterval(() => { frame = frame + 1 }, 1000)
		return () => clearInterval(interval)
	});
	
// thoughts: maybe scroll left/right instead of moving K? i.e. view is an nxn array projection from
// an NxN world
// maybe allow holding down a key, but at a controlled speed? i.e. only moving one per "turn"
// also "turn" should be the actual tick speed of npcs, not the "frame"^ used for tile animation
// basically: should this be turn based or real-time? I'm thinking the latter because it's more fun
// add: unicorns that can hurt you, goblins, some rocks/caves/trees/things to navigate around
// finally add: some free online looping music (or make some?)
// should probably save every 100 ticks (can use a writeable store attached to localstorage + JSONify)
// boss fight with MMMMMMMM
// thought: all player state could be a writeable store that tracks history?
</script>

<Controls on:left="{() => { location = walkDirection({location, direction: 'left'})}}"
					on:right="{() => { location = walkDirection({location, direction: 'right'})}}"
					on:up="{() => { location = walkDirection({location, direction: 'up'})}}"
					on:down="{() => { location = walkDirection({location, direction: 'down'}) }}"
					/>
<div id="view">
<h1>
	Overworld
</h1>
<div id="grid">
		{#each Array.from({length: 11 * 11}) as cell, idx}
				<Tile switched="{frame % 2 === 0}" type="{getTileAt(idxToLocation({location, idx})) || null}" />
	{/each}
</div>
	<pre>use arrow keys to move</pre>
	<Stats />
</div>

<style>
	#view {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	h1 {
		font-size: 11pt;
		color: gray;
	}
	#grid {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 200px;
		height: 210px;
		flex-wrap: wrap;
	}
	pre {
		margin-top: 2pt;
		margin-bottom: 3pt;
		font-size: 9pt;
	}
</style>