<script>
	import Overworld from './Overworld.svelte';
	import StartMenu from './StartMenu.svelte';

	let scene = 'scene0';
	// TEST
	scene = 'scene1';
	function startGame() {
			setTimeout(() => { scene = 'scene1'; }, 500);
	}

</script>

<div id="game">
	{#if scene === 'scene1'}<Overworld />
	{:else}<StartMenu on:loaded="{startGame}" />
	{/if}
</div>

<style>
	#game {
		background-color: black;
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: 100%;
	}
</style>