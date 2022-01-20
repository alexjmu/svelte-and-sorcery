<script>
		import FakeLink from './FakeLink.svelte'
		import DotDotDot from './DotDotDot.svelte';

		let loading = false;
</script>

<div id="view">
	<h1>Svelte/Sorcery</h1>
	<div>
		<FakeLink on:click="{() => { loading = true; }}"/>
	</div>
	{#if loading}
	<DotDotDot on:loaded />
	{/if}
</div>

<style>
	h1 {
		color: lightgray;
	}
#view {
		display: flex;
		width: 100px;
		flex-direction: column;
	}
</style>