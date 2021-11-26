<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	
	let pressedKey = null;
	$: pressedKey ? dispatch({
		'ArrowLeft': 'left',
		'ArrowRight': 'right',
		'ArrowUp': 'up',
		'ArrowDown': 'down'
	}[pressedKey]) : dispatch('none')
	
	function handleKeydown({key}) {
		pressedKey = key 
	}
	function handleKeyup() {
		pressedKey = null
	}
</script>

<svelte:window
							 on:keydown|preventDefault="{handleKeydown}"
							 on:keyup|preventDefault="{handleKeyup}"
							 />