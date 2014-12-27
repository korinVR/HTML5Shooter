
gamelib.hitTest1x1 = function (gameObject1, gameObject2) {
	if (!gameObject1.alive || !gameObject2.alive) {
		return;
	}
	
	if (gameObject1.aabb.x0 > gameObject2.aabb.x1 ||
		gameObject2.aabb.x0 > gameObject1.aabb.x1 ||
		gameObject1.aabb.y0 > gameObject2.aabb.y1 ||
		gameObject2.aabb.y0 > gameObject1.aabb.y1) {
		return;
	}
	
	// TODO: more detailed collision detection
	
	gameObject1.onCollide(gameObject2);
	gameObject2.onCollide(gameObject1);
}

gamelib.hitTestNxN = function (list1, list2) {
	var h1 = list1.head;
	var h2 = list2.head;
	
	for (var o1 = h1.next; o1 != h1; o1 = o1.next) {
		for (var o2 = h2.next; o2 != h2; o2 = o2.next) {
			gamelib.hitTest1x1(o1, o2);
		}
	}
}

gamelib.hitTest1xN = function (gameObject, list) {
	var h = list.head;
	
	for (var o = h.next; o != h; o = o.next) {
		gamelib.hitTest1x1(gameObject, o);
	}
}


