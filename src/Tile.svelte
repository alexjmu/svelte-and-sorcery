<script>
	import { onMount } from 'svelte';
	
	export let type = '.';
	export let switched = false;
	export let location = undefined;
	
	const pickCachedIconSet = makePickCachedIconSet();
	let currentTileSet;
	$: currentTileSet = pickCachedIconSet({ type, location });
	let currentTile;
	$: currentTile = currentTileSet[switched ? 0 : 1];
	
	const types = {
		'.': [['.', '.'], [' ', ' '], [' ', ' ']],
		'_': [['_', '_'], ['-', '-']],
		'T': [['T', 'T'], ['t', 'T'], ['T', 't']],
		'K': ['k', 'k'],
		'G': [['g', 'G'], ['G', 'G'], ['G', 'G']],
		'U': [['U', 'u'], ['u', 'U']],
		'#': ['#', '#'],
		',': [',', ','],
		'+': ['+', '+'],
		'0': [['0', '0'], ['0', '0'], ['*', '*']]
	}
	function getIconSets({ type }) {
		const iconSets = types[type]
			|| (() => { throw Error(`unknown Tile icon type ${type}`); })();
		const isMultipleSets = Array.isArray(iconSets[0]);
		return isMultipleSets ? iconSets : [iconSets];
	}
	function makePickCachedIconSet() {
		const cache = {};
		const pickCachedIconSet = ({ type, location }) => {
			const hash = `${type}-${location.x}-${location.y}`;
			if (cache[hash]) {
				return cache[hash];
			}
			const iconSets = getIconSets({ type });
			const randomSet = iconSets[Math.floor(Math.random() * iconSets.length)];
			cache[hash] = randomSet;
			return randomSet;
		}
		return pickCachedIconSet;
	}
</script>

<div class="tile {
						{'#': 'wall', ',': 'food', '_': 'ground', null: 'null'}[type] || type
						}">
{currentTile}
</div>

<style>
	.tile {
		color: white;
		font-size: 10pt;
		width:19px;
		height: 19px;
	}
	.K {
		color: pink;
	}
	.G {
		color: darkred;
	}
	.U {
		color: hotpink;
	}
	.T {
		color: darkgreen;
	}
	.wall {
		color: gray;
	}
	.food {
		color: darkgreen;
	}
	.ground {
		color: darkgray;
	}
	.null {
		color: gray;
	}
</style>