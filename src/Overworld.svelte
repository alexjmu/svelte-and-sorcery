<script>
	import { onMount } from 'svelte';
	import Stats from './Stats.svelte';
	import Tile from './Tile.svelte';
	import Controls from './Controls.svelte';
	
	import { getIconAt, playerLocation, tickEvent, walkDirection } from './worldmap.js';
	
	let curLocation = playerLocation;
	let controllerDirection = undefined;
	$: { if (controllerDirection !== undefined) {
		actionPlayerCommand();
	}}
	function actionPlayerCommand() {
		// todo: has ticked in 250 interval - then don't action in onMount() below
		tickEvent();
		curLocation = controllerDirection ?
			walkDirection({ direction: controllerDirection })
			: { ...curLocation };
	}
	function idxToMap({ loc, idx }) {
		let yDiff = idx % 11; // cells run top to bottom
		let xDiff = Math.floor(idx / 11);
		// view is 11 by 11, player should be centred
		return {
			x: loc.x - 5 + xDiff,
			y: loc.y - 5 + yDiff
		}
	}
	
	let frame = 0;
	onMount(() => {
		const tileFrameInterval = setInterval(() => { frame = frame + 1 }, 1000);
		// TODO: should be in a component above <Controls> that interfaces with the game state
		const tickInterval = setInterval(() => {
			actionPlayerCommand()
		}, 500);
		return () => {
			clearInterval(tileFrameInterval);
			clearInterval(tickInterval);
		}
	});
</script>

<Controls
	on:left="{() => { controllerDirection = 'left' }}"
	on:right="{() => { controllerDirection = 'right' }}"
	on:up="{() => { controllerDirection = 'up' }}"
	on:down="{() => { controllerDirection = 'down'; }}"
	on:none="{() => { controllerDirection = undefined; }}"
/>
<div id="view">
<h1>
	Overworld
</h1>
<div id="grid">
	{#each Array.from({length: 11 * 11}) as _cell, idx}
		<Tile switched="{frame % 2 === 0}" type="{getIconAt(idxToMap({ loc: curLocation, idx })) || null}" />
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