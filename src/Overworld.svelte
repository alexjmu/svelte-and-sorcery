<script>
	import { onMount } from 'svelte';
	import Stats from './Stats.svelte';
	import Tile from './Tile.svelte';
	import Controls from './Controls.svelte';
	
	import { getIconAt, playerLocation, tickEvent, walkDirection } from './worldmap.js';
	
	let curLocation = playerLocation;
	let controllerDirection = undefined;
	$: { (controllerDirection || true) && tickAndRedrawIdempotent() }
	let frame = 0;
	// frame = 0;
	//$: frame = !!controllerDirection ? 0 : 0;
	const tickAndRedrawIdempotent = (() => {
		let hasTriggeredThisTick = false;
		
		return (newTickStarting) => {
			if (canAction(!!newTickStarting)) {
				setTrigger(newTickStarting);
				tickEvent();
				movePlayerAndRedraw();
			}
		}

		function canAction(newTickStarting) {
			return !hasTriggeredThisTick || newTickStarting;
		}
		function setTrigger(newTickStarting) {
			if (newTickStarting) {
				hasTriggeredThisTick = false;
			} else {
				hasTriggeredThisTick = true;
			}
		}
	})();
	function movePlayerAndRedraw() {
		curLocation = controllerDirection ?
			walkDirection({ direction: controllerDirection })
			: { ...curLocation };
	}
	onMount(() => {
		const tileFrameInterval = setInterval(() => { frame = frame + 1 }, 1000);
		const tickInterval = setInterval(() => {
			tickAndRedrawIdempotent(true);
		}, 100);
		return () => {
			clearInterval(tileFrameInterval);
			clearInterval(tickInterval);
		}
	});

	let viewportCoords;
	$: viewportCoords = Array.from({length: 11 * 11}).map((_, idx) => {
		const location = idxToMap({ loc: curLocation, idx })
		return {
			location,
			icon: getIconAt(location),
			id: `location(${location.x}, ${location.y})`
		}
	})

	function idxToMap({ loc, idx }) {
		let yDiff = idx % 11; // cells run top to bottom
		let xDiff = Math.floor(idx / 11);
		// view is 11 by 11, player should be centred
		return {
			x: loc.x - 5 + xDiff,
			y: loc.y - 5 + yDiff
		}
	}
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
	{#each viewportCoords as cell (cell.id)}
		<Tile
			switched="{frame % 2 === 0}"
			location="{cell.location}"
			type="{cell.icon}"
			/>
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